import { z } from 'zod'

import { CATALOG_NAMES, type CatalogNames } from './catalogNames'
import { FEATURE_COPY, type FeatureCopy } from './featureCopy'
import { DEFAULT_LOCALE, LANGUAGE, type Locale } from './locale'

const planId = z.enum(['premium', 'coaching'])

const premiumPlan = z.object({
  id: z.literal('premium'),
  name: z.string().min(1),
  monthlyCents: z.int().positive(),
  yearlyCents: z.int().positive(),
})

/** The Pix prices are optional fields of version 3 (PRP-067 of codart-messaging, decision 10). */
const premiumPlanV3 = premiumPlan.extend({
  yearlyInstallments: z.int().positive(),
  yearlyPixCents: z.int().positive().optional(),
})

const coachingPackage = z.object({
  months: z.int().positive(),
  totalCents: z.int().positive(),
  installments: z.int().positive(),
  perMonthCents: z.int().positive(),
  pixCents: z.int().positive().optional(),
})

/**
 * The prices that replace the catalog's at `from`, sent only while the change is ahead. A page
 * built before it switches to them in the browser (`pricesAt`), with no rebuild.
 */
const nextPrices = z.object({
  from: z.iso.datetime({ offset: true }),
  premium: z.object({
    monthlyCents: z.int().positive(),
    yearlyCents: z.int().positive(),
    yearlyPixCents: z.int().positive().optional(),
  }),
  coaching: coachingPackage.optional(),
})

/** Without prices while the sale is off: the site then says "soon" instead of a number. */
const coachingPlan = z.discriminatedUnion('available', [
  z.object({
    id: z.literal('coaching'),
    name: z.string().min(1),
    available: z.literal(false),
  }),
  z.object({
    id: z.literal('coaching'),
    name: z.string().min(1),
    available: z.literal(true),
    packages: z.array(coachingPackage).min(1),
  }),
])

const catalogFacts = {
  currency: z.literal('BRL'),
  trialDays: z.int().positive(),
  trialPlan: z.literal('premium'),
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
}

/**
 * What `GET /fitness/plans` of codart-messaging answers: the facts, never the marketing.
 * Version 2 stays accepted because the site deploys before codart-messaging serves version 3,
 * which adds the yearly installments and sells Premium Pro as one 12-month package (PRP-058).
 */
export const plansSchema = z.discriminatedUnion('version', [
  z.object({ version: z.literal(2), ...catalogFacts, plans: z.tuple([premiumPlan, coachingPlan]) }),
  z.object({
    version: z.literal(3),
    ...catalogFacts,
    plans: z.tuple([premiumPlanV3, coachingPlan]),
    next: nextPrices.optional(),
  }),
])

export type PlansFacts = z.infer<typeof plansSchema>
export type PlanId = z.infer<typeof planId>
export type CoachingPackage = z.infer<typeof coachingPackage>
export type NextPrices = z.infer<typeof nextPrices>

export type Feature = PlansFacts['features'][number] & FeatureCopy
export type PremiumPlan = z.infer<typeof premiumPlan> & {
  yearlyInstallments?: number
  yearlyPixCents?: number
  features: Feature[]
}
export type CoachingPlan = z.infer<typeof coachingPlan> & { features: Feature[] }

export type Catalog = {
  trialDays: number
  premium: PremiumPlan
  coaching: CoachingPlan
  groups: { id: string; name: string; features: Feature[] }[]
  next?: NextPrices
}

export class CatalogMismatch extends Error {
  constructor(readonly problems: string[]) {
    super(`The plans from codart-messaging and the site copy disagree:\n${problems.join('\n')}`)
  }
}

const namingProblems = (facts: PlansFacts, names: CatalogNames, locale: Locale): string[] => {
  const sides = [
    ['feature', facts.features.map((each) => each.id), names.features],
    ['group', facts.groups.map((each) => each.id), names.groups],
  ] as const
  return sides.flatMap(([kind, ids, named]) =>
    ids
      .filter((id) => named[id] === undefined)
      .map((id) => `no ${locale} name for the ${kind} "${id}"`),
  )
}

/**
 * Fails loudly on a feature the site cannot describe, so a build never ships one without its copy.
 * Copy for an id the plans do not list yet is left out, so the site can merge it before
 * codart-messaging deploys the feature; the fixture tests keep both sides equal.
 */
