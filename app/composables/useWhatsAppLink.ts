import { whatsAppLink } from '#shared/whatsapp'

import { brand } from '~/brand'

/**
 * The single way the site opens the conversation, so attribution can later replace it in one place.
 * `null` opens the chat with no text, for someone who already bought and only goes back to it.
 */
export const useWhatsAppLink = (text?: MaybeRefOrGetter<string | null | undefined>) => {
  const { whatsappNumber } = useRuntimeConfig().public
  const trialDays = useTrialDays()
  const locale = useSiteLocale()
  return computed(() => {
    const wanted = toValue(text)
    return whatsAppLink(
      whatsappNumber,
      wanted === null ? '' : wanted?.trim() || brand.greeting[locale.value](trialDays.value),
    )
  })
}
