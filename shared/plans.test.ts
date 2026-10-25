import { describe, expect, it } from 'vitest'

import { FEATURE_COPY } from './featureCopy'
import fixture from './plans.fixture.json'
import { buildCatalog, CatalogMismatch, money, yearlyPerMonth } from './plans'

const DASHES = /[–—]/

describe('buildCatalog', () => {
  it('gives every feature of the plans its copy', () => {
    const catalog = buildCatalog(fixture)
    expect(catalog.premium.features).toHaveLength(fixture.features.length)
    expect(catalog.basic.features.every((feature) => feature.plan === 'basic')).toBe(true)
    expect(catalog.groups.flatMap((group) => group.features)).toHaveLength(fixture.features.length)
  })

  it('refuses a feature the site has no copy for', () => {
    const plans = {
      ...fixture,
      features: [
        ...fixture.features,
        { id: 'sleepLog', plan: 'premium', group: 'reports', name: 'Sono' },
      ],
    }
    expect(() => buildCatalog(plans)).toThrow(CatalogMismatch)
    expect(() => buildCatalog(plans)).toThrow(/no copy for the feature "sleepLog"/)
  })

  it('refuses copy for a feature the plans no longer have', () => {
    const plans = { ...fixture, features: fixture.features.filter((each) => each.id !== 'pantry') }
    expect(() => buildCatalog(plans)).toThrow(/copy for "pantry"/)
  })

  it('refuses an answer that is not the agreed contract', () => {
    expect(() => buildCatalog({ ...fixture, version: 2 })).toThrow()
    expect(() => buildCatalog({ ...fixture, plans: fixture.plans.slice(0, 1) })).toThrow()
  })
})

describe('feature copy', () => {
  it('has no dashes in anything a visitor reads', () => {
    const texts = Object.values(FEATURE_COPY).flatMap((copy) => [
      copy.headline,
      copy.howTo,
      ...copy.exchange.flatMap((message) => [message.text ?? '', message.button ?? '']),
    ])
    expect(texts.filter((text) => DASHES.test(text))).toEqual([])
  })
})

describe('money', () => {
  it('formats cents as reais with a space that never breaks', () => {
    expect(money(2990)).toBe('R$ 29,90')
    expect(yearlyPerMonth({ yearlyCents: 15900 })).toBe('R$ 13,25')
  })
})
