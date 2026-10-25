# AGENTS.md

Guia de trabalho para agentes de código e para quem chega agora. O que o site é
e por que fica no [`docs/PRD.md`](./docs/PRD.md) e em [`docs/prps/`](./docs/prps);
aqui fica só o que muda o jeito de trabalhar.

## Antes de escrever código

- Mudança que não é trivial começa por uma entrevista com o dono do produto,
  uma pergunta por vez e com a sua recomendação (skill `grilling`). Fato se
  descobre lendo o repositório; decisão é do dono.
- Página, seção ou mudança visual segue a skill `design-taste-frontend` (a
  direção sorteada está no PRP-001, decisão 9) e as do Emil Kowalski
  (`emil-design-eng`, `mobile-native`, `animate`). Passe o `inspect.mjs` dela
  nas três larguras antes do PR.

## Comandos

Node 24 (`.nvmrc`) e pnpm.

| Para             | Rode                                      |
| ---------------- | ----------------------------------------- |
| Instalar         | `pnpm install`                            |
| Desenvolver      | `pnpm dev`                                |
| Lint / corrigir  | `pnpm lint` / `pnpm lint:fix`             |
| Tipos            | `pnpm typecheck`                          |
| Testes unitários | `pnpm test`                               |
| Formato          | `pnpm format:check` / `pnpm format`       |
| Gerar o site     | `pnpm generate` (sai em `.output/public`) |
| Ponta a ponta    | `pnpm test:e2e` (depois do `generate`)    |

Antes de abrir PR: `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm generate && pnpm test:e2e`.

## Regras que o código não mostra sozinho

- **Plano, preço e dias de teste nunca se escrevem à mão.** Vêm do JSON do
  `codart-messaging` (`GET /fitness/plans`, lido no build). O texto de cada
  função mora aqui, por id; o teste falha quando os dois lados não batem.
- **Nada de prova social inventada:** nenhum número de usuários, depoimento,
  prêmio ou logo de cliente até existir um de verdade.
- **Marca num lugar só:** nome, domínio e textos da marca ficam em
  `app/brand.ts`.
- **O botão do WhatsApp sai sempre do `useWhatsAppLink`.**
- **Script de terceiro só depois do consentimento**, pelo `@nuxt/scripts`, e só
  com o id configurado. Nada de Google Tag Manager.
- **Sem travessão (— nem –) no texto que a pessoa lê.** No lugar, dois-pontos,
  vírgula ou parênteses.
- **Tudo estático:** nenhuma página depende de servidor.

## Comentários

O padrão é nenhum. Comentário só explica **por que** o código é assim, quando o
código não consegue dizer.

## Git

Conventional Commits (o `commitlint` confere). Um PR por vez, contra a `main`,
com o porquê da mudança na descrição. Merge na `main` publica o site.
