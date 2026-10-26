# PRD: site do fitness (`codart-fitness-web`)

O site público do diário de dieta e treino que a Codart opera no WhatsApp. O
produto em si vive no [`codart-messaging`](https://github.com/C0d4rt/codart-messaging)
(`PRD-fitness.md`); este repositório só apresenta, explica e leva até a conversa.

## 1. Resumo

- **O que é:** uma landing page, a página dos planos com o guia de cada função
  e as páginas legais provisórias, em `fitness.codart.dev`.
- **Para quem:** quem chega por anúncio, busca ou indicação e ainda não
  conversou com o diário; e quem já conversa e tocou em **Saber mais** na
  mensagem dos planos.
- **A única ação:** abrir o WhatsApp com a mensagem pronta para começar os 7
  dias grátis.
- **Marca provisória:** Fitness, genérica até a escolha do nome. Nome, domínio e número ficam num
  só arquivo (`app/brand.ts`); a troca para o domínio próprio é mudar esse
  arquivo e redirecionar o subdomínio com 301.

## 2. O que o site diz

- **O que é o produto:** um diário de comida e treino que se faz mandando
  mensagem, áudio ou foto no WhatsApp, sem app e sem planilha.
- **Como funciona:** toque no botão, mande o que comeu, acompanhe a meta.
- **O que dá para fazer:** cada função com o plano dela, como usar e um
  exemplo de conversa com o texto que o diário manda de verdade.
- **Os planos:** Premium e Básico, mensal e anual, com o teste de 7 dias com
  tudo do Premium, sem cartão.
- **Em que se apoia:** a tabela TACO (Unicamp), o Open Food Facts e o
  Compendium of Physical Activities; exclusão dos dados pela conversa (LGPD);
  não substitui nutricionista.
- **Perguntas frequentes:** app, pagamento, cancelamento, arrependimento,
  privacidade, áudio e foto, o fim do teste.

**O que o site não diz:** número de usuários, depoimentos, prêmios, logos de
clientes ou qualquer prova social. Enquanto não houver dado real, nada disso
existe aqui (CDC art. 37).

## 3. Fonte dos fatos

Planos, preços, dias de teste e a lista de funções com o plano de cada uma são
do `codart-messaging`, que os publica em `GET /fitness/plans`. O site lê esse
JSON no build e junta com o texto de marketing dele, por id da função. O build
falha quando os dois lados não batem. Preço nunca é escrito à mão aqui.

## 4. Medição

GA4 e pixel da Meta, só depois do aceite no banner de consentimento (Consent
Mode v2, negado por padrão). O clique no botão do WhatsApp é a conversão do
site (`generate_lead` e `Lead`). A conversão de verdade (teste começado,
assinatura) acontece no WhatsApp e fica para o PRP de marketing pago, com o
redirecionador de atribuição e a Conversions API.

## 5. Limites

- **Estático:** nenhuma página depende de servidor; tudo sai do `nuxt generate`.
- **Dado pessoal:** o site não coleta nenhum. O consentimento fica no
  navegador da pessoa.
- **Textos legais:** termos e privacidade definitivos dependem da revisão
  jurídica (`PRD-fitness.md` §9). Até lá as páginas dizem que estão em revisão.
- **Número do WhatsApp:** a produção ainda usa o número de teste da Meta, que
  só conversa com contatos cadastrados. O botão vale para o público quando o
  número próprio existir.

## 6. Roadmap

| Fase   | O que entra                                                                                            | PRP                 |
| ------ | ------------------------------------------------------------------------------------------------------ | ------------------- |
| Site 1 | Landing page, `/planos`, páginas legais provisórias, consentimento e pixels, deploy em S3 e CloudFront | `PRP-001`           |
| Depois | Redirecionador de atribuição e Conversions API, para anúncio                                           | a escrever          |
| Depois | Domínio e nome definitivos                                                                             | troca no `brand.ts` |

## 7. Revisões

- **rev. 1 (2026-10-25):** primeira versão, a partir da entrevista que originou
  o `PRP-001` e o `PRP-032` do `codart-messaging`.
