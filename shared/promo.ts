/**
 * Black Friday 2026. The struck "from" prices are the ones that take effect on 1 December, decided by
 * the owner on 25/11: a reference price that was never charged would be misleading (CDC art. 37).
 */
export const BLACK_FRIDAY = {
  endsAt: '2026-11-30T23:59:59-03:00',
  yearlyFromCents: 26990,
  coachingFromCents: 59880,
} as const

export const blackFridayOn = (now: Date): boolean =>
  now.getTime() <= Date.parse(BLACK_FRIDAY.endsAt)

/** The price to strike, only while the offer runs and only when it is above what is sold now. */
export const struckCents = (
  fromCents: number,
  priceCents: number,
  now: Date,
): number | undefined => (blackFridayOn(now) && fromCents > priceCents ? fromCents : undefined)
