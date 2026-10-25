import { z } from 'zod'

import { FEATURE_COPY, type FeatureCopy } from './featureCopy'

const planId = z.enum(['basic', 'premium'])

/** What `GET /fitness/plans` of codart-messaging answers: the facts, never the marketing. */
export const plansSchema = z.object({
  version: z.literal(1),
  currency: z.literal('BRL'),
  trialDays: z.int().positive(),
  trialPlan: planId,
  plans: z
    .array(
      z.object({
        id: planId,
        name: z.string().min(1),
        monthlyCents: z.int().positive(),
        yearlyCents: z.int().positive(),
      }),
    )
    .length(2),
  groups: z.array(z.object({ id: z.string().min(1), name: z.string().min(1) })).min(1),
  features: z
    .array(
      z.object({
        id: z.string().min(1),
        plan: planId,
        group: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .min(1),
})

export type PlansFacts = z.infer<typeof plansSchema>
export type PlanId = z.infer<typeof planId>

export type Feature = PlansFacts['features'][number] & FeatureCopy
export type Plan = PlansFacts['plans'][number] & { features: Feature[] }

export type Catalog = {
  trialDays: number
  trialPlan: PlanId
  premium: Plan
  basic: Plan
  groups: { id: string; name: string; features: Feature[] }[]
}

export class CatalogMismatch extends Error {
  constructor(readonly problems: string[]) {
    super(`The plans from codart-messaging and the site copy disagree:\n${problems.join('\n')}`)
  }
}

/** Fails loudly on any disagreement, so a build never ships a feature without its copy or the other way round. */
export const buildCatalog = (
  raw: unknown,
  copy: Record<string, FeatureCopy> = FEATURE_COPY,
): Catalog => {
  const facts = plansSchema.parse(raw)
  const groupIds = new Set(facts.groups.map((group) => group.id))
  const factIds = new Set(facts.features.map((feature) => feature.id))
  const problems = [
    ...facts.features
      .filter((feature) => copy[feature.id] === undefined)
      .map((feature) => `no copy for the feature "${feature.id}"`),
    ...Object.keys(copy)
      .filter((id) => !factIds.has(id))
      .map((id) => `copy for "${id}", which the plans no longer have`),
    ...facts.features
      .filter((feature) => !groupIds.has(feature.group))
      .map((feature) => `"${feature.id}" is in the unknown group "${feature.group}"`),
  ]
  if (problems.length > 0) {
    throw new CatalogMismatch(problems)
  }
  const features: Feature[] = facts.features.map((feature) => ({
    ...feature,
    ...copy[feature.id]!,
  }))
  const planOf = (id: PlanId): Plan => {
    const plan = facts.plans.find((each) => each.id === id)
    if (plan === undefined) {
      throw new CatalogMismatch([`no plan "${id}"`])
    }
    return {
      ...plan,
      features: features.filter((feature) => id === 'premium' || feature.plan === 'basic'),
    }
  }
  return {
    trialDays: facts.trialDays,
    trialPlan: facts.trialPlan,
    premium: planOf('premium'),
    basic: planOf('basic'),
    groups: facts.groups.map((group) => ({
      ...group,
      features: features.filter((feature) => feature.group === group.id),
    })),
  }
}

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** "R$ 29,90", with a non-breaking space so the price never splits across lines. */
export const money = (cents: number): string => BRL.format(cents / 100).replace(/\s/g, ' ')

/** What the yearly plan costs a month, rounded down to the cent. */
export const yearlyPerMonth = (plan: Pick<Plan, 'yearlyCents'>): string =>
  money(Math.floor(plan.yearlyCents / 12))
