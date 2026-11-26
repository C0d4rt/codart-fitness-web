/**
 * Black Friday 2026 is a label on the prices of the day. The full prices take effect on 1/12, so the
 * only price struck next to them is that one, said with its date (`next` of the catalog).
 */
export const BLACK_FRIDAY_ENDS_AT = '2026-11-30T23:59:59-03:00'

export const blackFridayOn = (now: Date): boolean =>
  now.getTime() <= Date.parse(BLACK_FRIDAY_ENDS_AT)
