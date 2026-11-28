import type { Catalog } from '#shared/plans'
import { blackFridayEndsAt } from '#shared/promo'

/** When Black Friday ends while it is on, judged at build time and again in the browser. */
export const useBlackFriday = (catalog: MaybeRefOrGetter<Catalog>) => {
  const now = useNow()
  return computed(() => blackFridayEndsAt(toValue(catalog), now.value))
}
