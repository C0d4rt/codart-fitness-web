import { describe, expect, it } from 'vitest'

import { FRAGMENT_GLOBAL, FRAGMENT_SCRIPT, showsCode, takeFragment } from './fragment'

const runAt = (url: string) => {
  const address = new URL(url)
  const replaced: string[] = []
  const scope: Record<string, unknown> = {}
  const location = {
    get hash() {
      return address.hash
    },
    get pathname() {
      return address.pathname
    },
    get search() {
      return address.search
    },
  }
  const history = {
    state: { position: 1 },
    replaceState: (_state: unknown, _title: string, next: string) => {
      replaced.push(next)
      address.hash = ''
    },
  }
  new Function('window', 'location', 'history', FRAGMENT_SCRIPT)(scope, location, history)
  return { scope, replaced, address }
}

describe('the head script for the fragment', () => {
  it('takes the WhatsApp token off /assinar and keeps it only in memory', () => {
    const { scope, replaced, address } = runAt(
      'https://fitness.codart.dev/assinar?plano=pro#c=abc_DEF-123',
    )

    expect(replaced).toEqual(['/assinar?plano=pro'])
    expect(address.hash).toBe('')
    expect(scope[FRAGMENT_GLOBAL]).toEqual({ key: 'c', value: 'abc_DEF-123' })
  })

  it('takes the activation code off /en/subscribe/activate', () => {
    const { scope, replaced } = runAt(
      'https://fitness.codart.dev/en/subscribe/activate#a=ATV-7KQ2MXPD',
    )

    expect(replaced).toEqual(['/en/subscribe/activate'])
    expect(scope[FRAGMENT_GLOBAL]).toEqual({ key: 'a', value: 'ATV-7KQ2MXPD' })
  })

  it('leaves the anchors of the other pages alone', () => {
    expect(runAt('https://fitness.codart.dev/recursos#photos').replaced).toEqual([])
    expect(runAt('https://fitness.codart.dev/#c=x').replaced).toEqual([])
    expect(runAt('https://fitness.codart.dev/assinar#premium').replaced).toEqual([])
  })

  it('hands the value to the page once', () => {
    const scope: Record<string, unknown> = { [FRAGMENT_GLOBAL]: { key: 'c', value: 'abc' } }

    expect(takeFragment(scope, 'a')).toBeUndefined()
    expect(takeFragment(scope, 'c')).toBe('abc')
    expect(takeFragment(scope, 'c')).toBeUndefined()
  })
})

describe('the pages without analytics', () => {
  it('are the ones that show a code, in both languages', () => {
    for (const path of [
      '/entrar',
      '/assinar/pronto',
      '/assinar/ativar/',
      '/en/sign-in',
      '/en/subscribe/done',
      '/en/subscribe/activate',
    ]) {
      expect(showsCode(path), path).toBe(true)
    }
    for (const path of ['/', '/assinar', '/en/subscribe', '/planos']) {
      expect(showsCode(path), path).toBe(false)
    }
  })
})
