# codart-fitness-web

Site do diário de dieta e treino da Codart no WhatsApp: a landing page, os
planos e o guia de cada função. Nuxt 4 gerado estático, servido por S3 e
CloudFront em `fitness.codart.dev`.

O porquê de cada decisão está no [`docs/PRD.md`](./docs/PRD.md) e no
[`PRP-001`](./docs/prps/PRP-001-site.md); como trabalhar aqui, no
[`AGENTS.md`](./AGENTS.md).

## Rodar

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm generate   # .output/public
```

## Configuração

Tudo opcional no desenvolvimento (veja `.env.example`):

| Variável                      | Para quê                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `PLANS_API_URL`               | De onde vêm os planos no build. Sem ela, a cópia em `shared/plans.fixture.json`. |
| `NUXT_PUBLIC_WHATSAPP_NUMBER` | O número do botão, só dígitos com o país.                                        |
| `NUXT_PUBLIC_GA_ID`           | GA4 (`G-…`), carregado só depois do consentimento.                               |
| `NUXT_PUBLIC_META_PIXEL_ID`   | Pixel da Meta, idem.                                                             |

## Deploy

Merge na `main`, todo dia às 9h17 UTC e pelo botão (`workflow_dispatch`). O job
roda no ambiente `production` do GitHub (o único em que o papel da AWS confia),
assume esse papel por OIDC e precisa destas variáveis do repositório,
saídas da stack `site` do `codart-infrastructure`: `AWS_DEPLOY_ROLE_ARN`,
`SITE_BUCKET`, `SITE_DISTRIBUTION_ID` (e `AWS_REGION`, que na falta é
`us-east-1`). Sem `AWS_DEPLOY_ROLE_ARN`, o deploy é pulado.
