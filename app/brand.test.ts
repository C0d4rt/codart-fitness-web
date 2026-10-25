import { describe, expect, it } from 'vitest'

import { brand } from './brand'

describe('brand', () => {
  it('serves the site from an https origin without a trailing slash', () => {
    const url = new URL(brand.siteUrl)
    expect(url.protocol).toBe('https:')
    expect(brand.siteUrl.endsWith('/')).toBe(false)
  })

  it('greets without dashes, which read as machine text in a chat', () => {
    expect(brand.whatsappGreeting).not.toMatch(/[–—]/)
  })
})
