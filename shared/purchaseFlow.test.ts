import { describe, expect, it } from 'vitest'

import fixture from './plans.fixture.json' with { type: 'json' }
import { buildCatalog } from './plans'
import {
  activationCodeOf,
  canSignInAfterActivation,
  cheaperPixOf,
  choiceOfSlug,
  defaultMethod,
  installmentOf,
  loginStep,
  mostInstallments,
  offerFromCatalog,
  orderedPlans,
  purchaseSettled,
  purchaseView,
  returnOf,
  slugOf,
} from './purchaseFlow'
import type { PlanOffer } from './siteApi'

const TITLES = { monthly: 'Premium mensal', yearly: 'Premium anual', coaching: 'Premium Pro' }

const offSale = {
  ...fixture,
  plans: [fixture.plans[0], { id: 'coaching', name: 'Premium Pro', available: false }],
}

describe('the plan in the link', () => {
  it('reads the slugs the WhatsApp links write, and the English ones', () => {
    expect(choiceOfSlug('premium-mensal')).toEqual({ plan: 'premium', cycle: 'monthly' })
    expect(choiceOfSlug('premium-anual')).toEqual({ plan: 'premium', cycle: 'yearly' })
    expect(choiceOfSlug('pro')).toEqual({ plan: 'coaching', cycle: 'yearly' })
    expect(choiceOfSlug('Premium-Yearly')).toEqual({ plan: 'premium', cycle: 'yearly' })
    expect(choiceOfSlug('basic')).toBeUndefined()
    expect(choiceOfSlug(['pro'])).toBeUndefined()
  })

  it('writes the slug back the Portuguese way', () => {
    expect(slugOf({ plan: 'premium', cycle: 'monthly' })).toBe('premium-mensal')
    expect(slugOf({ plan: 'coaching', cycle: 'yearly' })).toBe('pro')
  })

  it('returns after signing in only to a page of the fixed list', () => {
    expect(returnOf('assinar')).toBe('assinar')
    expect(returnOf('https://evil.example')).toBeUndefined()
    expect(returnOf('/assinar')).toBeUndefined()
  })
})

describe('the prices of the build', () => {
  it('offers the three plans with the methods each takes (decision 4)', () => {
    const offer = offerFromCatalog(buildCatalog(fixture, 'pt'), TITLES)

    expect(offer.buyer).toBe('anonymous')
    expect(offer.plans.map((each) => [each.title, each.priceCents])).toEqual([
      ['Premium mensal', 2990],
      ['Premium anual', 26990],
      ['Premium Pro', 59880],
    ])
    expect(offer.plans[0]!.methods).toEqual([
      { method: 'card', priceCents: 2990, renews: true },
      { method: 'pix', priceCents: 2990, renews: false },
    ])
    expect(offer.plans[1]!.methods).toEqual([
      { method: 'card', priceCents: 26990, renews: false, installments: 12 },
      { method: 'pix', priceCents: 24990, renews: false },
    ])
    expect(offer.plans[2]).toMatchObject({
      installmentCents: 4990,
      signInToDiscount: true,
      methods: [
        { method: 'card', priceCents: 59880, renews: false, installments: 12 },
        { method: 'pix', priceCents: 54990, renews: false },
      ],
    })
  })

  it('takes the yearly and Premium Pro by card alone when the catalog has no Pix price', () => {
    const { yearlyPixCents: _, ...premium } = fixture.plans[0]!
    const { pixCents: __, ...pack } = fixture.plans[1]!.packages![0]!
    const offer = offerFromCatalog(
      buildCatalog(
        { ...fixture, plans: [premium, { ...fixture.plans[1], packages: [pack] }] },
        'pt',
      ),
      TITLES,
    )

    expect(offer.plans[1]!.methods.map((each) => each.method)).toEqual(['card'])
    expect(offer.plans[2]!.methods.map((each) => each.method)).toEqual(['card'])
  })

  it('shows the Pix price only where it costs less than the card', () => {
    const [monthly, yearly, pro] = offerFromCatalog(buildCatalog(fixture, 'pt'), TITLES).plans
    expect(cheaperPixOf(monthly!)).toBeUndefined()
    expect(cheaperPixOf(yearly!)).toBe(24990)
    expect(cheaperPixOf(pro!)).toBe(54990)
  })

  it('says Premium Pro is not on sale when the build has no package', () => {
    const offer = offerFromCatalog(buildCatalog(offSale, 'pt'), TITLES)

    expect(offer.plans[2]).toMatchObject({ blocked: 'pro_unavailable', methods: [] })
  })

  it('puts the cards in the order monthly, yearly, Premium Pro', () => {
    const plans = offerFromCatalog(buildCatalog(fixture, 'pt'), TITLES).plans

    expect(orderedPlans([...plans].reverse()).map((each) => slugOf(each))).toEqual([
      'premium-mensal',
      'premium-anual',
      'pro',
    ])
  })
})

