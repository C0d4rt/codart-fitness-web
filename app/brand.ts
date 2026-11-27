import type { Locale } from '../shared/locale'

/** The one place the provisional brand lives: moving to the own domain is changing this file. */
const name = 'MyFitAlly'

export const brand = {
  name,
  siteUrl: 'https://fitness.codart.dev',
  tagline: {
    pt: 'Seu assistente fitness no WhatsApp',
    en: 'Your fitness assistant on WhatsApp',
  } satisfies Record<Locale, string>,
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
