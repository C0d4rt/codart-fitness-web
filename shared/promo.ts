/**
 * Black Friday 2026 is a label on the prices of the day, which stay after it. No struck price and no
 * countdown: nothing changes on 1/12, so either would mislead (CDC art. 37).
 */
export const BLACK_FRIDAY_ENDS_AT = '2026-11-30T23:59:59-03:00'

export const blackFridayOn = (now: Date): boolean =>
  now.getTime() <= Date.parse(BLACK_FRIDAY_ENDS_AT)
