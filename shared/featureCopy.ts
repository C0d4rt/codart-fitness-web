import type { ChatMessage } from './chat'

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

/** Keyed by the feature ids of `GET /fitness/plans`; `buildCatalog` refuses any id on one side only. */
export const FEATURE_COPY: Record<string, FeatureCopy> = {
  diary: {
    headline: 'Conte o que comeu, como contaria a alguém',
    howTo:
      'Escreva ou mande um áudio com o que comeu, do jeito que falaria. O diário acha cada alimento na tabela TACO, soma e responde com o total do dia.',
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
      'Digite os números do código de barras e quanto comeu. Os valores vêm do rótulo, pela base aberta Open Food Facts.',
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
      'Diga os exercícios, as séries e as cargas, ou o tempo do cardio. O gasto é estimado pelo Compendium of Physical Activities e entra na conta do dia.',
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
      'Pergunte por um nutriente, ou por todos. A comparação é com os valores de referência da rotulagem da ANVISA.',
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
