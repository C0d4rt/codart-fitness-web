name: "PRP-001: o site do fitness, com a landing page, os planos e o guia de cada função"
description: |

## Purpose

Dar ao diário de dieta e treino no WhatsApp um site que explique o produto,
mostre os planos com o que cada um tem e leve à conversa pelo botão dos 7 dias
grátis. A página `/planos` é também o destino do **Saber mais** que a mensagem
dos planos manda no WhatsApp (`PRP-032` do `codart-messaging`).

**Depende de:** `GET /fitness/plans` no `codart-messaging` (`PRP-032`) e da
stack `site` no `codart-infrastructure` (S3, CloudFront, certificado e DNS).

**Não inclui:** atribuição de campanha por redirecionador e Conversions API;
termos e privacidade definitivos; blog e páginas de SEO programático; outros
idiomas.

---

## Status: em implementação (25/10/2026)

As decisões saíram de uma entrevista com o dono do produto em 24 e 25/10/2026.

---

## Fatos levantados

| Fato                                                                                              | Onde                                                    | Consequência                                                    |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------- |
| O beconfident.app é feito no Framer, com o botão de teste passando por um redirecionador de leads | cabeçalhos `server: Framer`, `generator: Framer`        | Serve de referência de estrutura, não de código.                |
| O `beconfident-freetrial-web` é Nuxt 3 estático com sitemap, robots e schema.org                  | `package.json` dele                                     | É o modelo de stack mais próximo; aqui na versão atual do Nuxt. |
| O `codart.dev` é HTML puro no Cloudflare Pages; a zona `codart.dev` está no Cloudflare, só DNS    | `~/Projects/codart`, `codart-infrastructure/stacks/dns` | O subdomínio aponta para o CloudFront por CNAME sem proxy.      |
| A produção do diário usa o número de teste da Meta                                                | `PRD-fitness.md` §9                                     | O botão funciona para o público só com o número próprio.        |
| O produto ainda não tem nome comercial                                                            | `PRD-fitness.md`                                        | Nome provisório num arquivo só.                                 |

---

## Decisões

### 1. Um site próprio, com o guia de cada função

- **Pergunta:** onde mora o "Saber mais" com exemplos e guia de uso: página
  servida pela plataforma, Flow do WhatsApp, imagens ou texto?
- **Resposta:** uma página web. Com o site próprio, ela é a `/planos` daqui, com
  âncora por plano (`#premium`, `#basic`) e por função (`#photos`).
- **Por quê:** é a única opção com visual livre, sem aprovação da Meta e sem
  custo por mensagem.

### 2. Marca e domínio

- **Resposta:** marca própria, provisoriamente **Kcalma**, em
  `fitness.codart.dev` até o domínio próprio. Livres em 25/10/2026: `kcalma.com.br`
  e `kcalma.app` (falta consultar a marca no INPI).
- **Avaliado:** Comidário (também livre), AnotaFit (lembra o Anota AI), TacoFit
  (lê como o taco mexicano).

### 3. Stack

- **Resposta:** Nuxt 4 gerado estático, TypeScript estrito, CSS com variáveis
  de design e sem biblioteca de componentes; `@nuxt/fonts` e `@nuxt/image`
  (fontes e imagens servidas pelo próprio site), sitemap, robots e schema.org;
  ESLint, Prettier, Vitest e Playwright; pnpm e Node 24.
- **Recusado:** SPA com Vite (a página chega vazia: pior SEO e pior preview no
  WhatsApp); Astro com ilhas Vue (bom, mas o pedido era Vue).

### 4. Hospedagem

- **Resposta:** S3 privado lido só pelo CloudFront (OAC), com certificado ACM,
  `PriceClass_All` (as bordas da América do Sul), uma CloudFront Function para
  servir `/planos/index.html` em `/planos` e os cabeçalhos de segurança. Stack
  `site` no `codart-infrastructure`.
- **Deploy:** GitHub Actions assume um papel por OIDC, roda `nuxt generate`,
  `aws s3 sync` e invalida só o HTML. Os arquivos de `/_nuxt/` têm hash e vão
  com cache de um ano; o HTML, com cache curto.
