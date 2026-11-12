import { describe, expect, it } from 'vitest'

import { CATALOG_NAMES } from './catalogNames'
import { FEATURE_COPY } from './featureCopy'
import { LOCALES } from './locale'
import fixture from './plans.fixture.json'
import {
  bestPackage,
  buildCatalog,
  CatalogMismatch,
  installmentCents,
  money,
  wholeMoney,
  yearlyPerMonth,
  yearlySaving,
} from './plans'

const DASHES = /[–—]/

const packages = [
  { months: 3, totalCents: 29990, installments: 3, perMonthCents: 9997 },
  { months: 6, totalCents: 49990, installments: 6, perMonthCents: 8332 },
]

const onSale = {
  ...fixture,
  plans: [fixture.plans[0], { id: 'coaching', name: 'Premium Pro', available: true, packages }],
}

describe('buildCatalog', () => {
  it.each(LOCALES)('gives every feature of the plans its %s copy', (locale) => {
    const catalog = buildCatalog(fixture, locale)
    expect(catalog.coaching.features).toHaveLength(fixture.features.length)
    expect(catalog.premium.features.every((feature) => feature.plan === 'premium')).toBe(true)
    expect(catalog.premium.features.length).toBeLessThan(fixture.features.length)
    expect(catalog.groups.flatMap((group) => group.features)).toHaveLength(fixture.features.length)
  })

  it.each(LOCALES)('has %s copy for exactly the feature ids of the plans', (locale) => {
    expect(Object.keys(FEATURE_COPY[locale]).sort()).toEqual(
      fixture.features.map((feature) => feature.id).sort(),
    )
  })

  it('keeps the names of the plans in Portuguese and takes the app wording in English', () => {
    expect(buildCatalog(fixture, 'pt').coaching.name).toBe('Premium Pro')
    const english = buildCatalog(fixture, 'en')
    expect(english.coaching.name).toBe('Premium Pro')
    expect(english.groups.map((group) => group.name)).not.toContain('Registrar')
    expect(english.premium.features.find((feature) => feature.id === 'pantry')?.name).toBe('Pantry')
  })

  it('has Premium Pro without prices while its sale is off', () => {
    const { coaching } = buildCatalog(fixture)
    expect(coaching.available).toBe(false)
    expect('packages' in coaching).toBe(false)
  })

  it('has the Premium Pro packages, longest first, once its sale is on', () => {
    const { coaching } = buildCatalog(onSale)
    expect(coaching.available).toBe(true)
    expect(coaching.available && coaching.packages.map((pack) => pack.months)).toEqual([6, 3])
  })

  it('refuses Premium Pro on sale with no package to sell', () => {
    const plans = [fixture.plans[0], { id: 'coaching', name: 'Premium Pro', available: true }]
    expect(() => buildCatalog({ ...fixture, plans })).toThrow()
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
    expect(() => buildCatalog({ ...fixture, version: 1 })).toThrow()
    expect(() => buildCatalog({ ...fixture, plans: fixture.plans.slice(0, 1) })).toThrow()
    const basic = { id: 'basic', name: 'Básico', monthlyCents: 1990, yearlyCents: 11900 }
    expect(() => buildCatalog({ ...fixture, plans: [...fixture.plans, basic] })).toThrow()
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
    expect(money(2990, 'pt')).toBe('R$ 29,90')
    expect(yearlyPerMonth({ yearlyCents: 19990 }, 'pt')).toBe('R$ 16,65')
  })

  it('writes reais the English way on English pages', () => {
    expect(money(2990, 'en')).toBe('R$29.90')
    expect(yearlyPerMonth({ yearlyCents: 19990 }, 'en')).toBe('R$16.65')
  })

  it('cuts the cents of an anchor price', () => {
    expect(wholeMoney(8332, 'pt')).toBe('R$ 83')
    expect(wholeMoney(8399, 'en')).toBe('R$83')
  })
})

describe('the Premium Pro packages', () => {
  it('charges each installment rounded up to the cent', () => {
    expect(installmentCents({ totalCents: 29990, installments: 3 })).toBe(9997)
    expect(installmentCents({ totalCents: 49990, installments: 6 })).toBe(8332)
  })

  it('leads with the package that costs least a month', () => {
    expect(bestPackage(packages)?.months).toBe(6)
    expect(bestPackage([])).toBeUndefined()
  })
})

describe('yearlySaving', () => {
  it('rounds down, so the page never promises more than the price gives', () => {
    expect(yearlySaving({ monthlyCents: 2990, yearlyCents: 19990 })).toBe(44)
    expect(yearlySaving({ monthlyCents: 1990, yearlyCents: 11900 })).toBe(50)
  })

  it('is zero when a year costs as much as twelve months or more', () => {
    expect(yearlySaving({ monthlyCents: 1000, yearlyCents: 12000 })).toBe(0)
    expect(yearlySaving({ monthlyCents: 1000, yearlyCents: 13000 })).toBe(0)
  })
})
