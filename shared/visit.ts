export const VISIT_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
] as const

export type Visit = {
  landing: string
  params: Partial<Record<(typeof VISIT_PARAMS)[number], string>>
}

const CLICK_IDS = new Set(['fbclid', 'gclid'])

/** What the page the visitor landed on says about where they came from; anything else in its query is left out. */
export const visitOf = (landing: string, query: Record<string, unknown>): Visit => {
  const params: Visit['params'] = {}
  for (const key of VISIT_PARAMS) {
    const raw = query[key]
    const value = Array.isArray(raw) ? raw[0] : raw
    if (typeof value === 'string' && value.trim() !== '') params[key] = value.trim()
  }
  return { landing, params }
}

/**
 * The API's redirect to the chat (PRP-037): it records the visit under a short code and opens
 * WhatsApp with the greeting and that code. Click ids leave the browser only with consent.
 */
export const siteEntryLink = (
  apiUrl: string,
  visit: Visit,
  { consent, lang }: { consent: boolean; lang: string },
): string => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(visit.params)) {
    if (value !== undefined && (consent || !CLICK_IDS.has(key))) query.set(key, value)
  }
  query.set('landing', visit.landing)
  query.set('consent', consent ? '1' : '0')
  query.set('lang', lang)
  return `${apiUrl.replace(/\/+$/, '')}/fitness/go?${query.toString()}`
}
