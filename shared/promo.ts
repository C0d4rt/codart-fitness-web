/**
 * Black Friday 2026 is a label on the prices of the day, which stay after it. No struck price: none
 * was ever charged above them, so a "from" price would mislead (CDC art. 37).
 */
export const BLACK_FRIDAY_ENDS_AT = '2026-11-30T23:59:59-03:00'

export const blackFridayOn = (now: Date): boolean =>
  now.getTime() <= Date.parse(BLACK_FRIDAY_ENDS_AT)
