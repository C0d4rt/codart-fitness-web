# Product Marketing Context

**Document version:** v1
**Last updated:** 2026-10-26

> Rascunho gerado a partir do repositório do site (`codart-fitness-web`), do site no ar (`fitness.codart.dev`, conferido em 2026-10-26) e do produto no `codart-messaging` (`PRD-fitness.md` rev. 27, `packages/domain-fitness`). Onde o repositório não responde, há um `[PRECISA: ...]` com a pergunta para o dono. Itens deduzidos estão marcados "(inferido de <arquivo>)".

## Product Overview

**One-liner:** Seu diário de dieta e treino no WhatsApp (`app/brand.ts`, `tagline`). No site no ar, o título é "Seu assistente fitness" (`app/pages/index.vue`).
**What it does:** A pessoa conta o que comeu ou treinou por texto, áudio ou foto, numa conversa de WhatsApp, e o diário identifica os alimentos, soma calorias e macros e responde na hora com o total do dia e quanto falta para a meta. Também acompanha peso, metas, treinos com gasto estimado, e manda resumo da semana, gráficos e a planilha do diário. Sem app para instalar e sem planilha (`docs/PRD.md` §2; `PRD-fitness.md` §1).
**Product category:** Diário alimentar / contador de calorias e de treino, na prateleira do MyFitnessPal, mas entregue como assistente no WhatsApp (`PRD-fitness.md` §2). Como a pessoa procura por isso: [PRECISA: quais termos de busca e de anúncio a pessoa usa para achar o produto ("contador de calorias", "diário alimentar", "app de dieta", "calorias no WhatsApp")? Há dados de busca ou de palavra-chave?]
**Product type:** B2C, assinatura (SaaS de consumo) operado pela Codart Tecnologia LTDA, servido como bot no WhatsApp sobre a plataforma `codart-messaging`. O site é estático e só apresenta e leva até a conversa (`docs/PRD.md`).
**Business model:** Pago desde o começo, sem plano gratuito permanente. 7 dias grátis com tudo do Premium, sem cartão, contados da primeira mensagem; depois, assinatura no Pix ou no cartão (Mercado Pago), mensal ou anual (`PRD-fitness.md` §4). Valores de partida hoje no contrato: Premium R$ 29,90/mês ou R$ 159,00/ano; Básico R$ 19,90/mês ou R$ 119,00/ano (`shared/plans.fixture.json`). **Esses valores vêm de `GET /fitness/plans` do `codart-messaging` e nunca podem ser escritos à mão em copy do site** (`AGENTS.md`); em texto fora do site, confira o contrato antes de citar. Cancelamento pela conversa, acesso até o fim do período pago; reembolso automático nos 7 dias depois do pagamento (CDC art. 49). Estado atual: produção ainda no número de teste da Meta e cobrança desligada, sem usuário real (`docs/PRD.md` §5; `PRD-fitness.md` §8).

## Target Audience

**Target companies:** Não se aplica (B2C). Público: adulto (18+) brasileiro que quer controlar o que come e o que treina e já usa o WhatsApp o dia todo (`PRD-fitness.md` §5, aceite só para 18+; inferido de `app/components/HomeMoment.vue`: "É fácil porque é no WhatsApp, que você já usa o dia todo"). [PRECISA: qual o perfil principal que o produto quer atingir primeiro (faixa de idade, gênero, objetivo: emagrecer, ganhar massa, manter; renda; região)? O repositório não define.]
**Decision-makers:** A própria pessoa que usa e paga.
**Primary use case:** Registrar refeições (e treinos) sem esforço e saber, a cada registro, o total do dia e quanto falta para a meta (`PRD-fitness.md` §1 e §8.1).
**Jobs to be done:**

- Anotar o que comi sem abrir app, buscar alimento ou preencher formulário: "Conte o que comeu, como contaria a alguém" (`shared/featureCopy.ts`, `diary`).
- Saber a qualquer hora quanto ainda cabe na meta do dia: "Quanto falta, a qualquer hora" (`shared/featureCopy.ts`, `dayGoal`).
- Acompanhar a evolução (peso, semana, nutrientes) sem montar planilha (`shared/featureCopy.ts`, `weekSummary`, `weight`).
  **Use cases:**
