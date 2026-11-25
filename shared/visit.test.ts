import { describe, expect, it } from 'vitest'

import { siteEntryLink, visitOf } from './visit'

const API = 'https://api.fitness.codart.dev'

describe('visitOf', () => {
  it('keeps the UTMs and click ids of the landing page, and nothing else', () => {
    expect(
      visitOf('/planos', { utm_source: 'instagram', fbclid: 'IwAR2', ref: 'x', utm_term: ' ' }),
    ).toEqual({ landing: '/planos', params: { utm_source: 'instagram', fbclid: 'IwAR2' } })
  })

  it('reads a repeated parameter once', () => {
    expect(visitOf('/', { utm_campaign: ['bf', 'other'] }).params).toEqual({ utm_campaign: 'bf' })
  })
})

describe('siteEntryLink', () => {
  const visit = visitOf('/', {
    utm_source: 'partner',
    utm_campaign: 'bf',
    fbclid: 'IwAR2',
    gclid: 'Cj0',
  })

  it('sends the click ids with consent', () => {
    const url = new URL(siteEntryLink(API, visit, { consent: true, lang: 'pt' }))
    expect(url.origin + url.pathname).toBe(`${API}/fitness/go`)
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: 'partner',
      utm_campaign: 'bf',
      fbclid: 'IwAR2',
      gclid: 'Cj0',
      landing: '/',
      consent: '1',
      lang: 'pt',
    })
  })

  it('keeps the click ids in the browser without consent', () => {
    const url = new URL(siteEntryLink(`${API}/`, visit, { consent: false, lang: 'en' }))
    expect(url.searchParams.has('fbclid')).toBe(false)
    expect(url.searchParams.has('gclid')).toBe(false)
    expect(url.searchParams.get('utm_source')).toBe('partner')
    expect(url.searchParams.get('consent')).toBe('0')
  })
})
