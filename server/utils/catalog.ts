import fixture from '#shared/plans.fixture.json'
import type { Locale } from '#shared/locale'
import { buildCatalog, type Catalog } from '#shared/plans'

/**
 * Only ever called while the site is generated: the answer is baked into each page, so a
 * mismatch between codart-messaging and the copy here fails the build instead of shipping.
 */
export const loadCatalog = async (locale: Locale): Promise<Catalog> =>
  buildCatalog(await fetchPlans(), locale)

/* Every prerendered page asks for the catalog; one answer per build keeps the build under the API's rate limit. */
let plans: Promise<unknown> | undefined
const fetchPlans = (): Promise<unknown> => {
  const url = process.env.PLANS_API_URL
  if (!url) return Promise.resolve(fixture)
  plans ??= $fetch<unknown>(url, { timeout: 10_000, retry: 2 }).catch((err: unknown) => {
    plans = undefined
    throw err
  })
  return plans
}
