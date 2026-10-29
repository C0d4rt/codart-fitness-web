<script setup lang="ts">
import type { Plan } from '#shared/plans'

import { brand } from '~/brand'

const catalog = await usePlans()
const { t } = useI18n()
const localePath = useLocalePath()

const offer = (plan: Plan, cents: number, name: string) => ({
  '@type': 'Offer',
  name,
  price: (cents / 100).toFixed(2),
  priceCurrency: 'BRL',
  availability: 'https://schema.org/InStock',
  url: `${brand.siteUrl}/planos`,
})

useSchemaOrg([
  defineProduct({
    name: brand.name,
    description: brand.tagline,
    image: `${brand.siteUrl}/og.png`,
    brand: { '@type': 'Brand', name: brand.name },
    offers: [catalog.premium, catalog.basic].flatMap((plan) => [
      offer(plan, plan.monthlyCents, t('plans.offerMonthly', { plan: plan.name })),
      offer(plan, plan.yearlyCents, t('plans.offerYearly', { plan: plan.name })),
    ]),
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
            <th scope="col">{{ catalog.basic.name }}</th>
            <th scope="col">{{ catalog.premium.name }}</th>
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
            <td>
              {{ feature.plan === 'basic' ? t('plans.included') : t('plans.premiumOnly') }}
            </td>
            <td>{{ t('plans.included') }}</td>
          </tr>
        </tbody>
      </table>
    </section>

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
  border-collapse: collapse;
  font-size: var(--step-small);
}

.table th,
.table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--tone);
  text-align: left;
}

.table td {
  width: 7.5rem;
}

.table thead th {
  font-weight: 700;
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
