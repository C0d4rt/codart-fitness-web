<script setup lang="ts">
import { type Catalog, money, yearlyPerMonth } from '#shared/plans'

const props = defineProps<{ catalog: Catalog; bare?: boolean }>()

const period = ref<'month' | 'year'>('month')
const { t } = useI18n()

const plans = computed(() => [
  {
    id: 'premium',
    plan: props.catalog.premium,
    who: t('pricing.premiumWho'),
    items: [
      t('pricing.allOfBasic'),
      ...props.catalog.premium.features
        .filter((feature) => feature.plan === 'premium')
        .slice(0, 5)
        .map((feature) => feature.name),
    ],
    featured: true,
  },
  {
    id: 'basic',
    plan: props.catalog.basic,
    who: t('pricing.basicWho'),
    items: props.catalog.basic.features.slice(0, 6).map((feature) => feature.name),
    featured: false,
  },
])
</script>

<template>
  <section class="pricing" :class="{ bare }" aria-labelledby="pricing-title">
    <div class="head" data-reveal>
      <h2 id="pricing-title" :class="bare ? 'visually-hidden' : 'title'">
        {{ t('pricing.title') }}
      </h2>
      <p v-if="!bare">{{ t('pricing.lead', { days: catalog.trialDays }) }}</p>
      <div class="period" role="group" :aria-label="t('pricing.periodLabel')">
        <button type="button" :aria-pressed="period === 'month'" @click="period = 'month'">
          {{ t('pricing.monthly') }}
        </button>
        <button type="button" :aria-pressed="period === 'year'" @click="period = 'year'">
          {{ t('pricing.yearly') }}
        </button>
      </div>
    </div>

    <div class="cards">
      <article
        v-for="each in plans"
        :id="each.id"
        :key="each.id"
        class="card"
        :class="{ featured: each.featured }"
      >
        <h3 class="name">{{ each.plan.name }}</h3>
        <p class="who">{{ each.who }}</p>
        <p class="price">
          <span class="amount">{{
            money(period === 'month' ? each.plan.monthlyCents : each.plan.yearlyCents)
          }}</span>
          <span class="per">{{
            period === 'month' ? t('pricing.perMonth') : t('pricing.perYear')
          }}</span>
        </p>
        <p class="equiv">
          {{
            period === 'month'
              ? t('pricing.orYearly', { price: money(each.plan.yearlyCents) })
              : t('pricing.yearlyPerMonth', { price: yearlyPerMonth(each.plan) })
          }}
        </p>
        <ul class="items">
          <li v-for="item in each.items" :key="item">{{ item }}</li>
        </ul>
        <WhatsAppButton
          :location="`plans-${each.id}`"
          :label="
            each.featured ? t('cta.tryDays', { days: catalog.trialDays }) : t('cta.startTrial')
          "
          :inverse="each.featured"
        />
      </article>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: 3rem;
  padding: var(--gap-section) var(--margin) 0;
}

.pricing.bare {
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding-top: 2.5rem;
}

.head {
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 1.5rem;
}

.title {
  font-size: var(--step-head);
}

.head p {
  max-width: 36ch;
  color: var(--muted);
}

.period {
  display: inline-grid;
  grid-auto-flow: column;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--tone);
}

.period button {
  min-width: 6.5rem;
  min-height: 2.5rem;
  padding: 0 1.125rem;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--muted);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 200ms ease,
    color 200ms ease,
    transform 160ms var(--ease-out);
}

.period button[aria-pressed='true'] {
  background: var(--card);
  color: var(--ink);
}

.period button:active {
  transform: scale(0.97);
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.card {
  display: grid;
  grid-template-rows: auto auto auto auto 1fr auto;
  gap: 0.875rem;
  padding: 2rem;
  border-radius: var(--radius);
  background: var(--card);
  scroll-margin-top: 2rem;
}

.featured {
  background: var(--green);
  color: var(--green-ink);
}

.name {
  font-size: var(--step-lead);
}

.who,
.equiv {
  color: var(--muted);
  font-size: var(--step-small);
}

.featured .who,
.featured .equiv {
  color: #eef8f2;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.amount {
  font-size: var(--step-head);
  font-weight: 700;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
}

.per {
  font-weight: 500;
  white-space: nowrap;
}

.items {
  display: grid;
  align-content: start;
  gap: 0.5rem;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-small);
}

.items li {
  position: relative;
  padding-left: 1.5rem;
}

.items li::before {
  content: '';
  position: absolute;
  top: 0.5em;
  left: 0.125rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--green);
}

.featured .items li::before {
  background: var(--mint);
}

.card :deep(.button) {
  margin-top: 1rem;
}

@media (max-width: 63.99rem) {
  .pricing {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 47.99rem) {
  .cards {
    grid-template-columns: 1fr;
  }
  .card {
    padding: 1.5rem;
  }
}
</style>
