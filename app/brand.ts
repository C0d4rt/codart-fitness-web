import type { Locale } from '../shared/locale'

/** The one place the provisional brand lives: moving to the own domain is changing this file. */
const name = 'Fitness'

export const brand = {
  name,
  siteUrl: 'https://fitness.codart.dev',
  tagline: {
    pt: 'Seu diário de dieta e treino no WhatsApp',
    en: 'Your diet and workout diary on WhatsApp',
  } satisfies Record<Locale, string>,
  /** The first message of the chat: the app answers in the language it is written in. */
  greeting: {
    pt: (trialDays?: number) =>
      trialDays
        ? `Oi! Quero testar o ${name} ${trialDays} dias grátis`
        : `Oi! Quero testar o ${name}`,
    en: (trialDays?: number) =>
      trialDays
        ? `Hi! I want to try ${name} free for ${trialDays} days`
        : `Hi! I want to try ${name}`,
  } satisfies Record<Locale, (trialDays?: number) => string>,
  /** `support@` and `privacy@` are aliases of the Portuguese mailboxes, for English readers. */
  email: {
    pt: { support: 'contato@codart.dev', privacy: 'privacidade@codart.dev' },
    en: { support: 'support@codart.dev', privacy: 'privacy@codart.dev' },
  } satisfies Record<Locale, { support: string; privacy: string }>,
  company: {
    name: 'Codart Tecnologia LTDA',
    cnpj: '65.840.318/0001-26',
    city: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' } satisfies Record<Locale, string>,
  },
} as const
