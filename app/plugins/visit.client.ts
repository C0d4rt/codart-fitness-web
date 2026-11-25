import { type Visit, visitOf } from '#shared/visit'

/** Where the visit began is read once, on the page the visitor opened, and kept only in memory. */
export default defineNuxtPlugin(() => {
  const route = useRoute()
  useState<Visit>('visit', () => visitOf(route.path, route.query))
})
