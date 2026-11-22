import { describe, expect, it } from 'vitest'

import fixture from './plans.fixture.json' with { type: 'json' }
import { buildCatalog } from './plans'
import {
  activationCodeOf,
  canSignInAfterActivation,
  choiceOfSlug,
  defaultMethod,
  loginStep,
  offerFromCatalog,
  orderedPlans,
  purchaseSettled,
  purchaseView,
  returnOf,
  slugOf,
} from './purchaseFlow'
import type { PlanOffer } from './siteApi'

const TITLES = { monthly: 'Premium mensal', yearly: 'Premium anual', coaching: 'Premium Pro' }

const onSale = {
  ...fixture,
  plans: [
    fixture.plans[0],
    {
      id: 'coaching',
      name: 'Premium Pro',
      available: true,
      packages: [{ months: 12, totalCents: 47880, installments: 12, perMonthCents: 3990 }],
    },
  ],
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
    const offer = offerFromCatalog(buildCatalog(onSale, 'pt'), TITLES)

    expect(offer.buyer).toBe('anonymous')
    expect(offer.plans.map((each) => [each.title, each.priceCents])).toEqual([
      ['Premium mensal', 2990],
      ['Premium anual', 19990],
      ['Premium Pro', 47880],
    ])
    expect(offer.plans[0]!.methods).toEqual([
      { method: 'card', renews: true },
      { method: 'pix', renews: false },
    ])
    expect(offer.plans[1]!.methods).toEqual([{ method: 'card', renews: false, installments: 12 }])
    expect(offer.plans[2]).toMatchObject({
      installmentCents: 3990,
      signInToDiscount: true,
      methods: [{ method: 'card', renews: false, installments: 12 }],
    })
  })

  it('says Premium Pro is not on sale when the build has no package', () => {
    const offer = offerFromCatalog(buildCatalog(fixture, 'pt'), TITLES)

    expect(offer.plans[2]).toMatchObject({ blocked: 'pro_unavailable', methods: [] })
  })

  it('puts the cards in the order monthly, yearly, Premium Pro', () => {
    const plans = offerFromCatalog(buildCatalog(onSale, 'pt'), TITLES).plans

    expect(orderedPlans([...plans].reverse()).map((each) => slugOf(each))).toEqual([
      'premium-mensal',
      'premium-anual',
      'pro',
    ])
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
