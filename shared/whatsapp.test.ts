import { describe, expect, it } from 'vitest'

import { whatsAppLink } from './whatsapp'

describe('whatsAppLink', () => {
  it('opens the conversation with the message already written', () => {
    expect(whatsAppLink('+55 (11) 99765-8329', 'Oi! Quero testar')).toBe(
      'https://wa.me/5511997658329?text=Oi!%20Quero%20testar',
    )
  })

  it('still opens WhatsApp with the text while the number is not configured', () => {
    expect(whatsAppLink('', 'Oi')).toBe('https://wa.me/?text=Oi')
  })

  it('encodes what would break the query', () => {
    expect(whatsAppLink('5511', 'a&b=c')).toBe('https://wa.me/5511?text=a%26b%3Dc')
  })
})
