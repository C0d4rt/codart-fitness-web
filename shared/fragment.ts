/** Pages that show a sign-in or activation code: Google Analytics and the pixel never load on them. */
const CODE_PAGES = [
  '/entrar',
  '/assinar/pronto',
  '/assinar/ativar',
  '/en/sign-in',
  '/en/subscribe/done',
  '/en/subscribe/activate',
]

export const showsCode = (path: string): boolean =>
  CODE_PAGES.includes(path.replace(/\/+$/, '') || '/')

export const FRAGMENT_GLOBAL = '__fitnessFragment'

export type Fragment = { key: 'c' | 'a'; value: string }

/**
 * Runs inline in the head, before the router, the app or any analytics: it takes `#c=` (the
 * WhatsApp link's token) and `#a=` (the e-mail's activation code) off the address bar and keeps the
 * value only in memory, for the page to read once. The router never sees it, so it never writes it
 * back, and no script reading the URL later ever finds it.
 */
export const FRAGMENT_SCRIPT = `(function(){var m=/^#([ca])=([^&]{1,256})/.exec(location.hash);if(!m||!/^\\/(assinar|en\\/subscribe)(\\/|$)/.test(location.pathname))return;try{history.replaceState(history.state,'',location.pathname+location.search)}catch(e){}try{window.${FRAGMENT_GLOBAL}={key:m[1],value:decodeURIComponent(m[2])}}catch(e){}})()`

/** Hands the fragment to the page once and forgets it. */
export const takeFragment = (
  scope: Record<string, unknown>,
  key: Fragment['key'],
): string | undefined => {
  const found = scope[FRAGMENT_GLOBAL] as Fragment | undefined
  if (!found || found.key !== key) return undefined
  Reflect.deleteProperty(scope, FRAGMENT_GLOBAL)
  return found.value
}
