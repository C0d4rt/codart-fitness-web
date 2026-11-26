import { describe, expect, it } from 'vitest'

import { blackFridayOn } from './promo'

describe('blackFridayOn', () => {
  it('runs through the last minute of 30 November in Brasília', () => {
    expect(blackFridayOn(new Date('2026-11-30T23:59:00-03:00'))).toBe(true)
  })

  it('is over on 1 December', () => {
    expect(blackFridayOn(new Date('2026-12-01T00:00:00-03:00'))).toBe(false)
  })
})
