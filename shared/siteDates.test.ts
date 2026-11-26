import { describe, expect, it } from 'vitest'

import { changeDay } from './siteDates'

describe('changeDay', () => {
  it('writes the first of the month as an ordinal in Portuguese', () => {
    expect(changeDay('2026-12-01T00:00:00-03:00', 'pt')).toBe('1º/12')
  })

  it('writes any other day plainly', () => {
    expect(changeDay('2027-01-15T00:00:00-03:00', 'pt')).toBe('15/1')
  })

  it('writes the month by name in English', () => {
    expect(changeDay('2026-12-01T00:00:00-03:00', 'en')).toBe('Dec 1')
  })

  it('reads the day in Brasília, not in UTC', () => {
    expect(changeDay('2026-12-01T02:00:00Z', 'pt')).toBe('30/11')
  })
})
