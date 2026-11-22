import type { ConsentChoice } from '#shared/consent'
import { showsCode } from '#shared/fragment'

const DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const

const GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
} as const

/** Nothing of Google or Meta loads before an explicit yes, and a no later stops what was granted. */
export default defineNuxtPlugin(() => {
  const { gaId, metaPixelId } = useRuntimeConfig().public
  const choice = useState<ConsentChoice | undefined>('consent')
  const granted = computed(() => choice.value === 'granted')
  const router = useRouter()
  const path = ref(window.location.pathname)
  router.afterEach((to) => {
    path.value = to.path
  })
  // GA4 records the external links clicked, and the WhatsApp link of these pages carries a code.
  const allowed = computed(() => granted.value && !showsCode(path.value))
  const trigger = useScriptTriggerConsent({ consent: allowed })
  const loaded = ref(false)
  watch(
    allowed,
    (now) => {
      if (now) loaded.value = true
    },
    { immediate: true },
  )
  // A loaded script cannot be taken off the page, so a code page is reached by a full load instead.
  router.beforeEach((to, from) => {
    if (loaded.value && showsCode(to.path) && to.path !== from.path) {
      window.location.assign(router.resolve(to).href)
      return false
    }
  })

  const ga = gaId
    ? useScriptGoogleAnalytics({ id: gaId, defaultConsent: DENIED, scriptOptions: { trigger } })
    : undefined
  const pixel = metaPixelId
    ? useScriptMetaPixel({ id: metaPixelId, scriptOptions: { trigger } })
    : undefined

  watch(
    granted,
    (now) => {
      ga?.proxy.gtag('consent', 'update', now ? GRANTED : DENIED)
      if (now) {
        pixel?.proxy.fbq('consent', 'grant')
      } else {
        pixel?.proxy.fbq('consent', 'revoke')
      }
    },
    { immediate: false },
  )

  return {
    provide: {
      analytics: {
        /** The site's one conversion: the tap that opens the conversation. */
        lead: (location: string) => {
          if (!granted.value) return
          ga?.proxy.gtag('event', 'generate_lead', { method: 'whatsapp', location })
          pixel?.proxy.fbq('track', 'Lead', { content_name: location })
        },
      },
    },
  }
})
