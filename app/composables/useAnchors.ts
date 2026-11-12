import type { Locale } from '#shared/locale'

const ANCHORS = {
  pt: {
    how: 'como-funciona',
    faq: 'perguntas',
    bento: 'seus-numeros',
    day: 'um-dia-normal',
    everything: 'tudo-o-que-faz',
    data: 'dados',
    photos: 'fotos',
    company: 'empresa',
  },
  en: {
    how: 'how-it-works',
    faq: 'questions',
    bento: 'your-numbers',
    day: 'a-normal-day',
    everything: 'everything-it-does',
    data: 'data',
    photos: 'photos',
    company: 'company',
  },
} satisfies Record<Locale, Record<string, string>>

/** The section ids a link can point to, in the language of the page they are on. */
export const useAnchors = () => {
  const locale = useSiteLocale()
  return computed(() => ANCHORS[locale.value])
}
