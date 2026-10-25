/** Marks each `[data-reveal]` block once it enters, so its children rise in their stagger. */
export default defineNuxtPlugin((nuxtApp) => {
  document.documentElement.classList.add('js')
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  const watchAll = () => {
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((element) => {
      Array.from(element.children).forEach((child, index) => {
        ;(child as HTMLElement).style.setProperty('--i', String(index))
      })
      observer.observe(element)
    })
  }
  nuxtApp.hook('page:finish', () => void requestAnimationFrame(watchAll))
  nuxtApp.hook('app:mounted', () => void requestAnimationFrame(watchAll))
})
