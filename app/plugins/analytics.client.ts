import type { ConsentChoice } from '#shared/consent'

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
  const trigger = useScriptTriggerConsent({ consent: granted })

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