- Contar o almoço por texto ou áudio e receber o registro com calorias e macros.
- Mandar a foto do prato ou do rótulo e conferir num formulário antes de registrar (Premium).
- Registrar o treino que já faz (séries, cargas, cardio) com o gasto estimado entrando no saldo do dia.
- Repetir "o café de sempre", receitas da casa por porção, alimentos próprios (whey, pão da padaria).
- Perguntar "o que eu janto hoje?" e receber ideias dentro do que falta da meta (Premium).
- Receber o resumo da semana toda segunda; pedir a planilha CSV para levar ao nutricionista (Premium).
- Jejum intermitente acompanhado com aviso do fim da janela (Premium, `PRD-fitness.md` rev. 27).

## Personas

B2C: sem papéis de compra. O PRD só define "Usuário (WhatsApp)" (`PRD-fitness.md` §7). Três perfis de consumidor que a copy e as funções sustentam (inferido de `shared/featureCopy.ts` e `PRD-fitness.md` §4 e §8.1):

| Persona                                      | Cares about                                                               | Challenge                                                                       | Value we promise                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Quem quer começar a contar calorias (Básico) | Praticidade, não aprender ferramenta nova                                 | Apps de dieta pedem formulário, busca em banco de alimentos e disciplina diária | "Conte o que comeu, como contaria a alguém"; resposta na hora com quanto falta                                            |
| Quem já treina e conta macros (Premium)      | Números exatos: macros em gramas, meta por dia da semana, gasto do treino | Anotar comida e treino em lugares diferentes, digitar tudo de novo              | "Macros em gramas, para quem já sabe os números"; "O treino A, sem digitar de novo"                                       |
| Quem é acompanhado por nutricionista         | Seguir a meta que o profissional passou e levar os dados à consulta       | Registrar entre consultas e exportar o histórico                                | Meta informada direto (`PRD-fitness.md` §8.1); "levar ao seu nutricionista" em CSV (`shared/featureCopy.ts`, `csvExport`) |

[PRECISA: essas três personas batem com quem você quer atingir? Qual delas é a principal para o lançamento?]

## Problems & Pain Points

**Core problem:** Manter um diário alimentar dá trabalho: abrir um app, buscar cada alimento, pesar, preencher. Quem para de anotar perde a noção do dia e da meta (inferido de `PRD-fitness.md` §2.2, "Formulário obrigatório antes de usar", "Busca num banco de alimentos").
**Why alternatives fall short:**

- MyFitnessPal e afins: formulário obrigatório antes de usar, busca num banco de alimentos, mais um app no celular (`PRD-fitness.md` §2.2).
- Planilha ou caderno: não soma sozinho e não diz quanto falta (inferido de `docs/PRD.md` §2, "sem app e sem planilha").
- Foto do prato no concorrente é recurso pago, e banco de alimentos com dado estrangeiro [PRECISA: a TACO (tabela brasileira) é um argumento que você quer usar contra o banco do MyFitnessPal? Há evidência de que o banco dele erra comida brasileira?]
  **What it costs them:** [PRECISA: o que a pessoa perde quando desiste de anotar (peso que volta, dinheiro com nutricionista, frustração)? Não há relato de cliente no repositório.]
  **Emotional tension:** [PRECISA: qual a tensão emocional que você ouve (culpa por "sair da dieta", cansaço de contar tudo, vergonha de recomeçar)? Sem entrevistas no repositório.] O produto evita o tom de cobrança: um lembrete só, e "parar" desliga (`shared/featureCopy.ts`, `reminders`).

## Competitive Landscape

