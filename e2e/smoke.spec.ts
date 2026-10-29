import { expect, test } from '@playwright/test'

import fixture from '../shared/plans.fixture.json' with { type: 'json' }

test.use({ colorScheme: 'light' })

test('the home page says what this is and opens the conversation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Dieta e treino no WhatsApp')
  const cta = page.getByRole('link', { name: 'Testar 7 dias grátis' }).first()
  await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\/.*\?text=Oi!/)
  await expect(page.getByText('R$ 29,90').first()).toBeVisible()
})

test('the plans page has an anchor for each plan', async ({ page }) => {
  await page.goto('/planos')
  await expect(page.locator('#premium')).toHaveCount(1)
  await expect(page.locator('#basic')).toHaveCount(1)
  await expect(page.getByText('R$ 29,90').first()).toBeVisible()
})

test('the features page has an anchor for each feature', async ({ page }) => {
  await page.goto('/recursos#photos')
  await expect(page.locator('#photos')).toBeInViewport()
  await expect(page.locator('article[id]')).toHaveCount(fixture.features.length)
})

test('no third party script loads before consent', async ({ page }) => {
  const thirdParty: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.hostname !== 'localhost') thirdParty.push(url.hostname)
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(thirdParty).toEqual([])
})

test('the showcase swaps the answer the visitor picks', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'A semana' }).click()
  await expect(
    page.locator('#o-que-volta').getByText('Resumo da semana', { exact: true }),
  ).toBeVisible()
})

test('the English home page speaks English and opens the chat in English', async ({ page }) => {
  await page.goto('/en')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
  await expect(page.locator('h1')).toContainText('Diet and workouts on WhatsApp')
  const cta = page.getByRole('link', { name: 'Try 7 days free' }).first()
  await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\/.*\?text=Hi!%20I%20want/)
  await expect(page.getByText('R$29.90').first()).toBeVisible()
  await page.getByRole('button', { name: 'The week' }).click()
  await expect(page.locator('#answers').getByText('Week summary', { exact: true })).toBeVisible()
})

test('the English plans page has the plans in English, with prices in reais', async ({ page }) => {
  await page.goto('/en/plans')
  await expect(page.locator('#premium')).toHaveCount(1)
  await expect(page.locator('#basic h3')).toHaveText('Basic')
  await expect(page.getByText('R$29.90').first()).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://fitness.codart.dev/en/plans',
  )
})

test('the footer switches to the same page in the other language', async ({ page }) => {
  await page.goto('/planos')
  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/plans$/)
  await expect(page.locator('h1')).toHaveText('Plans')
  await page.getByRole('link', { name: 'Português' }).click()
  await expect(page).toHaveURL(/\/planos$/)
  await expect(page.locator('h1')).toHaveText('Planos')
})

for (const path of ['/', '/planos', '/recursos', '/contato', '/en', '/en/plans']) {
  test(`screenshot of ${path}`, async ({ page }, info) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const name = path === '/' ? 'home' : path.slice(1).replace('/', '-')
    await page.screenshot({
      path: `test-results/screens/${info.project.name}-${name}.png`,
      fullPage: true,
    })
  })
}
