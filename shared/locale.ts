/** The codes of the i18n locales in `nuxt.config.ts`: Portuguese at the root, English under /en. */
export const LOCALES = ['pt', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pt'

/** The BCP 47 tag each locale formats numbers, money and times with. */
export const LANGUAGE: Record<Locale, string> = { pt: 'pt-BR', en: 'en-US' }

export const asLocale = (code: string): Locale =>
  (LOCALES as readonly string[]).includes(code) ? (code as Locale) : DEFAULT_LOCALE

export const thousands = (value: number, locale: Locale): string =>
  value.toLocaleString(LANGUAGE[locale])

/** A bubble's "HH:MM" as the phone shows it: unchanged in Portuguese, "7:52 AM" in English. */
export const clock = (time: string, locale: Locale): string => {
  if (locale === 'pt') return time
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return new Intl.DateTimeFormat(LANGUAGE[locale], {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(Date.UTC(2026, 0, 1, hours, minutes))
}

export const decimal = (value: number, locale: Locale): string =>
  value.toLocaleString(LANGUAGE[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 })
