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
  moneyParts,
  priceChanges,
  pricesAt,
  wholeMoney,
  yearlyPerMonth,
  yearlySaving,
} from './plans'

const DASHES = /[–—]/

const packages = [
  { months: 3, totalCents: 29990, installments: 3, perMonthCents: 9997 },
  { months: 6, totalCents: 49990, installments: 6, perMonthCents: 8332 },
]

const program = fixture.plans[1]!.packages![0]!

const offSale = {
  ...fixture,
  plans: [fixture.plans[0], { id: 'coaching', name: 'Premium Pro', available: false }],
}

const { yearlyInstallments: _, yearlyPixCents: __, ...premiumV2 } = fixture.plans[0]!
const { next: ___, ...withoutNext } = fixture

const versionTwo = {
  ...fixture,
  version: 2,
  plans: [premiumV2, offSale.plans[1]],
}

const versionTwoOnSale = {
  ...versionTwo,
  plans: [premiumV2, { id: 'coaching', name: 'Premium Pro', available: true, packages }],
}

const PROFESSIONALS = /nutricionista|educador|profissiona|CRN|CREF|dietitian|trainer|professional/

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

  it.each(LOCALES)('has %s names for exactly the features and groups of the plans', (locale) => {
    const names = CATALOG_NAMES[locale]
    if (names === undefined) return
    expect(Object.keys(names.features).sort()).toEqual(
      fixture.features.map((feature) => feature.id).sort(),
    )
    expect(Object.keys(names.groups).sort()).toEqual(fixture.groups.map((group) => group.id).sort())
  })

  it('keeps the names of the plans in Portuguese and takes the app wording in English', () => {
    expect(buildCatalog(fixture, 'pt').coaching.name).toBe('Premium Pro')
    const english = buildCatalog(fixture, 'en')
    expect(english.coaching.name).toBe('Premium Pro')
    expect(english.groups.map((group) => group.name)).not.toContain('Registrar')
    expect(english.premium.features.find((feature) => feature.id === 'pantry')?.name).toBe('Pantry')
  })

  it('has Premium Pro without prices while its sale is off', () => {
    const { coaching } = buildCatalog(offSale)
    expect(coaching.available).toBe(false)
    expect('packages' in coaching).toBe(false)
  })

  it('has Premium Pro as one 12-month program once its sale is on', () => {
    const { coaching } = buildCatalog(fixture)
    expect(coaching.available).toBe(true)
    expect(coaching.available && coaching.packages).toEqual([program])
  })

  it('takes the Pix prices of the yearly and of Premium Pro from version 3', () => {
    const { premium, coaching } = buildCatalog(fixture)
    expect(premium.yearlyPixCents).toBe(21990)
    expect(coaching.available && coaching.packages[0]!.pixCents).toBe(54990)
  })

  it('still reads version 3 without the Pix prices, sold then by card alone', () => {
    const { yearlyPixCents: _, ...premium } = fixture.plans[0]!
    const { pixCents: __, ...pack } = program
    const catalog = buildCatalog({
      ...fixture,
      plans: [premium, { ...fixture.plans[1], packages: [pack] }],
    })
    expect(catalog.premium.yearlyPixCents).toBeUndefined()
    expect(catalog.coaching.available && catalog.coaching.packages[0]!.pixCents).toBeUndefined()
  })

  it('takes the prices that replace these at 1/12 from version 3', () => {
    expect(buildCatalog(fixture).next).toEqual(fixture.next)
  })

  it('still reads version 3 without the next prices, once the change is past', () => {
    expect(buildCatalog(withoutNext).next).toBeUndefined()
  })

  it('refuses next prices without the date they take effect', () => {
    const { from: _, ...next } = fixture.next
    expect(() => buildCatalog({ ...fixture, next })).toThrow()
  })

  it('takes the yearly installments from version 3', () => {
    expect(buildCatalog(fixture).premium.yearlyInstallments).toBe(12)
  })

  it('refuses version 3 without the yearly installments', () => {
    const plans = { ...fixture, plans: [premiumV2, fixture.plans[1]] }
    expect(() => buildCatalog(plans)).toThrow()
  })

  it('still reads version 2, which the API serves until codart-messaging deploys version 3', () => {
    const catalog = buildCatalog(versionTwo)
    expect(catalog.premium.yearlyCents).toBe(23880)
    expect(catalog.premium.yearlyInstallments).toBeUndefined()
    expect(catalog.coaching.available).toBe(false)
  })

  it('has the version 2 Premium Pro packages, longest first', () => {
    const { coaching } = buildCatalog(versionTwoOnSale)
    expect(coaching.available && coaching.packages.map((pack) => pack.months)).toEqual([6, 3])
  })

  it.each(LOCALES)(
    'names no professional behind Premium Pro in %s, whatever the API calls its features',
    (locale) => {
      const features = fixture.features.map((feature) =>
        feature.id === 'professionalReview'
          ? {
              ...feature,
              name: 'Plano sob a responsabilidade de nutricionista e educador físico (CRN e CREF)',
            }
          : feature,
      )
      const catalog = buildCatalog({ ...versionTwo, features }, locale)
      const names = catalog.coaching.features.map((feature) => feature.name)
      expect(names.filter((name) => PROFESSIONALS.test(name))).toEqual([])
    },
  )

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

  it.each(LOCALES)('leaves out %s copy for a feature the plans do not have yet', (locale) => {
    const plans = {
      ...fixture,
      features: fixture.features.filter((each) => each.id !== 'readyPrograms'),
    }
    const catalog = buildCatalog(plans, locale)
    expect(catalog.coaching.features.map((feature) => feature.id)).not.toContain('readyPrograms')
    expect(catalog.coaching.features).toHaveLength(fixture.features.length - 1)
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
  it.each(LOCALES)('promises no professional behind Premium Pro in %s', (locale) => {
    const coaching = fixture.features
      .filter((feature) => feature.plan === 'coaching')
      .map((feature) => FEATURE_COPY[locale][feature.id]!)
    const texts = coaching.flatMap((copy) => [
      copy.headline,
      copy.howTo,
      ...copy.exchange.map((message) => message.text ?? ''),
    ])
    expect(texts.filter((text) => PROFESSIONALS.test(text))).toEqual([])
  })

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

  it('splits the symbol from the figure, reading the same as the whole price', () => {
    expect(moneyParts(3990, 'pt')).toEqual({ currency: 'R$ ', amount: '39,90' })
    expect(moneyParts(123456, 'en')).toEqual({ currency: 'R$', amount: '1,234.56' })
    for (const locale of ['pt', 'en'] as const) {
      const { currency, amount } = moneyParts(123456, locale)
      expect(currency + amount).toBe(money(123456, locale))
    }
  })
})

