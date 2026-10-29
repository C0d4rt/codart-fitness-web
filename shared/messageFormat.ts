import { IntlMessageFormat } from 'intl-messageformat'

type Values = Record<string, unknown>

export const icuMessage = (message: string, locale: string): ((values: Values) => unknown) => {
  const format = new IntlMessageFormat(message, locale)
  return (values) => format.format(values as Record<string, never>)
}

export const icuCompiler = (
  message: unknown,
  { locale, key }: { locale: string; key: string },
): ((ctx: { values: Values }) => unknown) => {
  if (typeof message !== 'string') return () => key
  const say = icuMessage(message, locale)
  return (ctx) => say(ctx.values)
}