- **Recusado:** Cloudflare Pages (também grátis, mas fora do Terraform da AWS).
- **Custo:** dentro da franquia grátis do CloudFront (1 TB e 10 milhões de
  requisições por mês) até perto de um milhão de visitas.

### 5. A fonte dos planos

- **Resposta:** o `codart-messaging` é dono dos fatos (planos, preços, dias de
  teste, funções e o plano de cada uma) e os publica em `GET /fitness/plans`; o
  site é dono da apresentação (título, como usar, exemplo) por id da função. O
  build lê o JSON de `PLANS_API_URL` e, sem ela, a cópia em
  `app/data/plans.fixture.json`.
- **A trava:** o teste e o build falham quando uma função do JSON não tem texto
  aqui, ou quando há texto de uma função que o JSON não tem.
- **Quando o preço muda:** o site é refeito todo dia e pode ser refeito à mão
  (`workflow_dispatch`). O disparo pelo deploy do messaging fica para depois,
  porque mexe no `.github/workflows` de lá.
- **Recusado:** cópia escrita à mão (duas fontes que divergem); buscar no
  navegador (o preço some do HTML e o site depende da API).

### 6. Páginas e seções

- `/`: hero; como funciona; o que dá para fazer; planos; em que se apoia;
  perguntas frequentes; chamada final; rodapé com Codart, CNPJ, contato, termos,
  privacidade e o crédito da TACO e do Open Food Facts.
- `/planos`: os dois planos e o guia, uma seção por função com plano, como usar
  e exemplo de conversa.
- `/termos` e `/privacidade`: provisórias, dizendo que o texto está em revisão.
- **Recusado:** depoimentos, números de usuários e prêmios (não existem ainda);
  uma página por plano (duplicaria as funções do Básico).

### 7. O botão do WhatsApp

- **Resposta:** `wa.me/<número>?text=<mensagem pronta>`, montado num só lugar
  (`useWhatsAppLink`).
- **Recusado por agora:** o redirecionador com código de campanha e o "Click to
  WhatsApp" da Meta. Entram com o PRP de anúncio.

### 8. Medição

- **Resposta:** GA4 e pixel da Meta direto no código com `@nuxt/scripts`,
  carregados só depois do aceite num banner próprio, com o Consent Mode v2
  negado por padrão. A escolha fica no navegador e muda pelo rodapé. O clique no
  botão do WhatsApp é `generate_lead` no GA4 e `Lead` na Meta. Os ids vêm de
  variáveis de build; sem id, aquele script não carrega.
- **Recusado:** Google Tag Manager (deixaria a CSP frouxa e o site aberto a
  qualquer script de quem tem o painel); só analytics sem cookie (os anúncios
  vêm logo).

### 9. Direção de arte

- **Resposta:** a direção `split-stage` da skill `design-taste-frontend` (seed
  924369623): metade da tela não se mexe. No desktop, o lado fixo é a conversa
  do WhatsApp feita em HTML, que muda conforme a seção; no celular, cada seção
  traz a sua tela da conversa. Tipografia Bodoni Moda e Jost; paleta "Teal on
  paper" (um azul-petróleo sobre branco frio), sem o verde do WhatsApp como cor
  da marca. Movimento com as skills do Emil Kowalski, curto e desligado em
  `prefers-reduced-motion`.
- **Recusado:** `one-motif` (o prato como forma, mais conceitual) e
  `loud-flat-poster` (contradiz a calma do nome).

---

## Fatias

1. **Documentos:** este PRP e o `PRD.md`.
2. **Esqueleto:** Nuxt 4, ferramentas, CI e o workflow de deploy (que pula
   quando o papel da AWS ainda não está nas variáveis do repositório).
3. **Páginas:** o catálogo com a trava, a landing page, `/planos`, as páginas
   legais, o consentimento e os pixels, os testes e as capturas.

## Validação

`pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm generate`,
e `pnpm test:e2e` (Playwright) com as capturas em celular e desktop.