describe('the Premium Pro packages', () => {
  it('rounds each installment to the nearest cent, as codart-messaging charges it', () => {
    expect(installmentCents({ totalCents: 29990, installments: 3 })).toBe(9997)
    expect(installmentCents({ totalCents: 49990, installments: 6 })).toBe(8332)
    expect(installmentCents(program)).toBe(4990)
    expect(installmentCents({ totalCents: 19990, installments: 12 })).toBe(1666)
    expect(installmentCents({ totalCents: 10001, installments: 12 })).toBe(833)
  })

  it('leads with the package that costs least a month', () => {
    expect(bestPackage(packages)?.months).toBe(6)
    expect(bestPackage([])).toBeUndefined()
  })
})

describe('yearlySaving', () => {
  it('rounds down, so the page never promises more than the price gives', () => {
    expect(yearlySaving({ monthlyCents: 2990, yearlyCents: 19990 })).toBe(44)
    expect(yearlySaving({ monthlyCents: 2990, yearlyCents: 23880 })).toBe(33)
    expect(yearlySaving({ monthlyCents: 1990, yearlyCents: 11900 })).toBe(50)
  })

  it('is zero when a year costs as much as twelve months or more', () => {
    expect(yearlySaving({ monthlyCents: 1000, yearlyCents: 12000 })).toBe(0)
    expect(yearlySaving({ monthlyCents: 1000, yearlyCents: 13000 })).toBe(0)
  })
})

describe('pricesAt', () => {
  const catalog = buildCatalog(fixture)
  const pro = (at: Date) => {
    const { coaching } = pricesAt(catalog, at)
    return coaching.available ? coaching.packages[0] : undefined
  }

  it('keeps the prices of today, and the next ones, until the last second of 30/11', () => {
    const before = pricesAt(catalog, new Date('2026-11-30T23:59:59-03:00'))
    expect(before).toBe(catalog)
    expect(before.premium).toMatchObject({
      monthlyCents: 2990,
      yearlyCents: 23880,
      yearlyPixCents: 21990,
    })
    expect(before.next?.premium.monthlyCents).toBe(3990)
    expect(pro(new Date('2026-11-30T23:59:59-03:00'))?.perMonthCents).toBe(4990)
  })

  it('charges the next prices from 1/12 at midnight in Brasília, with nothing next', () => {
    const at = new Date('2026-12-01T00:00:00-03:00')
    const after = pricesAt(catalog, at)
    expect(after.next).toBeUndefined()
    expect(after.premium).toMatchObject({
      monthlyCents: 3990,
      yearlyCents: 35880,
      yearlyInstallments: 12,
      yearlyPixCents: 32990,
    })
    expect(after.premium.features).toBe(catalog.premium.features)
    expect(pro(at)).toEqual({
      months: 12,
      totalCents: 71880,
      installments: 12,
      perMonthCents: 5990,
      pixCents: 64990,
    })
    expect(installmentCents({ totalCents: after.premium.yearlyCents, installments: 12 })).toBe(2990)
    expect(yearlySaving(after.premium)).toBe(25)
  })

  it('drops a Pix price the next prices leave out', () => {
    const { yearlyPixCents: _, ...premium } = fixture.next.premium
    const after = pricesAt(
      buildCatalog({ ...fixture, next: { ...fixture.next, premium } }),
      new Date('2026-12-02'),
    )
    expect(after.premium.yearlyPixCents).toBeUndefined()
  })

  it('leaves Premium Pro off sale when the next prices have one for it', () => {
    const after = pricesAt(buildCatalog({ ...offSale, next: fixture.next }), new Date('2026-12-02'))
    expect(after.coaching.available).toBe(false)
  })

  it('leaves a catalog without next prices as it is', () => {
    const plain = buildCatalog(withoutNext)
    expect(pricesAt(plain, new Date('2027-01-01'))).toBe(plain)
  })

  it('changes the prices only at the start of the next ones', () => {
    expect(priceChanges(catalog)).toEqual(['2026-12-01T00:00:00-03:00'])
    expect(priceChanges(buildCatalog(withoutNext))).toEqual([])
  })
})
