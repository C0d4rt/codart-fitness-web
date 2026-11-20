/** A link to the home page that, clicked while already on it, takes the visitor back to the top. */
export const useHomeLink = () => {
  const route = useRoute()
  const localePath = useLocalePath()
  const home = computed(() => localePath('/'))

  /* The router skips a link to the page it is on, so there is no navigation to scroll with. */
  const backToTop = () => {
    if (route.path !== home.value || route.hash) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: still ? 'instant' : 'smooth' })
  }

  return { backToTop }
}
