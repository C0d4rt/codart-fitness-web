import { type Poller, startPolling } from '#shared/poller'

/** One poller per page, stopped when the page goes, and asked again when the tab comes back. */
export const usePolling = () => {
  let poller: Poller | undefined
  const timedOut = ref(false)

  const onVisible = () => {
    if (document.visibilityState === 'visible') poller?.now()
  }

  onMounted(() => document.addEventListener('visibilitychange', onVisible))
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisible)
    poller?.stop()
  })

  return {
    timedOut: readonly(timedOut),
    start: (options: Omit<Parameters<typeof startPolling>[0], 'onTimeout' | 'clock'>) => {
      poller?.stop()
      timedOut.value = false
      poller = startPolling({
        ...options,
        onTimeout: () => {
          timedOut.value = true
        },
      })
    },
    stop: () => poller?.stop(),
  }
}
