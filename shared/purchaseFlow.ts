import { type Catalog, installmentCents, packageInstallmentCents } from './plans'
import type { LoginStatus, PayMethod, PlanOffer, PlansResponse, Purchase } from './siteApi'

export type PlanChoice = { plan: PlanOffer['plan']; cycle: PlanOffer['cycle'] }

/** `?plano=` as the WhatsApp links write it (decision 14), plus the English spellings. */
const SLUGS: Record<string, PlanChoice> = {
  'premium-mensal': { plan: 'premium', cycle: 'monthly' },
  'premium-anual': { plan: 'premium', cycle: 'yearly' },
  pro: { plan: 'coaching', cycle: 'yearly' },
  'premium-monthly': { plan: 'premium', cycle: 'monthly' },
  'premium-yearly': { plan: 'premium', cycle: 'yearly' },
  'premium-pro': { plan: 'coaching', cycle: 'yearly' },
}

export const choiceOfSlug = (slug: unknown): PlanChoice | undefined =>
  typeof slug === 'string' ? SLUGS[slug.trim().toLowerCase()] : undefined

export const slugOf = (choice: PlanChoice): string =>
  choice.plan === 'coaching'
    ? 'pro'
    : choice.cycle === 'monthly'
      ? 'premium-mensal'
      : 'premium-anual'

export const sameChoice = (a: PlanChoice | undefined, b: PlanChoice | undefined): boolean =>
  a !== undefined && b !== undefined && a.plan === b.plan && a.cycle === b.cycle

/** The order of the cards: the monthly, the yearly and Premium Pro side by side (decision 3). */
const ORDER = ['premium-mensal', 'premium-anual', 'pro']

export const orderedPlans = (plans: readonly PlanOffer[]): PlanOffer[] =>
  [...plans].sort((a, b) => ORDER.indexOf(slugOf(a)) - ORDER.indexOf(slugOf(b)))

/**
 * The prices of the build, shown until `GET /plans` answers (decision 16), with the methods each plan
 * takes today (decision 4). Nothing here can be bought: the page waits for the API to pay.
 */
export const offerFromCatalog = (
  catalog: Catalog,
  titles: { monthly: string; yearly: string; coaching: string },
): PlansResponse => {
  const yearlyInstallments = catalog.premium.yearlyInstallments ?? 1
  const pack = catalog.coaching.available
    ? (catalog.coaching.packages.find((each) => each.months === 12) ?? catalog.coaching.packages[0])
    : undefined
  return {
    buyer: 'anonymous',
    plans: [
      {
        plan: 'premium',
        cycle: 'monthly',
        title: titles.monthly,
        priceCents: catalog.premium.monthlyCents,
        methods: [
          { method: 'card', renews: true },
          { method: 'pix', renews: false },
        ],
      },
      {
        plan: 'premium',
        cycle: 'yearly',
        title: titles.yearly,
        priceCents: catalog.premium.yearlyCents,
        methods: [
          {
            method: 'card',
            renews: false,
            ...(yearlyInstallments > 1 ? { installments: yearlyInstallments } : {}),
          },
        ],
      },
      pack
        ? {
            plan: 'coaching',
            cycle: 'yearly',
            title: titles.coaching,
            months: pack.months,
            priceCents: pack.totalCents,
            fullCents: pack.totalCents,
            discountCents: 0,
            installmentCents: packageInstallmentCents(pack),
            credits: [],
            signInToDiscount: true,
            methods: [{ method: 'card', renews: false, installments: pack.installments }],
          }
        : {
            plan: 'coaching',
            cycle: 'yearly',
            title: titles.coaching,
            priceCents: 0,
            blocked: 'pro_unavailable',
            methods: [],
          },
    ],
  }
}

/**
 * The most installments the offer's methods take, and what each one charges: the method's
 * `installmentCents`, then the offer's, as codart-messaging computed them, and only without both
 * the same rounding here.
 */
export const installmentOf = (offer: PlanOffer): { count: number; cents: number } => {
  const most = offer.methods.reduce<PayMethod | undefined>(
    (best, each) => ((each.installments ?? 1) > (best?.installments ?? 1) ? each : best),
    undefined,
  )
  const count = most?.installments ?? 1
  const cents =
    most?.installmentCents ??
    (offer.installmentCents ||
      installmentCents({ totalCents: offer.priceCents, installments: count }))
  return { count, cents }
}

/** The most installments any plan on sale takes, for the payment badges. */
export const mostInstallments = (plans: readonly PlanOffer[]): number =>
  Math.max(1, ...plans.filter((each) => !each.blocked).map((each) => installmentOf(each).count))

/** The one method to start on: the only one there is, or none so the person picks. */
export const defaultMethod = (offer: PlanOffer): PayMethod['method'] | undefined => {
  const open = offer.methods.filter((each) => !each.blocked)
  return open.length === 1 ? open[0]!.method : undefined
}

const STATUS_VIEWS = ['none', 'waiting', 'activated', 'refused', 'expired', 'refunded'] as const

/** What `/assinar/pronto` shows for each answer of `GET /purchase`. */
export type PurchaseView = (typeof STATUS_VIEWS)[number] | 'checking' | 'confirmed' | 'activate'

const isStatusView = (status: string): status is (typeof STATUS_VIEWS)[number] =>
  (STATUS_VIEWS as readonly string[]).includes(status)

export const purchaseView = (purchase: Purchase): PurchaseView => {
  if (purchase.status === 'paid') {
    if (purchase.owned) return 'confirmed'
    return purchase.link && purchase.code ? 'activate' : 'waiting'
  }
  return isStatusView(purchase.status) ? purchase.status : 'checking'
}

/** The page keeps asking only while something can still change on its own. */
export const purchaseSettled = (view: PurchaseView): boolean =>
  view !== 'waiting' && view !== 'activate' && view !== 'checking'

/** The activated purchase can still sign this browser in. */
export const canSignInAfterActivation = (purchase: Purchase, now: number): boolean =>
  purchase.status === 'activated' &&
  purchase.signInUntil !== undefined &&
  Date.parse(purchase.signInUntil) > now

export type LoginStep = 'wait' | 'exchange' | 'expired' | 'used' | 'lost'

export const loginStep = (status: LoginStatus['status']): LoginStep => {
  switch (status) {
    case 'pending':
      return 'wait'
    case 'confirmed':
      return 'exchange'
    case 'expired':
      return 'expired'
    case 'used':
      return 'used'
    case 'none':
      return 'lost'
    default:
      return 'wait'
  }
}

/**
 * The activation code as typed or pasted ("atv 7kq2 mxpd", the whole sentence, or the eight
 * characters alone), written the way the API reads it: `ATV-` and eight characters.
 */
export const activationCodeOf = (typed: string): string | undefined => {
  const cleaned = typed.toUpperCase().replace(/[^0-9A-Z]/g, '')
  const match = /(?:ATV)?([0-9A-Z]{8})$/.exec(cleaned)
  return match ? `ATV-${match[1]}` : undefined
}

/** Where `/entrar` may send the person after signing in: a fixed list, never a free path. */
export const RETURNS = ['assinar'] as const
export type ReturnTo = (typeof RETURNS)[number]

export const returnOf = (value: unknown): ReturnTo | undefined =>
  (RETURNS as readonly unknown[]).includes(value) ? (value as ReturnTo) : undefined
