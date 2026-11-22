/** The `fitness.site.*` codes of the API contracts (PRP-065, stages 2 and 3a), without the prefix. */
export const API_ERROR_CODES = [
  'origin_refused',
  'json_required',
  'login_pending',
  'login_used',
  'login_expired',
  'login_unknown',
  'link_unknown',
  'link_expired',
  'declaration_required',
  'method_unavailable',
  'pro_unavailable',
  'already_subscribed',
  'guardian_required',
  'purchase_paid',
  'checkout_refused',
  'purchase_unknown',
  'purchase_activated',
  'purchase_not_activated',
  'sign_in_closed',
  'sign_in_used',
] as const

/** What the browser can tell apart without a code from the API. */
export const TRANSPORT_ERROR_CODES = [
  'network',
  'unavailable',
  'rate_limited',
  'bad_request',
  'bad_response',
  'unknown',
] as const

export const SITE_ERROR_CODES = [...API_ERROR_CODES, ...TRANSPORT_ERROR_CODES] as const

export type SiteErrorCode = (typeof SITE_ERROR_CODES)[number]

const PREFIX = 'fitness.site.'

const isApiCode = (code: string): code is (typeof API_ERROR_CODES)[number] =>
  (API_ERROR_CODES as readonly string[]).includes(code)

/** Branches on the body's `code` first, as the contracts ask, and on the status only without one. */
export const siteErrorOf = (status: number, body: unknown): SiteErrorCode => {
  const code =
    body !== null && typeof body === 'object' && 'code' in body && typeof body.code === 'string'
      ? body.code
      : ''
  const bare = code.startsWith(PREFIX) ? code.slice(PREFIX.length) : ''
  if (isApiCode(bare)) return bare
  if (status === 429) return 'rate_limited'
  if (status === 404 || status >= 500) return 'unavailable'
  if (status === 400 || status === 422) return 'bad_request'
  return 'unknown'
}

/** The i18n key of the sentence each code shows. */
export const siteErrorKey = (code: SiteErrorCode): string => `site.errors.${code}`