describe('the installment shown', () => {
  const yearly = (methods: PlanOffer['methods'], installmentCents?: number): PlanOffer => ({
    plan: 'premium',
    cycle: 'yearly',
    title: 'Premium anual',
    priceCents: 10001,
    methods,
    ...(installmentCents === undefined ? {} : { installmentCents }),
  })

  it('is what the API says each installment charges, by method first', () => {
    expect(
      installmentOf(
        yearly([{ method: 'card', renews: false, installments: 12, installmentCents: 834 }], 900),
      ),
    ).toEqual({ count: 12, cents: 834 })
    expect(
      installmentOf(yearly([{ method: 'card', renews: false, installments: 12 }], 900)),
    ).toEqual({ count: 12, cents: 900 })
  })

  it('rounds to the nearest cent, as codart-messaging does, only when the API says nothing', () => {
    expect(installmentOf(yearly([{ method: 'card', renews: false, installments: 12 }]))).toEqual({
      count: 12,
      cents: 833,
    })
    expect(installmentOf(yearly([{ method: 'pix', renews: false }]))).toEqual({
      count: 1,
      cents: 10001,
    })
  })

  it('takes the Premium Pro installment of the build from the catalog', () => {
    const offer = offerFromCatalog(
      buildCatalog(
        {
          ...fixture,
          plans: [
            fixture.plans[0],
            {
              ...fixture.plans[1],
              packages: [{ months: 12, totalCents: 10001, installments: 12, perMonthCents: 834 }],
            },
          ],
        },
        'pt',
      ),
      TITLES,
    )

    expect(installmentOf(offer.plans[2]!)).toEqual({ count: 12, cents: 834 })
  })
})

describe('the payment badges', () => {
  it('promise as many installments as the plans on sale take, and no more', () => {
    const onSaleOffer = offerFromCatalog(buildCatalog(fixture, 'pt'), TITLES)
    const withoutPro = offerFromCatalog(buildCatalog(offSale, 'pt'), TITLES)
    const monthlyOnly = withoutPro.plans.filter((each) => each.cycle === 'monthly')

    expect(mostInstallments(onSaleOffer.plans)).toBe(12)
    expect(
      mostInstallments(
        onSaleOffer.plans.map((each) =>
          each.plan === 'coaching'
            ? { ...each, methods: [{ method: 'card', renews: false, installments: 18 }] }
            : each,
        ),
      ),
    ).toBe(18)
    expect(mostInstallments(monthlyOnly)).toBe(1)
  })
})

describe('the method to start on', () => {
  const offer = (methods: PlanOffer['methods']): PlanOffer => ({
    plan: 'premium',
    cycle: 'monthly',
    title: 'Premium mensal',
    priceCents: 2990,
    methods,
  })

  it('is the only one open, or none for the person to pick', () => {
    expect(defaultMethod(offer([{ method: 'card', renews: false, installments: 12 }]))).toBe('card')
    expect(
      defaultMethod(
        offer([
          { method: 'card', renews: true },
          { method: 'pix', renews: false },
        ]),
      ),
    ).toBeUndefined()
    expect(
      defaultMethod(
        offer([
          { method: 'card', renews: true, blocked: 'already_subscribed' },
          { method: 'pix', renews: false },
        ]),
      ),
    ).toBe('pix')
  })
})

describe('the purchase page', () => {
  it('asks to activate only a paid purchase without an owner and with its code', () => {
    expect(
      purchaseView({
        status: 'paid',
        owned: false,
        code: 'ATV-7KQ2MXPD',
        message: 'Ativar minha assinatura: ATV-7KQ2MXPD',
        link: 'https://wa.me/5511?text=Ativar',
      }),
    ).toBe('activate')
    expect(purchaseView({ status: 'paid', owned: true })).toBe('confirmed')
    expect(purchaseView({ status: 'waiting' })).toBe('waiting')
    expect(purchaseView({ status: 'refunded' })).toBe('refunded')
  })

  it('keeps asking only while the payment or the activation can still arrive', () => {
    expect(purchaseSettled('waiting')).toBe(false)
    expect(purchaseSettled('activate')).toBe(false)
    expect(purchaseSettled('checking')).toBe(false)
    expect(purchaseSettled('activated')).toBe(true)
    expect(purchaseSettled('confirmed')).toBe(true)
    expect(purchaseSettled('refused')).toBe(true)
    expect(purchaseSettled('none')).toBe(true)
  })

  it('signs this browser in only within the window after the activation', () => {
    const activated = {
      status: 'activated' as const,
      activatedAt: '2026-11-21T12:00:00.000Z',
      signInUntil: '2026-11-21T12:30:00.000Z',
    }
    expect(canSignInAfterActivation(activated, Date.parse('2026-11-21T12:10:00.000Z'))).toBe(true)
    expect(canSignInAfterActivation(activated, Date.parse('2026-11-21T12:31:00.000Z'))).toBe(false)
    expect(canSignInAfterActivation({ status: 'paid' }, 0)).toBe(false)
  })
})

describe('the sign-in page', () => {
  it('exchanges the request once the code arrived, and stops on the ends', () => {
    expect(loginStep('pending')).toBe('wait')
    expect(loginStep('confirmed')).toBe('exchange')
    expect(loginStep('expired')).toBe('expired')
    expect(loginStep('used')).toBe('used')
    expect(loginStep('none')).toBe('lost')
  })

  it('keeps waiting on a status it does not know yet', () => {
    expect(loginStep('something_new')).toBe('wait')
  })
})

describe('the activation code', () => {
  it('takes the code however it was typed or pasted', () => {
    expect(activationCodeOf('ATV-7KQ2MXPD')).toBe('ATV-7KQ2MXPD')
    expect(activationCodeOf(' atv 7kq2 mxpd ')).toBe('ATV-7KQ2MXPD')
    expect(activationCodeOf('7kq2mxpd')).toBe('ATV-7KQ2MXPD')
    expect(activationCodeOf('Ativar minha assinatura: ATV-7KQ2MXPD')).toBe('ATV-7KQ2MXPD')
    expect(activationCodeOf('ATV-7KQ')).toBeUndefined()
  })
})
