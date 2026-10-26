import fixture from '#shared/plans.fixture.json'
import { buildCatalog, type Catalog } from '#shared/plans'

/**
 * Only ever called while the site is generated: the answer is baked into each page, so a
 * mismatch between codart-messaging and the copy here fails the build instead of shipping.
 */
export const loadCatalog = async (): Promise<Catalog> => {
  const url = process.env.PLANS_API_URL
  const raw: unknown = url ? await $fetch<unknown>(url, { timeout: 10_000, retry: 2 }) : fixture
  return buildCatalog(raw)
}
