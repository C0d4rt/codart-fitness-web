import type { ChatMessage, ChatScreen } from './chat'
import { FEATURE_COPY } from './featureCopy'
import { type Locale, thousands } from './locale'

const exchange = (id: string, locale: Locale): ChatMessage[] =>
  FEATURE_COPY[locale][id]?.exchange ?? []

const HERO = {
  pt: {
    label:
      'Uma conversa em que a pessoa conta o almoço e o diário responde com as calorias e o que falta da meta.',
    hello: 'oi',
    welcome:
      'Oi! 👋 Eu anoto o que você come e te digo o total do dia. É só me contar, por texto ou áudio.',
  },
  en: {
    label:
      'A chat where someone tells the diary about their lunch and it replies with the calories and what is left of the goal.',
    hello: 'hi',
    welcome:
      "Hi! 👋 I keep track of what you eat and tell you your day's total. Just tell me, by text or voice note.",
  },
} satisfies Record<Locale, { label: string; hello: string; welcome: string }>

export const heroScreen = (locale: Locale): ChatScreen => ({
  id: 'hero',
  label: HERO[locale].label,
  messages: [
    { from: 'you', text: HERO[locale].hello, time: '12:39' },
    { from: 'bot', text: HERO[locale].welcome, time: '12:39' },
    ...exchange('diary', locale),
  ],
})

const WORKOUT_LABEL: Record<Locale, string> = {
  pt: 'O treino contado numa mensagem e o gasto estimado que volta.',
  en: 'A workout told in one message and the estimated burn that comes back.',
}

export const workoutScreen = (locale: Locale): ChatScreen => ({
  id: 'workout',
  label: WORKOUT_LABEL[locale],
  messages: exchange('workouts', locale),
})

export const SHOWCASE_OUTPUTS = [
  { id: 'day', feature: 'dayGoal', name: { pt: 'O dia', en: 'The day' } },
  { id: 'week', feature: 'weekSummary', name: { pt: 'A semana', en: 'The week' } },
  { id: 'weight', feature: 'weight', name: { pt: 'O peso', en: 'Weight' } },
  { id: 'nutrients', feature: 'nutrients', name: { pt: 'Os nutrientes', en: 'Nutrients' } },
  { id: 'file', feature: 'csvExport', name: { pt: 'A planilha', en: 'The spreadsheet' } },
] as const satisfies readonly { id: string; feature: string; name: Record<Locale, string> }[]

export type ShowcaseOutput = (typeof SHOWCASE_OUTPUTS)[number]['id']

const SHOWCASE_LABEL: Record<Locale, (name: string) => string> = {
  pt: (name) => `O que o diário responde quando a pessoa pede ${name.toLowerCase()}.`,
  en: (name) => `What the diary replies when someone asks for ${name.toLowerCase()}.`,
}

export const showcaseScreen = (output: ShowcaseOutput, locale: Locale): ChatScreen => {
  const found = SHOWCASE_OUTPUTS.find((each) => each.id === output) ?? SHOWCASE_OUTPUTS[0]
  return {
    id: `showcase-${found.id}`,
    label: SHOWCASE_LABEL[locale](found.name[locale]),
    messages: exchange(found.feature, locale),
  }
}

export type LogMode = 'text' | 'audio' | 'photo'

const LOG_MODE = {
  pt: {
    audio: 'Um áudio de sete segundos com o café da manhã, e o registro que volta.',
    audioReply:
      '✅ Registrado:\n*Café da manhã*\n1. ~50 g de pão francês (1 unidade): 150 kcal\n2. ~200 ml de café com leite (1 xícara): 84 kcal\nTotal do dia: 234 kcal (P 9 g · C 38 g · G 5 g)\nFaltam 1.566 kcal para a meta de 1.800.',
    photo: 'A foto do prato e o formulário para conferir.',
    text: 'O almoço contado por texto e o registro que volta.',
  },
  en: {
    audio: 'A seven-second voice note about breakfast, and the entry that comes back.',
    audioReply:
      '✅ Logged:\n*Breakfast*\n1. ~50 g of bread roll (1 piece): 150 kcal\n2. ~200 ml of coffee with milk (1 cup): 84 kcal\nDay total: 234 kcal (P 9 g · C 38 g · F 5 g)\n1,566 kcal left for the goal of 1,800.',
    photo: 'A photo of the plate and the form to check it.',
    text: 'Lunch told by text and the entry that comes back.',
  },
} satisfies Record<Locale, { audio: string; audioReply: string; photo: string; text: string }>

export const logModeScreen = (mode: LogMode, locale: Locale): ChatScreen => {
  const words = LOG_MODE[locale]
  if (mode === 'audio') {
    return {
      id: 'mode-audio',
      label: words.audio,
      messages: [
        { from: 'you', attachment: { kind: 'audio', seconds: 7 }, time: '07:52' },
        { from: 'bot', text: words.audioReply, time: '07:52' },
      ],
    }
  }
  if (mode === 'photo') {
    return { id: 'mode-photo', label: words.photo, messages: exchange('photos', locale) }
  }
  return { id: 'mode-text', label: words.text, messages: exchange('diary', locale) }
}

const EATEN_TODAY = 1240

type GoalWords = {
  label: (goal: string, eaten: string) => string
  ask: (goal: string) => string
  set: (goal: string) => string
  question: string
  total: (eaten: string) => string
  left: (left: string, goal: string) => string
  over: (over: string, goal: string) => string
}

const GOAL: Record<Locale, GoalWords> = {
  pt: {
    label: (goal, eaten) => `A meta de ${goal} kcal e quanto falta depois de ${eaten} kcal no dia.`,
    ask: (goal) => `minha meta é ${goal} kcal`,
    set: (goal) =>
      `🎯 Meta ajustada: ${goal} kcal por dia.\nEla não muda com o seu peso; para voltar à calculada, diga "recalcular minha meta".`,
    question: 'quanto falta?',
    total: (eaten) => `Total do dia: ${eaten} kcal (P 78 g · C 140 g · G 38 g)`,
    left: (left, goal) => `Faltam ${left} kcal para a meta de ${goal}.`,
    over: (over, goal) => `Passou ${over} kcal da meta de ${goal}.`,
  },
  en: {
    label: (goal, eaten) =>
      `A goal of ${goal} kcal and how much is left after ${eaten} kcal in the day.`,
    ask: (goal) => `my goal is ${goal} kcal`,
    set: (goal) =>
      `🎯 Goal set: ${goal} kcal per day.\nIt doesn't change with your weight; to go back to the calculated one, say "recalculate my goal".`,
    question: 'how much is left?',
    total: (eaten) => `Day total: ${eaten} kcal (P 78 g · C 140 g · F 38 g)`,
    left: (left, goal) => `${left} kcal left for the goal of ${goal}.`,
    over: (over, goal) => `${over} kcal over the goal of ${goal}.`,
  },
}

export const goalScreen = (goal: number, locale: Locale): ChatScreen => {
  const words = GOAL[locale]
  const n = (value: number) => thousands(value, locale)
  const left = goal - EATEN_TODAY
  return {
    id: 'goal',
    label: words.label(n(goal), n(EATEN_TODAY)),
    messages: [
      { from: 'you', text: words.ask(n(goal)), time: '17:08' },
      { from: 'bot', text: words.set(n(goal)), time: '17:08' },
      { from: 'you', text: words.question, time: '17:10' },
      {
        from: 'bot',
        text: `${words.total(n(EATEN_TODAY))}\n${
          left >= 0 ? words.left(n(left), n(goal)) : words.over(n(-left), n(goal))
        }`,
        time: '17:10',
      },
    ],
  }
}
