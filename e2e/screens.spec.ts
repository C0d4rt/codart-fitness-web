import { test } from '@playwright/test'

test.use({ colorScheme: 'light' })

const SCREENS = {
  '/': ['hero', 'como-funciona', 'o-que-volta', 'do-seu-jeito', 'premium', 'perguntas'],
  '/planos': ['premium'],
  '/recursos': ['photos'],
}

for (const [path, anchors] of Object.entries(SCREENS)) {
  test(`screens of ${path}`, async ({ page }, info) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const name = path === '/' ? 'home' : path.slice(1)
    for (const anchor of anchors) {
      if (anchor !== 'hero') {
        await page.locator(`#${anchor}`).scrollIntoViewIfNeeded()
        await page.waitForTimeout(900)
      }
      await page.screenshot({
        path: `test-results/screens/${info.project.name}-${name}-${anchor}.png`,
      })
    }
  })
}
