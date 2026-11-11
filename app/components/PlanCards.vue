<script setup lang="ts">
import {
  bestPackage,
  type Catalog,
  installmentCents,
  money,
  wholeMoney,
  yearlyPerMonth,
  yearlySaving,
} from '#shared/plans'

const props = defineProps<{ catalog: Catalog; bare?: boolean }>()

const PREMIUM_HIGHLIGHTS = [
  'diary',
  'photos',
  'mealSuggestion',
  'workouts',
  'weekSummary',
  'csvExport',
]

const { t } = useI18n()
const locale = useSiteLocale()

const premium = computed(() => props.catalog.premium)
const coaching = computed(() => props.catalog.coaching)

const period = ref<'month' | 'year'>('month')
const saving = computed(() => yearlySaving(premium.value))
const premiumItems = computed(() =>
  PREMIUM_HIGHLIGHTS.flatMap((id) =>
    premium.value.features.filter((each) => each.id === id).map((each) => each.name),
  ),
)

const packages = computed(() => (coaching.value.available ? coaching.value.packages : []))
const best = computed(() => bestPackage(packages.value))
const months = ref(best.value?.months)
const chosen = computed(
  () => packages.value.find((each) => each.months === months.value) ?? packages.value[0],
)
const coachingItems = computed(() => [
  t('pricing.allOfPremium'),
  ...coaching.value.features
    .filter((feature) => feature.plan === 'coaching')
    .map((feature) => feature.name),
])
const wantCoaching = computed(() => t('pricing.wantPlan', { plan: coaching.value.name }))
</script>

<template>
  <section class="pricing" :class="{ bare }" aria-labelledby="pricing-title">
    <div class="head" data-reveal>
      <h2 id="pricing-title" :class="bare ? 'visually-hidden' : 'title'">
        {{ t('pricing.title') }}
      </h2>
      <p v-if="!bare">{{ t('pricing.lead', { days: catalog.trialDays }) }}</p>
    </div>

    <div class="cards">
      <article id="premium" class="card featured">
        <div class="name-row">
          <h3 class="name">{{ premium.name }}</h3>
          <Transition name="chip">
            <p v-if="period === 'year' && saving > 0" class="chip">
              {{ t('pricing.saving', { percent: saving }) }}
            </p>
          </Transition>
        </div>
        <p class="who">{{ t('pricing.premiumWho') }}</p>
        <div
          class="switch"
          role="group"
          :aria-label="t('pricing.periodLabel')"
          :style="{ '--at': period === 'year' ? 1 : 0, '--n': 2 }"
        >
          <span class="glide" aria-hidden="true" />
          <button type="button" :aria-pressed="period === 'month'" @click="period = 'month'">
            {{ t('pricing.monthly') }}
          </button>
          <button type="button" :aria-pressed="period === 'year'" @click="period = 'year'">
            {{ t('pricing.yearly') }}
          </button>
        </div>
        <p class="price" aria-live="polite">
          <span class="amount">{{
            money(period === 'month' ? premium.monthlyCents : premium.yearlyCents, locale)
          }}</span>
          <span class="per">{{
            period === 'month' ? t('pricing.perMonth') : t('pricing.perYear')
          }}</span>
        </p>
        <p class="equiv">
          {{
            period === 'month'
              ? t('pricing.orYearly', {
                  price: money(premium.yearlyCents, locale),
                  percent: saving,
                })
              : t('pricing.yearlyPerMonth', { price: yearlyPerMonth(premium, locale) })
          }}
        </p>
        <ul class="items">
          <li v-for="item in premiumItems" :key="item">{{ item }}</li>
        </ul>
        <div class="action">
          <WhatsAppButton
            location="plans-premium"
            :label="t('cta.tryDays', { days: catalog.trialDays })"
            inverse
          />
        </div>
      </article>

      <article id="coaching" class="card">
        <div class="name-row">
          <h3 class="name">{{ coaching.name }}</h3>
          <Transition name="chip">
            <p v-if="chosen && chosen === best && packages.length > 1" class="chip">
              {{ t('pricing.perMonthAnchor', { price: wholeMoney(chosen.perMonthCents, locale) }) }}
            </p>
          </Transition>
        </div>
        <p class="who">{{ t('pricing.coachingWho') }}</p>
        <template v-if="chosen">
          <div
            v-if="packages.length > 1"
            class="switch"
            role="group"
            :aria-label="t('pricing.packageLabel')"
            :style="{ '--at': packages.indexOf(chosen), '--n': packages.length }"
          >
            <span class="glide" aria-hidden="true" />
            <button
              v-for="pack in packages"
              :key="pack.months"
              type="button"
              :aria-pressed="pack === chosen"
              @click="months = pack.months"
            >
              {{ t('pricing.months', { months: pack.months }) }}
            </button>
          </div>
          <p class="price" aria-live="polite">
            <span v-if="chosen.installments > 1" class="per">{{
              t('pricing.installmentsOf', { installments: chosen.installments })
            }}</span>
            <span class="amount">{{ money(installmentCents(chosen), locale) }}</span>
          </p>
          <p class="equiv">
            {{
              t('pricing.packageTotal', {
                total: money(chosen.totalCents, locale),
                months: chosen.months,
              })
            }}
          </p>
        </template>
        <template v-else>
          <p class="price soon">
            <span class="amount">{{ t('pricing.soon') }}</span>
          </p>
          <p class="equiv">{{ t('pricing.soonNote') }}</p>
        </template>
        <ul class="items">
          <li v-for="item in coachingItems" :key="item">{{ item }}</li>
        </ul>
        <div class="action">
          <WhatsAppButton
            location="plans-coaching"
            :text="wantCoaching"
            :label="chosen ? wantCoaching : t('pricing.notifyMe')"
          />
          <p v-if="chosen" class="terms">{{ t('pricing.coachingTerms') }}</p>
        </div>
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
  gap: 0;
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

