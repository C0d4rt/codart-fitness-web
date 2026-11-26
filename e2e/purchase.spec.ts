import { expect, type Page, test } from '@playwright/test'

import { SITE_ANSWERS } from '../shared/siteContract.fixture'

test.use({ colorScheme: 'light' })

const API = 'https://api.fitness.codart.dev/fitness/site'
const CHECKOUT = 'https://payment-link.pagar.me/pl_123'

type Answer = { status?: number; body?: unknown }
type Handler = (body: unknown, count: number) => Answer
type Call = { method: string; path: string; body: unknown }

/** The API of PRP-065 as the contracts describe it, answered in the browser: nothing leaves the test. */
const fakeApi = async (page: Page, handlers: Record<string, Handler>) => {
  const calls: Call[] = []
  const counts = new Map<string, number>()
  await page.route(`${API}/**`, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const key = `${request.method()} ${url.pathname.replace('/fitness/site', '')}`
    const body = request.postData() ? JSON.parse(request.postData()!) : undefined
    calls.push({ method: request.method(), path: url.pathname + url.search, body })
    const count = (counts.get(key) ?? 0) + 1
    counts.set(key, count)
    const handler = handlers[key]
    const answer = handler ? handler(body, count) : { status: 404, body: { code: 'not_found' } }
    await route.fulfill({
      status: answer.status ?? 200,
      contentType: 'application/json',
      body: answer.body === undefined ? '' : JSON.stringify(answer.body),
    })
  })
  await page.route(`${CHECKOUT}**`, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Pagar.me</h1>' }),
  )
  return calls
}

const ANONYMOUS_PLANS = SITE_ANSWERS.plans

const LINK_PLANS = {
  buyer: 'purchase',
  plans: [
    ANONYMOUS_PLANS.plans[0],
    ANONYMOUS_PLANS.plans[1],
    {
      ...ANONYMOUS_PLANS.plans[2],
      methods: [
        {
          method: 'card',
          priceCents: 58890,
          renews: false,
          installments: 12,
          installmentCents: 4908,
        },
        { method: 'pix', priceCents: 54000, renews: false },
      ],
      priceCents: 58890,
      discountCents: 990,
      installmentCents: 4908,
      signInToDiscount: false,
      credits: [
        {
          plan: 'premium',
          from: '2026-11-21T15:00:00.000Z',
          until: '2026-12-21T15:00:00.000Z',
          cents: 990,
        },
      ],
    },
  ],
}

const ME_PURCHASE = {
  signedIn: true,
  scope: 'purchase',
  phone: '+55 11 9****-4321',
  access: { standing: 'trial' },
  expiresAt: '2026-11-24T12:00:00.000Z',
}

test('the WhatsApp link takes the token off the address bar and buys Premium Pro with the credit', async ({
  page,
}) => {
  const calls = await fakeApi(page, {
    'POST /handoff': () => ({
      body: { signedIn: true, scope: 'purchase', expiresAt: '2026-11-24T12:00:00.000Z' },
    }),
    'GET /me': () => ({ body: ME_PURCHASE }),
    'GET /plans': () => ({ body: LINK_PLANS }),
    'POST /checkout': () => ({ body: { checkoutUrl: CHECKOUT } }),
  })

  await page.goto('/assinar?plano=pro#c=tok_ABC-123')

  await expect(page.getByText('Comprando para +55 11 9****-4321')).toBeVisible()
  expect(await page.evaluate(() => window.location.hash)).toBe('')
  expect(await page.evaluate(() => JSON.stringify(window.history.state))).not.toContain('tok_')
  expect(calls.find((call) => call.path.endsWith('/handoff'))?.body).toEqual({
    token: 'tok_ABC-123',
  })
  expect(calls.every((call) => !call.path.includes('tok_'))).toBe(true)

  const pro = page.locator('li.card', { has: page.getByRole('heading', { name: 'Premium Pro' }) })
  await expect(pro.getByText('De R$ 598,80 por R$ 588,90')).toBeVisible()
  await expect(pro.getByText(/Desconto do Premium já pago/)).toBeVisible()
  await expect(pro.getByText('ou R$ 540,00 no Pix à vista')).toBeVisible()
  await expect(pro.getByRole('checkbox')).toHaveCount(0)
  await pro.getByRole('radio', { name: /Cartão, em até 12x/ }).check()

  await pro.getByRole('button', { name: 'Ir para o pagamento' }).click()
  await expect(page).toHaveURL(CHECKOUT)
  expect(calls.find((call) => call.path.endsWith('/checkout'))?.body).toEqual({
    plan: 'coaching',
    cycle: 'yearly',
    method: 'card',
    declared: false,
    locale: 'pt-BR',
  })
})

