import type { Locale } from '#shared/locale'

const ANCHORS = {
  pt: {
    how: 'como-funciona',
    faq: 'perguntas',
    showcase: 'o-que-volta',
    bento: 'do-seu-jeito',
    data: 'dados',
    photos: 'fotos',
    company: 'empresa',
  },
  en: {
    how: 'how-it-works',
    faq: 'questions',
    showcase: 'answers',
    bento: 'your-way',
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
