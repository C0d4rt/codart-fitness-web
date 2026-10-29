import { whatsAppLink } from '#shared/whatsapp'

import { brand } from '~/brand'

/** The single way the site opens the conversation, so attribution can later replace it in one place. */
export const useWhatsAppLink = (text?: MaybeRefOrGetter<string | undefined>) => {
  const { whatsappNumber } = useRuntimeConfig().public
  const trialDays = useTrialDays()
  const locale = useSiteLocale()
  return computed(() =>
    whatsAppLink(
      whatsappNumber,
      toValue(text)?.trim() || brand.greeting[locale.value](trialDays.value),
    ),
  )
}
