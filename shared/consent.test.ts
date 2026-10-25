import { describe, expect, it } from 'vitest'

import { CONSENT_KEY, readConsent, writeConsent } from './consent'

const memory = () => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  }
}

const throwing = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
}

describe('consent', () => {
  it('has no choice until the visitor makes one', () => {
    expect(readConsent(memory())).toBeUndefined()
  })

  it('remembers the choice', () => {
    const storage = memory()
    writeConsent(storage, 'granted')
    expect(readConsent(storage)).toBe('granted')
    writeConsent(storage, 'denied')
    expect(readConsent(storage)).toBe('denied')
  })

  it('ignores anything else stored under its key', () => {
    const storage = memory()
    storage.setItem(CONSENT_KEY, 'yes')
    expect(readConsent(storage)).toBeUndefined()
  })

  it('treats blocked or missing storage as no choice, without throwing', () => {
    expect(readConsent(throwing)).toBeUndefined()
    expect(() => writeConsent(throwing, 'granted')).not.toThrow()
    expect(readConsent(undefined)).toBeUndefined()
  })
})
