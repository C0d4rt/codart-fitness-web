<script setup lang="ts">
import {
  bestPackage,
  type Catalog,
  installmentCents,
  money,
  moneyParts,
  packageInstallmentCents,
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
  'readyPrograms',
  'weekSummary',
  'csvExport',
]

const { t } = useI18n()
const locale = useSiteLocale()
const blackFriday = useBlackFriday()

const premium = computed(() => props.catalog.premium)
const coaching = computed(() => props.catalog.coaching)

const period = ref<'month' | 'year'>('year')
const periods = computed(() => [
  { value: 'month' as const, label: t('pricing.monthly') },
  { value: 'year' as const, label: t('pricing.yearly') },
])
const yearlyInstallments = computed(() => premium.value.yearlyInstallments ?? 1)
const byInstallments = computed(() => period.value === 'year' && yearlyInstallments.value > 1)
const yearlyShown = (totalCents: number) =>
  yearlyInstallments.value > 1
    ? installmentCents({ totalCents, installments: yearlyInstallments.value })
    : totalCents
const premiumPrice = computed(() =>
  moneyParts(
    period.value === 'month' ? premium.value.monthlyCents : yearlyShown(premium.value.yearlyCents),
    locale.value,
  ),
)
const saving = computed(() => yearlySaving(premium.value))
const premiumNote = computed(() => {
  if (period.value === 'month') {
    return t('pricing.orYearly', {
      price: money(premium.value.yearlyCents, locale.value),
      percent: saving.value,
    })
  }
  return byInstallments.value
    ? t('pricing.installmentTotal', { total: money(premium.value.yearlyCents, locale.value) })
    : t('pricing.yearlyPerMonth', { price: yearlyPerMonth(premium.value, locale.value) })
})
const premiumItems = computed(() =>
  PREMIUM_HIGHLIGHTS.flatMap((id) =>
    premium.value.features
      .filter((each) => each.id === id)
      .map((each) => (id === 'readyPrograms' ? t('pricing.levelWorkouts') : each.name)),
  ),
)

const packages = computed(() => (coaching.value.available ? coaching.value.packages : []))
const packageOptions = computed(() =>
  packages.value.map((pack) => ({
    value: pack.months,
    label: t('pricing.months', { months: pack.months }),
  })),
)
const best = computed(() => bestPackage(packages.value))
const months = ref(best.value?.months)
const chosen = computed(
  () => packages.value.find((each) => each.months === months.value) ?? packages.value[0],
)
const installment = computed(() =>
  moneyParts(chosen.value ? packageInstallmentCents(chosen.value) : 0, locale.value),
)

const yearlyStruck = computed(() => {
  const from = period.value === 'year' && blackFriday.yearlyFrom(premium.value.yearlyCents)
  if (!from) return undefined
  const shown = money(yearlyShown(from), locale.value)
  return {
    text: byInstallments.value ? `${shown}${t('pricing.perMonthShort')}` : shown,
    label: t('pricing.blackFriday.struck', { price: money(from, locale.value) }),
  }
})
const coachingStruck = computed(() => {
  const pack = chosen.value
  const from = pack && blackFriday.coachingFrom(pack.totalCents)
  return pack && from
    ? {
        total: from,
        installment: installmentCents({ totalCents: from, installments: pack.installments }),
      }
    : undefined
})
const offerLines = computed(() => {
  const yearly = blackFriday.yearlyFrom(premium.value.yearlyCents)
  const pack = chosen.value
  const pro = pack && blackFriday.coachingFrom(pack.totalCents)
  return [
    yearly &&
      t('pricing.blackFriday.yearly', {
        from: money(yearly, locale.value),
        price: money(premium.value.yearlyCents, locale.value),
      }),
    pack &&
      pro &&
      t('pricing.blackFriday.coaching', {
        plan: coaching.value.name,
        from: money(pro, locale.value),
        price: money(pack.totalCents, locale.value),
      }),
  ].filter((line): line is string => Boolean(line))
})
const coachingItems = computed(() => [
  t('pricing.allOfPremium'),
  ...coaching.value.features
    .filter((feature) => feature.plan === 'coaching')
    .map((feature) => feature.name),
])
const wantCoaching = computed(() => t('pricing.wantPlan', { plan: coaching.value.name }))
const maxInstallments = computed(() =>
  Math.max(
    premium.value.yearlyInstallments ?? 1,
    ...packages.value.map((each) => each.installments),
  ),
)
const promises = computed(() => [
  t('pricing.promises.trial', { days: props.catalog.trialDays }),
  t('pricing.promises.noCard'),
  t('pricing.promises.guarantee'),
  t('pricing.promises.pay'),
  t('pricing.promises.cancel'),
])
</script>

