import { describe, expect, it } from 'vitest'

import { brand } from './brand'

describe('brand', () => {
  it('serves the site from an https origin without a trailing slash', () => {
    const url = new URL(brand.siteUrl)
    expect(url.protocol).toBe('https:')
    expect(brand.siteUrl.endsWith('/')).toBe(false)
  })

  it('greets without dashes, which read as machine text in a chat', () => {
    expect(brand.greeting(7)).not.toMatch(/[–—]/)
    expect(brand.greeting()).not.toMatch(/[–—]/)
  })

  it('names the trial length only when it is known', () => {
    expect(brand.greeting(7)).toContain('7 dias grátis')
    expect(brand.greeting()).not.toMatch(/\d/)
  })
})
