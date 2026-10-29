import { asLocale } from '#shared/locale'

export default defineEventHandler((event) => loadCatalog(asLocale(String(getQuery(event).locale))))