**Direct:** MyFitnessPal: referência declarada do produto (sem uso de código ou dado). Fica atrás porque exige formulário antes de usar, busca em banco, tela para rolar; Premium a R$ 31,90/mês ou R$ 162,90/ano no Brasil (`PRD-fitness.md` §2.1 a §2.4). Os anuais daqui foram postos abaixo do dele de propósito (`PRD-fitness.md` §4). [PRECISA: quais outros concorrentes diretos você vê (FatSecret, Yazio, Lose It!, outros bots de calorias no WhatsApp)? O repositório só cita o MyFitnessPal.]
**Secondary:** Planilha, caderno, bloco de notas do celular: resolvem o registro, mas não somam, não dão meta nem quanto falta (inferido de `docs/PRD.md` §2).
**Indirect:** Nutricionista ou personal: acompanhamento profissional. O produto não compete: não prescreve, e se posiciona como complemento ("levar ao seu nutricionista"; "Ele substitui um nutricionista? Não.") (`app/components/HomeFaq.vue`; `PRD-fitness.md` §5).

## Differentiation

**Key differentiators:**

- Funciona dentro do WhatsApp: sem app para instalar, sem conta para criar, "Sai usando" (`PRD-fitness.md` §8.1).
- Registro em linguagem natural, por texto, áudio ou foto, com correção natural ("na verdade foram 2 colheres") (`PRD-fitness.md` §8.1).
- Responde a cada registro com o total do dia e quanto falta (`shared/featureCopy.ts`, `diary`).
- Calorias e macros vêm de tabela (TACO, Unicamp; Open Food Facts), não do modelo; a meta é fórmula pública (Mifflin-St Jeor), não opinião da IA (`PRD-fitness.md` §3 e §8.1; `app/pages/creditos.vue`).
- Dieta e treino no mesmo diário, com o gasto do treino no saldo do dia (`PRD-fitness.md` §8.1).
- Preço abaixo do MyFitnessPal no anual (`PRD-fitness.md` §4).
  **How we do it differently:** Em vez de tela, formulário e busca, a pessoa conversa. O perfil é opcional e vem depois do primeiro registro; quantidade suposta é dita como estimativa e pode ser corrigida (`PRD-fitness.md` §8.1).
  **Why that's better:** "É fácil porque é no WhatsApp, que você já usa o dia todo" (`app/components/HomeMoment.vue`). Menos atrito para começar e para continuar anotando.
  **Why customers choose us:** [PRECISA: ainda não há usuário real. Depois dos primeiros testes, por que as pessoas escolheram (ou não)?]

## Objections

Objeções antecipadas pelo FAQ do site e pelo roteiro de cancelamento; nenhuma ouvida em venda ainda.

| Objection                                     | Response                                                                                                                                       |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| "Preciso instalar app? Como começo?"          | "Toque em "Testar 7 dias grátis" e mande o oi no WhatsApp. Funciona no celular ou no computador." (`HomeFaq.vue`)                              |
| "Vão me cobrar no teste?"                     | "São 7 dias com tudo do Premium, contados da primeira mensagem. Não pedimos cartão." (`HomeFaq.vue`)                                           |
| "E se eu me arrepender?"                      | "Nos 7 dias depois do pagamento, peça o reembolso na conversa e ele sai sozinho, como prevê o Código de Defesa do Consumidor." (`HomeFaq.vue`) |
| "Substitui nutricionista?"                    | "Não. O diário registra, soma e informa; não prescreve dieta nem treino." (`HomeFaq.vue`)                                                      |
| "E os meus dados?"                            | "Servem só para o seu diário. Diga "quero apagar minha conta" e tudo é apagado, como prevê a LGPD." (`HomeFaq.vue`)                            |
| "Está caro" (motivo de cancelamento previsto) | Oferta do anual, "o mesmo que {perMonth} por mês", ou pausa (`diaryMessages.ts`, `fitness.cancel.offer.yearly`)                                |
| "As estimativas não batem" (motivo previsto)  | Alguém da equipe chama para entender (`diaryMessages.ts`, `fitness.cancel.offer.human`)                                                        |

[PRECISA: quais objeções você já ouviu de pessoas reais (amigos, testes, grupo de beta)? Por exemplo: privacidade de mandar foto de comida, confiança em calorias estimadas, "bot não entende".]

**Anti-persona:**

