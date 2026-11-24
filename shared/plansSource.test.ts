import { describe, expect, it } from 'vitest'

import { PlansSourceMissing, plansSourceOf } from './plansSource'

describe('where the build reads the plans', () => {
  it('asks codart-messaging whenever the URL is set', () => {
    expect(plansSourceOf({ PLANS_API_URL: 'https://api.example.test/fitness/plans' })).toEqual({
      url: 'https://api.example.test/fitness/plans',
    })
    expect(
      plansSourceOf({
        PLANS_API_URL: 'https://api.example.test/fitness/plans',
        PLANS_FIXTURE: '1',
      }),
    ).toEqual({ url: 'https://api.example.test/fitness/plans' })
  })

  it('uses the fixture only when asked for by name', () => {
    expect(plansSourceOf({ PLANS_FIXTURE: '1' })).toBe('fixture')
  })

  it('refuses to build without the URL or the flag', () => {
    expect(() => plansSourceOf({})).toThrow(PlansSourceMissing)
    expect(() => plansSourceOf({ PLANS_API_URL: '', PLANS_FIXTURE: 'true' })).toThrow(
      PlansSourceMissing,
    )
  })
})
