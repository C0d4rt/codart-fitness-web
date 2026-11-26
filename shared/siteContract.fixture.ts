/**
 * Answers of the codart-messaging site routes, copied from its `api/siteRouter.test.ts` and from the
 * types of `application/sitePurchase.ts` (packages/domain-fitness). When messaging changes one of
 * them, copy it here again: the contract test then fails if the site can no longer read it.
 */
export const SITE_ANSWERS = {
  login: {
    code: 'WEB-234567',
    message: 'Sign in to the site: WEB-234567',
    link: 'https://wa.me/5511926169724?text=Sign%20in%20to%20the%20site%3A%20WEB-234567',
    expiresAt: '2026-11-21T12:10:00.000Z',
  },
  loginStatus: { status: 'pending', expiresAt: '2026-11-21T12:10:00.000Z' },
  loginStatusNone: { status: 'none' },
  session: { signedIn: true, scope: 'account', expiresAt: '2026-12-21T12:00:00.000Z' },
  handoff: { signedIn: true, scope: 'purchase', expiresAt: '2026-11-24T12:00:00.000Z' },
  me: {
    signedIn: true,
    scope: 'account',
    phone: '+55 11 9****-4321',
    access: { standing: 'none' },
    expiresAt: '2026-12-21T12:00:00.000Z',
  },
  signedOut: { signedIn: false },
  plans: {
    buyer: 'anonymous',
    declaration: {
      code: 'payer_adult',
      text: 'Tenho 18 anos ou mais ou sou responsável pelo menor de idade.',
    },
    plans: [
      {
        plan: 'premium',
        cycle: 'monthly',
        title: 'Premium mensal',
        priceCents: 2990,
        methods: [
          { method: 'card', priceCents: 2990, renews: true },
          { method: 'pix', priceCents: 2990, renews: false },
        ],
      },
      {
        plan: 'premium',
        cycle: 'yearly',
        title: 'Premium anual',
        priceCents: 23880,
        methods: [
          {
            method: 'card',
            priceCents: 23880,
            renews: false,
            installments: 12,
            installmentCents: 1990,
          },
          { method: 'pix', priceCents: 21990, renews: false },
        ],
      },
      {
        plan: 'coaching',
        cycle: 'yearly',
        title: 'Premium Pro',
        months: 12,
        methods: [
          {
            method: 'card',
            priceCents: 59880,
            renews: false,
            installments: 12,
            installmentCents: 4990,
          },
          { method: 'pix', priceCents: 54990, renews: false },
        ],
        priceCents: 59880,
        fullCents: 59880,
        discountCents: 0,
        installmentCents: 4990,
        credits: [],
        signInToDiscount: true,
      },
    ],
  },
  proOffSale: {
    plan: 'coaching',
    cycle: 'yearly',
    title: 'Premium Pro',
    months: 12,
    methods: [],
    priceCents: 0,
    blocked: 'pro_unavailable',
  },
  checkout: { checkoutUrl: 'https://payment-link.pagar.me/pl_1' },
  purchaseWaiting: {
    plan: 'premium',
    cycle: 'monthly',
    method: 'card',
    status: 'waiting',
    owned: false,
  },
  purchasePaid: {
    plan: 'premium',
    cycle: 'monthly',
    method: 'card',
    status: 'paid',
    owned: false,
    code: 'ATV-7KQ2MXPD',
    message: 'Ativar minha assinatura: ATV-7KQ2MXPD',
    link: 'https://wa.me/5511926169724?text=Ativar%20minha%20assinatura%3A%20ATV-7KQ2MXPD',
  },
  purchaseActivated: {
    plan: 'premium',
    cycle: 'yearly',
    method: 'card',
    status: 'activated',
    owned: false,
    activatedAt: '2026-11-21T12:00:00.000Z',
    signInUntil: '2026-11-21T12:30:00.000Z',
  },
  purchaseNone: { status: 'none' },
  opened: { opened: true },
} as const

/**
 * The `fitness.site.*` codes messaging answers: `origin_refused` and `json_required` from
 * `api/siteRouter.ts`, `login_*` from `domain/siteLogin.ts` (`SiteLoginRefusal`), and the rest from
 * `SiteRefusalCode` in `application/sitePurchase.ts`.
 */
export const MESSAGING_SITE_ERROR_CODES = [
  'origin_refused',
  'json_required',
  'login_unknown',
  'login_pending',
  'login_expired',
  'login_used',
  'link_unknown',
  'link_expired',
  'already_subscribed',
  'guardian_required',
  'declaration_required',
  'method_unavailable',
  'pro_unavailable',
  'purchase_paid',
  'checkout_refused',
  'purchase_unknown',
  'purchase_activated',
  'purchase_not_activated',
  'sign_in_closed',
  'sign_in_used',
] as const
