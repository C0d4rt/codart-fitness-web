import { describe, expect, it } from 'vitest'

import { msUntilBoundary } from './clock'

const at = (iso: string) => Date.parse(iso)

describe('msUntilBoundary', () => {
  it('waits until the first boundary still ahead', () => {
    expect(
      msUntilBoundary(
        ['2026-12-01T00:00:00-03:00', '2026-11-30T23:00:00-03:00'],
        at('2026-11-30T22:59:00-03:00'),
      ),
    ).toBe(60_000)
  })

  it('skips the boundaries already behind', () => {
    expect(
      msUntilBoundary(
        ['2026-11-30T23:00:00-03:00', '2026-12-01T00:00:00-03:00'],
        at('2026-11-30T23:30:00-03:00'),
      ),
    ).toBe(30 * 60_000)
  })

  it('waits for nothing once every boundary is behind, or at it', () => {
    expect(msUntilBoundary(['2026-12-01T00:00:00-03:00'], at('2026-12-01T00:00:00-03:00'))).toBe(
      undefined,
    )
    expect(msUntilBoundary([], at('2026-12-01T00:00:00-03:00'))).toBeUndefined()
  })

  it('never asks a timer for longer than it holds', () => {
    expect(msUntilBoundary(['2027-06-01T00:00:00-03:00'], at('2026-11-27T12:00:00-03:00'))).toBe(
      2 ** 31 - 1,
    )
  })
})
