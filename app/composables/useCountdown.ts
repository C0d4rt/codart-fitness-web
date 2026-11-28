const DAY = 86_400_000
const HOUR = 3_600_000
const MINUTE = 60_000

/** The time left until `endsAt`, ticking each second in the browser; undefined while prerendered. */
export const useCountdown = (endsAt: MaybeRefOrGetter<string>) => {
  const now = ref<number>()
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    const tick = () => (now.value = Date.now())
    tick()
    timer = setInterval(tick, 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))
  return computed(() => {
    if (now.value === undefined) return undefined
    const left = Math.max(0, Date.parse(toValue(endsAt)) - now.value)
    return {
      days: Math.floor(left / DAY),
      hours: Math.floor((left % DAY) / HOUR),
      minutes: Math.floor((left % HOUR) / MINUTE),
      seconds: Math.floor((left % MINUTE) / 1000),
    }
  })
}
