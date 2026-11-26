import { blackFridayOn } from '#shared/promo'

/** Judged at build time and again in the browser, so a page built before 30/11 drops the label on 1/12. */
export const useBlackFriday = () => {
  const now = useNow()
  return computed(() => blackFridayOn(now.value))
}
