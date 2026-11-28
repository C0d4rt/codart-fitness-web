import type { Nuxt } from 'nuxt/schema'
import { describe, expect, it } from 'vitest'

import { releaseConfigProblems, requireReleaseConfig } from './releaseConfig'

const PLANS_API_URL = 'https://api.example.test/fitness/plans'

const fakeNuxt = (options: { dev: boolean; _prepare: boolean }) => {
  const hooks: Record<string, () => void> = {}
  const nuxt = {
    options,
    hook: (name: string, run: () => void) => {
      hooks[name] = run
    },
  } as unknown as Nuxt
  return { nuxt, hooks }
}

describe('releaseConfigProblems', () => {
  it('accepts a real build with the number in digits', () => {
    expect(
      releaseConfigProblems({ PLANS_API_URL, NUXT_PUBLIC_WHATSAPP_NUMBER: '5511999999999' }),
    ).toEqual([])
  })

  it('refuses a real build with an empty or malformed number', () => {
    for (const number of [undefined, '', '+5511999999999', '55 11 99999 9999', '1234567']) {
      expect(
        releaseConfigProblems({ PLANS_API_URL, NUXT_PUBLIC_WHATSAPP_NUMBER: number }),
      ).toHaveLength(1)
    }
  })

  it('leaves a fixture build alone', () => {
    expect(releaseConfigProblems({ PLANS_FIXTURE: '1' })).toEqual([])
  })
})

describe('requireReleaseConfig', () => {
  it('stops a real build without the number', () => {
    const { nuxt, hooks } = fakeNuxt({ dev: false, _prepare: false })
    requireReleaseConfig({}, nuxt)
    const saved = { ...process.env }
    process.env.PLANS_API_URL = PLANS_API_URL
    delete process.env.NUXT_PUBLIC_WHATSAPP_NUMBER
    try {
      expect(() => hooks['build:before']!()).toThrow('NUXT_PUBLIC_WHATSAPP_NUMBER')
    } finally {
      process.env = saved
    }
  })

  it('leaves dev and prepare alone', () => {
    for (const options of [
      { dev: true, _prepare: false },
      { dev: false, _prepare: true },
    ]) {
      const { nuxt, hooks } = fakeNuxt(options)
      requireReleaseConfig({}, nuxt)
      expect(hooks).toEqual({})
    }
  })
})
