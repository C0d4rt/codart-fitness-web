import { brand } from '../app/brand'
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
        '✅ *Almoço* registrado\n\n• 150 g de arroz: 192 kcal\n• 1 concha de feijão (~86 g): 65 kcal\n• ~100 g de filé de frango: 159 kcal\n\n• Proteína: 40 g\n• Carboidratos: 54 g\n• Gordura: 3 g\n*Total do dia:* 416 kcal\n*Faltam 1.384 kcal* para a meta de 1.800.',
      ),
    ],
  },
  namedMeals: {
    headline: 'Cada coisa na refeição certa',
    howTo:
      'O diário põe cada registro em café, almoço, lanche ou jantar pelo horário, e pergunta quando fica em dúvida. As refeições são as suas: diga quais faz.',
    exchange: [
      you('minhas refeições são café, almoço, lanche e jantar', '08:02'),
      bot('🍽️ Suas refeições agora são: café, almoço, lanche, jantar.', '08:02'),
    ],
  },
  barcode: {
    headline: 'Produto de mercado pelo código',
    howTo:
      'Digite os números do código de barras e quanto comeu. Os valores vêm do rótulo do produto.',
    exchange: [
      you('7891000100103 comi 2 colheres', '16:20'),
      bot(
        '✅ *Lanches* registrado\n\n• 30 g de Leite Condensado Moça: 98 kcal\n\n• Proteína: 61 g\n• Carboidratos: 160 g\n• Gordura: 33 g\n*Total do dia:* 1.212 kcal\n*Faltam 588 kcal* para a meta de 1.800.',
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
        '✅ *Lanches* registrado\n\n• registro rápido: 300 kcal\n\n• Proteína: 72 g\n• Carboidratos: 168 g\n• Gordura: 41 g\n*Total do dia:* 1.420 kcal\n*Faltam 380 kcal* para a meta de 1.800.',
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
        'Oi! 👋 Ontem você registrou 1.760 kcal. O que você já comeu hoje? Me conta que eu anoto.\n\nPara não receber lembretes, responda "parar".',
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
      {
        from: 'you',
        attachment: {
          kind: 'photo',
          label: 'Uma salada com rúcula, ovos, cenoura e tomate',
          src: '/images/salada.jpg',
        },
        time: '12:58',
      },
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
        '✅ *Almoço* registrado\n\n• registro rápido: 450 kcal\n\n• Proteína: 62 g\n• Carboidratos: 104 g\n• Gordura: 33 g\n*Total do dia:* 980 kcal\n*Faltam 820 kcal* para a meta de 1.800.',
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
        '📅 anteontem\n\n✅ *Jantar* registrado\n\n• 2 fatias de pizza de muçarela (~200 g): 520 kcal\n\n• Proteína: 86 g\n• Carboidratos: 215 g\n• Gordura: 55 g\n*Total do dia:* 1.690 kcal\n*Faltam 110 kcal* para a meta de 1.800.',
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
      bot(
        '✅ Guardei *whey* nos seus alimentos: 120 kcal na porção de 30 g · 400 kcal em 100 g (Proteína 80 g · Carboidratos 10 g · Gordura 3,3 g).',
      ),
    ],
  },
  savedMeals: {
    headline: 'O café de sempre, numa palavra',
    howTo:
      'Depois de registrar uma refeição, salve com um nome. Na próxima vez, diga o nome, ou "o de sempre no café".',
    exchange: [
      you('salva isso como café padrão', '07:48'),
      bot(
        '⭐ Guardei *café padrão* nas suas refeições salvas: 50 g de pão francês, 100 g de ovo mexido, 200 g de café com leite. Para registrar de novo, é só dizer "café padrão".',
        '07:48',
      ),
    ],
  },
  recipes: {
    headline: 'A receita da casa, por porção',
    howTo:
      'Mande os ingredientes e quantas porções rende, ou o link da receita. Depois, registre "1 porção" e o diário faz a conta.',
    exchange: [
      you('receita strogonoff: 500 g de frango e 200 g de creme de leite, rende 4 porções'),
      bot(
        '📖 *Receita strogonoff*, confira a conta\n\n• 500 g de frango: 595 kcal\n• 200 g de creme de leite: 442 kcal\n\n*Total:* 1.037 kcal, com 700 g de ingredientes crus\nProteína 111 g · Carboidratos 9 g · Gordura 60 g\n259 kcal por porção (rende 4)\n\nGuardo a receita *strogonoff* assim?',
        '12:41',
        'Guardar',
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
        '✅ *Treino* registrado\n\n1. Supino reto: 3×8 com 60 kg\n2. Corrida: 30 min (357 kcal)\n\n🔥 cerca de 357 kcal (estimativa)',
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
        '✅ *Treino* registrado\n\n1. Supino reto: 3×8 com 60 kg\n2. Remada curvada: 3×10 com 40 kg\n3. Desenvolvimento: 3×10 com 16 kg\n\n*Faltam 640 kcal* para a meta de 1.800.\n\nQuanto tempo durou o treino? Assim somo o gasto.',
        '18:55',
      ),
    ],
  },
  readyPrograms: {
    headline: 'Um programa de treino pronto, do iniciante ao avançado',
    howTo:
      'São programas gerais, que você escolhe: não são montados para você. Se faltar um aparelho ou doer alguma coisa, o exercício é trocado.',
    exchange: [
      you('treinos', '07:10'),
      bot(
        'Escolha um treino pronto: ele começa hoje, com os exercícios trocados se faltar um aparelho ou se algo doer.',
        '07:10',
        'Treinos prontos',
      ),
      you('minha academia não tem leg press', '07:40'),
      bot('Troquei leg press por agachamento no smith no seu plano.', '07:40'),
    ],
  },
  dayGoal: {
    headline: 'Quanto falta, a qualquer hora',
    howTo:
      'A meta sai de uma conta com o seu peso, altura, idade e atividade, e cada resposta diz quanto falta. Pergunte quando quiser.',
    exchange: [
      you('quanto falta pra minha meta?', '17:10'),
      bot(
        '📊 *Hoje: 1.240 kcal*\n• Proteína: 78 g\n• Carboidratos: 140 g\n• Gordura: 38 g\n*Faltam 560 kcal* para a meta de 1.800.',
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
        '🎯 *Meta ajustada: 1.800 kcal por dia*\n• Proteína: 113 g (25%)\n• Carboidratos: 225 g (50%)\n• Gordura: 50 g (25%)\n\nEla não muda com o seu peso; para voltar à calculada, diga "recalcular minha meta".',
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
        '🍽️ Sua meta por refeição: café da manhã 21% (378 kcal) · almoço 30% (540 kcal) · jantar 40% (720 kcal) · lanches 9% (162 kcal).\nPara mudar, diga por exemplo "40% no jantar".',
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
        '🎯 *Meta ajustada: 1.940 kcal por dia*, a soma dos macros\n• Proteína: 150 g\n• Carboidratos: 200 g\n• Gordura: 60 g\n\nEla não muda com o seu peso; para voltar à calculada, diga "recalcular minha meta".',
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
        '🎯 *Meta de sábado e domingo: 2.200 kcal*\n• Proteína: 143 g\n• Carboidratos: 270 g\n• Gordura: 61 g\n\nNos outros dias, vale a sua meta de sempre.',
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
        '💡 *Ideias: Jantar*\nFaltam 450 kcal e 29 g de proteína.\n\n1. 3 ovos cozidos, 1 pão francês, salada de alface à vontade: 380 kcal\n2. 120 g de frango grelhado, 100 g de arroz branco cozido, salada de alface à vontade: 330 kcal\n3. 120 g de arroz branco cozido, 140 g de feijão carioca, 2 ovos cozidos: 406 kcal\n\nSe comer uma delas, me diga, por exemplo: "comi a opção 2".',
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
        '⏱️ Jejum 16:8 ativado. Ele começa na sua última refeição registrada, ou quando você disser *comecei o jejum*, e eu aviso quando a janela terminar.',
        '19:50',
      ),
      bot('⏱️ Seu jejum de 16 h terminou (começou às 20:00). Pode comer!', '12:00'),
    ],
  },
  mealReminders: {
    headline: 'Lembrete na hora de cada refeição',
    howTo:
      'Diga a que horas quer ser lembrado, como "me lembra do almoço às 12h30 e do jantar às 20h". O lembrete só chega se aquela refeição ainda não foi registrada no dia.',
    exchange: [
      you('me lembra do almoço às 12h30 e do jantar às 20h', '09:15'),
      bot(
        '🔔 Combinado: *almoço* às 12:30 e *jantar* às 20:00. Nesses horários eu te lembro, só se a refeição ainda não estiver registrada.',
        '09:15',
      ),
      bot(
        '🍽️ Hora de registrar: *jantar*. Me conta o que você comeu. Faltam 640 kcal hoje.\n\nPara não receber lembretes, responda "parar".',
        '20:00',
      ),
    ],
  },
  compareProducts: {
    headline: 'No mercado, compare antes de levar',
    howTo:
      'Diga "quero comparar" e mande o código de barras ou a foto do rótulo de cada produto, um por vez, até 5. O assistente põe lado a lado os números, os selos "alto em", os primeiros ingredientes e quanto cada um cabe no seu dia, sem dizer qual é "o melhor".',
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
      'No dia que você escolher (segunda, se não disser nada), chega o resumo da semana, com o gráfico das calorias e dos macros. Peça quando quiser: "como foi minha semana?".',
    exchange: [
      you('como foi minha semana?', '08:30'),
      bot(
        '📊 *Resumo da semana* (13/10 a 19/10)\n\n📅 6 de 7 dias registrados\n🍽️ Média de 1.760 kcal por dia registrado (meta 1.800)\nProteína 110 de 122 g · Carboidratos 200 de 216 g · Gordura 55 de 50 g\n\n🏋️ 3 dias de treino · 1.150 kcal gastas\n⚖️ Peso: 72,4 → 71,8 kg (−0,6 kg)\n🍽️ Almoço: 36% das kcal',
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
        '⚖️ *Evolução do peso* (desde 01/09)\n\n• Início: 74,2 kg (01/09)\n• Atual: 71,8 kg (19/10)\n• *Variação: −2,4 kg (−3,2%)*\n\nQuer só os últimos 30 ou 90 dias? É só pedir.',
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
        '🥗 *Nutrientes de hoje*\n\n• Sódio: 1.480 mg de 2.000 mg, faltam 520 mg\n\nDe onde veio:\n• 60 g de presunto: 613 mg (41%)\n• 50 g de pão francês: 324 mg (22%)\n• 30 g de queijo minas: 207 mg (14%)',
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
        '🏆 *O que mais te deu calorias nesta semana*\n\n1. Arroz branco cozido (1.805 g): 2.310 kcal, 19%\n2. Pão francês (500 g): 1.500 kcal, 12%\n3. Frango grelhado (800 g): 1.272 kcal, 10%\n\n*Total:* 12.320 kcal',
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
  anamnesis: {
    headline: 'Uma avaliação completa antes do plano',
    howTo:
      'Na própria conversa, você responde sobre objetivo, rotina, treino, alimentação, preferências e saúde, e manda três fotos para acompanhar a sua evolução. O seu plano é montado a partir disso.',
    exchange: [
      bot(
        'Seu Premium Pro começou! O primeiro passo é a sua avaliação: telas rápidas sobre você, seu objetivo, rotina, treino, alimentação e saúde.',
        '10:02',
        'Fazer avaliação',
      ),
      bot(
        'Recebi sua avaliação, obrigado! Agora preciso de 3 fotos do corpo, com roupa de treino, uma por vez. Elas ficam guardadas só para acompanhar sua evolução.',
        '10:09',
      ),
    ],
  },
  swapDiet: {
    headline: 'Uma dieta montada para você, com trocas',
    howTo:
      'O cardápio sai da sua meta e do que você gosta de comer, em porções que se trocam entre si. Pergunte o que comer em cada refeição e troque um alimento por outro equivalente quando quiser.',
    exchange: [
      you('o que eu como no almoço?', '11:50'),
      bot(
        'Pelo seu plano, no almoço:\n• 120 g de arroz tipo 1 cozido (ou 150 g de batata cozida)\n• 86 g de feijão carioca cozido\n• 120 g de frango grelhado (ou 150 g de tilápia grelhada)',
        '11:50',
        'Comi como no plano',
      ),
      you('Ver trocas', '11:52'),
      bot(
        'Trocas do almoço:\n*35 g de carboidrato*: arroz tipo 1 cozido 120 g, batata cozida 150 g, macarrão cozido 110 g\n*38 g de proteína*: frango grelhado 120 g, tilápia grelhada 150 g, patinho grelhado 110 g',
        '11:52',
      ),
    ],
  },
  periodizedTraining: {
    headline: 'Treino em fases, com a carga que sobe',
    howTo:
      'O treino é montado para os seus dias, a sua academia e o seu objetivo, em fases que mudam o estímulo ao longo do programa. Na academia, pergunte "qual meu treino hoje?": vem o dia da vez com as séries, as repetições e a carga de cada exercício, com o vídeo a um toque.',
    exchange: [
      you('qual meu treino hoje?', '18:10'),
      bot(
        '🏋️ *Treino A*, semana 3 de 4\nFase da semana: *força*\nGrupo do dia: Pernas\n1. Agachamento livre: 4 séries de 6 a 8 com 70 kg\n   ↑ subi para 70 kg: você fez 4 séries de 8 com 67,5 kg\n2. Leg press: 3 séries de 8 a 10 com 160 kg\n3. Cadeira flexora: 3 séries de 10 a 12 com 35 kg',
        '18:10',
        'Como fazer',
      ),
    ],
  },
  professionalReview: {
    headline: 'Um plano que acompanha a sua evolução',
    howTo:
      'A dieta e o treino são montados a partir da sua avaliação, com métodos baseados em evidência e conteúdo de referência, e se ajustam ao seu progresso durante o programa. O assistente da conversa anota, soma e explica.',
    exchange: [
      bot(
        'Seu plano chegou! Quando for treinar, me pergunte "qual meu treino hoje?". Para comer, siga sua meta do dia, e qualquer dúvida do seu caso eu mando para a nossa equipe.',
        '09:30',
      ),
    ],
  },
  checkIns: {
    headline: 'Check-in a cada 14 dias, reavaliação todo mês',
    howTo:
      'A cada 14 dias, um check-in rápido: peso, energia, sono, fome e o que ficou difícil. Todo mês, a reavaliação, com fotos para comparar. O plano se ajusta ao que você conta, e você recebe o que mudou e por quê, ou que ele segue igual.',
    exchange: [
      bot(
        'Hora do seu check-in! Leva um minuto e ajuda a ajustar seu plano.',
        '08:00',
        'Fazer check-in',
      ),
      bot(
        `💬 Equipe ${brand.name}: Você perdeu 0,8 kg em duas semanas, no ritmo certo. Como a fome à noite apertou, passamos 150 kcal do almoço para o jantar.`,
        '17:40',
      ),
    ],
  },
  coachChat: {
    headline: 'Pergunte à nossa equipe, na mesma conversa',
    howTo:
      'A dúvida do seu caso vai para a nossa equipe, e a resposta chega na própria conversa em até 24 horas.',
    exchange: [
      you('posso fazer o treino de quinta no sábado?', '07:15'),
      bot(
        'Essa é para a nossa equipe: mandei sua pergunta, e a resposta chega aqui em até 24 horas.',
        '07:15',
      ),
      bot(
        `💬 Equipe ${brand.name}: Pode, sim. Faça o treino C no sábado e descanse no domingo, antes do treino A.`,
        '13:20',
      ),
    ],
  },
  unlimitedReplies: {
    headline: 'Pergunte quanto quiser',
    howTo:
      'No Premium Pro, as respostas do assistente não têm limite por dia: pergunte, registre e peça sugestões quantas vezes precisar.',
    exchange: [
      you('o que eu como no lanche para bater a proteína?', '16:10'),
      bot(
        'Faltam 30 g de proteína para a meta de hoje. Do seu plano, o lanche que mais ajuda é 170 g de iogurte natural com 1 dose de whey (30 g): 30 g de proteína.',
        '16:10',
      ),
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
        '✅ *Lunch* logged\n\n• 150 g of rice: 192 kcal\n• 1 ladle of beans (~86 g): 65 kcal\n• ~100 g of chicken fillet: 159 kcal\n\n• Protein: 40 g\n• Carbs: 54 g\n• Fat: 3 g\n*Day total:* 416 kcal\n*1,384 kcal left* for the goal of 1,800.',
      ),
    ],
  },
  namedMeals: {
    headline: 'Everything in the right meal',
    howTo:
      'The diary puts each entry in breakfast, lunch, snack or dinner by the time of day, and asks when it is not sure. The meals are yours: tell it which ones you have.',
    exchange: [
      you('my meals are breakfast, lunch, snack and dinner', '08:02'),
      bot('🍽️ Your meals are now: breakfast, lunch, snack, dinner.', '08:02'),
    ],
  },
  barcode: {
    headline: 'Store products by their barcode',
    howTo:
      'Type the numbers of the barcode and how much you had. The values come from the product label.',
    exchange: [
      you('7891000100103 I had 2 tablespoons', '16:20'),
      bot(
        '✅ *Snacks* logged\n\n• 30 g of Leite Condensado Moça: 98 kcal\n\n• Protein: 61 g\n• Carbs: 160 g\n• Fat: 33 g\n*Day total:* 1,212 kcal\n*588 kcal left* for the goal of 1,800.',
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
        '✅ *Snacks* logged\n\n• quick add: 300 kcal\n\n• Protein: 72 g\n• Carbs: 168 g\n• Fat: 41 g\n*Day total:* 1,420 kcal\n*380 kcal left* for the goal of 1,800.',
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
        'Hi! 👋 Yesterday you logged 1,760 kcal. What have you eaten today? Tell me and I\'ll log it.\n\nTo stop getting reminders, reply "stop".',
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
      {
        from: 'you',
        attachment: {
          kind: 'photo',
          label: 'A salad with arugula, eggs, carrot and tomato',
          src: '/images/salada.jpg',
        },
        time: '12:58',
      },
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
        '✅ *Lunch* logged\n\n• quick add: 450 kcal\n\n• Protein: 62 g\n• Carbs: 104 g\n• Fat: 33 g\n*Day total:* 980 kcal\n*820 kcal left* for the goal of 1,800.',
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
        '📅 the day before yesterday\n\n✅ *Dinner* logged\n\n• 2 slices of mozzarella pizza (~200 g): 520 kcal\n\n• Protein: 86 g\n• Carbs: 215 g\n• Fat: 55 g\n*Day total:* 1,690 kcal\n*110 kcal left* for the goal of 1,800.',
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
      bot(
        '✅ I saved *whey* in your foods: 120 kcal per 30 g serving · 400 kcal per 100 g (Protein 80 g · Carbs 10 g · Fat 3.3 g).',
      ),
    ],
  },
  savedMeals: {
    headline: 'Your usual breakfast, in one word',
    howTo:
      'After logging a meal, save it with a name. Next time, just say the name, or "the usual for breakfast".',
    exchange: [
      you('save this as usual breakfast', '07:48'),
      bot(
        '⭐ I saved *usual breakfast* in your saved meals: 50 g of bread roll, 100 g of scrambled eggs, 200 g of coffee with milk. To log it again, just say "usual breakfast".',
        '07:48',
      ),
    ],
  },
  recipes: {
    headline: 'Your home recipe, per serving',
    howTo:
      'Send the ingredients and how many servings it makes, or the link to the recipe. Then log "1 serving" and the diary does the math.',
    exchange: [
      you('stroganoff recipe: 500 g of chicken and 200 g of cream, makes 4 servings'),
      bot(
        '📖 *Recipe stroganoff*, check the numbers\n\n• 500 g of chicken: 595 kcal\n• 200 g of cream: 442 kcal\n\n*Total:* 1,037 kcal, with 700 g of raw ingredients\nProtein 111 g · Carbs 9 g · Fat 60 g\n259 kcal per serving (makes 4)\n\nShould I save the recipe *stroganoff* like this?',
        '12:41',
        'Save',
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
        '✅ *Workout* logged\n\n1. Bench press: 3×8 at 60 kg\n2. Running: 30 min (357 kcal)\n\n🔥 about 357 kcal (estimate)',
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
        '✅ *Workout* logged\n\n1. Bench press: 3×8 at 60 kg\n2. Bent-over row: 3×10 at 40 kg\n3. Shoulder press: 3×10 at 16 kg\n\n*640 kcal left* for the goal of 1,800.\n\nHow long did the workout last? That way I can add up the burn.',
        '18:55',
      ),
    ],
  },
  readyPrograms: {
    headline: 'A ready workout program, from beginner to advanced',
    howTo:
      'These are general programs that you pick: they are not built for you. If a machine is missing or something hurts, the exercise gets swapped.',
    exchange: [
      you('workouts', '07:10'),
      bot(
        'Pick a ready workout program: it starts today, with exercises swapped if your gym lacks a machine or something hurts.',
        '07:10',
        'Ready programs',
      ),
      you("my gym doesn't have a leg press", '07:40'),
      bot('I swapped leg press for Smith machine squat in your plan.', '07:40'),
    ],
  },
  dayGoal: {
    headline: 'How much is left, any time',
    howTo:
      'Your goal comes from a calculation with your weight, height, age and activity, and every reply says how much is left. Ask whenever you like.',
    exchange: [
      you('how much is left for my goal?', '17:10'),
      bot(
        '📊 *Today: 1,240 kcal*\n• Protein: 78 g\n• Carbs: 140 g\n• Fat: 38 g\n*560 kcal left* for the goal of 1,800.',
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
        '🎯 *Goal set: 1,800 kcal per day*\n• Protein: 113 g (25%)\n• Carbs: 225 g (50%)\n• Fat: 50 g (25%)\n\nIt doesn\'t change with your weight; to go back to the calculated one, say "recalculate my goal".',
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
        '🍽️ Your goal per meal: breakfast 21% (378 kcal) · lunch 30% (540 kcal) · dinner 40% (720 kcal) · snacks 9% (162 kcal).\nTo change it, say for example "40% at dinner".',
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
        '🎯 *Goal set: 1,940 kcal per day*, the sum of the macros\n• Protein: 150 g\n• Carbs: 200 g\n• Fat: 60 g\n\nIt doesn\'t change with your weight; to go back to the calculated one, say "recalculate my goal".',
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
        '🎯 *Goal for Saturday and Sunday: 2,200 kcal*\n• Protein: 143 g\n• Carbs: 270 g\n• Fat: 61 g\n\nOn other days, your usual goal applies.',
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
        '💡 *Ideas: Dinner*\n450 kcal and 29 g of protein left.\n\n1. 3 boiled eggs, 1 bread roll, lettuce salad as much as you like: 380 kcal\n2. 120 g of grilled chicken, 100 g of cooked white rice, lettuce salad as much as you like: 330 kcal\n3. 120 g of cooked white rice, 140 g of pinto beans, 2 boiled eggs: 406 kcal\n\nIf you eat one of them, tell me, for example: "I had option 2".',
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
        "⏱️ 16:8 fasting on. It starts at your last logged meal, or when you say *I started fasting*, and I'll let you know when the window ends.",
        '19:50',
      ),
      bot('⏱️ Your 16 h fast is over (it started at 08:00 PM). You can eat!', '12:00'),
    ],
  },
  mealReminders: {
    headline: 'A reminder at the time of each meal',
    howTo:
      'Say when you want to be reminded, like "remind me about lunch at 12:30 and dinner at 8 pm". The reminder only comes if that meal is not logged yet that day.',
    exchange: [
      you('remind me about lunch at 12:30 and dinner at 8 pm', '09:15'),
      bot(
        "🔔 Done: *lunch* at 12:30 PM and *dinner* at 08:00 PM. I'll remind you at those times, only if the meal isn't logged yet.",
        '09:15',
      ),
      bot(
        '🍽️ Time to log: *dinner*. Tell me what you ate. 640 kcal left for today.\n\nTo stop getting reminders, reply "stop".',
        '20:00',
      ),
    ],
  },
  compareProducts: {
    headline: 'At the store, compare before you buy',
    howTo:
      'Say "I want to compare" and send the barcode or a photo of the label of each product, one at a time, up to 5. The assistant puts the numbers side by side, with the "high in" seals, the first ingredients and how much of each fits your day, without saying which one is "the best".',
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
      'On the day you choose (Monday, unless you say otherwise), the week summary arrives, with a chart of your calories and macros. Ask whenever you like: "how was my week?".',
    exchange: [
      you('how was my week?', '08:30'),
      bot(
        '📊 *Week summary* (10/13 to 10/19)\n\n📅 6 of 7 days logged\n🍽️ Average of 1,760 kcal per logged day (goal 1,800)\nProtein 110 of 122 g · Carbs 200 of 216 g · Fat 55 of 50 g\n\n🏋️ 3 workout days · 1,150 kcal burned\n⚖️ Weight: 72.4 → 71.8 kg (−0.6 kg)\n🍽️ Lunch: 36% of the kcal',
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
        '⚖️ *Weight progress* (since 09/01)\n\n• Start: 74.2 kg (09/01)\n• Now: 71.8 kg (10/19)\n• *Change: −2.4 kg (−3.2%)*\n\nWant just the last 30 or 90 days? Just ask.',
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
        '🥗 *Nutrients for today*\n\n• Sodium: 1,480 mg of 2,000 mg, 520 mg left\n\nWhere it came from:\n• 60 g of ham: 613 mg (41%)\n• 50 g of bread roll: 324 mg (22%)\n• 30 g of fresh cheese: 207 mg (14%)',
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
        '🏆 *What gave you the most calories this week*\n\n1. Cooked white rice (1,805 g): 2,310 kcal, 19%\n2. Bread roll (500 g): 1,500 kcal, 12%\n3. Grilled chicken (800 g): 1,272 kcal, 10%\n\n*Total:* 12,320 kcal',
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
  anamnesis: {
    headline: 'A full assessment before the plan',
    howTo:
      'Right in the chat, you answer about your goal, routine, training, eating, preferences and health, and send three photos to track your progress. Your plan is built from that.',
    exchange: [
      bot(
        'Your Premium Pro has started! The first step is your assessment: quick screens about you, your goal, routine, training, food and health.',
        '10:02',
        'Start assessment',
      ),
      bot(
        'Got your assessment, thanks! Now I need 3 body photos in workout clothes, one at a time. They are kept only to follow your progress.',
        '10:09',
      ),
    ],
  },
  swapDiet: {
    headline: 'A diet built for you, with swaps',
    howTo:
      'The menu comes from your goal and the foods you like, in portions that swap for one another. Ask what to eat at each meal and swap a food for an equivalent one whenever you like.',
    exchange: [
      you('what do I eat for lunch?', '11:50'),
      bot(
        'By your plan, for lunch:\n• 120 g of cooked white rice (or 150 g of boiled potato)\n• 86 g of cooked pinto beans\n• 120 g of grilled chicken (or 150 g of grilled tilapia)',
        '11:50',
        'Log as planned',
      ),
      you('See swaps', '11:52'),
      bot(
        'Swaps for lunch:\n*35 g of carbs*: cooked white rice 120 g, boiled potato 150 g, cooked pasta 110 g\n*38 g of protein*: grilled chicken 120 g, grilled tilapia 150 g, grilled lean beef 110 g',
        '11:52',
      ),
    ],
  },
  periodizedTraining: {
    headline: 'Training in phases, with loads that go up',
    howTo:
      'Your training is built for your days, your gym and your goal, in phases that change the stimulus over the program. At the gym, ask "what\'s my workout today?": you get the next day with the sets, the reps and the load for each exercise, with the video one tap away.',
    exchange: [
      you("what's my workout today?", '18:10'),
      bot(
        '🏋️ *Workout A*, week 3 of 4\nPhase of the week: *strength*\nMuscles of the day: Legs\n1. Back squat: 4 sets of 6 to 8 with 70 kg\n   ↑ up to 70 kg: you did 4 sets of 8 with 67.5 kg\n2. Leg press: 3 sets of 8 to 10 with 160 kg\n3. Seated leg curl: 3 sets of 10 to 12 with 35 kg',
        '18:10',
        'How to do it',
      ),
    ],
  },
  professionalReview: {
    headline: 'A plan that keeps up with your progress',
    howTo:
      'Your diet and training are built from your assessment, with evidence-based methods and reference content, and adjust to your progress through the program. The chat assistant logs, adds up and explains.',
    exchange: [
      bot(
        'Your plan is here! When you go train, ask me "what\'s my workout today?". For food, follow your daily goal, and I send any question about your case to our team.',
        '09:30',
      ),
    ],
  },
  checkIns: {
    headline: 'A check-in every 14 days, a reassessment every month',
    howTo:
      'Every 14 days, a quick check-in: weight, energy, sleep, hunger and what was hard. Every month, the reassessment, with photos to compare. Your plan adjusts to what you report, and you get what changed and why, or that it stays the same.',
    exchange: [
      bot(
        'Time for your check-in! It takes a minute and helps adjust your plan.',
        '08:00',
        'Do check-in',
      ),
      bot(
        `💬 ${brand.name} team: You lost 0.8 kg in two weeks, right on pace. Since hunger got tight at night, we moved 150 kcal from lunch to dinner.`,
        '17:40',
      ),
    ],
  },
  coachChat: {
    headline: 'Ask our team, in the same chat',
    howTo:
      'A question about your case goes to our team, and the answer arrives in the chat within 24 hours.',
    exchange: [
      you("can I do Thursday's workout on Saturday?", '07:15'),
      bot(
        'This one is for our team: I sent your question, and the answer arrives here within 24 hours.',
        '07:15',
      ),
      bot(
        `💬 ${brand.name} team: Yes, you can. Do workout C on Saturday and rest on Sunday, before workout A.`,
        '13:20',
      ),
    ],
  },
  unlimitedReplies: {
    headline: 'Ask as much as you like',
    howTo:
      "On Premium Pro, the assistant's replies have no daily limit: ask, log and get suggestions as often as you need.",
    exchange: [
      you('what can I eat as a snack to hit my protein?', '16:10'),
      bot(
        "You're 30 g of protein short of today's goal. From your plan, the snack that helps most is 170 g of plain yogurt with 1 scoop of whey (30 g): 30 g of protein.",
        '16:10',
      ),
    ],
  },
}

/** Keyed by the feature ids of `GET /fitness/plans`; `buildCatalog` refuses any id on one side only. */
export const FEATURE_COPY: Record<Locale, Record<string, FeatureCopy>> = { pt: PT, en: EN }
