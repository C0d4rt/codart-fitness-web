export type Clock = {
  now: () => number
  setTimeout: (run: () => void, ms: number) => unknown
  clearTimeout: (handle: unknown) => void
}

export const systemClock: Clock = {
  now: () => Date.now(),
  setTimeout: (run, ms) => globalThis.setTimeout(run, ms),
  clearTimeout: (handle) => globalThis.clearTimeout(handle as ReturnType<typeof setTimeout>),
}

/** `'slower'` is the API's rate limit: the next question waits twice as long, up to `maxEveryMs`. */
export type PollAnswer = 'again' | 'slower' | 'done'

export type Poller = {
  /** Asks again right away, as when the person comes back from WhatsApp to the tab. */
  now: () => void
  stop: () => void
  readonly running: boolean
}

/**
 * Asks once, then every `everyMs` while `tick` answers `'again'`, never two questions at a time,
 * and gives up after `forMs` with `onTimeout`. `stop` aborts the question in flight.
 */
export const startPolling = ({
  tick,
  everyMs,
  maxEveryMs = everyMs * 8,
  forMs,
  onTimeout,
  clock = systemClock,
}: {
  tick: (signal: AbortSignal) => Promise<PollAnswer>
  everyMs: number
  maxEveryMs?: number
  forMs: number
  onTimeout?: () => void
  clock?: Clock
}): Poller => {
  const until = clock.now() + forMs
  const aborter = new AbortController()
  let running = true
  let busy = false
  let timer: unknown
  let delay = everyMs

  const schedule = () => {
    if (!running) return
    if (clock.now() >= until) {
      running = false
      onTimeout?.()
      return
    }
    timer = clock.setTimeout(run, delay)
  }

  const run = async () => {
    if (!running || busy) return
    clock.clearTimeout(timer)
    busy = true
    const next = await tick(aborter.signal).catch(() => 'again' as const)
    busy = false
    if (next === 'done') {
      running = false
      return
    }
    delay = next === 'slower' ? Math.min(delay * 2, maxEveryMs) : everyMs
    schedule()
  }

  void run()

  return {
    now: () => void run(),
    stop: () => {
      running = false
      clock.clearTimeout(timer)
      aborter.abort()
    },
    get running() {
      return running
    },
  }
}
