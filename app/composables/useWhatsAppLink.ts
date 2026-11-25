import { type Visit, siteEntryLink } from '#shared/visit'
import { whatsAppLink } from '#shared/whatsapp'

/**
 * The single way the site opens the conversation. With no text, the visitor is starting the trial:
 * the API's redirect records where the visit came from and writes the greeting. A text of its own
 * goes straight to the chat, and `null` opens it empty, for someone who already bought.
 */
export const useWhatsAppLink = (text?: MaybeRefOrGetter<string | null | undefined>) => {
  const { whatsappNumber, apiUrl } = useRuntimeConfig().public
  const locale = useSiteLocale()
  const route = useRoute()
  const visit = useState<Visit | undefined>('visit')
  const { choice } = useConsent()
  return computed(() => {
    const wanted = toValue(text)
    if (wanted === null) return whatsAppLink(whatsappNumber, '')
    if (wanted?.trim()) return whatsAppLink(whatsappNumber, wanted.trim())
    return siteEntryLink(apiUrl, visit.value ?? { landing: route.path, params: {} }, {
      consent: choice.value === 'granted',
      lang: locale.value,
    })
  })
}
