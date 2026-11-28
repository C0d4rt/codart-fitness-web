#!/usr/bin/env bash
# Generates a commit of main and publishes it, as .github/workflows/deploy.yml does, for when
# Actions does not run. The build settings come from the same repository variables.
# Usage: scripts/deploy.sh <full-sha>
# Needs aws (AWS_PROFILE, default codart), gh (GH_USER, default edugsmx, or GH_TOKEN), jq,
# Node 24, pnpm.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHA="${1:-}"

die() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || die "usage: $0 <full-sha>"

for node_bin in "$HOME"/.nvm/versions/node/v24*/bin; do
  [[ ! -d "$node_bin" ]] || PATH="$node_bin:$PATH"
done
[[ "$(node --version 2>/dev/null)" == v24.* ]] || die "Node 24 is required (.nvmrc)"

if [[ -z "${GH_TOKEN:-}" ]]; then
  GH_TOKEN="$(gh auth token --user "${GH_USER:-edugsmx}")"
fi
[[ -n "$GH_TOKEN" ]] || die "no GitHub token"
export GH_TOKEN

VARIABLES="$(cd "$ROOT" && gh api --paginate "repos/{owner}/{repo}/actions/variables?per_page=100" --jq '.variables[]')" ||
  die "could not read the repository variables"
variable() {
  jq -rs --arg name "$1" 'map(select(.name == $name))[0].value // ""' <<<"$VARIABLES"
}
required() {
  local value
  value="$(variable "$1")"
  [[ -n "$value" ]] || die "the repository variable $1 is empty"
  printf '%s' "$value"
}

PLANS_API_URL="$(required PLANS_API_URL)"
NUXT_PUBLIC_WHATSAPP_NUMBER="$(required NUXT_PUBLIC_WHATSAPP_NUMBER)"
NUXT_PUBLIC_GA_ID="$(variable NUXT_PUBLIC_GA_ID)"
NUXT_PUBLIC_META_PIXEL_ID="$(variable NUXT_PUBLIC_META_PIXEL_ID)"
SITE_BUCKET="$(required SITE_BUCKET)"
SITE_DISTRIBUTION_ID="$(required SITE_DISTRIBUTION_ID)"
AWS_REGION="$(variable AWS_REGION)"
export PLANS_API_URL NUXT_PUBLIC_WHATSAPP_NUMBER NUXT_PUBLIC_GA_ID NUXT_PUBLIC_META_PIXEL_ID
export AWS_PROFILE="${AWS_PROFILE:-codart}" AWS_REGION="${AWS_REGION:-us-east-1}"
unset PLANS_FIXTURE NUXT_PUBLIC_API_URL

# shellcheck disable=SC2016 # the helper expands GH_TOKEN itself, so the token stays off the command line
git -C "$ROOT" -c credential.helper= \
  -c 'credential.helper=!f() { echo username=x-access-token; echo "password=$GH_TOKEN"; }; f' \
  fetch --quiet origin
git -C "$ROOT" cat-file -e "$SHA^{commit}" 2>/dev/null || die "$SHA is not a commit of this repository"
git -C "$ROOT" merge-base --is-ancestor "$SHA" origin/main || die "$SHA is not on origin/main"

WORK="$(mktemp -d "${TMPDIR:-/tmp}/site-release.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT
git -C "$ROOT" archive --format=tar "$SHA" | tar -x -C "$WORK"
cd "$WORK"
pnpm install --frozen-lockfile --prefer-offline
pnpm generate

# Every file sets its own Cache-Control, or the CDN keeps it five minutes. Hashed files go first
# and are never deleted: a visitor holding the previous HTML still finds what it asks for.
for dir in _nuxt _scripts; do
  [[ -d ".output/public/$dir" ]] || continue
  aws s3 sync ".output/public/$dir" "s3://$SITE_BUCKET/$dir" \
    --cache-control "public, max-age=31536000, immutable" --only-show-errors
done
aws s3 sync .output/public "s3://$SITE_BUCKET" \
  --exclude "_nuxt/*" --exclude "_scripts/*" --exclude "llms.txt" --delete \
  --cache-control "public, max-age=0, s-maxage=300, must-revalidate" --only-show-errors
# S3 would store it as text/plain with no charset, and nosniff then garbles the accents.
aws s3 cp .output/public/llms.txt "s3://$SITE_BUCKET/llms.txt" \
  --content-type "text/plain; charset=utf-8" \
  --cache-control "public, max-age=0, s-maxage=300, must-revalidate" --only-show-errors
aws cloudfront create-invalidation --distribution-id "$SITE_DISTRIBUTION_ID" --paths "/*" \
  --query Invalidation.Id --output text

echo "deployed site $SHA"
