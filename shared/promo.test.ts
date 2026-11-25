import { describe, expect, it } from 'vitest'

import { BLACK_FRIDAY, blackFridayOn, struckCents } from './promo'

const before = new Date('2026-11-30T23:59:00-03:00')
const after = new Date('2026-12-01T00:00:00-03:00')

describe('Black Friday', () => {
  it('runs until the last minute of 30/11 in Brasília', () => {
    expect(blackFridayOn(before)).toBe(true)
    expect(blackFridayOn(after)).toBe(false)
  })

  it('strikes the December price only while it is above the current one', () => {
    expect(struckCents(BLACK_FRIDAY.yearlyFromCents, 19990, before)).toBe(26990)
    expect(struckCents(BLACK_FRIDAY.yearlyFromCents, 19990, after)).toBeUndefined()
    expect(struckCents(BLACK_FRIDAY.yearlyFromCents, 26990, before)).toBeUndefined()
  })
})
