import { BLACK_FRIDAY, blackFridayOn, struckCents } from '#shared/promo'

/** Judged at build time and again in the browser, so a page built before 30/11 drops the offer on 1/12. */
export const useBlackFriday = () => {
  const now = ref(new Date())
  onMounted(() => {
    now.value = new Date()
  })
  return {
    on: computed(() => blackFridayOn(now.value)),
    yearlyFrom: (priceCents: number) =>
      struckCents(BLACK_FRIDAY.yearlyFromCents, priceCents, now.value),
    coachingFrom: (priceCents: number) =>
      struckCents(BLACK_FRIDAY.coachingFromCents, priceCents, now.value),
  }
}
