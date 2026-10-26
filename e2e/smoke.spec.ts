import { expect, test } from '@playwright/test'

import fixture from '../shared/plans.fixture.json' with { type: 'json' }

test.use({ colorScheme: 'light' })

test('the home page says what this is and opens the conversation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('assistente de saúde')
  const cta = page.getByRole('link', { name: 'Testar 7 dias grátis' }).first()
  await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\/.*\?text=Oi!/)
  await expect(page.getByText('R$ 29,90').first()).toBeVisible()
})

test('the plans page has an anchor for each plan and for each feature', async ({ page }) => {
  await page.goto('/planos#photos')
  await expect(page.locator('#premium')).toHaveCount(1)
  await expect(page.locator('#basic')).toHaveCount(1)
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

for (const path of ['/', '/planos']) {
  test(`screenshot of ${path}`, async ({ page }, info) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const name = path === '/' ? 'home' : path.slice(1)
    await page.screenshot({
      path: `test-results/screens/${info.project.name}-${name}.png`,
      fullPage: true,
    })
  })
}
