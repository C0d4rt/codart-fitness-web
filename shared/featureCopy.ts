import type { ChatMessage } from './chat'
import type { Locale } from './locale'

export type FeatureCopy = {
  /** One short line that says what the person gets. */
  headline: string
  /** How to use it, in one or two sentences. */
  howTo: string
  /** An exchange in the diary's own words and numbers. */
  exchange: ChatMessage[]
}

const you = (text: string, time = '12:41'): ChatMessage => ({ from: 'you', text, time })
const bot = (text: string, time = '12:41', button?: string): ChatMessage => ({
  from: 'bot',
  text,
  time,
  ...(button === undefined ? {} : { button }),
})

const PT: Record<string, FeatureCopy> = {
  diary: {
    headline: 'Conte o que comeu, como contaria a alguém',
    howTo:
      'Escreva ou mande um áudio com o que comeu, do jeito que falaria. O diário entende cada alimento, soma e responde com o total do dia.',
    exchange: [
      you('almocei 150 g de arroz, uma concha de feijão e um filé de frango'),
      bot(
        '✅ Registrado:\n*Almoço*\n1. 150 g de arroz branco cozido: 192 kcal\n2. ~86 g de feijão carioca cozido (1 concha): 65 kcal\n3. ~100 g de filé de frango grelhado (1 filé): 159 kcal\nTotal do dia: 416 kcal (P 40 g · C 54 g · G 3 g)\nFaltam 1.384 kcal para a meta de 1.800.',
      ),
    ],
  },
  namedMeals: {
    headline: 'Cada coisa na refeição certa',
    howTo:
      'O diário põe cada registro em café, almoço, lanche ou jantar pelo horário, e pergunta quando fica em dúvida. As refeições são as suas: diga quais faz.',
    exchange: [
      you('minhas refeições são café, almoço, lanche e jantar', '08:02'),
      bot('Anotado: suas refeições são café, almoço, lanche e jantar.', '08:02'),
    ],
  },
  barcode: {
    headline: 'Produto de mercado pelo código',
    howTo:
      'Digite os números do código de barras e quanto comeu. Os valores vêm do rótulo do produto.',
    exchange: [
      you('7891000100103 comi 2 colheres', '16:20'),
      bot(
        '✅ Registrado:\n*Lanche*\n1. ~30 g de Leite Condensado Moça (2 colheres): 98 kcal\nTotal do dia: 1.212 kcal (P 61 g · C 160 g · G 33 g)',
        '16:20',
      ),
    ],
  },
  quickAdd: {
    headline: 'Só o número, quando é o que você tem',
    howTo: 'Sabe as calorias e não os alimentos? Diga o número e a refeição.',
    exchange: [
      you('registra 300 kcal no lanche', '16:05'),
      bot(
        '✅ Registrado:\n*Lanche*\n1. registro rápido: 300 kcal\nTotal do dia: 1.420 kcal (P 72 g · C 168 g · G 41 g)',
        '16:05',
      ),
    ],
  },
  reminders: {
    headline: 'Um lembrete, e só um',
    howTo:
      'Se você some por um dia, o diário manda uma mensagem curta para retomar. Responda "parar" e ele não manda mais.',
    exchange: [
      bot(
        'Oi! 👋 Ontem você registrou 1.760 kcal. O que você já comeu hoje? Me conta que eu anoto.',
        '11:30',
      ),
      you('café com leite e um pão na chapa', '11:34'),
    ],
  },
  photos: {
    headline: 'A foto do prato vira registro',
    howTo:
      'Mande a foto do prato, do rótulo ou do código. Para o prato, você confere num formulário o que foi visto e corrige as gramas antes de registrar.',
    exchange: [
      { from: 'you', attachment: { kind: 'photo', label: 'Foto do almoço' }, time: '12:58' },
      bot(
        'Vi isto no seu prato. Confira: desmarque o que não comeu e corrija as gramas antes de registrar. O que vier desmarcado eu não tive certeza.',
        '12:58',
        'Conferir prato',
      ),
    ],
  },
  quickAddMacros: {
    headline: 'Registro rápido com proteína, carbo e gordura',
    howTo: 'No registro rápido, diga também os macros, e o total do dia fica completo.',
    exchange: [
      you('registra 450 kcal no almoço, 30 g de proteína, 40 g de carbo e 18 g de gordura'),
      bot(
        '✅ Registrado:\n*Almoço*\n1. registro rápido: 450 kcal (P 30 g · C 40 g · G 18 g)\nTotal do dia: 980 kcal (P 62 g · C 104 g · G 33 g)',
      ),
    ],
  },
  backfill: {
    headline: 'Esqueceu um dia? Ainda dá',
    howTo:
      'Registre ou corrija até 7 dias para trás dizendo o dia: "anteontem", "no sábado", "dia 12".',
    exchange: [
      you('anteontem jantei 2 fatias de pizza de muçarela', '09:15'),
      bot(
        '📅 quinta, 23/10\n✅ Registrado:\n*Jantar*\n1. ~200 g de pizza de muçarela (2 fatias): 520 kcal',
        '09:15',
      ),
    ],
  },
  myFoods: {
    headline: 'Seus alimentos, com os seus números',
    howTo:
      'Cadastre o que não está na tabela, como o seu whey ou o pão da padaria, com os valores do rótulo. Daí em diante é só dizer o nome.',
    exchange: [
      you('meu whey: 30 g têm 120 kcal, 24 g de proteína, 3 g de carboidrato e 1 g de gordura'),
      bot('✅ Guardei *whey* nos seus alimentos: 30 g têm 120 kcal (P 24 g · C 3 g · G 1 g).'),
    ],
  },
  savedMeals: {
    headline: 'O café de sempre, numa palavra',
    howTo:
      'Depois de registrar uma refeição, salve com um nome. Na próxima vez, diga o nome, ou "o de sempre no café".',
    exchange: [
      you('salva isso como café padrão', '07:48'),
      bot(
        '⭐ Guardei *café padrão* nas suas refeições salvas: pão francês, ovo mexido e café com leite. Para registrar de novo, é só dizer "café padrão".',
        '07:48',
      ),
    ],
  },
  recipes: {
    headline: 'A receita da casa, por porção',
    howTo:
      'Mande os ingredientes e quantas porções rende, ou o link da receita. Depois, registre "1 porção" e o diário faz a conta.',
    exchange: [
      you(
        'receita strogonoff: 500 g de frango, 1 caixa de creme de leite, 1 cebola, rende 4 porções',
      ),
      bot(
        '📖 Guardei a receita *strogonoff*: 1 porção tem 274 kcal (P 28 g · C 6 g · G 14 g). Para registrar, diga por exemplo: "comi 1 porção do strogonoff".',
      ),
    ],
  },
  pantry: {
    headline: 'O que tem em casa, sem quantidade',
    howTo:
      'Conte o que comprou e o que acabou. A despensa serve para lembrar, e no Premium as sugestões saem do que você já tem.',
    exchange: [
      you('tenho em casa ovos, aveia e banana', '19:02'),
      bot('🏠 Anotei na sua despensa: ovos, aveia e banana. Agora são 3 itens.', '19:02'),
    ],
  },
  workouts: {
    headline: 'O treino anotado, com o gasto estimado',
    howTo:
      'Diga os exercícios, as séries e as cargas, ou o tempo do cardio. O gasto é estimado e entra na conta do dia.',
    exchange: [
      you('supino reto, 3 séries de 8 com 60 kg, e corri 30 min', '18:40'),
      bot(
        '🏋️ Treino registrado:\nSupino reto: 3 × 8 com 60 kg\nCorrida: 30 min\n🔥 Gasto do treino: cerca de 410 kcal (estimativa).',
        '18:40',
      ),
    ],
  },
  savedWorkouts: {
    headline: 'O treino A, sem digitar de novo',
    howTo: 'Salve o treino da semana com um nome e registre de novo só dizendo que fez.',
    exchange: [
      you('fiz o treino A', '18:55'),
      bot(
        '🏋️ Treino registrado:\nSupino reto: 3 × 8 com 60 kg\nRemada curvada: 3 × 10 com 40 kg\nDesenvolvimento: 3 × 10 com 16 kg\nQuanto tempo durou o treino? Assim somo o gasto.',
        '18:55',
      ),
    ],
  },
  dayGoal: {
    headline: 'Quanto falta, a qualquer hora',
    howTo:
      'A meta sai de uma conta com o seu peso, altura, idade e atividade, e cada resposta diz quanto falta. Pergunte quando quiser.',
    exchange: [
      you('quanto falta pra minha meta?', '17:10'),
      bot(
        'Total do dia: 1.240 kcal (P 78 g · C 140 g · G 38 g)\nFaltam 560 kcal para a meta de 1.800.',
        '17:10',
      ),
    ],
  },
  goalPercent: {
    headline: 'A meta do seu jeito, em percentual',
    howTo: 'Mude as calorias ou a divisão entre carboidrato, proteína e gordura, somando 100%.',
    exchange: [
      you('50% carbo, 25% proteína, 25% gordura', '10:20'),
      bot(
        '🎯 Meta ajustada: 1.800 kcal por dia (carboidrato 50% · 225 g, proteína 25% · 113 g, gordura 25% · 50 g).\nEla não muda com o seu peso; para voltar à calculada, diga "recalcular minha meta".',
        '10:20',
      ),
    ],
  },
  mealGoals: {
    headline: 'Quanto falta em cada refeição',
    howTo:
      'Divida a meta entre as refeições, e cada registro mostra quanto ainda cabe naquela refeição.',
    exchange: [
      you('40% no jantar', '10:31'),
      bot(
        '🍽️ Sua meta por refeição: café 20%, almoço 30%, lanche 10% e jantar 40%.\nPara mudar, diga por exemplo "40% no jantar".',
        '10:31',
      ),
    ],
  },
  goalGrams: {
    headline: 'Macros em gramas, para quem já sabe os números',
    howTo:
      'Diga os gramas de carboidrato, proteína e gordura, e a meta de calorias vira a soma deles.',
    exchange: [
      you('minha meta é 200 g de carbo, 150 g de proteína e 60 g de gordura', '10:40'),
      bot(
        '🎯 Meta ajustada: 1.940 kcal por dia, a soma dos macros (carboidrato 200 g, proteína 150 g, gordura 60 g).\nEla não muda com o seu peso; para voltar à calculada, diga "recalcular minha meta".',
        '10:40',
      ),
    ],
  },
  weekdayGoals: {
    headline: 'Uma meta para o fim de semana',
    howTo: 'Dê a alguns dias uma meta diferente; nos outros, vale a de sempre.',
    exchange: [
      you('no sábado e domingo minha meta é 2.200 kcal', '10:52'),
      bot(
        '🎯 Meta de sábado e domingo: 2.200 kcal. Nos outros dias, vale a sua meta de sempre.',
        '10:52',
      ),
    ],
  },
  mealSuggestion: {
    headline: 'O que comer, dentro do que falta',
    howTo:
      'Pergunte o que comer numa refeição. As ideias cabem no que falta da meta e preferem o que está na sua despensa.',
    exchange: [
      you('o que eu janto hoje?', '19:30'),
      bot(
        '*Jantar*: faltam 620 kcal (P 35 g). Algumas ideias:\n1. Omelete de 3 ovos com espinafre e 1 pão francês\n2. 120 g de frango grelhado com salada e 4 colheres de arroz\n3. Crepioca com queijo branco e tomate\nSe comer uma delas, me diga, por exemplo: "comi a opção 2".\n_Sugestão geral, a partir da sua meta. Não substitui nutricionista nem médico._',
        '19:30',
      ),
    ],
  },
  fasting: {
    headline: 'O jejum acompanhado sozinho',
    howTo:
      'Diga o seu protocolo uma vez, como "faço jejum 16:8". O jejum começa na sua última refeição, ou quando você disser "comecei o jejum", e o diário avisa quando a janela terminar.',
    exchange: [
      you('faço jejum 16:8', '19:50'),
      bot(
        'Anotado: jejum 16:8. Ele começa na sua última refeição, ou quando você disser "comecei o jejum", e eu aviso quando a janela terminar. O jejum não é indicado para todos: com alguma condição de saúde, na gestação ou com histórico de transtorno alimentar, fale antes com um profissional.',
        '19:50',
      ),
      bot('⏱️ Seu jejum de 16 h terminou (começou às 20:00). Pode comer!', '12:00'),
    ],
  },
  compareProducts: {
    headline: 'No mercado, compare antes de levar',
    howTo:
      'Diga "quero comparar" e mande o código de barras ou a foto do rótulo de cada produto, um por vez, até 5. O diário põe lado a lado os números, os selos "alto em", os primeiros ingredientes e quanto cada um cabe no seu dia, sem dizer qual é "o melhor".',
    exchange: [
      you('quero comparar esses dois iogurtes', '17:40'),
      bot(
        '🛒 Vamos comparar. Manda o código de barras ou a foto do rótulo de cada produto, *uma foto por vez*, até 5 produtos. Quando terminar, diga *compara*.',
        '17:40',
      ),
      you('qual tem menos açúcar?', '17:43'),
      bot(
        '🛒 *Comparação* de 2 produtos, por 100 g\nNa ordem de menos açúcar, menos calorias e menos selos "alto em":\n\n*A) Iogurte natural*\n60 kcal · 4 g de proteína · 5 g de açúcares totais · 50 mg de sódio\nSem selo "alto em"\nPrimeiros ingredientes: leite integral, fermento lácteo\nPorção de 170 g: 102 kcal, cabe nas 420 kcal que faltam hoje\n\n*B) Iogurte de morango*\n90 kcal · 3 g de proteína · 12 g de açúcares totais · 60 mg de sódio\nSem selo "alto em"\nPrimeiros ingredientes: leite, açúcar, preparado de morango (açúcar entre eles)\nUltraprocessado (NOVA 4, segundo a Open Food Facts)\nPorção de 170 g: 153 kcal, cabe nas 420 kcal que faltam hoje\n\nComparei pelos números do rótulo, com dados da Open Food Facts.',
        '17:43',
      ),
    ],
  },
  weekSummary: {
    headline: 'A semana num resumo e num gráfico',
    howTo:
      'Toda segunda chega o resumo da semana anterior, com o gráfico das calorias e dos macros. Peça quando quiser: "como foi minha semana?".',
    exchange: [
      you('como foi minha semana?', '08:30'),
      bot(
        '📊 *Resumo da semana* (13/10 a 19/10)\n📅 6 de 7 dias registrados\n🍽️ Média de 1.760 kcal por dia registrado, para uma meta de 1.800\n🏋️ Dias de treino: 3 · 1.150 kcal gastas\n⚖️ Peso: 72,4 → 71,8 kg (-0,6 kg)',
        '08:30',
      ),
    ],
  },
  weight: {
    headline: 'O peso ao longo do tempo',
    howTo: 'Diga o peso quando se pesar. Peça a evolução e ela vem em texto e em gráfico.',
    exchange: [
      you('como está meu peso?', '07:05'),
      bot(
        '⚖️ *Evolução do peso* (desde 01/09)\nInício: 74,2 kg (01/09)\nAtual: 71,8 kg (19/10)\nVariação: -2,4 kg (-3,2%)\nQuer só os últimos 30 ou 90 dias? É só pedir.',
        '07:05',
      ),
    ],
  },
  nutrients: {
    headline: 'Sódio, fibra e açúcar, além das calorias',
    howTo:
      'Pergunte por um nutriente, ou por todos. A comparação é com os valores de referência da rotulagem.',
    exchange: [
      you('quanto de sódio comi hoje?', '20:15'),
      bot(
        '🥗 Nutrientes de hoje:\nSódio: 1.480 de 2.000 mg · faltam 520\nAs metas são as de referência da rotulagem (ANVISA). Para ver de onde veio um deles, pergunte, por exemplo: "de onde veio o sódio?"',
        '20:15',
      ),
    ],
  },
  foodRanking: {
    headline: 'O que mais pesou na sua semana',
    howTo:
      'Veja os alimentos que mais deram calorias, proteína, carboidrato ou gordura, no dia, na semana ou no mês.',
    exchange: [
      you('o que mais me deu calorias essa semana?', '21:00'),
      bot(
        '🏆 *O que mais te deu calorias nesta semana*\n1. Arroz branco cozido: 2.310 kcal (19%), em 1.805 g\n2. Pão francês: 1.500 kcal (12%), em 500 g\n3. Frango grelhado: 1.272 kcal (10%), em 800 g\nTotal no período: 12.320 kcal',
        '21:00',
      ),
    ],
  },
  csvExport: {
    headline: 'Seu diário numa planilha',
    howTo:
      'Peça o arquivo e receba tudo em CSV: comida, treinos e peso, para abrir no Excel ou levar ao seu nutricionista.',
    exchange: [
      you('me manda o CSV', '21:20'),
      {
        from: 'bot',
        attachment: { kind: 'file', name: 'diario.csv' },
        text: '📄 Seu diário de 01/09 a 24/10, em CSV: o que você comeu, seus treinos e seu peso. Abre no Excel ou no Google Planilhas.',
        time: '21:20',
      },
    ],
  },
}

