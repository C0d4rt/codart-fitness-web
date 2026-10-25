import type { ChatMessage, ChatScreen } from './chat'
import { FEATURE_COPY } from './featureCopy'

const exchange = (id: string): ChatMessage[] => FEATURE_COPY[id]?.exchange ?? []

export const HERO_SCREEN: ChatScreen = {
  id: 'hero',
  label:
    'Uma conversa em que a pessoa conta o almoço e o diário responde com as calorias e o que falta da meta.',
  messages: [
    { from: 'you', text: 'oi', time: '12:39' },
    {
      from: 'bot',
      text: 'Oi! 👋 Eu anoto o que você come e te digo o total do dia. É só me contar, por texto ou áudio.',
      time: '12:39',
    },
    ...exchange('diary'),
  ],
}

export const HOW_SCREEN: ChatScreen = {
  id: 'how',
  label: 'O lembrete do dia seguinte e a pergunta de quanto falta para a meta.',
  messages: [...exchange('reminders'), ...exchange('dayGoal')],
}

export const SHOWCASE_OUTPUTS = [
  { id: 'day', name: 'O dia', feature: 'dayGoal' },
  { id: 'week', name: 'A semana', feature: 'weekSummary' },
  { id: 'weight', name: 'O peso', feature: 'weight' },
  { id: 'nutrients', name: 'Os nutrientes', feature: 'nutrients' },
  { id: 'file', name: 'A planilha', feature: 'csvExport' },
] as const

export type ShowcaseOutput = (typeof SHOWCASE_OUTPUTS)[number]['id']

export const showcaseScreen = (output: ShowcaseOutput): ChatScreen => {
  const found = SHOWCASE_OUTPUTS.find((each) => each.id === output) ?? SHOWCASE_OUTPUTS[0]
  return {
    id: `showcase-${found.id}`,
    label: `O que o diário responde quando a pessoa pede ${found.name.toLowerCase()}.`,
    messages: exchange(found.feature),
  }
}

export const LOG_MODES = [
  { id: 'text', name: 'Texto' },
  { id: 'audio', name: 'Áudio' },
  { id: 'photo', name: 'Foto' },
] as const

export type LogMode = (typeof LOG_MODES)[number]['id']

export const logModeScreen = (mode: LogMode): ChatScreen => {
  if (mode === 'audio') {
    return {
      id: 'mode-audio',
      label: 'Um áudio de sete segundos com o café da manhã, e o registro que volta.',
      messages: [
        { from: 'you', attachment: { kind: 'audio', seconds: 7 }, time: '07:52' },
        {
          from: 'bot',
          text: '✅ Registrado:\n*Café da manhã*\n1. ~50 g de pão francês (1 unidade): 150 kcal\n2. ~200 ml de café com leite (1 xícara): 84 kcal\nTotal do dia: 234 kcal (P 9 g · C 38 g · G 5 g)\nFaltam 1.566 kcal para a meta de 1.800.',
          time: '07:52',
        },
      ],
    }
  }
  if (mode === 'photo') {
    return {
      id: 'mode-photo',
      label: 'A foto do prato e o formulário para conferir.',
      messages: exchange('photos'),
    }
  }
  return {
    id: 'mode-text',
    label: 'O almoço contado por texto e o registro que volta.',
    messages: exchange('diary'),
  }
}

const EATEN_TODAY = 1240

const thousands = (value: number): string => value.toLocaleString('pt-BR')

export const goalScreen = (goal: number): ChatScreen => {
  const left = goal - EATEN_TODAY
  return {
    id: 'goal',
    label: `A meta de ${thousands(goal)} kcal e quanto falta depois de ${thousands(EATEN_TODAY)} kcal no dia.`,
    messages: [
      { from: 'you', text: `minha meta é ${thousands(goal)} kcal`, time: '17:08' },
      {
        from: 'bot',
        text: `🎯 Meta ajustada: ${thousands(goal)} kcal por dia.\nEla não muda com o seu peso; para voltar à calculada, diga "recalcular minha meta".`,
        time: '17:08',
      },
      { from: 'you', text: 'quanto falta?', time: '17:10' },
      {
        from: 'bot',
        text: `Total do dia: ${thousands(EATEN_TODAY)} kcal (P 78 g · C 140 g · G 38 g)\n${
          left >= 0
            ? `Faltam ${thousands(left)} kcal para a meta de ${thousands(goal)}.`
            : `Passou ${thousands(-left)} kcal da meta de ${thousands(goal)}.`
        }`,
        time: '17:10',
      },
    ],
  }
}

export const reminderScreen = (on: boolean): ChatScreen =>
  on
    ? {
        id: 'reminder-on',
        label: 'O lembrete curto do dia seguinte.',
        messages: exchange('reminders'),
      }
    : {
        id: 'reminder-off',
        label: 'A pessoa responde parar e os lembretes param.',
        messages: [
          ...exchange('reminders').slice(0, 1),
          { from: 'you', text: 'parar', time: '11:31' },
          {
            from: 'bot',
            text: 'Pronto, não mando mais lembretes. 🔕 Se mudar de ideia, é só dizer "voltar lembretes". Sigo anotando o que você me contar.',
            time: '11:31',
          },
        ],
      }

export const PLANS_SCREEN = (lines: {
  premium: string
  basic: string
  trialDays: number
}): ChatScreen => ({
  id: 'plans',
  label: 'A mensagem dos planos, com o botão Saber mais.',
  messages: [
    { from: 'you', text: 'o que tem no premium?', time: '20:02' },
    {
      from: 'bot',
      text: `Você está no teste, com tudo do Premium, por ${lines.trialDays} dias.\n\n⭐ *Premium* (${lines.premium}/mês): foto do prato e do rótulo, sugestão do que comer, meta por refeição e mais.\n*Básico* (${lines.basic}/mês): o diário inteiro por texto e áudio, com treino, receitas e relatórios.\n\nPara assinar, responda *assinar*.`,
      time: '20:02',
      button: 'Saber mais',
    },
  ],
})
