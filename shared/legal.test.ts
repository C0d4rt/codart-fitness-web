import { describe, expect, it } from 'vitest'

import { LEGAL, LEGAL_EFFECTIVE, LEGAL_VERSION } from './legal'

const textsOf = (doc: (typeof LEGAL)['pt']['terms']): string[] => [
  doc.intro,
  ...doc.sections.flatMap((section) => [
    section.title,
    ...(section.paragraphs ?? []),
    ...(section.items ?? []),
  ]),
]

describe('the legal texts (PRP-040)', () => {
  it.each(['terms', 'privacy'] as const)(
    'says the %s in both languages, section for section',
    (doc) => {
      const pt = LEGAL.pt[doc].sections
      const en = LEGAL.en[doc].sections

      expect(en.map((section) => section.items?.length ?? 0)).toEqual(
        pt.map((section) => section.items?.length ?? 0),
      )
      expect(en.map((section) => section.paragraphs?.length ?? 0)).toEqual(
        pt.map((section) => section.paragraphs?.length ?? 0),
      )
    },
  )

  it.each(['pt', 'en'] as const)('has no dash and no empty text in %s', (locale) => {
    const texts = [...textsOf(LEGAL[locale].terms), ...textsOf(LEGAL[locale].privacy)]

    expect(texts.filter((text) => /[—–]/.test(text))).toEqual([])
    expect(texts.filter((text) => text.trim() === '')).toEqual([])
  })

  it('carries the version the app asks to accept', () => {
    expect(LEGAL_VERSION).toBe('2')
    expect(LEGAL_EFFECTIVE).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('gives each language its own mailbox for privacy', () => {
    expect(LEGAL.pt.privacy.intro).toContain('privacidade@codart.dev')
    expect(LEGAL.en.privacy.intro).toContain('privacy@codart.dev')
  })
})
