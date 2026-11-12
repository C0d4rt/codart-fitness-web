<script setup lang="ts">
import { brand } from '~/brand'

const catalog = await usePlans()
const { t } = useI18n()
const localePath = useLocalePath()

const offer = (cents: number, name: string) => ({
  '@type': 'Offer',
  name,
  price: (cents / 100).toFixed(2),
  priceCurrency: 'BRL',
  availability: 'https://schema.org/InStock',
  url: brand.siteUrl + localePath('/planos'),
})

const { premium, coaching } = catalog

useSchemaOrg([
  defineProduct({
    name: brand.name,
    description: brand.tagline[useSiteLocale().value],
    image: `${brand.siteUrl}/og.png`,
    brand: { '@type': 'Brand', name: brand.name },
    offers: [
      offer(premium.monthlyCents, t('plans.offerMonthly', { plan: premium.name })),
      offer(premium.yearlyCents, t('plans.offerYearly', { plan: premium.name })),
      ...(coaching.available
        ? coaching.packages.map((pack) =>
            offer(
              pack.totalCents,
              t('plans.offerPackage', { plan: coaching.name, months: pack.months }),
            ),
          )
        : []),
    ],
  }),
])

useSeoMeta({
  title: t('plans.title'),
  description: t('plans.description', { name: brand.name, days: catalog.trialDays }),
})
</script>

<template>
  <div class="page">
    <SiteNav />
    <main id="conteudo">
      <header class="intro">
        <h1 class="title">{{ t('plans.title') }}</h1>
        <p class="lead">{{ t('plans.lead', { days: catalog.trialDays }) }}</p>
      </header>

      <PlanCards :catalog="catalog" bare />

      <section class="compare" aria-labelledby="compare-title">
        <div class="compare-head">
          <h2 id="compare-title" class="compare-title">{{ t('plans.compareTitle') }}</h2>
          <NuxtLinkLocale to="/recursos" class="link">{{ t('plans.seeFeatures') }}</NuxtLinkLocale>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">
                <span class="visually-hidden">{{ t('plans.featureColumn') }}</span>
              </th>
              <th scope="col">{{ premium.name }}</th>
              <th scope="col">{{ coaching.name }}</th>
            </tr>
          </thead>
          <tbody v-for="group in catalog.groups" :key="group.id">
            <tr class="group-row">
              <th scope="colgroup" colspan="3">{{ group.name }}</th>
            </tr>
            <tr v-for="feature in group.features" :key="feature.id">
              <th scope="row">
                <NuxtLink :to="localePath(`/recursos#${feature.id}`)">{{ feature.name }}</NuxtLink>
              </th>
              <td v-for="(included, column) in [feature.plan === 'premium', true]" :key="column">
                <svg v-if="included" class="check" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                </svg>
                <span v-else class="absent" aria-hidden="true" />
                <span class="visually-hidden">{{
                  included ? t('plans.included') : t('plans.coachingOnly')
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <SiteClosing />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1.25rem;
  padding: 4rem var(--margin) 0;
}

.title {
  font-size: var(--step-display);
}

.lead {
  max-width: 44ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.compare {
  display: grid;
  gap: 1.5rem;
  margin: 5rem var(--margin) 0;
  padding: 2rem;
  border-radius: var(--radius);
  background: var(--card);
}

.compare-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.compare-title {
  font-size: var(--step-lead);
}

.link {
  color: var(--green);
  font-weight: 500;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: var(--step-small);
}

.table th,
.table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--tone);
  text-align: left;
}

.table td {
  position: relative;
  width: 7.5rem;
  text-align: center;
}

/* Right under the site header (its 5rem bar and 1px rule), so the plan names stay in view. */
.table thead th {
  position: sticky;
  top: calc(5rem + 1px);
  z-index: 1;
  background: var(--card);
  font-weight: 700;
}

.table thead th + th {
  text-align: center;
}

.check {
  width: 1.25rem;
  height: 1.25rem;
  margin-inline: auto;
  fill: none;
  stroke: var(--green);
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.absent {
  display: block;
  width: 0.75rem;
  height: 2px;
  margin-inline: auto;
  border-radius: 1px;
  background: color-mix(in srgb, var(--muted) 50%, transparent);
}

.table tbody th {
  font-weight: 500;
}

.table tbody th a {
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .table tbody th a:hover {
    text-decoration: underline;
  }
}

.group-row th {
  padding-top: 1.5rem;
  color: var(--green);
  font-weight: 700;
}

@media (max-width: 47.99rem) {
  .compare {
    padding: 1.25rem;
  }
  .table td {
    width: 5rem;
  }
}
</style>
