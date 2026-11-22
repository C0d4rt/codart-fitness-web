import { z } from 'zod'

import { type SiteErrorCode, siteErrorOf } from './siteErrors'

const iso = z.string().min(1)
const waLink = z.string().regex(/^https:\/\/wa\.me\/\d*\?text=/)

export const sessionSchema = z.object({
  signedIn: z.literal(true),
  scope: z.enum(['account', 'purchase']),
  expiresAt: iso,
})

export const meSchema = z.union([
  z.object({
    signedIn: z.literal(true),
    scope: z.enum(['account', 'purchase']),
    phone: z.string().optional(),
    name: z.string().optional(),
    access: z
      .object({
        standing: z.string(),
        plan: z.enum(['premium', 'coaching']).optional(),
        until: iso.optional(),
      })
      .optional(),
    expiresAt: iso,
  }),
  z.object({ signedIn: z.literal(false) }),
])

const methodSchema = z.object({
  method: z.enum(['card', 'pix']),
  renews: z.boolean(),
  installments: z.int().positive().optional(),
  blocked: z.string().optional(),
})

const planOfferSchema = z.object({
  plan: z.enum(['premium', 'coaching']),
  cycle: z.enum(['monthly', 'yearly']),
  title: z.string(),
  priceCents: z.int().nonnegative(),
  months: z.int().positive().optional(),
  fullCents: z.int().nonnegative().optional(),
  discountCents: z.int().nonnegative().optional(),
  installmentCents: z.int().nonnegative().optional(),
  credits: z
    .array(z.object({ plan: z.string(), from: iso, until: iso, cents: z.int().nonnegative() }))
    .optional(),
  signInToDiscount: z.boolean().optional(),
  blocked: z.string().optional(),
  methods: z.array(methodSchema).default([]),
})

export const plansResponseSchema = z.object({
  buyer: z.enum(['anonymous', 'account', 'purchase']),
  declaration: z.object({ code: z.string(), text: z.string().min(1) }).optional(),
  blocked: z.string().optional(),
  plans: z.array(planOfferSchema),
})

export const checkoutSchema = z.object({
  checkoutUrl: z.string().regex(/^https:\/\//),
})

export const purchaseSchema = z.object({
  status: z.enum(['none', 'waiting', 'paid', 'activated', 'refused', 'expired', 'refunded']),
  plan: z.enum(['premium', 'coaching']).optional(),
  cycle: z.enum(['monthly', 'yearly']).optional(),
  method: z.enum(['card', 'pix']).optional(),
  owned: z.boolean().optional(),
  code: z.string().optional(),
  message: z.string().optional(),
  link: waLink.optional(),
  activatedAt: iso.optional(),
  signInUntil: iso.optional(),
})

export const loginSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  link: waLink,
  expiresAt: iso,
})

export const loginStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'expired', 'used', 'none']),
  expiresAt: iso.optional(),
})

export type Session = z.infer<typeof sessionSchema>
export type Me = z.infer<typeof meSchema>
export type PlanOffer = z.infer<typeof planOfferSchema>
export type PayMethod = z.infer<typeof methodSchema>
export type PlansResponse = z.infer<typeof plansResponseSchema>
export type Purchase = z.infer<typeof purchaseSchema>
export type Login = z.infer<typeof loginSchema>
export type LoginStatus = z.infer<typeof loginStatusSchema>
export type ApiLocale = 'pt-BR' | 'en-US'

export type CheckoutChoice = {
  plan: PlanOffer['plan']
  cycle: PlanOffer['cycle']
  method: PayMethod['method']
  declared: boolean
  locale: ApiLocale
}

export type ApiResult<T> =
  { ok: true; data: T } | { ok: false; status: number; code: SiteErrorCode }

type Fetch = (input: string, init: RequestInit) => Promise<Response>

/**
 * Every call carries the API's cookies (`credentials: 'include'`) and never a token: the sessions
 * live only in `HttpOnly` cookies on the API host. A POST always sends a JSON body, which the API
 * requires so a cross-site form can never post.
 */
export const createSiteApi = ({ baseUrl, fetch }: { baseUrl: string; fetch: Fetch }) => {
  const root = `${baseUrl.replace(/\/+$/, '')}/fitness/site`

  const call = async <T>(
    method: 'GET' | 'POST',
    path: string,
    schema: z.ZodType<T>,
    body?: unknown,
  ): Promise<ApiResult<T>> => {
    let response: Response
    try {
      response = await fetch(`${root}${path}`, {
        method,
        credentials: 'include',
        cache: 'no-store',
        headers:
          method === 'POST'
            ? { accept: 'application/json', 'content-type': 'application/json' }
            : { accept: 'application/json' },
        body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
      })
    } catch {
      return { ok: false, status: 0, code: 'network' }
    }
    const json: unknown =
      response.status === 204 ? undefined : await response.json().catch(() => undefined)
    if (!response.ok) {
      return { ok: false, status: response.status, code: siteErrorOf(response.status, json) }
    }
    const parsed = schema.safeParse(json)
    return parsed.success
      ? { ok: true, data: parsed.data }
      : { ok: false, status: response.status, code: 'bad_response' }
  }

  return {
    me: () => call('GET', '/me', meSchema),
    handoff: (token: string) => call('POST', '/handoff', sessionSchema, { token }),
    plans: (locale: ApiLocale) =>
      call('GET', `/plans?locale=${encodeURIComponent(locale)}`, plansResponseSchema),
    checkout: (choice: CheckoutChoice) => call('POST', '/checkout', checkoutSchema, choice),
    purchase: () => call('GET', '/purchase', purchaseSchema),
    openPurchase: (code: string) =>
      call('POST', '/purchase/open', z.object({ opened: z.literal(true) }), { code }),
    purchaseSession: () => call('POST', '/purchase/session', sessionSchema),
    startLogin: (locale: ApiLocale) => call('POST', '/login', loginSchema, { locale }),
    loginStatus: () => call('GET', '/login', loginStatusSchema),
    loginSession: () => call('POST', '/login/session', sessionSchema),
    logout: () => call('POST', '/logout', z.unknown()),
  }
}

export type SiteApi = ReturnType<typeof createSiteApi>
