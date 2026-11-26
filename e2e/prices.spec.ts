import { expect, type Page, test } from '@playwright/test'

test.use({ colorScheme: 'light' })

const BEFORE = new Date('2026-11-26T12:00:00-03:00')
const AFTER = new Date('2026-12-01T10:00:00-03:00')

const openPlans = async (page: Page, at: Date) => {
  await page.clock.setFixedTime(at)
  await page.goto('/planos')
}

test('before 1/12 each card strikes the price from 1/12 next to the Black Friday one', async ({
  page,
}, info) => {
  await openPlans(page, BEFORE)

  const offer = page.getByRole('note')
  await expect(offer.getByText('Black Friday', { exact: true })).toBeVisible()
  await expect(
    offer.getByText('Premium anual em 12x de R$ 19,90 ou R$ 219,90 no Pix à vista'),
  ).toBeVisible()
  await expect(
    offer.getByText('Premium Pro em 12x de R$ 49,90 ou R$ 549,90 no Pix à vista'),
  ).toBeVisible()

  const bar = page.locator('.promo-bar')
  await expect(
    bar.getByText(
      info.project.name === 'mobile'
        ? 'Anual em 12x de R$ 19,90'
        : 'Premium anual em 12x de R$ 19,90 ou R$ 219,90 no Pix',
      { exact: true },
    ),
  ).toBeVisible()

  const premium = page.locator('#premium')
  await expect(premium.getByText('Black Friday', { exact: true })).toBeVisible()
  await expect(premium.getByText('R$ 19,90').first()).toBeVisible()
  await expect(premium.locator('s')).toHaveText('R$ 29,90/mês')
  await expect(premium.getByText('R$ 29,90/mês', { exact: true })).toBeVisible()
  await expect(premium.getByText('Preço a partir de 1º/12: 12x de R$ 29,90')).toHaveCount(1)
  await expect(premium.getByText('sem juros, no cartão · total R$ 238,80')).toBeVisible()
  await expect(premium.getByText('ou R$ 219,90 no Pix à vista')).toBeVisible()
  await expect(premium.getByText('33% a menos', { exact: true })).toBeVisible()

  await premium.getByRole('button', { name: 'Mensal' }).click()
  await expect(premium.getByText('R$ 29,90').first()).toBeVisible()
  await expect(premium.locator('s')).toHaveText('R$ 39,90')
  await expect(premium.getByText('R$ 39,90', { exact: true })).toBeVisible()
  await expect(premium.getByText('Preço a partir de 1º/12: R$ 39,90 por mês')).toHaveCount(1)

  const coaching = page.locator('#coaching')
  await expect(coaching.getByText('R$ 49,90').first()).toBeVisible()
  await expect(coaching.locator('s')).toHaveText('R$ 59,90/mês')
  await expect(coaching.getByText('R$ 59,90/mês', { exact: true })).toBeVisible()
  await expect(coaching.getByText('Preço a partir de 1º/12: 12x de R$ 59,90')).toHaveCount(1)
  await expect(coaching.getByText('ou R$ 549,90 no Pix à vista')).toBeVisible()
})

test('from 1/12 the page built before shows the full prices, with no Black Friday and nothing struck', async ({
  page,
}) => {
  await openPlans(page, AFTER)

  const premium = page.locator('#premium')
  await expect(premium.getByText('R$ 29,90').first()).toBeVisible()
  await expect(premium.getByText('sem juros, no cartão · total R$ 358,80')).toBeVisible()
  await expect(premium.getByText('ou R$ 329,90 no Pix à vista')).toBeVisible()
  await expect(premium.getByText('25% a menos', { exact: true })).toBeVisible()

  const coaching = page.locator('#coaching')
  await expect(coaching.getByText('R$ 59,90').first()).toBeVisible()
  await expect(coaching.getByText('sem juros, no cartão · total R$ 718,80')).toBeVisible()
  await expect(coaching.getByText('ou R$ 649,90 no Pix à vista')).toBeVisible()

  await premium.getByRole('button', { name: 'Mensal' }).click()
  await expect(premium.getByText('R$ 39,90').first()).toBeVisible()
  await expect(premium.getByText(/por ano/)).toHaveCount(0)

  await expect(page.getByText('Black Friday')).toHaveCount(0)
  await expect(page.getByText(/a partir de 1º\/12/)).toHaveCount(0)
  await expect(page.locator('main s')).toHaveCount(0)
})

test('from 1/12 the purchase page shows the full prices until the API answers', async ({
  page,
}) => {
  await page.clock.setFixedTime(AFTER)
  await page.route('https://api.fitness.codart.dev/fitness/site/**', (route) =>
    route.abort('connectionrefused'),
  )
  await page.goto('/assinar?plano=premium-mensal')
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByText('R$ 39,90').first()).toBeVisible()
  await expect(page.getByText('R$ 59,90').first()).toBeVisible()
})
