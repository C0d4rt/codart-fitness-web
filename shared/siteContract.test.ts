import { describe, expect, it } from 'vitest'

import { purchaseView } from './purchaseFlow'
import {
  checkoutSchema,
  loginSchema,
  loginStatusSchema,
  meSchema,
  plansResponseSchema,
  purchaseSchema,
  sessionSchema,
} from './siteApi'
import { MESSAGING_SITE_ERROR_CODES, SITE_ANSWERS } from './siteContract.fixture'
import { API_ERROR_CODES } from './siteErrors'

describe('the site contract with codart-messaging (PRP-065)', () => {
  it.each([
    ['login', loginSchema, SITE_ANSWERS.login],
    ['loginStatus', loginStatusSchema, SITE_ANSWERS.loginStatus],
    ['loginStatusNone', loginStatusSchema, SITE_ANSWERS.loginStatusNone],
    ['session', sessionSchema, SITE_ANSWERS.session],
    ['handoff', sessionSchema, SITE_ANSWERS.handoff],
    ['me', meSchema, SITE_ANSWERS.me],
    ['signedOut', meSchema, SITE_ANSWERS.signedOut],
    ['checkout', checkoutSchema, SITE_ANSWERS.checkout],
    ['purchaseWaiting', purchaseSchema, SITE_ANSWERS.purchaseWaiting],
    ['purchasePaid', purchaseSchema, SITE_ANSWERS.purchasePaid],
    ['purchaseActivated', purchaseSchema, SITE_ANSWERS.purchaseActivated],
    ['purchaseNone', purchaseSchema, SITE_ANSWERS.purchaseNone],
  ] as const)('reads the %s answer', (_, schema, answer) => {
    expect(schema.safeParse(answer).success).toBe(true)
  })

  it('reads every plan and every method of the plans answer', () => {
    const read = plansResponseSchema.parse(SITE_ANSWERS.plans)

    expect(read.plans.map((each) => [each.plan, each.cycle, each.methods.length])).toEqual(
      SITE_ANSWERS.plans.plans.map((each) => [each.plan, each.cycle, each.methods.length]),
    )
    expect(read.plans[1]!.methods[0]!.installmentCents).toBe(1666)
  })

  it('leaves out a plan or a method it does not know, and keeps the rest', () => {
    const [monthly, ...others] = SITE_ANSWERS.plans.plans
    const read = plansResponseSchema.parse({
      ...SITE_ANSWERS.plans,
      buyer: 'someone_new',
      plans: [
        { ...monthly, methods: [...monthly.methods, { method: 'boleto', renews: false }] },
        { ...monthly, plan: 'family' },
        ...others,
      ],
    })

    expect(read.buyer).toBe('someone_new')
    expect(read.plans).toHaveLength(3)
    expect(read.plans[0]!.methods.map((each) => each.method)).toEqual(['card', 'pix'])
  })

  it('shows a purchase status it does not know as still checking', () => {
    const read = purchaseSchema.parse({ ...SITE_ANSWERS.purchaseWaiting, status: 'disputed' })

    expect(purchaseView(read)).toBe('checking')
  })

  it('knows every error code messaging answers, and no other', () => {
    expect([...API_ERROR_CODES].sort()).toEqual([...MESSAGING_SITE_ERROR_CODES].sort())
  })
})
