import type { Catalog } from '#shared/plans'

export const plansKey = (locale: string) => `plans-${locale}`

export const usePlans = async (): Promise<Catalog> => {
  const locale = useSiteLocale().value
  const { data } = await useFetch<Catalog>('/api/plans', {
    key: plansKey(locale),
    query: { locale },
  })
  if (!data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'The plans could not be read',
      fatal: true,
    })
  }
  return data.value
}
