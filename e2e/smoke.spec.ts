import { expect, test } from '@playwright/test'

test('the home page says what this is', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})
