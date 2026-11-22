import { LANGUAGE } from '#shared/locale'
import { type ApiLocale, createSiteApi, type Me } from '#shared/siteApi'
import { siteErrorKey, type SiteErrorCode } from '#shared/siteErrors'

/** The API of the sign-in and the purchase, called only from the browser of the four account pages. */
export const useSiteApi = () => {
  const { apiUrl } = useRuntimeConfig().public
  return createSiteApi({
    baseUrl: String(apiUrl),
    fetch: (input, init) => globalThis.fetch(input, init),
  })
}

export const useApiLocale = () => {
  const locale = useSiteLocale()
  return computed(() => LANGUAGE[locale.value] as ApiLocale)
}

/** Who the API says is in this browser, kept for the header once an account page asked. */
export const useSiteAccount = () => useState<Me | undefined>('site-me', () => undefined)

export const useSiteError = () => {
  const { t } = useI18n()
  return (code: SiteErrorCode) => t(siteErrorKey(code))
}

/** The masked number, or the name told to the assistant when the contact has no phone. */
export const whoOf = (me: Me | undefined): string | undefined =>
  me?.signedIn ? (me.phone ?? me.name) : undefined
