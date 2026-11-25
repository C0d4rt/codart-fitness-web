import { describe, expect, it } from 'vitest'

import { LOCALES } from '../shared/locale'
import { brand } from './brand'

describe('brand', () => {
  it('serves the site from an https origin without a trailing slash', () => {
    const url = new URL(brand.siteUrl)
    expect(url.protocol).toBe('https:')
    expect(brand.siteUrl.endsWith('/')).toBe(false)
  })

  it.each(LOCALES)('writes the %s tagline without dashes', (locale) => {
    expect(brand.tagline[locale]).not.toMatch(/[–—]/)
  })
})
