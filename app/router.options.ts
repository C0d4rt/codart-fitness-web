import type { RouterConfig } from '@nuxt/schema'

/*
 * The stylesheet's smooth scroll raced hydration on a direct visit to an anchor and left the page at
 * the top. The router scrolls instead, once the target page is rendered, clear of the sticky header:
 * smoothly within a page unless the person asks for less motion, at once on arrival or another page.
 */
export default {
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) {
      const header = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const samePage = from.matched.length > 0 && to.path === from.path
      const target = {
        el: to.hash,
        top: header,
        behavior: samePage && !still ? ('smooth' as const) : ('instant' as const),
      }
      if (samePage) return target
      return new Promise((resolve) => {
        useNuxtApp().hooks.hookOnce('page:finish', () => {
          setTimeout(() => resolve(target), 0)
        })
      })
    }
    return to.path === from.path ? false : { top: 0 }
  },
} satisfies RouterConfig