<template>
  <section class="pricing" :class="{ bare }" aria-labelledby="pricing-title">
    <div class="head" data-reveal>
      <h2 id="pricing-title" :class="bare ? 'visually-hidden' : 'title'">
        <TextLines :text="t('pricing.title')" />
      </h2>
      <ul v-if="!bare" class="promises">
        <li v-for="promise in promises" :key="promise">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" /></svg>
          {{ promise }}
        </li>
      </ul>
      <div v-if="offerLines.length" class="offer" role="note">
        <p class="offer-title">{{ t('pricing.blackFriday.title') }}</p>
        <p v-for="line in offerLines" :key="line">{{ line }}</p>
        <p class="offer-after">{{ t('pricing.blackFriday.after') }}</p>
      </div>
    </div>

    <div class="cards">
      <article id="premium" class="card">
        <div class="name-row">
          <h3 class="name">{{ premium.name }}</h3>
          <Transition name="chip">
            <p v-if="period === 'year' && saving > 0" class="chip">
              {{ t('pricing.saving', { percent: saving }) }}
            </p>
          </Transition>
        </div>
        <p class="who">{{ t('pricing.premiumWho') }}</p>
        <PlanSwitch v-model="period" :options="periods" :label="t('pricing.periodLabel')" />
        <p class="price" aria-live="polite">
          <span v-if="byInstallments" class="lead">{{
            t('pricing.yearlyLead', { installments: yearlyInstallments })
          }}</span>
          <s v-if="yearlyStruck" class="was" :aria-label="yearlyStruck.label">{{
            yearlyStruck.text
          }}</s>
          <span class="amount"
            ><span class="unit currency">{{ premiumPrice.currency }}</span
            >{{ premiumPrice.amount
            }}<span v-if="byInstallments" class="unit">{{ t('pricing.perMonthShort') }}</span></span
          >
          <span v-if="!byInstallments" class="per">{{
            period === 'month' ? t('pricing.perMonth') : t('pricing.perYear')
          }}</span>
        </p>
        <p class="equiv">{{ premiumNote }}</p>
        <ul class="items">
          <li v-for="item in premiumItems" :key="item">{{ item }}</li>
        </ul>
        <div class="action action--pair" data-cta>
          <WhatsAppButton
            location="plans-premium"
            :label="t('cta.tryDays', { days: catalog.trialDays })"
            quiet
          />
          <NuxtLinkLocale
            :to="{
              path: '/assinar',
              query: { plano: period === 'month' ? 'premium-mensal' : 'premium-anual' },
            }"
            class="button"
            >{{ t('pricing.subscribeNow') }}</NuxtLinkLocale
          >
        </div>
      </article>

      <article id="coaching" class="card">
        <div class="name-row">
          <h3 class="name">{{ coaching.name }}</h3>
          <p v-if="chosen" class="chip">{{ t('pricing.recommended') }}</p>
          <Transition name="chip">
            <p v-if="chosen && chosen === best && packages.length > 1" class="chip">
              {{ t('pricing.perMonthAnchor', { price: wholeMoney(chosen.perMonthCents, locale) }) }}
            </p>
          </Transition>
        </div>
        <p class="who">{{ t('pricing.coachingWho') }}</p>
        <template v-if="chosen">
          <PlanSwitch
            v-if="packages.length > 1"
            :model-value="chosen.months"
            :options="packageOptions"
            :label="t('pricing.packageLabel')"
            @update:model-value="months = $event"
          />
          <p v-if="chosen.installments > 1" class="price" aria-live="polite">
            <span class="lead">{{
              t('pricing.installmentLead', {
                months: chosen.months,
                installments: chosen.installments,
              })
            }}</span>
            <s
              v-if="coachingStruck"
              class="was"
              :aria-label="
                t('pricing.blackFriday.struck', { price: money(coachingStruck.total, locale) })
              "
              >{{ money(coachingStruck.installment, locale) }}{{ t('pricing.perMonthShort') }}</s
            >
            <span class="amount"
              ><span class="unit currency">{{ installment.currency }}</span
              >{{ installment.amount
              }}<span class="unit">{{ t('pricing.perMonthShort') }}</span></span
            >
          </p>
          <p v-else class="price" aria-live="polite">
            <span class="amount">{{ money(chosen.totalCents, locale) }}</span>
            <span class="per">{{ t('pricing.forMonths', { months: chosen.months }) }}</span>
          </p>
          <p class="equiv">
            {{
              chosen.installments > 1
                ? t('pricing.installmentTotal', { total: money(chosen.totalCents, locale) })
                : t('pricing.byCard')
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
        <div class="action" data-cta>
          <NuxtLinkLocale
            v-if="chosen"
            :to="{ path: '/assinar', query: { plano: 'pro' } }"
            class="button"
            >{{ wantCoaching }}</NuxtLinkLocale
          >
          <WhatsAppButton
            v-else
            location="plans-coaching"
            :text="wantCoaching"
            :label="t('pricing.notifyMe')"
            quiet
          />
        </div>
      </article>
    </div>
    <PaymentBadges class="payments" :installments="maxInstallments" />
  </section>
</template>

<style scoped>
.pricing {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  align-items: center;
  gap: 3rem clamp(3rem, 1rem + 5vw, 6rem);
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
  gap: 2.5rem;
}

.title {
  font-size: var(--step-head);
}

.promises {
  display: grid;
  gap: 0.875rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.promises li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.promises svg {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: var(--green);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.payments {
  grid-column: -2;
  margin: -1.75rem 0 0;
}

.bare .payments {
  margin-top: 1.25rem;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 2.25rem 2rem 2rem;
  border-radius: var(--radius);
  background: var(--card);
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
.equiv {
  color: var(--muted);
  font-size: var(--step-small);
}

.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.5rem;
  margin-top: 0.5rem;
}

.amount {
  font-size: var(--step-figure);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.unit {
  font-size: 0.4em;
  letter-spacing: 0;
}

.currency {
  margin-right: 0.125rem;
}

.lead {
  flex-basis: 100%;
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.soon .amount {
  color: var(--muted);
}

.was {
  flex-basis: 100%;
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.offer {
  display: grid;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  background: var(--mint);
  font-size: var(--step-small);
}

.offer-title {
  color: var(--green);
  font-weight: 700;
}

.offer-after {
  color: var(--muted);
}

.bare .offer {
  margin-bottom: 1.25rem;
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

.action--pair {
  grid-template-columns: auto auto;
  gap: 0.5rem;
}

.action--pair :deep(.button) {
  padding: 0.5rem 0.625rem;
  font-size: var(--step-small);
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