test('an anonymous buyer picks the monthly by Pix and must declare being an adult', async ({
  page,
}) => {
  const calls = await fakeApi(page, {
    'GET /me': () => ({ body: { signedIn: false } }),
    'GET /plans': () => ({ body: ANONYMOUS_PLANS }),
    'POST /checkout': () => ({ body: { checkoutUrl: CHECKOUT } }),
  })

  await page.goto('/assinar')
  await expect(page.getByRole('link', { name: 'Entrar com WhatsApp' })).toBeVisible()
  const monthly = page.locator('li.card', {
    has: page.getByRole('heading', { name: 'Premium', exact: true }),
  })
  await expect(monthly.getByRole('radio', { name: /^Cartão/ })).toBeVisible()
  await monthly.getByRole('radio', { name: /^Pix/ }).check()
  await expect(page).toHaveURL(/\?plano=premium-mensal$/)

  const pay = monthly.getByRole('button', { name: 'Ir para o pagamento' })
  await pay.click()
  await expect(monthly.getByRole('alert')).toHaveText('Marque a declaração para continuar.')
  expect(calls.some((call) => call.path.endsWith('/checkout'))).toBe(false)

  await monthly.getByRole('checkbox').check()
  await pay.click()
  await expect(page).toHaveURL(CHECKOUT)
  expect(calls.filter((call) => call.path.endsWith('/checkout'))).toHaveLength(1)
  expect(calls.find((call) => call.path.endsWith('/checkout'))?.body).toMatchObject({
    plan: 'premium',
    cycle: 'monthly',
    method: 'pix',
    declared: true,
  })
})

test('one Premium card switches between the monthly and the yearly', async ({ page }) => {
  await fakeApi(page, {
    'GET /me': () => ({ body: { signedIn: false } }),
    'GET /plans': () => ({ body: ANONYMOUS_PLANS }),
  })

  await page.goto('/assinar?plano=premium-mensal')
  await expect(page.locator('li.card')).toHaveCount(2)
  const premium = page.locator('li.card', {
    has: page.getByRole('heading', { name: 'Premium', exact: true }),
  })
  await expect(premium.getByRole('radio', { name: /^Pix/ })).toBeVisible()

  await premium.getByRole('button', { name: 'Anual' }).click()
  await expect(page).toHaveURL(/\?plano=premium-anual$/)
  await expect(premium.getByText('R$ 269,90').first()).toBeVisible()
  await expect(premium.getByText('ou R$ 249,90 no Pix à vista')).toBeVisible()
  await expect(
    premium.getByRole('radio', { name: /^Cartão, em até 12x R\$\s269,90 por 12 meses/ }),
  ).toBeVisible()
  const pix = premium.getByRole('radio', { name: /^Pix à vista R\$\s249,90 por 12 meses/ })
  await pix.check()
  await expect(premium.getByText(/Não renova sozinho/)).toBeVisible()

  await premium.getByRole('button', { name: 'Mensal' }).click()
  await expect(premium.getByRole('radio', { name: /^Cartão/ })).not.toBeChecked()
  await expect(premium.getByText(/no Pix à vista/)).toHaveCount(0)
})

test('both plans stay open, and a link to Premium Pro lands on its card', async ({ page }) => {
  await fakeApi(page, {
    'GET /me': () => ({ body: { signedIn: false } }),
    'GET /plans': () => ({ body: ANONYMOUS_PLANS }),
  })

  await page.goto('/assinar?plano=pro')
  await expect(page.getByRole('button', { name: 'Ir para o pagamento' })).toHaveCount(2)
  await expect(page.getByRole('button', { name: 'Escolher' })).toHaveCount(0)
  const pro = page.locator('li.card', { has: page.getByRole('heading', { name: 'Premium Pro' }) })
  await expect(pro.getByText('ou R$ 549,90 no Pix à vista')).toBeVisible()
  await expect(pro.getByRole('heading', { name: 'Premium Pro' })).toBeInViewport()

  await pro.getByRole('checkbox').check()
  const premium = page.locator('li.card', {
    has: page.getByRole('heading', { name: 'Premium', exact: true }),
  })
  await expect(premium.getByRole('checkbox')).not.toBeChecked()
})

