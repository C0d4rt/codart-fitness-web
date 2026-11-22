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

export type Poller = {
  /** Asks again right away, as when the person comes back from WhatsApp to the tab. */
  now: () => void
  stop: () => void
  readonly running: boolean
}

/**
 * Asks once, then every `everyMs` while `tick` answers `'again'`, never two questions at a time,
 * and gives up after `forMs` with `onTimeout`.
 */
export const startPolling = ({
  tick,
  everyMs,
  forMs,
  onTimeout,
  clock = systemClock,
}: {
  tick: () => Promise<'again' | 'done'>
  everyMs: number
  forMs: number
  onTimeout?: () => void
  clock?: Clock
}): Poller => {
  const until = clock.now() + forMs
  let running = true
  let busy = false
  let timer: unknown

  const schedule = () => {
    if (!running) return
    if (clock.now() >= until) {
      running = false
      onTimeout?.()
      return
    }
    timer = clock.setTimeout(run, everyMs)
  }

  const run = async () => {
    if (!running || busy) return
    clock.clearTimeout(timer)
    busy = true
    const next = await tick().catch(() => 'again' as const)
    busy = false
    if (next === 'done') {
      running = false
      return
    }
    schedule()
  }

  void run()

  return {
    now: () => void run(),
    stop: () => {
      running = false
      clock.clearTimeout(timer)
    },
    get running() {
      return running
    },
  }
}
