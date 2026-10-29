import { describe, expect, it } from 'vitest'

import { CATALOG_NAMES } from './catalogNames'
import { FEATURE_COPY } from './featureCopy'
import { LOCALES } from './locale'
import fixture from './plans.fixture.json'
import { buildCatalog, CatalogMismatch, money, yearlyPerMonth } from './plans'

const DASHES = /[–—]/

describe('buildCatalog', () => {
  it.each(LOCALES)('gives every feature of the plans its %s copy', (locale) => {
    const catalog = buildCatalog(fixture, locale)
    expect(catalog.premium.features).toHaveLength(fixture.features.length)
    expect(catalog.basic.features.every((feature) => feature.plan === 'basic')).toBe(true)
    expect(catalog.groups.flatMap((group) => group.features)).toHaveLength(fixture.features.length)
  })

  it.each(LOCALES)('has %s copy for exactly the feature ids of the plans', (locale) => {
    expect(Object.keys(FEATURE_COPY[locale]).sort()).toEqual(
      fixture.features.map((feature) => feature.id).sort(),
    )
  })

  it('keeps the names of the plans in Portuguese and takes the app wording in English', () => {
    expect(buildCatalog(fixture, 'pt').basic.name).toBe('Básico')
    const english = buildCatalog(fixture, 'en')
    expect(english.basic.name).toBe('Basic')
    expect(english.groups.map((group) => group.name)).not.toContain('Registrar')
    expect(english.premium.features.find((feature) => feature.id === 'pantry')?.name).toBe('Pantry')
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
    expect(() => buildCatalog(plans)).toThrow(/no pt copy for the feature "sleepLog"/)
  })

  it('refuses copy for a feature the plans no longer have', () => {
    const plans = { ...fixture, features: fixture.features.filter((each) => each.id !== 'pantry') }
    expect(() => buildCatalog(plans, 'en')).toThrow(/en copy for "pantry"/)
  })

  it('refuses a feature or group with no name in a translated locale', () => {
    const plans = {
      ...fixture,
      groups: [...fixture.groups, { id: 'sleep', name: 'Sono' }],
    }
    expect(() => buildCatalog(plans, 'en')).toThrow(/no en name for the group "sleep"/)
    const names = CATALOG_NAMES.en!
    const { pantry: _, ...features } = names.features
    expect(() => buildCatalog(fixture, 'en', FEATURE_COPY.en, { ...names, features })).toThrow(
      /no en name for the feature "pantry"/,
    )
  })

  it('refuses an answer that is not the agreed contract', () => {
    expect(() => buildCatalog({ ...fixture, version: 2 })).toThrow()
    expect(() => buildCatalog({ ...fixture, plans: fixture.plans.slice(0, 1) })).toThrow()
  })
})

describe('feature copy', () => {
  it.each(LOCALES)('has no dashes in anything a visitor reads in %s', (locale) => {
    const texts = Object.values(FEATURE_COPY[locale]).flatMap((copy) => [
      copy.headline,
      copy.howTo,
      ...copy.exchange.flatMap((message) => [message.text ?? '', message.button ?? '']),
    ])
    expect(texts.filter((text) => DASHES.test(text))).toEqual([])
  })
})

describe('money', () => {
  it('formats cents as reais with a space that never breaks', () => {
    expect(money(2990, 'pt')).toBe('R$ 29,90')
    expect(yearlyPerMonth({ yearlyCents: 15900 }, 'pt')).toBe('R$ 13,25')
  })

  it('writes reais the English way on English pages', () => {
    expect(money(2990, 'en')).toBe('R$29.90')
    expect(yearlyPerMonth({ yearlyCents: 15900 }, 'en')).toBe('R$13.25')
  })
})
