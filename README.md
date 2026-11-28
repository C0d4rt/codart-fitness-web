# codart-fitness-web

Site do diário de dieta e treino da Codart no WhatsApp: a landing page, os
planos e o guia de cada função. Nuxt 4 gerado estático, servido por S3 e
CloudFront em `myfitally.com`.

O porquê de cada decisão está no [`docs/PRD.md`](./docs/PRD.md) e no
[`PRP-001`](./docs/prps/PRP-001-site.md); como trabalhar aqui, no
[`AGENTS.md`](./AGENTS.md).

## Rodar

```bash
pnpm install
pnpm dev                        # http://localhost:3000
PLANS_FIXTURE=1 pnpm generate   # .output/public
```

## Configuração

Tudo opcional no desenvolvimento (veja `.env.example`):

| Variável                      | Para quê                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `PLANS_API_URL`               | De onde vêm os planos no build. Sem ela, o build falha.                                                 |
| `PLANS_FIXTURE`               | `1` usa a cópia em `shared/plans.fixture.json` quando não há `PLANS_API_URL` (dev, CI e ponta a ponta). |
| `NUXT_PUBLIC_WHATSAPP_NUMBER` | O número do botão, só dígitos com o país. Com `PLANS_API_URL`, o build exige.                           |
| `NUXT_PUBLIC_API_URL`         | A API da entrada e da compra. Sem ela, `https://api.myfitally.com`.                                     |
| `NUXT_PUBLIC_GA_ID`           | GA4 (`G-…`), carregado só depois do consentimento.                                                      |
| `NUXT_PUBLIC_META_PIXEL_ID`   | Pixel da Meta, idem.                                                                                    |

## Deploy

Merge na `main`, todo dia às 9h17 UTC e pelo botão (`workflow_dispatch`). O job
roda no ambiente `production` do GitHub (o único em que o papel da AWS confia),
assume esse papel por OIDC e precisa destas variáveis do repositório,
saídas da stack `site` do `codart-infrastructure`: `AWS_DEPLOY_ROLE_ARN`,
`SITE_BUCKET`, `SITE_DISTRIBUTION_ID` (e `AWS_REGION`, que na falta é
`us-east-1`). Sem `AWS_DEPLOY_ROLE_ARN`, o deploy é pulado.

Desde 21/11/2026 o GitHub Actions recusa os jobs por cobrança: nem o merge,
nem o build diário, nem o botão publicam. O deploy é à mão, do seu notebook,
com um commit da `main`:

```bash
scripts/deploy.sh <sha-completo>
```

Ele faz o mesmo que o workflow, a partir de um `git archive` do commit (nunca
da sua árvore), e lê as mesmas variáveis do repositório com o `gh`, logado na
conta `edugsmx` (outra, em `GH_USER`, ou um `GH_TOKEN`). `PLANS_API_URL`,
`NUXT_PUBLIC_WHATSAPP_NUMBER`, `SITE_BUCKET` e `SITE_DISTRIBUTION_ID` vazias
param o deploy antes de gerar. Precisa do `aws login` no perfil `codart` (ou
outro, em `AWS_PROFILE`) e do Node 24. Sem o build diário, um preço que muda no
`codart-messaging` só chega ao site rodando o script de novo.

Com `PLANS_API_URL` (um build de verdade), o `generate` se recusa a rodar sem
`NUXT_PUBLIC_WHATSAPP_NUMBER` de 8 a 15 dígitos: sem ele o botão sairia como
`https://wa.me/?text=…`.
