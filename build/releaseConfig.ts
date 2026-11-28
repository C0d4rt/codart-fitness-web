import type { Nuxt } from 'nuxt/schema'

type Env = Record<string, string | undefined>

/** A build with the live catalog is the one that ships: its WhatsApp button needs a real number. */
export const releaseConfigProblems = (env: Env): string[] => {
  if (!env.PLANS_API_URL) return []
  const number = env.NUXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  return /^\d{8,15}$/.test(number)
    ? []
    : [`NUXT_PUBLIC_WHATSAPP_NUMBER must be 8 to 15 digits with the country code, got "${number}"`]
}

export const requireReleaseConfig = (_options: unknown, nuxt: Nuxt): void => {
  if (nuxt.options.dev || nuxt.options._prepare) return
  nuxt.hook('build:before', () => {
    const problems = releaseConfigProblems(process.env)
    if (problems.length > 0) {
      throw new Error(`Refusing to build the site with PLANS_API_URL set: ${problems.join('; ')}`)
    }
  })
}