export const buildCatalog = (
  raw: unknown,
  locale: Locale = DEFAULT_LOCALE,
  copy: Record<string, FeatureCopy> = FEATURE_COPY[locale],
  names: CatalogNames | undefined = CATALOG_NAMES[locale],
): Catalog => {
  const facts = plansSchema.parse(raw)
  const groupIds = new Set(facts.groups.map((group) => group.id))
  const problems = [
    ...facts.features
      .filter((feature) => copy[feature.id] === undefined)
      .map((feature) => `no ${locale} copy for the feature "${feature.id}"`),
    ...facts.features
      .filter((feature) => !groupIds.has(feature.group))
      .map((feature) => `"${feature.id}" is in the unknown group "${feature.group}"`),
    ...(names === undefined ? [] : namingProblems(facts, names, locale)),
  ]
  if (problems.length > 0) {
    throw new CatalogMismatch(problems)
  }
  const features: Feature[] = facts.features.map((feature) => ({
    ...feature,
    ...copy[feature.id]!,
    name: names?.features[feature.id] ?? feature.name,
  }))
  const [premium, coaching] = facts.plans
  return {
    trialDays: facts.trialDays,
    premium: {
      ...premium,
      name: names?.plans.premium ?? premium.name,
      features: features.filter((feature) => feature.plan === 'premium'),
    },
    coaching: {
      ...(coaching.available
        ? { ...coaching, packages: [...coaching.packages].sort((a, b) => b.months - a.months) }
        : coaching),
      name: names?.plans.coaching ?? coaching.name,
      features,
    },
    groups: facts.groups.map((group) => ({
      ...group,
      name: names?.groups[group.id] ?? group.name,
      features: features.filter((feature) => feature.group === group.id),
    })),
    ...(facts.version === 3 && facts.next ? { next: facts.next } : {}),
  }
}

/** The moments the prices change: the page reads the clock again at each. */
export const priceChanges = (catalog: Pick<Catalog, 'next'>): string[] =>
  catalog.next ? [catalog.next.from] : []

/** The catalog as charged at `now`: from `next.from` on, the next prices are the prices. */
export const pricesAt = (catalog: Catalog, now: Date): Catalog => {
  const { next, ...current } = catalog
  if (next === undefined || now.getTime() < Date.parse(next.from)) return catalog
  const { coaching } = current
  const pack = next.coaching
  return {
    ...current,
    premium: {
      ...current.premium,
      monthlyCents: next.premium.monthlyCents,
      yearlyCents: next.premium.yearlyCents,
      yearlyPixCents: next.premium.yearlyPixCents,
    },
    coaching:
      coaching.available && pack
        ? {
            ...coaching,
            packages: coaching.packages.map((each) => (each.months === pack.months ? pack : each)),
          }
        : coaching,
  }
}

/**
 * The last day, in Brasília, the prices hold while next prices are announced: schema.org's
 * `priceValidUntil`, a date the offer does not outlive.
 */
export const priceValidUntil = (catalog: Pick<Catalog, 'next'>): string | undefined =>
  catalog.next &&
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(
    Date.parse(catalog.next.from) - 1,
  )

/** Always reais, written the reader's way ("R$ 29,90", "R$29.90"), and never split across lines. */
export const money = (cents: number, locale: Locale): string =>
  new Intl.NumberFormat(LANGUAGE[locale], { style: 'currency', currency: 'BRL' })
    .format(cents / 100)
    .replace(/\s/g, ' ')

/** `money` cut in two ("R$ " and "39,90"), so a price can set the symbol smaller and read the same. */
export const moneyParts = (cents: number, locale: Locale): { currency: string; amount: string } => {
  const parts = new Intl.NumberFormat(LANGUAGE[locale], {
    style: 'currency',
    currency: 'BRL',
  }).formatToParts(cents / 100)
  const isSymbol = (type: string) => type === 'currency' || type === 'literal'
  const join = (keep: boolean) =>
    parts
      .filter((part) => isSymbol(part.type) === keep)
      .map((part) => part.value)
      .join('')
      .replace(/\s/g, ' ')
  return { currency: join(true), amount: join(false) }
}

/** Whole reais for an anchor ("R$ 83"), the cents cut: the exact price always sits next to it. */
export const wholeMoney = (cents: number, locale: Locale): string =>
  new Intl.NumberFormat(LANGUAGE[locale], {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(Math.floor(cents / 100))
    .replace(/\s/g, ' ')

/**
 * What each card installment charges when the API does not say, rounded to the nearest cent as
 * codart-messaging rounds it ("12x de R$ 16,66" for R$ 199,90).
 */
export const installmentCents = (charge: { totalCents: number; installments: number }) =>
  Math.round(charge.totalCents / charge.installments)

/** With one installment a month, the package's `perMonthCents` is the installment messaging charges. */
export const packageInstallmentCents = (pack: CoachingPackage) =>
  pack.installments === pack.months ? pack.perMonthCents : installmentCents(pack)

/** The package that costs least a month: the card opens on it and anchors its price. */
export const bestPackage = (packages: readonly CoachingPackage[]): CoachingPackage | undefined =>
  packages.reduce<CoachingPackage | undefined>(
    (best, each) => (best === undefined || each.perMonthCents < best.perMonthCents ? each : best),
    undefined,
  )

/** What the yearly plan costs a month, rounded down to the cent. */
export const yearlyPerMonth = (plan: Pick<PremiumPlan, 'yearlyCents'>, locale: Locale): string =>
  money(Math.floor(plan.yearlyCents / 12), locale)

/** How much less a year costs than twelve months, in whole percent, rounded down so it never overstates. */
export const yearlySaving = (plan: Pick<PremiumPlan, 'monthlyCents' | 'yearlyCents'>): number => {
  const twelveMonths = plan.monthlyCents * 12
  return Math.max(0, Math.floor((100 * (twelveMonths - plan.yearlyCents)) / twelveMonths))
}
