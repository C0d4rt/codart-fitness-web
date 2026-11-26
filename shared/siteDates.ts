import { LANGUAGE, type Locale } from './locale'

/** "21/12" or "12/21": the period of a credit, in the reader's time zone. */
export const dayMonth = (iso: string, locale: Locale, timeZone?: string): string =>
  new Intl.DateTimeFormat(LANGUAGE[locale], { day: '2-digit', month: '2-digit', timeZone }).format(
    new Date(iso),
  )

/** "21/12/2026" or "12/21/2026". */
export const fullDate = (iso: string, locale: Locale, timeZone?: string): string =>
  new Intl.DateTimeFormat(LANGUAGE[locale], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone,
  }).format(new Date(iso))

/** "12:10" or "12:10 PM": when a sign-in code stops working. */
export const clockTime = (iso: string, locale: Locale, timeZone?: string): string =>
  new Intl.DateTimeFormat(LANGUAGE[locale], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date(iso))

/** "1º/12", "15/1" or "Dec 1": the day a price takes effect, in Brasília. */
export const changeDay = (iso: string, locale: Locale): string => {
  const date = new Date(iso)
  const timeZone = 'America/Sao_Paulo'
  if (locale === 'en') {
    return new Intl.DateTimeFormat(LANGUAGE.en, {
      month: 'short',
      day: 'numeric',
      timeZone,
    }).format(date)
  }
  const part = (type: 'day' | 'month') =>
    Number(new Intl.DateTimeFormat(LANGUAGE.pt, { [type]: 'numeric', timeZone }).format(date))
  const day = part('day')
  return `${day === 1 ? '1º' : day}/${part('month')}`
}
