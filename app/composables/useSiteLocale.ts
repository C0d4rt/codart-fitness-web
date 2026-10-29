import { asLocale } from '#shared/locale'

export const useSiteLocale = () => {
  const { locale } = useI18n()
  return computed(() => asLocale(locale.value))
}
