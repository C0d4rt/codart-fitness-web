import { describe, expect, it, vi } from 'vitest'

import { createSiteApi } from './siteApi'

const json = (status: number, body: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const apiAnswering = (response: Response | Error) => {
  const fetch = vi.fn(async (_input: string, _init: RequestInit) => {
    if (response instanceof Error) throw response
    return response
  })
  return { api: createSiteApi({ baseUrl: 'https://api.example.test/', fetch }), fetch }
}

describe('the site API client (PRP-065)', () => {
  it('sends the cookies, a JSON body on every POST and never a token in the URL', async () => {
    const { api, fetch } = apiAnswering(
      json(200, { signedIn: true, scope: 'purchase', expiresAt: '2026-11-24T12:00:00.000Z' }),
    )

    await api.handoff('secret-token')

    const [url, init] = fetch.mock.calls[0]!
    expect(url).toBe('https://api.example.test/fitness/site/handoff')
    expect(url).not.toContain('secret-token')
    expect(init).toMatchObject({
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
    })
    expect(JSON.parse(String(init.body))).toEqual({ token: 'secret-token' })
  })

  it('posts an empty JSON object when there is nothing to say', async () => {
    const { api, fetch } = apiAnswering(new Response(null, { status: 204 }))

    const result = await api.logout()

    expect(result.ok).toBe(true)
    expect(fetch.mock.calls[0]![1].body).toBe('{}')
  })

  it('asks the plans in the language of the page, with the cookies but no body', async () => {
    const { api, fetch } = apiAnswering(json(200, { buyer: 'anonymous', plans: [] }))

    await api.plans('en-US')

    const [url, init] = fetch.mock.calls[0]!
    expect(url).toBe('https://api.example.test/fitness/site/plans?locale=en-US')
    expect(init).toMatchObject({ method: 'GET', credentials: 'include', body: undefined })
  })

  it('reads the plans with the methods, the credit and what blocks a purchase', async () => {
    const { api } = apiAnswering(
      json(200, {
        buyer: 'purchase',
        plans: [
          {
            plan: 'premium',
            cycle: 'monthly',
            title: 'Premium mensal',
            priceCents: 2990,
            methods: [
              { method: 'card', renews: true, blocked: 'already_subscribed' },
              { method: 'pix', renews: false },
            ],
          },
          {
            plan: 'coaching',
            cycle: 'yearly',
            title: 'Premium Pro',
            months: 12,
            priceCents: 46890,
            fullCents: 47880,
            discountCents: 990,
            installmentCents: 3908,
            credits: [
              {
                plan: 'premium',
                from: '2026-11-21T03:00:00.000Z',
                until: '2026-12-21T03:00:00.000Z',
                cents: 990,
              },
            ],
            methods: [{ method: 'card', renews: false, installments: 12 }],
          },
        ],
      }),
    )

    const result = await api.plans('pt-BR')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.plans[0]!.methods[0]).toEqual({
      method: 'card',
      renews: true,
      blocked: 'already_subscribed',
    })
    expect(result.data.plans[1]!.credits).toHaveLength(1)
  })

  it('branches on the code of the error body', async () => {
    const { api } = apiAnswering(
      json(409, {
        status: 409,
        error: 'Conflict',
        message: 'x',
        code: 'fitness.site.declaration_required',
      }),
    )

    expect(
      await api.checkout({
        plan: 'premium',
        cycle: 'monthly',
        method: 'card',
        declared: false,
        locale: 'pt-BR',
      }),
    ).toEqual({ ok: false, status: 409, code: 'declaration_required' })
  })

  it('tells a network failure, a limit and a server down apart', async () => {
    expect(await apiAnswering(new TypeError('Failed to fetch')).api.me()).toEqual({
      ok: false,
      status: 0,
      code: 'network',
    })
    expect(await apiAnswering(json(429, { message: 'slow down' })).api.me()).toMatchObject({
      code: 'rate_limited',
    })
    expect(await apiAnswering(new Response('<html>', { status: 502 })).api.me()).toMatchObject({
      code: 'unavailable',
    })
  })

  it('gives up on a call that hangs, and on one its caller aborts, as a network failure', async () => {
    const timers: { run: () => void; ms: number }[] = []
    const clock = {
      now: () => 0,
      setTimeout: (run: () => void, ms: number) => timers.push({ run, ms }),
      clearTimeout: () => {},
    }
    const fetch = vi.fn(
      (_input: string, init: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('', 'AbortError')))
        }),
    )
    const api = createSiteApi({ baseUrl: 'https://api.example.test', fetch, clock })

    const hung = api.purchase()
    timers[0]!.run()
    const caller = new AbortController()
    const aborted = api.loginStatus(caller.signal)
    caller.abort()

    expect(timers.map((each) => each.ms)).toEqual([10_000, 10_000])
    expect(await hung).toEqual({ ok: false, status: 0, code: 'network' })
    expect(await aborted).toEqual({ ok: false, status: 0, code: 'network' })
  })

  it.each([
    'javascript:alert(1)',
    'http://payment-link.pagar.me/pl_1',
    'https://evil.example/pl_1',
    'https://payment-link.pagar.me.evil.example/pl_1',
    'https://user@payment-link.pagar.me/pl_1',
    'not a url',
  ])('refuses the checkout link %s', async (checkoutUrl) => {
    const { api } = apiAnswering(json(200, { checkoutUrl }))

    expect(
      await api.checkout({
        plan: 'premium',
        cycle: 'yearly',
        method: 'card',
        declared: true,
        locale: 'pt-BR',
      }),
    ).toMatchObject({ ok: false, code: 'bad_response' })
  })

  it('follows a Pagar.me payment link', async () => {
    const { api } = apiAnswering(json(200, { checkoutUrl: 'https://payment-link.pagar.me/pl_1' }))

    expect(
      await api.checkout({
        plan: 'premium',
        cycle: 'yearly',
        method: 'card',
        declared: true,
        locale: 'pt-BR',
      }),
    ).toEqual({ ok: true, data: { checkoutUrl: 'https://payment-link.pagar.me/pl_1' } })
  })

  it('accepts only a wa.me link to open WhatsApp', async () => {
    const good = apiAnswering(
      json(201, {
        code: 'WEB-7KQ2MX',
        message: 'Entrar no site: WEB-7KQ2MX',
        link: 'https://wa.me/5511926169724?text=Entrar%20no%20site%3A%20WEB-7KQ2MX',
        expiresAt: '2026-11-21T12:10:00.000Z',
      }),
    )
    const bad = apiAnswering(
      json(201, {
        code: 'WEB-7KQ2MX',
        message: 'Entrar no site: WEB-7KQ2MX',
        link: 'https://evil.example/?text=x',
        expiresAt: '2026-11-21T12:10:00.000Z',
      }),
    )

    expect((await good.api.startLogin('pt-BR')).ok).toBe(true)
    expect(await bad.api.startLogin('pt-BR')).toMatchObject({ ok: false, code: 'bad_response' })
  })

  it('reads an anonymous paid purchase with its activation code', async () => {
    const { api } = apiAnswering(
      json(200, {
        plan: 'premium',
        cycle: 'monthly',
        method: 'card',
        status: 'paid',
        owned: false,
        code: 'ATV-7KQ2MXPD',
        message: 'Ativar minha assinatura: ATV-7KQ2MXPD',
        link: 'https://wa.me/5511926169724?text=Ativar%20minha%20assinatura%3A%20ATV-7KQ2MXPD',
      }),
    )

    expect(await api.purchase()).toMatchObject({
      ok: true,
      data: { status: 'paid', owned: false, code: 'ATV-7KQ2MXPD' },
    })
  })
})
