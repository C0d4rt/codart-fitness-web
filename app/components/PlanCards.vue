<script setup lang="ts">
import {
  bestPackage,
  type Catalog,
  installmentCents,
  money,
  moneyParts,
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

const premium = computed(() => props.catalog.premium)
const coaching = computed(() => props.catalog.coaching)

const period = ref<'month' | 'year'>('month')
const premiumPrice = computed(() =>
  moneyParts(
    period.value === 'month' ? premium.value.monthlyCents : premium.value.yearlyCents,
    locale.value,
  ),
)
const saving = computed(() => yearlySaving(premium.value))
const yearlyEquiv = computed(() => {
  const installments = premium.value.yearlyInstallments ?? 1
  return installments > 1
    ? t('pricing.yearlyInstallments', {
        installments,
        price: money(
          installmentCents({ totalCents: premium.value.yearlyCents, installments }),
          locale.value,
        ),
      })
    : t('pricing.yearlyPerMonth', { price: yearlyPerMonth(premium.value, locale.value) })
})
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
const installment = computed(() =>
  moneyParts(chosen.value ? installmentCents(chosen.value) : 0, locale.value),
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
  t('pricing.promises.trial', { days: props.catalog.trialDays }),
  t('pricing.promises.noCard'),
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
          <span class="amount"
            ><span class="unit currency">{{ premiumPrice.currency }}</span
            >{{ premiumPrice.amount }}</span
          >
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
              : yearlyEquiv
          }}
        </p>
        <ul class="items">
          <li v-for="item in premiumItems" :key="item">{{ item }}</li>
        </ul>
        <div class="action" data-cta>
          <WhatsAppButton
            location="plans-premium"
            :label="t('cta.tryDays', { days: catalog.trialDays })"
          />
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
          <WhatsAppButton
            location="plans-coaching"
            :text="wantCoaching"
            :label="chosen ? wantCoaching : t('pricing.notifyMe')"
            :quiet="!chosen"
          />
        </div>
      </article>
    </div>
    <ul class="payments" :aria-label="t('pricing.payments.label')">
      <li>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </svg>
        {{ t('pricing.payments.secure') }}
      </li>
      <li>
        <!-- The Pix symbol, from the logo of the Banco Central do Brasil. -->
        <svg class="pix" viewBox="0 5.746 78.518 78.518" aria-hidden="true">
          <g transform="translate(-535.594 -20.809)">
            <path
              d="m596.827 86.62c-3.08 0-5.978-1.199-8.156-3.377l-11.777-11.777c-.827-.829-2.268-.827-3.095 0l-11.82 11.82c-2.178 2.177-5.076 3.377-8.156 3.377h-2.321l14.916 14.915c4.658 4.658 12.211 4.658 16.869 0l14.958-14.958z"
            />
            <path
              d="m553.824 44.963c3.08 0 5.978 1.199 8.156 3.377l11.82 11.822c.851.852 2.241.855 3.095-.001l11.777-11.778c2.178-2.177 5.076-3.377 8.156-3.377h1.419l-14.958-14.958c-4.659-4.658-12.211-4.658-16.869 0l-14.915 14.915z"
            />
            <path
              d="m610.618 57.379-9.039-9.039c-.199.08-.415.129-.642.129h-4.11c-2.125 0-4.205.862-5.706 2.364l-11.776 11.777c-1.102 1.102-2.55 1.653-3.997 1.653-1.448 0-2.895-.551-3.997-1.652l-11.821-11.821c-1.501-1.503-3.581-2.364-5.706-2.364h-5.054c-.216 0-.417-.051-.607-.122l-9.075 9.075c-4.658 4.658-4.658 12.211 0 16.869l9.075 9.075c.19-.072.392-.122.607-.122h5.054c2.125 0 4.205-.861 5.706-2.364l11.82-11.82c2.136-2.135 5.861-2.135 7.995.001l11.776 11.776c1.501 1.502 3.581 2.364 5.706 2.364h4.11c.228 0 .443.05.642.129l9.039-9.039c4.658-4.658 4.658-12.211 0-16.869"
            />
          </g>
        </svg>
        {{ t('pricing.payments.pix') }}
      </li>
      <li>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
          <path d="M3 10h18M6.5 14.5h4" />
        </svg>
        {{ t('pricing.payments.card') }}
      </li>
      <li v-if="maxInstallments > 1">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" />
        </svg>
        {{ t('pricing.payments.installments', { installments: maxInstallments }) }}
      </li>
    </ul>
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

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.payments {
  grid-column: -2;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin: -1.75rem 0 0;
  padding: 0;
  list-style: none;
}

.bare .payments {
  margin-top: 1.25rem;
}

.payments li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0 1rem 0 0.875rem;
  border-radius: 999px;
  background: var(--card);
  color: var(--muted);
  font-size: var(--step-small);
}

.payments svg {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: var(--green);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.payments .pix {
  width: 1rem;
  height: 1rem;
  fill: var(--green);
  stroke: none;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 2.25rem 2rem 2rem;
  border-radius: var(--radius);
  background: var(--card);
}

#coaching {
  background: color-mix(in oklab, var(--card) 84%, var(--green));
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
