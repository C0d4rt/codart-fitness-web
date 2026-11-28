import { describe, expect, it } from 'vitest'

import { buildCatalog } from './plans'
import fixture from './plans.fixture.json'
import { blackFridayEndsAt } from './promo'

const catalog = buildCatalog(fixture)

describe('blackFridayEndsAt', () => {
  it('runs until the full prices take effect, in Brasília', () => {
    expect(blackFridayEndsAt(catalog, new Date('2026-11-30T23:59:59-03:00'))).toBe(
      '2026-12-01T00:00:00-03:00',
    )
  })

  it('is over when the full prices take effect', () => {
    expect(blackFridayEndsAt(catalog, new Date('2026-12-01T00:00:00-03:00'))).toBeUndefined()
  })

  it('follows the date of the next prices when the owner moves it', () => {
    const later = { ...catalog, next: { ...catalog.next!, from: '2026-12-03T00:00:00-03:00' } }
    expect(blackFridayEndsAt(later, new Date('2026-12-02T12:00:00-03:00'))).toBe(
      '2026-12-03T00:00:00-03:00',
    )
  })

  it('is off without next prices, so nothing counts down to a change that does not come', () => {
    expect(
      blackFridayEndsAt({ ...catalog, next: undefined }, new Date('2026-11-27T12:00:00-03:00')),
    ).toBeUndefined()
  })
})
