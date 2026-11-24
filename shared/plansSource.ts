export class PlansSourceMissing extends Error {
  constructor() {
    super(
      'PLANS_API_URL is empty, so the build would publish the fixture prices. ' +
        'Set it, or set PLANS_FIXTURE=1 to build with shared/plans.fixture.json on purpose.',
    )
  }
}

/** The fixture only when asked for by name: a deploy with a lost URL must fail, not publish it. */
export const plansSourceOf = (
  env: Record<string, string | undefined>,
): { url: string } | 'fixture' => {
  if (env.PLANS_API_URL) return { url: env.PLANS_API_URL }
  if (env.PLANS_FIXTURE === '1') return 'fixture'
  throw new PlansSourceMissing()
}
