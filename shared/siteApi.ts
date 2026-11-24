import { z } from 'zod'

import { type Clock, systemClock } from './poller'
import { type SiteErrorCode, siteErrorOf } from './siteErrors'

const iso = z.string().min(1)
const waLink = z.string().regex(/^https:\/\/wa\.me\/\d*\?text=/)
const planName = z.enum(['premium', 'coaching'])
const cycleName = z.enum(['monthly', 'yearly'])
const methodName = z.enum(['card', 'pix'])

/** A plan or method the API adds before the site knows it is left out, never the whole answer. */
const knownOnly = <T extends z.ZodType>(schema: T) =>
  z.array(z.unknown()).transform((items) =>
    items.flatMap((item): z.output<T>[] => {
      const read = schema.safeParse(item)
      return read.success ? [read.data] : []
    }),
  )

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
        plan: planName.optional().catch(undefined),
        until: iso.optional(),
      })
      .optional(),
    expiresAt: iso,
  }),
  z.object({ signedIn: z.literal(false) }),
])

const methodSchema = z.object({
  method: methodName,
  renews: z.boolean(),
  installments: z.int().positive().optional(),
  installmentCents: z.int().nonnegative().optional(),
  blocked: z.string().optional(),
})

const planOfferSchema = z.object({
  plan: planName,
  cycle: cycleName,
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
  methods: knownOnly(methodSchema).default([]),
})

export const plansResponseSchema = z.object({
  buyer: z.string(),
  declaration: z.object({ code: z.string(), text: z.string().min(1) }).optional(),
  blocked: z.string().optional(),
  plans: knownOnly(planOfferSchema),
})

/** Where codart-messaging's Pagar.me gateway sends the buyer: its payment links. */
export const CHECKOUT_HOSTS: readonly string[] = ['payment-link.pagar.me']

const isCheckoutUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && CHECKOUT_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}

export const checkoutSchema = z.object({
  checkoutUrl: z.string().refine(isCheckoutUrl),
})

/** Read as plain text: a status the site does not know yet shows as still checking. */
export const purchaseSchema = z.object({
  status: z.string(),
  plan: planName.optional().catch(undefined),
  cycle: cycleName.optional().catch(undefined),
  method: methodName.optional().catch(undefined),
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
  status: z.string(),
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
 * requires so a cross-site form can never post. A call that outlives `timeoutMs`, or whose
 * `signal` aborts, reads as `network`.
 */
export const createSiteApi = ({
  baseUrl,
  fetch,
  timeoutMs = 10_000,
  clock = systemClock,
}: {
  baseUrl: string
  fetch: Fetch
  timeoutMs?: number
  clock?: Clock
}) => {
  const root = `${baseUrl.replace(/\/+$/, '')}/fitness/site`

  const call = async <T>(
    method: 'GET' | 'POST',
    path: string,
    schema: z.ZodType<T>,
    body?: unknown,
    signal?: AbortSignal,
  ): Promise<ApiResult<T>> => {
    // One controller for both, instead of AbortSignal.any, which Safari only has since 17.4.
    const aborter = new AbortController()
    const abort = () => aborter.abort()
    const timer = clock.setTimeout(abort, timeoutMs)
    if (signal?.aborted) abort()
    signal?.addEventListener('abort', abort)
    let response: Response
    let json: unknown
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
        signal: aborter.signal,
      })
      json = response.status === 204 ? undefined : await response.json().catch(() => undefined)
    } catch {
      return { ok: false, status: 0, code: 'network' }
    } finally {
      clock.clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
    }
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
    purchase: (signal?: AbortSignal) => call('GET', '/purchase', purchaseSchema, undefined, signal),
    openPurchase: (code: string) =>
      call('POST', '/purchase/open', z.object({ opened: z.literal(true) }), { code }),
    purchaseSession: (signal?: AbortSignal) =>
      call('POST', '/purchase/session', sessionSchema, undefined, signal),
    startLogin: (locale: ApiLocale) => call('POST', '/login', loginSchema, { locale }),
    loginStatus: (signal?: AbortSignal) =>
      call('GET', '/login', loginStatusSchema, undefined, signal),
    loginSession: (signal?: AbortSignal) =>
      call('POST', '/login/session', sessionSchema, undefined, signal),
    logout: () => call('POST', '/logout', z.unknown()),
  }
}

export type SiteApi = ReturnType<typeof createSiteApi>