- Menores de 18 anos: o diário não guarda dados de quem diz ter menos de 18 (`PRD-fitness.md` §5).
- Quem busca dieta ou treino prescritos, diagnóstico ou orientação clínica: o produto não prescreve e encaminha a um profissional (`PRD-fitness.md` §5).
- Quem tem histórico de transtorno alimentar (aviso explícito no jejum e no prompt) (`PRD-fitness.md` §5; `/recursos`, jejum).
- Quem quer painel com gráficos interativos, passos, sono, água, comunidade: fica para um app futuro (`PRD-fitness.md` §2.4).

## Switching Dynamics

**Push:** Cansaço de app com formulário e busca em banco de alimentos (inferido de `PRD-fitness.md` §2.2). [PRECISA: relatos reais do que fez a pessoa largar o app ou a planilha anterior.]
**Pull:** "Sem app e sem planilha"; mandar um áudio ou uma foto e receber a conta pronta; 7 dias grátis com tudo, sem cartão (`docs/PRD.md` §2; `app/components/PlanCards.vue`).
**Habit:** O histórico já construído no outro app, e o costume de anotar por lá (inferido de `PRD-fitness.md` §4.1: "O que segura depois do dia 7 é o que ele construiu").
**Anxiety:** Precisão das calorias estimadas; privacidade de dado de saúde; ser cobrado sem querer; o bot "travar" ou não entender (inferido de `PRD-fitness.md` §2.3, §5 e §8.1). A copy responde: estimativa dita como estimativa, "Não pedimos cartão", exclusão pela conversa.

## Customer Language

**How they describe the problem:**

- [PRECISA: frases literais de pessoas reais sobre o problema. Não há entrevista, review ou conversa de cliente no repositório.]
  **How they describe us:**
- [PRECISA: frases literais de quem testou. Nenhum usuário real ainda.]
- Como a pessoa escreve para o diário (exemplos usados no produto, não depoimentos): "almocei 150 g de arroz, uma concha de feijão e um filé de frango", "quanto falta pra minha meta?", "o que eu janto hoje?", "fiz o treino A" (`shared/featureCopy.ts`).
  **Words to use:** diário; anotar, registrar; contar ("me conta"); quanto falta; meta do dia; total do dia; conversa; mensagem, áudio, foto; teste grátis, 7 dias grátis; Básico e Premium; estimativa ("cerca de", "~"); assistente (o título do site já usa "Seu assistente fitness"); "na hora".
  **Words to avoid:** "trial" na copy para o público (usar "teste"); "app" para descrever o produto (o ponto é não ter app); prescrever, dieta personalizada, plano alimentar, emagrecer garantido (o produto não prescreve, `PRD-fitness.md` §5); "IA"/"inteligência artificial" como argumento (nenhuma página do site usa; o diferencial é a tabela e a fórmula, não o modelo) (inferido do site no ar); números de usuários, "milhares de pessoas", depoimentos (não existem; `AGENTS.md`).
  **Glossary:**
  | Term             | Meaning                                                                                  |
  | ---------------- | ---------------------------------------------------------------------------------------- |
  | Diário           | O registro de comida, treino e peso da pessoa, feito pela conversa                       |
  | Quanto falta     | Calorias que ainda cabem na meta do dia, mostradas a cada registro                       |
  | Registro rápido  | Anotar só as calorias (Básico) ou calorias e macros (Premium), sem os alimentos          |
  | Meus alimentos   | Alimentos cadastrados pela pessoa com os valores do rótulo                               |
  | Refeições salvas | Uma refeição com nome ("café padrão") para registrar de novo numa palavra                |
  | Despensa         | O que a pessoa tem em casa, sem quantidade; usado pela sugestão no Premium               |
  | Conferir prato   | O formulário do WhatsApp em que a pessoa confere o que a foto mostrou antes de registrar |
  | Teste grátis     | 7 dias com tudo do Premium, sem cartão, a partir da primeira mensagem                    |
  | Saber mais       | O botão da mensagem dos planos que abre `/planos` no site (`PRP-032`)                    |
  | TACO             | Tabela Brasileira de Composição de Alimentos (NEPA/Unicamp), base das calorias           |

## Brand Voice

Extraído da copy do site (`app/`, `shared/featureCopy.ts`) e das mensagens reais do diário (`codart-messaging/packages/domain-fitness/src/application/diaryMessages.ts`). Ainda não há copy com desempenho medido.

