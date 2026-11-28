import type { Catalog } from './plans'

/**
 * Black Friday 2026 is a label on the prices of the day. It lasts while the catalog announces the
 * full prices (`next`) and ends the moment they take effect, so it never outlives the prices it
 * names, and without a `next` there is no end to count down to.
 */
export const blackFridayEndsAt = (
  catalog: Pick<Catalog, 'next'>,
  now: Date,
): string | undefined => {
  const endsAt = catalog.next?.from
  return endsAt !== undefined && now.getTime() < Date.parse(endsAt) ? endsAt : undefined
}
