import { describe, expect, it } from 'vitest'

import { LOCALES } from '../shared/locale'
import { brand } from './brand'

describe('brand', () => {
  it('serves the site from an https origin without a trailing slash', () => {
    const url = new URL(brand.siteUrl)
    expect(url.protocol).toBe('https:')
    expect(brand.siteUrl.endsWith('/')).toBe(false)
  })

  it.each(LOCALES)(
    'greets in %s without dashes, which read as machine text in a chat',
    (locale) => {
      expect(brand.greeting[locale](7)).not.toMatch(/[–—]/)
      expect(brand.greeting[locale]()).not.toMatch(/[–—]/)
      expect(brand.tagline[locale]).not.toMatch(/[–—]/)
    },
  )

  it('names the trial length only when it is known', () => {
    expect(brand.greeting.pt(7)).toContain('7 dias grátis')
    expect(brand.greeting.en(7)).toContain('free for 7 days')
    for (const locale of LOCALES) {
      expect(brand.greeting[locale]()).not.toMatch(/\d/)
    }
  })

  it('opens an English chat with an English first message, so the app answers in English', () => {
    expect(brand.greeting.en(7)).toMatch(/^Hi! I want to try/)
  })
})