| Attribute                     | Means                                                                         | Doesn't mean                                      | Example line                                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Conversa simples              | Frases curtas, segunda pessoa, verbo de dia a dia ("conta", "anoto", "manda") | Gíria forçada, informalidade de meme              | "Oi! 👋 Eu anoto o que você come e te digo o total do dia. É só me contar, por texto ou áudio." (`fitness.diary.greeting`)       |
| Números no lugar de adjetivos | Mostra o resultado com o número real, sempre fechando a conta                 | Promessa de resultado ("emagreça X kg")           | "Faltam 1.384 kcal para a meta de 1.800." (`shared/featureCopy.ts`, `diary`)                                                     |
| Honesto sobre limites         | Diz quando é estimativa, quando não registrou, o que não faz                  | Juridiquês, aviso que assusta                     | "É uma estimativa por uma fórmula pública, não uma prescrição: ela não substitui nutricionista nem médico." (`diaryMessages.ts`) |
| Calmo, sem cobrança           | Um lembrete, fácil de desligar; erro sem culpa                                | Insistência, culpa, contagem regressiva agressiva | "Um lembrete, e só um" / "Responda "parar" e ele não manda mais." (`shared/featureCopy.ts`, `reminders`)                         |
| Do lado da pessoa             | Facilita sair, cancelar, apagar; não esconde o caminho                        | Retenção escondida                                | "Cancele quando quiser; o acesso continua até o fim do período pago." (`HomeFaq.vue`)                                            |

**Tone by context:**

- Support: resposta direta com o próximo passo, um emoji leve no máximo. Ex.: "Não consegui gerar o link agora. 🙏 Responda "assinar" de novo daqui a alguns minutos." (`diaryMessages.ts`)
- Launch: [PRECISA: ainda não houve lançamento. Qual o canal e o tom do anúncio de abertura?] Pela regra do perfil, energia vinda de exemplo real de conversa, não de adjetivo.
- Errors: o que aconteceu e o que fazer, dizendo se registrou ou não. Ex.: "Não entendi. Me conta o que você comeu, por exemplo: "jantei 2 ovos e uma fatia de pão"." / "Não registrei nada dessa mensagem." (`diaryMessages.ts`)
- Sales: oferta curta, preço exato, um caminho. Ex.: "Para assinar, responda _assinar_." e "Uma saída mais em conta: o _{plan}_ sai por {price}, o mesmo que {perMonth} por mês." (`diaryMessages.ts`). No site: "Planos simples" e "7 dias grátis com tudo do Premium, sem cartão. Depois, pague no Pix ou no cartão" (`PlanCards.vue`).
- Social: [PRECISA: há perfil em rede social ou voz do fundador para usar? Nada no repositório.]
- Billing, legal, incidents: precisão e prazos explícitos. Ex.: "Confirma o cancelamento? A renovação para, e o seu acesso continua até {until}." (`diaryMessages.ts`)
  **Terms we own:** "quanto falta"; "diário" (não "app" nem "plataforma"); "Conferir prato"; "Saber mais"; "registro rápido"; "refeições salvas"; "Testar 7 dias grátis" (rótulo do botão principal).
  **Never use (and why):**
- Travessão (travessão longo ou meia-risca) em texto que a pessoa lê: regra do projeto; usar dois-pontos, vírgula ou parênteses (`AGENTS.md`).
- "Prescrição", "dieta personalizada", "plano alimentar": prescrição é atividade regulada; o produto registra, soma e informa (`PRD-fitness.md` §5).
- Prova social inventada ("milhares de usuários", depoimentos, notas, prêmios, logos): não existem; CDC art. 37 (`docs/PRD.md` §2; `AGENTS.md`).
- Preço ou dias de teste escritos à mão: vêm do contrato `GET /fitness/plans` (`AGENTS.md`).
- O verde do WhatsApp como cor da marca: a marca é "Teal on paper" (`docs/prps/PRP-001-site.md`, decisão 9). (Visual, não palavra, mas vale para criativos.)

## Proof Points

