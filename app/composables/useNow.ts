import { msUntilBoundary } from '#shared/clock'

/**
 * The build time while the page hydrates, so it matches the prerendered HTML, then the visitor's
 * clock, read again at each of `boundaries`, so a page left open changes with them.
 */
export const useNow = (boundaries: MaybeRefOrGetter<readonly string[]> = []) => {
  const now = useState('now', () => Date.now())
  let timer: ReturnType<typeof setTimeout> | undefined
  const read = () => {
    clearTimeout(timer)
    now.value = Date.now()
    const wait = msUntilBoundary(toValue(boundaries), now.value)
    if (wait !== undefined) timer = setTimeout(read, wait)
  }
  // Timers stand still in the back-forward cache, so a page brought back reads the clock again.
  const onShow = (event: PageTransitionEvent) => {
    if (event.persisted) read()
  }
  onMounted(() => {
    read()
    window.addEventListener('pageshow', onShow)
  })
  onBeforeUnmount(() => {
    clearTimeout(timer)
    window.removeEventListener('pageshow', onShow)
  })
  return computed(() => new Date(now.value))
}
