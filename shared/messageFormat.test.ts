import { describe, expect, it } from 'vitest'

import { icuMessage } from './messageFormat'

describe('icuMessage', () => {
  const days = '{days, plural, one {# dia} other {# dias}} grátis'

  it('picks the plural form of the locale', () => {
    expect(icuMessage(days, 'pt-BR')({ days: 1 })).toBe('1 dia grátis')
    expect(icuMessage(days, 'pt-BR')({ days: 7 })).toBe('7 dias grátis')
  })

  it('keeps an at sign as text', () => {
    expect(icuMessage('Escreva para oi@exemplo.com', 'pt-BR')({})).toBe(
      'Escreva para oi@exemplo.com',
    )
  })
})