test('a refused checkout says why in words', async ({ page }) => {
  await fakeApi(page, {
    'GET /me': () => ({ body: { signedIn: false } }),
    'GET /plans': () => ({ body: ANONYMOUS_PLANS }),
    'POST /checkout': () => ({
      status: 409,
      body: { status: 409, error: 'Conflict', message: 'x', code: 'fitness.site.pro_unavailable' },
    }),
  })

  await page.goto('/assinar?plano=premium-anual')
  const yearly = page.locator('li.card', {
    has: page.getByRole('heading', { name: 'Premium', exact: true }),
  })
  await yearly.getByRole('radio', { name: /^Pix à vista/ }).check()
  await yearly.getByRole('checkbox').check()
  await yearly.getByRole('button', { name: 'Ir para o pagamento' }).click()
  await expect(yearly.getByRole('alert')).toHaveText('O Premium Pro não está à venda agora.')
})

test('with the API down the build prices show and the page asks to try again', async ({ page }) => {
  await page.route(`${API}/**`, (route) => route.abort('connectionrefused'))

  await page.goto('/assinar')
  await expect(page.getByRole('alert')).toContainText('Não conseguimos falar com o servidor')
  await expect(page.getByText('R$ 29,90').first()).toBeVisible()
})

test('back from the payment, an anonymous purchase activates on WhatsApp and signs the browser in', async ({
  page,
}, info) => {
  const calls = await fakeApi(page, {
    'GET /purchase': (_, count) =>
      count < 2
        ? {
            body: {
              plan: 'premium',
              cycle: 'monthly',
              method: 'card',
              status: 'paid',
              owned: false,
              code: 'ATV-7KQ2MXPD',
              message: 'Ativar minha assinatura: ATV-7KQ2MXPD',
              link: 'https://wa.me/5511926169724?text=Ativar%20minha%20assinatura%3A%20ATV-7KQ2MXPD',
            },
          }
        : {
            body: {
              plan: 'premium',
              cycle: 'monthly',
              method: 'card',
              status: 'activated',
              owned: false,
              activatedAt: new Date().toISOString(),
              signInUntil: new Date(Date.now() + 30 * 60_000).toISOString(),
            },
          },
    'POST /purchase/session': () => ({
      body: { signedIn: true, scope: 'account', expiresAt: '2026-12-21T12:00:00.000Z' },
    }),
    'GET /me': () => ({ body: { ...ME_PURCHASE, scope: 'account' } }),
  })

  await page.goto('/assinar/pronto')
  await expect(page.getByText('Pagamento confirmado. Falta ativar.')).toBeVisible()
  await expect(page.getByText('Ativar minha assinatura: ATV-7KQ2MXPD')).toBeVisible()
  const open = page.getByRole('link', { name: /Abrir o WhatsApp/ })
  await expect(open).toHaveAttribute('href', /^https:\/\/wa\.me\/5511926169724\?text=Ativar/)
  if (info.project.name === 'desktop') {
    await expect(page.getByRole('img', { name: /QR code/ })).toBeVisible()
  }

  await expect(page.getByText('Assinatura ativada.')).toBeVisible({ timeout: 8000 })
  await expect(page.getByText(/entrou no site com o número \+55 11 9\*\*\*\*-4321/)).toBeVisible()
  expect(calls.filter((call) => call.path.endsWith('/purchase/session'))).toHaveLength(1)
})

test('a purchase that stops answering while waiting says so and can be asked again', async ({
  page,
}) => {
  await fakeApi(page, {
    'GET /purchase': (_, count) =>
      count === 2
        ? {
            status: 409,
            body: { status: 409, code: 'fitness.site.purchase_unknown', message: 'x' },
          }
        : { body: { plan: 'premium', cycle: 'monthly', method: 'pix', status: 'waiting' } },
  })

  await page.goto('/assinar/pronto')
  await expect(page.getByText('Esperando o pagamento.')).toBeVisible()
  await expect(page.getByRole('alert')).toHaveText(/Não achamos uma compra/, { timeout: 8000 })

  await page.getByRole('button', { name: 'Tentar de novo' }).click()
  await expect(page.getByText('Esperando o pagamento.')).toBeVisible()
})

