import { describe, expect, it } from 'vitest'

import ptBR from '../i18n/locales/pt-BR.json' with { type: 'json' }

const leaves = (value: unknown, path = ''): [string, unknown][] =>
  value !== null && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) => leaves(child, path ? `${path}.${key}` : key))
    : [[path, value]]

describe.each([['pt-BR', ptBR]])('the %s locale', (_, messages) => {
  it('has no empty text', () => {
    const empty = leaves(messages).filter(
      ([, value]) => typeof value !== 'string' || value.trim() === '',
    )
    expect(empty).toEqual([])
  })

  it('has no em or en dash', () => {
    const dashed = leaves(messages).filter(([, value]) => /[–—]/.test(String(value)))
    expect(dashed).toEqual([])
  })
})
