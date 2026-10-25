import type { Catalog } from '#shared/plans'

export const usePlans = async (): Promise<Catalog> => {
  const { data } = await useFetch<Catalog>('/api/plans', { key: 'plans' })
  if (!data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'The plans could not be read',
      fatal: true,
    })
  }
  return data.value
}
