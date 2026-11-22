import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { startPolling } from './poller'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('startPolling', () => {
  it('asks at once, then every interval until the answer settles', async () => {
    const answers: ('again' | 'done')[] = ['again', 'again', 'done']
    const tick = vi.fn(async () => answers.shift()!)

    const poller = startPolling({ tick, everyMs: 2000, forMs: 60_000 })
    await vi.advanceTimersByTimeAsync(0)
    expect(tick).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(2000)
    expect(tick).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(2000)
    expect(tick).toHaveBeenCalledTimes(3)
    expect(poller.running).toBe(false)

    await vi.advanceTimersByTimeAsync(10_000)
    expect(tick).toHaveBeenCalledTimes(3)
  })

  it('gives up after its time and says so', async () => {
    const onTimeout = vi.fn()
    const tick = vi.fn(async () => 'again' as const)

    const poller = startPolling({ tick, everyMs: 3000, forMs: 9000, onTimeout })
    await vi.advanceTimersByTimeAsync(20_000)

    expect(tick).toHaveBeenCalledTimes(4)
    expect(onTimeout).toHaveBeenCalledOnce()
    expect(poller.running).toBe(false)
  })

  it('never asks twice at the same time, even when asked again by hand', async () => {
    let release: (value: 'again' | 'done') => void = () => {}
    const tick = vi.fn(
      () =>
        new Promise<'again' | 'done'>((resolve) => {
          release = resolve
        }),
    )

    const poller = startPolling({ tick, everyMs: 2000, forMs: 60_000 })
    poller.now()
    poller.now()
    await vi.advanceTimersByTimeAsync(5000)
    expect(tick).toHaveBeenCalledTimes(1)

    release('again')
    await vi.advanceTimersByTimeAsync(0)
    poller.now()
    await vi.advanceTimersByTimeAsync(0)
    expect(tick).toHaveBeenCalledTimes(2)
    poller.stop()
  })

  it('keeps asking after a failed question', async () => {
    const tick = vi
      .fn<() => Promise<'again' | 'done'>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce('done')

    startPolling({ tick, everyMs: 1000, forMs: 60_000 })
    await vi.advanceTimersByTimeAsync(1000)

    expect(tick).toHaveBeenCalledTimes(2)
  })

  it('stops for good when the page leaves', async () => {
    const tick = vi.fn(async () => 'again' as const)

    const poller = startPolling({ tick, everyMs: 1000, forMs: 60_000 })
    await vi.advanceTimersByTimeAsync(0)
    poller.stop()
    await vi.advanceTimersByTimeAsync(10_000)

    expect(tick).toHaveBeenCalledTimes(1)
  })
})
