<script setup lang="ts">
import { type Catalog, money, yearlyPerMonth, yearlySaving } from '#shared/plans'

const props = defineProps<{ catalog: Catalog; bare?: boolean }>()

const period = ref<'month' | 'year'>('month')
const { t } = useI18n()
const locale = useSiteLocale()

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
    saving: yearlySaving(props.catalog.premium),
  },
  {
    id: 'basic',
    plan: props.catalog.basic,
    who: t('pricing.basicWho'),
    items: props.catalog.basic.features.slice(0, 6).map((feature) => feature.name),
    featured: false,
    saving: yearlySaving(props.catalog.basic),
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
      <div
        class="period"
        role="group"
        :aria-label="t('pricing.periodLabel')"
        :style="{ '--at': period === 'year' ? 1 : 0 }"
      >
        <span class="glide" aria-hidden="true" />
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
        <div class="name-row">
          <h3 class="name">{{ each.plan.name }}</h3>
          <Transition name="saving">
            <p v-if="period === 'year' && each.saving > 0" class="saving">
              {{ t('pricing.saving', { percent: each.saving }) }}
            </p>
          </Transition>
        </div>
        <p class="who">{{ each.who }}</p>
        <p class="price" aria-live="polite">
          <span class="amount">{{
            money(period === 'month' ? each.plan.monthlyCents : each.plan.yearlyCents, locale)
          }}</span>
          <span class="per">{{
            period === 'month' ? t('pricing.perMonth') : t('pricing.perYear')
          }}</span>
        </p>
        <p class="equiv">
          {{
            period === 'month'
              ? t('pricing.orYearly', {
                  price: money(each.plan.yearlyCents, locale),
                  percent: each.saving,
                })
              : t('pricing.yearlyPerMonth', { price: yearlyPerMonth(each.plan, locale) })
          }}
        </p>
        <ul class="items">
          <li v-for="item in each.items" :key="item">{{ item }}</li>
        </ul>
        <WhatsAppButton
          :location="`plans-${each.id}`"
          :label="
            each.featured
              ? t('cta.tryDays', { days: catalog.trialDays })
              : t('cta.tryThenPick', { plan: each.plan.name })
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
  position: relative;
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--tone);
}

/* One highlight under both options, so the switch reads as a move rather than a swap. */
.glide {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0.25rem;
  width: calc(50% - 0.25rem);
  border-radius: 999px;
  background: var(--card);
  transform: translateX(calc(var(--at, 0) * 100%));
  transition: transform 260ms var(--ease-in-out);
}

@media (prefers-reduced-motion: reduce) {
  .glide {
    transition: none;
  }
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

.period button {
  position: relative;
}

.period button[aria-pressed='true'] {
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

.featured :focus-visible {
  outline-color: var(--card);
}

.featured {
  background: var(--green);
  color: var(--green-ink);
}

.name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
}

.name {
  font-size: var(--step-lead);
}

.saving {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--mint);
  color: var(--green);
  font-size: var(--step-small);
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
}

.saving-enter-active {
  transition:
    opacity 200ms var(--ease-out),
    transform 200ms var(--ease-out);
}

.saving-leave-active {
  transition: opacity 120ms var(--ease-out);
}

.saving-enter-from {
  opacity: 0;
  transform: scale(0.94);
}

.saving-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .saving-enter-from {
    transform: none;
  }
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
  padding-block: 0.75rem;
  line-height: 1.25;
  text-align: center;
  text-wrap: balance;
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
