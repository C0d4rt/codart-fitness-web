import { describe, expect, it } from 'vitest'

import { formatChat } from './formatChat'

describe('formatChat', () => {
  it('draws bold, italic and line breaks the way WhatsApp does', () => {
    expect(formatChat('*Almoço*\n_Sugestão geral._')).toBe(
      '<strong>Almoço</strong><br><em>Sugestão geral.</em>',
    )
  })

  it('escapes markup before formatting', () => {
    expect(formatChat('<img src=x onerror=alert(1)> *ok*')).toBe(
      '&lt;img src=x onerror=alert(1)&gt; <strong>ok</strong>',
    )
  })

  it('leaves an underscore inside a word alone', () => {
    expect(formatChat('arquivo_final.csv')).toBe('arquivo_final.csv')
  })
})
