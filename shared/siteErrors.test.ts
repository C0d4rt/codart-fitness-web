import { describe, expect, it } from 'vitest'

import enUS from '../i18n/locales/en-US.json' with { type: 'json' }
import ptBR from '../i18n/locales/pt-BR.json' with { type: 'json' }

import { API_ERROR_CODES, SITE_ERROR_CODES, siteErrorOf } from './siteErrors'

describe('the site error codes', () => {
  it.each(API_ERROR_CODES)('reads fitness.site.%s from the body', (code) => {
    expect(siteErrorOf(409, { code: `fitness.site.${code}` })).toBe(code)
  })

  it('falls back on the status for a code it does not know', () => {
    expect(siteErrorOf(409, { code: 'fitness.site.something_new' })).toBe('unknown')
    expect(siteErrorOf(429, undefined)).toBe('rate_limited')
    expect(siteErrorOf(404, { code: 'not_found' })).toBe('unavailable')
    expect(siteErrorOf(503, null)).toBe('unavailable')
    expect(siteErrorOf(400, { code: 'validation' })).toBe('bad_request')
  })

  it.each([
    ['pt-BR', ptBR],
    ['en-US', enUS],
  ])('has a clear sentence for every code in %s', (_, messages) => {
    const errors = messages.site.errors as Record<string, string>
    expect(SITE_ERROR_CODES.filter((code) => !errors[code]?.trim())).toEqual([])
    expect(Object.keys(errors).sort()).toEqual([...SITE_ERROR_CODES].sort())
  })
})