**Metrics:** Nenhuma ainda. Não há usuário real: a produção usa o número de teste da Meta e a cobrança não está ligada (`docs/PRD.md` §5; `PRD-fitness.md` §8). Não inventar números.
**Customers:** Nenhum. Não usar logos nem nomes.
**Testimonials:** Nenhum. Não escrever depoimento, nem como "exemplo" (`AGENTS.md`).
**Value themes:**

| Theme                               | Proof                                                                                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Base de dados confiável             | Calorias pela TACO (NEPA/Unicamp) e Open Food Facts; gasto do treino pelo Compendium of Physical Activities (`app/pages/creditos.vue`) |
| Conta feita por código, não pela IA | A meta é fórmula determinística (Mifflin-St Jeor); o modelo só interpreta a linguagem (`PRD-fitness.md` §3 e §8.1)                     |
| Sem risco para testar               | 7 dias com tudo do Premium, sem cartão; reembolso automático em 7 dias após pagar (`HomeFaq.vue`; `PRD-fitness.md` §4)                 |
| Privacidade (LGPD)                  | Exclusão completa pela conversa, com 7 dias para desistir (`PRD-fitness.md` §5; `PRP-018`)                                             |
| Exemplos reais                      | Toda conversa do site usa o texto que o diário manda de verdade, com números da TACO que fecham (`docs/prps/PRP-001-site.md`, fatia 3) |
| Preço                               | Anual abaixo do anual do MyFitnessPal (R$ 162,90) (`PRD-fitness.md` §4; valores do contrato)                                           |

[PRECISA: depois do número próprio e dos primeiros usuários, quais métricas e depoimentos reais (com autorização) poderão ser usados?]

## Goals

**Business goal:** Converter teste grátis em assinatura paga. Os números que decidem o produto: ativação no primeiro dia, dias com registro no teste, conversão do teste em pagante, reembolso em 7 dias e custo de modelo por teste (`PRD-fitness.md` §8.2). [PRECISA: qual a meta numérica (assinantes, MRR, conversão do teste) para os primeiros meses?]
**Conversion action:** No site, o clique no botão do WhatsApp ("Testar 7 dias grátis"), que abre a conversa com "Oi! Quero testar o Fitness 7 dias grátis" (`app/brand.ts`); medido como `generate_lead` (GA4) e `Lead` (Meta). A conversão real (teste começado, assinatura) acontece no WhatsApp (`docs/PRD.md` §4).
**Current metrics:** Nenhuma: sem usuário real e sem tráfego medido. [PRECISA: o GA4 e o pixel da Meta já têm id configurado em produção? Há algum dado de visita do site?]

## Paid Ads (optional)

O repositório prevê anúncio, mas ainda não roda: o pixel da Meta e o GA4 existem no código, só depois do consentimento; o redirecionador de atribuição, o Click to WhatsApp e a Conversions API ficam para um PRP de marketing pago "a escrever" (`docs/PRD.md` §4 e §6; `docs/prps/PRP-001-site.md`, decisões 7 e 8). O botão só vale para o público quando houver número próprio (`docs/PRD.md` §5). Preencher esta seção quando o PRP de anúncio existir.
**Target CPA / ROAS:** [PRECISA: qual o custo por assinante pagante que fecha a conta, considerando que toda mensagem do diário tem custo na Meta desde 1º/10/2026 e o custo de modelo do teste?]
**Hard floor:** [PRECISA: a partir de qual CPA ou ROAS a campanha deve ser parada?]
**Monthly budget and daily variance:** [PRECISA: orçamento mensal e variação diária aceitável.]
**Conversions that count:**