const EN: Record<string, FeatureCopy> = {
  diary: {
    headline: 'Tell it what you ate, the way you would tell a friend',
    howTo:
      'Type or send a voice note with what you ate, the way you would say it. The diary understands each food, adds it up and replies with the day total.',
    exchange: [
      you('for lunch I had 150 g of rice, a ladle of beans and a chicken fillet'),
      bot(
        '✅ Logged:\n*Lunch*\n1. 150 g of cooked white rice: 192 kcal\n2. ~86 g of cooked pinto beans (1 ladle): 65 kcal\n3. ~100 g of grilled chicken fillet (1 fillet): 159 kcal\nDay total: 416 kcal (P 40 g · C 54 g · F 3 g)\n1,384 kcal left for the goal of 1,800.',
      ),
    ],
  },
  namedMeals: {
    headline: 'Everything in the right meal',
    howTo:
      'The diary puts each entry in breakfast, lunch, snack or dinner by the time of day, and asks when it is not sure. The meals are yours: tell it which ones you have.',
    exchange: [
      you('my meals are breakfast, lunch, snack and dinner', '08:02'),
      bot('🍽️ Your meals are now: breakfast, lunch, snack, and dinner.', '08:02'),
    ],
  },
  barcode: {
    headline: 'Store products by their barcode',
    howTo:
      'Type the numbers of the barcode and how much you had. The values come from the product label.',
    exchange: [
      you('7891000100103 I had 2 tablespoons', '16:20'),
      bot(
        '✅ Logged:\n*Snack*\n1. ~30 g of Moça sweetened condensed milk (2 tablespoons): 98 kcal\nDay total: 1,212 kcal (P 61 g · C 160 g · F 33 g)',
        '16:20',
      ),
    ],
  },
  quickAdd: {
    headline: 'Just the number, when that is all you have',
    howTo: 'Know the calories but not the foods? Say the number and the meal.',
    exchange: [
      you('log 300 kcal at snack', '16:05'),
      bot(
        '✅ Logged:\n*Snack*\n1. quick add: 300 kcal\nDay total: 1,420 kcal (P 72 g · C 168 g · F 41 g)',
        '16:05',
      ),
    ],
  },
  reminders: {
    headline: 'One reminder, and only one',
    howTo:
      'If you go quiet for a day, the diary sends a short message to help you pick it back up. Reply "stop" and it sends no more.',
    exchange: [
      bot(
        "Hi! 👋 Yesterday you logged 1,760 kcal. What have you eaten today? Tell me and I'll log it.",
        '11:30',
      ),
      you('coffee with milk and a toasted buttered roll', '11:34'),
    ],
  },
  photos: {
    headline: 'A photo of your plate becomes an entry',
    howTo:
      'Send a photo of the plate, the label or the barcode. For the plate, you check what was seen in a form and fix the grams before logging.',
    exchange: [
      { from: 'you', attachment: { kind: 'photo', label: 'Photo of lunch' }, time: '12:58' },
      bot(
        "This is what I saw on your plate. Check it: untick what you didn't eat and fix the grams before logging. Anything left unticked is something I wasn't sure about.",
        '12:58',
        'Check plate',
      ),
    ],
  },
  quickAddMacros: {
    headline: 'Quick add with protein, carbs and fat',
    howTo: 'In a quick add, also say the macros, and the day total stays complete.',
    exchange: [
      you('log 450 kcal at lunch, 30 g of protein, 40 g of carbs and 18 g of fat'),
      bot(
        '✅ Logged:\n*Lunch*\n1. quick add: 450 kcal (P 30 g · C 40 g · F 18 g)\nDay total: 980 kcal (P 62 g · C 104 g · F 33 g)',
      ),
    ],
  },
  backfill: {
    headline: 'Forgot a day? There is still time',
    howTo:
      'Log or fix entries up to 7 days back by saying the day: "the day before yesterday", "on Saturday", "on the 12th".',
    exchange: [
      you('the day before yesterday I had 2 slices of mozzarella pizza for dinner', '09:15'),
      bot(
        '📅 Thursday (10/23)\n✅ Logged:\n*Dinner*\n1. ~200 g of mozzarella pizza (2 slices): 520 kcal',
        '09:15',
      ),
    ],
  },
  myFoods: {
    headline: 'Your foods, with your numbers',
    howTo:
      'Add what is not in the table, like your whey or the bread from your bakery, with the values on the label. From then on, just say its name.',
    exchange: [
      you('my whey: 30 g has 120 kcal, 24 g of protein, 3 g of carbs and 1 g of fat'),
      bot('✅ I saved *whey* in your foods: 30 g has 120 kcal (P 24 g · C 3 g · F 1 g).'),
    ],
  },
  savedMeals: {
    headline: 'Your usual breakfast, in one word',
    howTo:
      'After logging a meal, save it with a name. Next time, just say the name, or "the usual for breakfast".',
    exchange: [
      you('save this as usual breakfast', '07:48'),
      bot(
        '⭐ I saved *usual breakfast* in your saved meals: bread roll, scrambled eggs, and coffee with milk. To log it again, just say "usual breakfast".',
        '07:48',
      ),
    ],
  },
  recipes: {
    headline: 'Your home recipe, per serving',
    howTo:
      'Send the ingredients and how many servings it makes, or the link to the recipe. Then log "1 serving" and the diary does the math.',
    exchange: [
      you('stroganoff recipe: 500 g of chicken, 1 carton of cream, 1 onion, makes 4 servings'),
      bot(
        '📖 I saved the recipe *stroganoff*: 1 serving has 274 kcal (P 28 g · C 6 g · F 14 g). To log it, say for example: "I had 1 serving of stroganoff".',
      ),
    ],
  },
  pantry: {
    headline: 'What you have at home, no amounts needed',
    howTo:
      'Tell it what you bought and what ran out. The pantry is there to remind you, and on Premium the suggestions come from what you already have.',
    exchange: [
      you('I have eggs, oats and bananas at home', '19:02'),
      bot("🏠 Added to your pantry: eggs, oats, and bananas. That's 3 items now.", '19:02'),
    ],
  },
  workouts: {
    headline: 'Your workout logged, with the estimated burn',
    howTo:
      'Say the exercises, sets and loads, or how long your cardio took. The burn is an estimate and counts toward your day.',
    exchange: [
      you('bench press, 3 sets of 8 at 60 kg, and I ran 30 min', '18:40'),
      bot(
        '🏋️ Workout logged:\nBench press: 3 × 8 at 60 kg\nRunning: 30 min\n🔥 Workout burn: about 410 kcal (estimate).',
        '18:40',
      ),
    ],
  },
  savedWorkouts: {
    headline: 'Workout A, without typing it again',
    howTo: 'Save your weekly workout with a name and log it again just by saying you did it.',
    exchange: [
      you('I did workout A', '18:55'),
      bot(
        '🏋️ Workout logged:\nBench press: 3 × 8 at 60 kg\nBent-over row: 3 × 10 at 40 kg\nShoulder press: 3 × 10 at 16 kg\nHow long did the workout last? That way I can add up the burn.',
        '18:55',
      ),
    ],
  },
  dayGoal: {
    headline: 'How much is left, any time',
    howTo:
      'Your goal comes from a calculation with your weight, height, age and activity, and every reply says how much is left. Ask whenever you like.',
    exchange: [
      you('how much is left for my goal?', '17:10'),
      bot(
        'Day total: 1,240 kcal (P 78 g · C 140 g · F 38 g)\n560 kcal left for the goal of 1,800.',
        '17:10',
      ),
    ],
  },
  goalPercent: {
    headline: 'Your goal your way, in percentages',
    howTo: 'Change the calories or the split between carbs, protein and fat, adding up to 100%.',
    exchange: [
      you('50% carbs, 25% protein, 25% fat', '10:20'),
      bot(
        '🎯 Goal set: 1,800 kcal per day (carbs 50% · 225 g, protein 25% · 113 g, fat 25% · 50 g).\nIt doesn\'t change with your weight; to go back to the calculated one, say "recalculate my goal".',
        '10:20',
      ),
    ],
  },
  mealGoals: {
    headline: 'How much is left for each meal',
    howTo: 'Split your goal between meals, and each entry shows how much still fits in that meal.',
    exchange: [
      you('40% at dinner', '10:31'),
      bot(
        '🍽️ Your goal per meal: breakfast 20%, lunch 30%, snack 10%, and dinner 40%.\nTo change it, say for example "40% at dinner".',
        '10:31',
      ),
    ],
  },
  goalGrams: {
    headline: 'Macros in grams, for those who know their numbers',
    howTo: 'Say the grams of carbs, protein and fat, and your calorie goal becomes their sum.',
    exchange: [
      you('my goal is 200 g of carbs, 150 g of protein and 60 g of fat', '10:40'),
      bot(
        '🎯 Goal set: 1,940 kcal per day, the sum of the macros (carbs 200 g, protein 150 g, fat 60 g).\nIt doesn\'t change with your weight; to go back to the calculated one, say "recalculate my goal".',
        '10:40',
      ),
    ],
  },
  weekdayGoals: {
    headline: 'A different goal for the weekend',
    howTo: 'Give some days a different goal; on the others, your usual goal applies.',
    exchange: [
      you('on Saturday and Sunday my goal is 2,200 kcal', '10:52'),
      bot(
        '🎯 Goal for Saturday and Sunday: 2,200 kcal. On other days, your usual goal applies.',
        '10:52',
      ),
    ],
  },
  mealSuggestion: {
    headline: 'What to eat, within what is left',
    howTo:
      'Ask what to eat for a meal. The ideas fit what is left of your goal and favor what is in your pantry.',
    exchange: [
      you('what should I have for dinner tonight?', '19:30'),
      bot(
        '*Dinner*: 620 kcal left (P 35 g). Some ideas:\n1. 3-egg omelet with spinach and 1 bread roll\n2. 120 g of grilled chicken with salad and 4 tablespoons of rice\n3. Tapioca and egg crepe with fresh cheese and tomato\nIf you eat one of them, tell me, for example: "I had option 2".\n_A general suggestion based on your goal. It doesn\'t replace a nutritionist or a doctor._',
        '19:30',
      ),
    ],
  },
  fasting: {
    headline: 'Your fast, tracked for you',
    howTo:
      'Tell it your protocol once, like "I do 16:8 fasting". The fast starts at your last meal, or when you say "I started fasting", and the diary lets you know when the window ends.',
    exchange: [
      you('I do 16:8 fasting', '19:50'),
      bot(
        "⏱️ 16:8 fasting on. It starts at your last logged meal, or when you say *I started fasting*, and I'll let you know when the window ends. Fasting isn't for everyone: if you have a health condition, are pregnant or have a history of eating disorders, talk to a professional first.",
        '19:50',
      ),
      bot('⏱️ Your 16 h fast is over (it started at 08:00 PM). You can eat!', '12:00'),
    ],
  },
  compareProducts: {
    headline: 'At the store, compare before you buy',
    howTo:
      'Say "I want to compare" and send the barcode or a photo of the label of each product, one at a time, up to 5. The diary puts the numbers side by side, with the "high in" seals, the first ingredients and how much of each fits your day, without saying which one is "the best".',
    exchange: [
      you('I want to compare these two yogurts', '17:40'),
      bot(
        "🛒 Let's compare. Send the barcode or a photo of the label of each product, *one photo at a time*, up to 5 products. When you're done, say *compare*.",
        '17:40',
      ),
      you('which one has less sugar?', '17:43'),
      bot(
        '🛒 *Comparison* of 2 products, per 100 g\nIn order of less sugar, fewer calories, and fewer "high in" seals:\n\n*A) Plain yogurt*\n60 kcal · 4 g of protein · 5 g of total sugars · 50 mg of sodium\nNo "high in" seal\nFirst ingredients: whole milk, dairy cultures\nServing of 170 g: 102 kcal, fits the 420 kcal left today\n\n*B) Strawberry yogurt*\n90 kcal · 3 g of protein · 12 g of total sugars · 60 mg of sodium\nNo "high in" seal\nFirst ingredients: milk, sugar, strawberry preparation (sugar among them)\nUltra-processed (NOVA 4, according to Open Food Facts)\nServing of 170 g: 153 kcal, fits the 420 kcal left today\n\nI compared the numbers on the labels, with data from Open Food Facts.',
        '17:43',
      ),
    ],
  },
  weekSummary: {
    headline: 'Your week in a summary and a chart',
    howTo:
      'Every Monday, the summary of the week before arrives, with a chart of your calories and macros. Ask whenever you like: "how was my week?".',
    exchange: [
      you('how was my week?', '08:30'),
      bot(
        '📊 *Week summary* (10/13 to 10/19)\n📅 6 of 7 days logged\n🍽️ Average of 1,760 kcal per logged day, against a goal of 1,800\n🏋️ Workout days: 3 · 1,150 kcal burned\n⚖️ Weight: 72.4 → 71.8 kg (-0.6 kg)',
        '08:30',
      ),
    ],
  },
  weight: {
    headline: 'Your weight over time',
    howTo:
      'Tell it your weight when you weigh yourself. Ask for your progress and it comes as text and as a chart.',
    exchange: [
      you('how is my weight going?', '07:05'),
      bot(
        '⚖️ *Weight progress* (since 09/01)\nStart: 74.2 kg (09/01)\nNow: 71.8 kg (10/19)\nChange: -2.4 kg (-3.2%)\nWant just the last 30 or 90 days? Just ask.',
        '07:05',
      ),
    ],
  },
  nutrients: {
    headline: 'Sodium, fiber and sugar, beyond calories',
    howTo:
      'Ask about one nutrient, or all of them. They are compared with the labeling reference values.',
    exchange: [
      you('how much sodium did I have today?', '20:15'),
      bot(
        '🥗 Nutrients for today:\nSodium: 1,480 of 2,000 mg · 520 left\nThe goals are the labeling reference values (ANVISA). To see where one came from, ask, for example: "where did the sodium come from?"',
        '20:15',
      ),
    ],
  },
  foodRanking: {
    headline: 'What weighed most in your week',
    howTo:
      'See the foods that gave you the most calories, protein, carbs or fat, over the day, the week or the month.',
    exchange: [
      you('what gave me the most calories this week?', '21:00'),
      bot(
        '🏆 *What gave you the most calories this week*\n1. Cooked white rice: 2,310 kcal (19%), in 1,805 g\n2. Bread roll: 1,500 kcal (12%), in 500 g\n3. Grilled chicken: 1,272 kcal (10%), in 800 g\nTotal for the period: 12,320 kcal',
        '21:00',
      ),
    ],
  },
  csvExport: {
    headline: 'Your diary in a spreadsheet',
    howTo:
      'Ask for the file and get everything as CSV: food, workouts and weight, to open in Excel or take to your nutritionist.',
    exchange: [
      you('send me the CSV', '21:20'),
      {
        from: 'bot',
        attachment: { kind: 'file', name: 'diary.csv' },
        text: '📄 Your diary from 09/01 to 10/24, as CSV: what you ate, your workouts and your weight. It opens in Excel or Google Sheets.',
        time: '21:20',
      },
    ],
  },
}

/** Keyed by the feature ids of `GET /fitness/plans`; `buildCatalog` refuses any id on one side only. */
export const FEATURE_COPY: Record<Locale, Record<string, FeatureCopy>> = { pt: PT, en: EN }
