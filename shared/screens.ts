import type { ChatMessage, ChatScreen } from './chat'
import { FEATURE_COPY } from './featureCopy'
import type { Locale } from './locale'

const exchange = (id: string, locale: Locale): ChatMessage[] =>
  FEATURE_COPY[locale][id]?.exchange ?? []

const HERO = {
  pt: {
    label:
      'Uma conversa em que a pessoa conta o almoço e o assistente responde com as calorias e o que falta da meta.',
    hello: 'oi',
    welcome:
      'Oi! 👋 Eu sou o seu assistente fitness. Te ajudo com refeições, treinos, metas e peso, e te respondo na hora.',
  },
  en: {
    label:
      'A chat where someone tells the assistant about their lunch and it replies with the calories and what is left of the goal.',
    hello: 'hi',
    welcome:
      "Hi! 👋 I'm your fitness assistant. I help you with meals, workouts, goals and weight, and answer you right away.",
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
      '✅ *Café da manhã* registrado\n\n• 1 unidade de pão francês (~50 g): 150 kcal\n• 1 xícara de café com leite (~200 g): 84 kcal\n\n• Proteína: 9 g\n• Carboidratos: 38 g\n• Gordura: 5 g\n*Total do dia:* 234 kcal\n*Faltam 1.566 kcal* para a meta de 1.800.',
    photo: 'A foto do prato e o formulário para conferir.',
    text: 'O almoço contado por texto e o registro que volta.',
  },
  en: {
    audio: 'A seven-second voice note about breakfast, and the entry that comes back.',
    audioReply:
      '✅ *Breakfast* logged\n\n• 1 unit of bread roll (~50 g): 150 kcal\n• 1 cup of coffee with milk (~200 g): 84 kcal\n\n• Protein: 9 g\n• Carbs: 38 g\n• Fat: 5 g\n*Day total:* 234 kcal\n*1,566 kcal left* for the goal of 1,800.',
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