test('signing in with WhatsApp shows the code, waits for it and enters', async ({ page }, info) => {
  const calls = await fakeApi(page, {
    'GET /me': (_, count) =>
      count === 1
        ? { body: { signedIn: false } }
        : {
            body: {
              ...ME_PURCHASE,
              scope: 'account',
              access: {
                standing: 'subscriber',
                plan: 'premium',
                until: '2026-12-21T03:00:00.000Z',
              },
            },
          },
    'POST /login': () => ({
      status: 201,
      body: {
        code: 'WEB-7KQ2MX',
        message: 'Entrar no site: WEB-7KQ2MX',
        link: 'https://wa.me/5511926169724?text=Entrar%20no%20site%3A%20WEB-7KQ2MX',
        expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
      },
    }),
    'GET /login': (_, count) => ({ body: { status: count < 2 ? 'pending' : 'confirmed' } }),
    'POST /login/session': () => ({
      body: { signedIn: true, scope: 'account', expiresAt: '2026-12-21T12:00:00.000Z' },
    }),
    'POST /logout': () => ({ status: 204 }),
  })

  await page.goto('/entrar')
  await expect(page.getByText('Entrar no site: WEB-7KQ2MX')).toBeVisible()
  if (info.project.name === 'desktop') {
    await expect(page.getByRole('img', { name: /QR code/ })).toBeVisible()
  }
  expect(
    calls.find((call) => call.path.endsWith('/login') && call.method === 'POST')?.body,
  ).toEqual({ locale: 'pt-BR' })

  await expect(page.getByRole('heading', { name: 'Você entrou.' })).toBeVisible({ timeout: 8000 })
  await expect(page.getByText('Premium até 21/12/2026.')).toBeVisible()
  await page.getByRole('button', { name: 'Sair' }).click()
  await expect(page.getByText('Você saiu deste navegador.')).toBeVisible()
})

test('a sign-in that never hears back says so and can ask again', async ({ page }) => {
  await page.clock.install()
  await fakeApi(page, {
    'GET /me': () => ({ body: { signedIn: false } }),
    'POST /login': () => ({
      status: 201,
      body: {
        code: 'WEB-7KQ2MX',
        message: 'Entrar no site: WEB-7KQ2MX',
        link: 'https://wa.me/5511926169724?text=Entrar%20no%20site%3A%20WEB-7KQ2MX',
        expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
      },
    }),
    'GET /login': () => ({ status: 503, body: { code: 'unavailable' } }),
  })

  await page.goto('/entrar')
  await expect(page.getByText('Esperando a sua mensagem')).toBeVisible()
  await page.clock.fastForward('21:00')

  await expect(page.getByText('A resposta ainda não chegou. Atualize daqui a pouco.')).toBeVisible()
  await page.getByRole('button', { name: 'Atualizar' }).click()
  await expect(page.getByText('Esperando a sua mensagem')).toBeVisible()
})

test('signing in from the purchase page goes back to it with the plan', async ({ page }) => {
  await fakeApi(page, {
    'GET /me': () => ({ body: { ...ME_PURCHASE, scope: 'account' } }),
    'GET /plans': () => ({ body: { ...LINK_PLANS, buyer: 'account' } }),
  })

  await page.goto('/entrar?voltar=assinar&plano=pro')

  await expect(page).toHaveURL(/\/assinar\?plano=pro$/)
  await expect(page.getByText('Você entrou como +55 11 9****-4321')).toBeVisible()
})

test('the activation link of the e-mail opens the purchase by its code', async ({ page }) => {
  const calls = await fakeApi(page, {
    'POST /purchase/open': () => ({ body: { opened: true } }),
    'GET /purchase': () => ({
      body: { plan: 'premium', cycle: 'yearly', method: 'card', status: 'activated', owned: false },
    }),
  })

  await page.goto('/assinar/ativar#a=ATV-7KQ2MXPD')

  await expect(page).toHaveURL(/\/assinar\/pronto$/)
  await expect(page.getByText('Assinatura ativada.')).toBeVisible()
  expect(calls.find((call) => call.path.endsWith('/purchase/open'))?.body).toEqual({
    code: 'ATV-7KQ2MXPD',
  })
})

test('the English pages speak English', async ({ page }) => {
  await fakeApi(page, {
    'GET /me': () => ({ body: { signedIn: false } }),
    'GET /plans': () => ({ body: ANONYMOUS_PLANS }),
  })

  await page.goto('/en/subscribe')
  await expect(page.locator('h1')).toHaveText('Pick your plan.')
  await expect(page.getByRole('link', { name: 'Sign in with WhatsApp' }).first()).toBeVisible()
})

test('the plans page sends each plan to the purchase page', async ({ page }) => {
  await page.goto('/planos')
  await expect(
    page.locator('#premium').getByRole('link', { name: 'Assinar agora' }),
  ).toHaveAttribute('href', '/assinar?plano=premium-anual')
})
