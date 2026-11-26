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
import { changeDay } from '#shared/siteDates'

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
const prices = usePrices(() => props.catalog)

const premium = computed(() => prices.value.premium)
const coaching = computed(() => prices.value.coaching)
const next = computed(() => prices.value.next)
const nextDay = computed(() => next.value && changeDay(next.value.from, locale.value))

type Later = { shown: string; spoken: string }
const later = (
  laterCents: number,
  nowCents: number,
  shown: (price: string) => string,
  said: (price: string) => string,
): Later | undefined => {
  if (nextDay.value === undefined || laterCents <= nowCents) return undefined
  const price = money(laterCents, locale.value)
  return {
    shown: shown(price),
    spoken: t('pricing.nextSpoken', { date: nextDay.value, price: said(price) }),
  }
}
const perMonthShort = (price: string) => `${price}${t('pricing.perMonthShort')}`

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
  if (period.value === 'month') return undefined
  return byInstallments.value
    ? t('pricing.installmentTotal', { total: money(premium.value.yearlyCents, locale.value) })
    : t('pricing.yearlyPerMonth', { price: yearlyPerMonth(premium.value, locale.value) })
})
const premiumLater = computed(() => {
  const plan = next.value?.premium
  if (!plan) return undefined
  if (period.value === 'month') {
    return later(
      plan.monthlyCents,
      premium.value.monthlyCents,
      (price) => price,
      (price) => `${price} ${t('pricing.perMonth')}`,
    )
  }
  if (byInstallments.value) {
    return later(
      yearlyShown(plan.yearlyCents),
      yearlyShown(premium.value.yearlyCents),
      perMonthShort,
      (price) => t('pricing.inInstallments', { count: yearlyInstallments.value, price }),
    )
  }
  return later(
    plan.yearlyCents,
    premium.value.yearlyCents,
    (price) => price,
    (price) => `${price} ${t('pricing.perYear')}`,
  )
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
const nextPack = computed(() =>
  next.value?.coaching?.months === chosen.value?.months ? next.value?.coaching : undefined,
)
const coachingLater = computed(() => {
  const pack = chosen.value
  const upcoming = nextPack.value
  if (!pack || !upcoming) return undefined
  return pack.installments > 1
    ? later(
        packageInstallmentCents(upcoming),
        packageInstallmentCents(pack),
        perMonthShort,
        (price) => t('pricing.inInstallments', { count: pack.installments, price }),
      )
    : later(
        upcoming.totalCents,
        pack.totalCents,
        (price) => price,
        (price) => `${price} ${t('pricing.forMonths', { months: pack.months })}`,
      )
})
const yearlyPix = computed(() =>
  period.value === 'year' && premium.value.yearlyPixCents !== undefined
    ? t('pricing.orPix', { price: money(premium.value.yearlyPixCents, locale.value) })
    : undefined,
)
const coachingPix = computed(() =>
  chosen.value?.pixCents === undefined
    ? undefined
    : t('pricing.orPix', { price: money(chosen.value.pixCents, locale.value) }),
)
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
  t('pricing.promises.noCard'),
  t('pricing.promises.guarantee'),
  t('pricing.promises.pay'),
  t('pricing.promises.cancel'),
])
</script>

<template>
  <section class="pricing" :class="{ bare }" aria-labelledby="pricing-title">
    <OfferPanel :catalog="catalog" class="offer" />
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
    </div>

    <div class="cards">
      <article id="premium" class="card">
        <div class="name-row">
          <h3 class="name">{{ premium.name }}</h3>
          <p v-if="blackFriday" class="chip chip--deal">{{ t('promo.label') }}</p>
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
          <span class="amount"
            ><span class="unit currency">{{ premiumPrice.currency }}</span
            >{{ premiumPrice.amount
            }}<span v-if="byInstallments" class="unit">{{ t('pricing.perMonthShort') }}</span></span
          >
          <span v-if="!byInstallments" class="per">{{
            period === 'month' ? t('pricing.perMonth') : t('pricing.perYear')
          }}</span>
        </p>
        <p v-if="premiumLater" class="later">
          <span aria-hidden="true"
            ><s>{{ premiumLater.shown }}</s></span
          ><span class="visually-hidden">{{ premiumLater.spoken }}</span>
        </p>
        <p v-if="premiumNote" class="equiv">{{ premiumNote }}</p>
        <p v-if="yearlyPix" class="pix">{{ yearlyPix }}</p>
        <ul class="items">
          <li v-for="item in premiumItems" :key="item">{{ item }}</li>
        </ul>
        <div class="action action--pair" data-cta>
          <WhatsAppButton location="plans-premium" :label="t('cta.try')" quiet />
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
          <p v-if="blackFriday && chosen" class="chip chip--deal">{{ t('promo.label') }}</p>
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
          <p v-if="coachingLater" class="later">
            <span aria-hidden="true"
              ><s>{{ coachingLater.shown }}</s></span
            ><span class="visually-hidden">{{ coachingLater.spoken }}</span>
          </p>
          <p v-if="chosen.installments > 1" class="equiv">
            {{ t('pricing.installmentTotal', { total: money(chosen.totalCents, locale) }) }}
          </p>
          <p v-else-if="!coachingPix" class="equiv">{{ t('pricing.byCard') }}</p>
          <p v-if="coachingPix" class="pix">{{ coachingPix }}</p>
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
  padding: 2.5rem 2.25rem 2.25rem;
  border-radius: var(--radius-panel);
  background: var(--card);
  box-shadow: var(--shadow-card);
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

.chip--deal {
  background: var(--black);
  color: #ffffff;
}

.offer {
  grid-column: 1 / -1;
  margin-bottom: clamp(1rem, 0.5rem + 1.5vw, 2rem);
}

.name-row .name {
  margin-right: auto;
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
  font-size: var(--step-price);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.unit {
  color: var(--muted);
  font-size: 0.3em;
  font-weight: 500;
  letter-spacing: 0;
}

.currency {
  margin-right: 0.25rem;
}

.lead {
  flex-basis: 100%;
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.soon .amount {
  color: var(--muted);
  font-size: var(--step-figure);
}

.later {
  margin-top: -0.375rem;
  color: var(--muted);
  font-size: var(--step-small);
}

.later s {
  text-decoration-thickness: 1px;
}

.pix {
  margin-top: -0.375rem;
  font-size: var(--step-small);
  font-weight: 600;
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
  min-height: 3.5rem;
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
