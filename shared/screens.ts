import type { ChatMessage, ChatScreen } from './chat'
import { FEATURE_COPY } from './featureCopy'
import type { Locale } from './locale'

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