| Action                                                                                                                                                                                                                                                                                                | Means                                                 | Value                                                  | Feeds bidding?                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `Lead` / `generate_lead`                                                                                                                                                                                                                                                                              | Clique no botão do WhatsApp no site                   | [PRECISA: quanto vale um clique no botão do WhatsApp?] | [PRECISA: o Lead deve alimentar o lance enquanto não há Conversions API?] |
| Teste iniciado                                                                                                                                                                                                                                                                                        | Primeira mensagem no WhatsApp (`PRD-fitness.md` §8.2) | [PRECISA: quanto vale um teste iniciado?]              | Só com a Conversions API (a escrever)                                     |
| Pagamento confirmado                                                                                                                                                                                                                                                                                  | Assinatura paga (`PRD-fitness.md` §8.2)               | Preço do plano no contrato                             | Só com a Conversions API (a escrever)                                     |
| **Known tracking weaknesses:** O clique no site não prova que a pessoa mandou a mensagem; teste e pagamento acontecem fora do site e ainda não voltam para a Meta; scripts só carregam com consentimento (Consent Mode v2 negado por padrão), então parte do tráfego não é medida (`docs/PRD.md` §4). |
| **Good lead vs. form fill:** Lead bom é quem manda a primeira mensagem e faz o primeiro registro no primeiro dia (ativação, `PRD-fitness.md` §8.2). [PRECISA: confirmar essa definição.]                                                                                                              |
| **Campaigns:** Nenhuma ainda.                                                                                                                                                                                                                                                                         |
| **Agent may:** read, compare, flag, draft, recommend                                                                                                                                                                                                                                                  |
| **Agent may not (without approval):** change budgets or bids, pause or launch, edit tracking, publish ads                                                                                                                                                                                             |

## Learnings

_Decisions and tested lessons. Newest first. Keep it to about 20 active entries._

| Date       | Learning                                                                                                                                                                                | Evidence                                                                           | Applies to                         | Status |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------- | ------ |
| 2026-10-25 | Nenhuma prova social (número de usuários, depoimento, prêmio, logo) até existir dado real                                                                                               | Decisão do dono; `AGENTS.md`; `docs/PRD.md` §2 (CDC art. 37); `PRP-001`, decisão 6 | Toda copy, anúncios, site          | active |
| 2026-10-25 | Preço, plano e dias de teste nunca escritos à mão: vêm de `GET /fitness/plans`; o build falha se site e contrato divergem                                                               | `AGENTS.md`; `PRP-001`, decisão 5; `shared/plans.ts`                               | Site, anúncios, e-mail             | active |
| 2026-10-25 | Sem travessão (nem o longo, nem a meia-risca) em texto que a pessoa lê; usar dois-pontos, vírgula ou parênteses                                                                         | `AGENTS.md`                                                                        | Toda copy                          | active |
| 2026-10-25 | Nome, domínio e textos da marca só em `app/brand.ts`; a marca "Fitness" é provisória e o nome final deve caber num assistente, não só num diário                                        | `AGENTS.md`; `PRP-001`, decisão 2                                                  | Site, criativos                    | active |
| 2026-10-25 | Uma única ação: abrir o WhatsApp com a mensagem pronta para os 7 dias grátis, sempre por `useWhatsAppLink`                                                                              | `docs/PRD.md` §1; `AGENTS.md`; `PRP-001`, decisão 7                                | Site, CTAs, anúncios               | active |
| 2026-10-25 | Exemplos de conversa usam o texto real que o diário manda, com números da TACO que fecham; não inventar resposta do bot                                                                 | `PRP-001`, fatia 3                                                                 | Site, criativos                    | active |
| 2026-10-25 | O produto não prescreve: toda sugestão leva "não substitui nutricionista nem médico"                                                                                                    | `PRD-fitness.md` §5; `diaryMessages.ts`                                            | Toda copy de benefício             | active |
| 2026-10-25 | Cor da marca é "Teal on paper", não o verde do WhatsApp; tipografia Bodoni Moda e Jost                                                                                                  | `PRP-001`, decisão 9                                                               | Criativos, site                    | active |
| 2026-10-25 | Script de terceiro (GA4, pixel) só após consentimento; sem Google Tag Manager                                                                                                           | `AGENTS.md`; `PRP-001`, decisão 8                                                  | Tracking, anúncios                 | active |
| 2026-10-12 | Entrada por 7 dias grátis sem cartão (mantida contra "paga antes com garantia"), porque produto novo e sem marca não pede pagamento antes de mostrar valor; mensal é o padrão na oferta | `PRD-fitness.md` §4.1                                                              | Oferta, anúncios, página de planos | active |

## Changelog

_Newest first. One line per revision: what changed and why._

- v1 (2026-10-26): Contexto inicial, rascunhado a partir do repositório.
