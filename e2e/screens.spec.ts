import { test } from '@playwright/test'

test.use({ colorScheme: 'light' })

const SCREENS = {
  '/': [
    'hero',
    'o-assistente',
    'como-funciona',
    'seus-numeros',
    'um-dia-normal',
    'tudo-o-que-faz',
    'premium',
    'perguntas',
  ],
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