.switch {
  position: relative;
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--tone);
}

/* One highlight under every option, so the switch reads as a move rather than a swap. */
.glide {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0.25rem;
  width: calc((100% - 0.5rem) / var(--n, 2));
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

.switch button {
  position: relative;
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
    color 200ms ease,
    transform 160ms var(--ease-out);
}

.switch button[aria-pressed='true'] {
  color: var(--ink);
}

.switch button:active {
  transform: scale(0.97);
}

.featured .switch {
  background: rgb(255 255 255 / 0.16);
}

.featured .switch button {
  color: #eef8f2;
}

.featured .switch button[aria-pressed='true'] {
  color: var(--green);
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.card {
  display: flex;
  flex-direction: column;
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
  min-height: 2rem;
}

.name {
  font-size: var(--step-lead);
}

.chip {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--mint);
  color: var(--green);
  font-size: var(--step-small);
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
}

.chip-enter-active {
  transition:
    opacity 200ms var(--ease-out),
    transform 200ms var(--ease-out);
}

.chip-leave-active {
  transition: opacity 120ms var(--ease-out);
}

.chip-enter-from {
  opacity: 0;
  transform: scale(0.94);
}

.chip-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .chip-enter-from {
    transform: none;
  }
}

.who,
.equiv,
.terms {
  color: var(--muted);
  font-size: var(--step-small);
}

.featured .who,
.featured .equiv {
  color: #eef8f2;
}

.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.5rem;
  margin-top: 0.5rem;
}

.amount {
  font-size: clamp(2.25rem, 1.5rem + 2vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.soon .amount {
  color: var(--green);
}

.per {
  font-weight: 500;
  white-space: nowrap;
}

.items {
  display: grid;
  flex: 1;
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

.action {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.action :deep(.button) {
  padding-block: 0.75rem;
  line-height: 1.25;
  text-align: center;
  text-wrap: balance;
}

.terms {
  text-align: center;
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
