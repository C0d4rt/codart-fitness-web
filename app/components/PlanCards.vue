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
  'readyPrograms',
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
      <article id="premium" class="plan">
        <div class="label" data-ui>
          <div class="band">
            <h3 class="name">{{ premium.name }}</h3>
            <Transition name="tag">
              <p v-if="period === 'year' && saving > 0" class="tag">
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
              >{{ money(period === 'month' ? premium.monthlyCents : premium.yearlyCents, locale)
              }}<span class="mark" aria-hidden="true">*</span></span
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
                : t('pricing.yearlyPerMonth', { price: yearlyPerMonth(premium, locale) })
            }}
          </p>
          <table class="items">
            <thead>
              <tr>
                <th scope="col">{{ t('plans.featureColumn') }}</th>
                <th scope="col">{{ t('plans.included') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in premiumItems" :key="item">
                <th scope="row">{{ item }}</th>
                <td>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                  </svg>
                  <span class="visually-hidden">{{ t('plans.included') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <span aria-hidden="true">* </span>{{ t('home.terms', { days: catalog.trialDays }) }}
          </p>
        </div>
        <div class="action">
          <WhatsAppButton
            location="plans-premium"
            :label="t('cta.tryDays', { days: catalog.trialDays })"
          />
        </div>
      </article>

      <article id="coaching" class="plan">
        <div class="label" data-ui>
          <div class="band">
            <h3 class="name">{{ coaching.name }}</h3>
            <Transition name="tag">
              <p v-if="chosen && chosen === best && packages.length > 1" class="tag">
                {{
                  t('pricing.perMonthAnchor', { price: wholeMoney(chosen.perMonthCents, locale) })
                }}
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
              <span class="amount">
                <span v-if="chosen.installments > 1" class="times">{{
                  t('pricing.installmentsOf', { installments: chosen.installments })
                }}</span>
                {{ money(installmentCents(chosen), locale) }}
              </span>
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
          <p v-else class="price soon">
            <span class="amount">{{ t('pricing.soon') }}</span>
          </p>
          <table class="items">
            <thead>
              <tr>
                <th scope="col">{{ t('plans.featureColumn') }}</th>
                <th scope="col">{{ t('plans.included') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in coachingItems" :key="item">
                <th scope="row">{{ item }}</th>
                <td>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                  </svg>
                  <span class="visually-hidden">{{ t('plans.included') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="note">{{ chosen ? t('pricing.coachingTerms') : t('pricing.soonNote') }}</p>
        </div>
        <div class="action">
          <WhatsAppButton
            location="plans-coaching"
            :text="wantCoaching"
            :label="chosen ? wantCoaching : t('pricing.notifyMe')"
            quiet
          />
        </div>
      </article>
    </div>
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
  padding: 0;
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
  gap: clamp(1rem, 0.5rem + 1.5vw, 2rem);
}

.plan {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 1rem;
}

/* Set like the nutrition facts on a package: an ink box, heavy and light rules, figures to the right. */
.label {
  --rule: 1px solid var(--ink);
  --heavy: 0.5rem solid var(--ink);

  display: flex;
  container-type: inline-size;
  flex-direction: column;
  padding: 0.75rem 1.125rem 1rem;
  border: 2px solid var(--ink);
  background: var(--card);
  color: var(--ink);
}

.band {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  padding-bottom: 0.5rem;
  border-bottom: var(--rule);
}

.name {
  font-size: var(--step-title);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.tag {
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  background: var(--mint);
  color: var(--green);
  font-size: var(--step-small);
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
}

.tag-enter-active {
  transition:
    opacity 200ms var(--ease-out),
    transform 200ms var(--ease-out);
}

.tag-leave-active {
  transition: opacity 120ms var(--ease-out);
}

.tag-enter-from {
  opacity: 0;
  transform: scale(0.94);
}

.tag-leave-to {
  opacity: 0;
}

.who {
  padding: 0.625rem 0;
  font-size: var(--step-small);
  line-height: 1.45;
}

.switch {
  position: relative;
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-self: flex-start;
  margin-bottom: 0.75rem;
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

/* The price is the label's energy line: the figure large, the portion it covers at its right. */
.price {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 1rem;
  padding: 0.5rem 0 0.375rem;
  border-top: var(--heavy);
}

.amount {
  font-size: min(var(--step-figure), 16cqi);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.mark {
  font-size: 0.5em;
  vertical-align: 0.8em;
}

.times {
  font-size: var(--step-body);
  letter-spacing: 0;
}

.soon .amount {
  color: var(--muted);
}

.per {
  font-weight: 700;
  white-space: nowrap;
}

.equiv {
  padding: 0.5rem 0;
  border-top: var(--rule);
  font-size: var(--step-small);
}

.items {
  width: 100%;
  margin-top: 0.25rem;
  border-collapse: collapse;
  border-top: var(--heavy);
  font-size: var(--step-small);
}

.items tbody {
  vertical-align: top;
}

.items th,
.items td {
  padding: 0.4375rem 0;
  border-bottom: var(--rule);
  font-weight: 400;
  text-align: left;
  text-wrap: pretty;
}

.items thead th {
  font-weight: 700;
}

.items th + th,
.items td {
  width: 1%;
  padding-left: 1rem;
  text-align: right;
  white-space: nowrap;
}

.items tbody tr:last-child > * {
  border-bottom: 0;
}

.items svg {
  display: inline-block;
  width: 1.125rem;
  height: 1.125rem;
  vertical-align: -0.2em;
  fill: none;
  stroke: var(--green);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.note {
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 0.25rem solid var(--ink);
  font-size: 0.8125rem;
  line-height: 1.45;
}

.action {
  display: grid;
}

.action :deep(.button) {
  padding-block: 0.75rem;
  line-height: 1.25;
  text-align: center;
  text-wrap: balance;
}

@media (prefers-reduced-motion: reduce) {
  .glide {
    transition: none;
  }
  .tag-enter-from {
    transform: none;
  }
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
  .label {
    padding-inline: 0.875rem;
  }
}

@media (forced-colors: active) {
  .glide {
    background: Highlight;
  }
  .switch button[aria-pressed='true'] {
    color: HighlightText;
  }
}
</style>
