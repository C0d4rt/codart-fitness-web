<script setup lang="ts">
import { brand } from '~/brand'
import { takeFragment } from '#shared/fragment'
import { money as moneyText, moneyParts, yearlyPerMonth, yearlySaving } from '#shared/plans'
import {
  choiceOfSlug,
  defaultMethod,
  installmentOf,
  mostInstallments,
  offerFromCatalog,
  orderedPlans,
  type PlanChoice,
  sameChoice,
  slugOf,
} from '#shared/purchaseFlow'
import type { PayMethod, PlanOffer, PlansResponse } from '#shared/siteApi'
import { dayMonth } from '#shared/siteDates'
import type { SiteErrorCode } from '#shared/siteErrors'

definePageMeta({ account: true })

const catalog = await usePlans()
const { t } = useI18n()
const locale = useSiteLocale()
const apiLocale = useApiLocale()
const api = useSiteApi()
const account = useSiteAccount()
const errorText = useSiteError()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

useSeoMeta({
  title: t('subscribe.title'),
  description: t('subscribe.description', { name: brand.name }),
  robots: 'noindex',
})

const titles = computed(() => ({
  monthly: t('subscribe.titles.premiumMonthly'),
  yearly: t('subscribe.titles.premiumYearly'),
  coaching: t('subscribe.titles.coaching'),
}))

const live = ref<PlansResponse>()
const loading = ref(true)
const offline = ref(false)
const notice = ref<SiteErrorCode>()
const offer = computed(() => live.value ?? offerFromCatalog(catalog, titles.value))
const plans = computed(() => orderedPlans(offer.value.plans))
const blocked = computed(() => offer.value.blocked === 'guardian_required')
const known = computed(() => offer.value.buyer !== 'anonymous')

const chosen = ref<PlanChoice>()
// The prerendered page hydrates on its own path; the query arrives with the navigation after it.
watch(
  () => route.query.plano,
  (slug) => {
    const wanted = choiceOfSlug(slug)
    if (wanted && !sameChoice(wanted, chosen.value)) chosen.value = wanted
  },
  { immediate: true },
)
const premiumCycle = ref<PlanOffer['cycle']>('monthly')
watch(
  chosen,
  (now) => {
    if (now?.plan === 'premium') premiumCycle.value = now.cycle
  },
  { immediate: true },
)
type PlanId = PlanOffer['plan']
const methods = reactive<Partial<Record<PlanId, PayMethod['method']>>>({})
const declared = reactive<Partial<Record<PlanId, boolean>>>({})
const payErrors = reactive<Partial<Record<PlanId, SiteErrorCode | 'pickMethod'>>>({})
const paying = ref<PlanId>()

const premiumOffer = (cycle: PlanOffer['cycle']) =>
  plans.value.find((each) => sameChoice(each, { plan: 'premium', cycle }))
const cards = computed(() =>
  plans.value.filter((each) => each.plan !== 'premium' || each.cycle === premiumCycle.value),
)
const cycles = computed(() => [
  { value: 'monthly' as const, label: t('pricing.monthly') },
  { value: 'yearly' as const, label: t('pricing.yearly') },
])
const most = computed(() => mostInstallments(plans.value))
const who = computed(() => whoOf(account.value))
const whatsApp = useWhatsAppLink(null)
const notifyLink = useWhatsAppLink(() => t('pricing.wantPlan', { plan: titles.value.coaching }))

// A price never breaks between the symbol and the amount.
const money = (cents: number, at: typeof locale.value) =>
  moneyText(cents, at).replace(/\s/g, '\u00a0')
const buyable = (each: PlanOffer) => !each.blocked && !blocked.value && each.methods.length > 0

const blackFriday = useBlackFriday()
const struckOf = (each: PlanOffer): { text: string; label: string } | undefined => {
  if (each.plan === 'coaching') {
    const from = blackFriday.coachingFrom(each.fullCents ?? each.priceCents)
    if (!from) return undefined
    const count = installmentOf(each).count
    return {
      text: `${money(Math.round(from / count), locale.value)}${t('pricing.perMonthShort')}`,
      label: t('pricing.blackFriday.struck', { price: money(from, locale.value) }),
    }
  }
  const from = each.cycle === 'yearly' ? blackFriday.yearlyFrom(each.priceCents) : undefined
  if (!from) return undefined
  const price = money(from, locale.value)
  return { text: price, label: t('pricing.blackFriday.struck', { price }) }
}

const focusPlan = (each: PlanOffer) => {
  chosen.value = { plan: each.plan, cycle: each.cycle }
  payErrors[each.plan] = undefined
  void router.replace({ query: { plano: slugOf(each) } })
}

// The monthly card renews by itself, so a method kept from the yearly must not stay ticked on it.
const pickCycle = (cycle: PlanOffer['cycle']) => {
  premiumCycle.value = cycle
  const next = premiumOffer(cycle)
  if (!next) return
  methods.premium = defaultMethod(next)
  focusPlan(next)
}

const orYearly = computed(() => {
  const monthlyCents = premiumOffer('monthly')?.priceCents ?? 0
  const yearlyCents = premiumOffer('yearly')?.priceCents ?? 0
  return t('pricing.orYearly', {
    price: money(yearlyCents, locale.value),
    percent: monthlyCents > 0 ? yearlySaving({ monthlyCents, yearlyCents }) : 0,
  })
})

watch(
  cards,
  (now) => {
    for (const each of now) {
      const open = each.methods.some((pay) => pay.method === methods[each.plan] && !pay.blocked)
      if (!open) methods[each.plan] = defaultMethod(each)
    }
  },
  { immediate: true },
)

const methodLabel = (pay: PayMethod) => {
  if (pay.method === 'pix') return t('subscribe.methods.pix')
  return pay.installments && pay.installments > 1
    ? t('subscribe.methods.cardInstallments', { installments: pay.installments })
    : t('subscribe.methods.card')
}

const methodNote = (each: PlanOffer, pay: PayMethod) => {
  if (pay.blocked === 'already_subscribed') return t('subscribe.methodNotes.alreadySubscribed')
  const price = money(each.priceCents, locale.value)
  if (each.plan === 'coaching') {
    return t('subscribe.methodNotes.coaching', { price, months: each.months ?? 12 })
  }
  if (each.cycle === 'yearly') return t('subscribe.methodNotes.yearly', { price })
  return pay.method === 'pix'
    ? t('subscribe.methodNotes.pix', { price })
    : t('subscribe.methodNotes.cardRenews', { price })
}

const yearlyNote = (each: PlanOffer) => {
  const installment = installmentOf(each)
  return installment.count > 1
    ? t('pricing.yearlyInstallments', {
        installments: installment.count,
        price: money(installment.cents, locale.value),
      })
    : t('pricing.yearlyPerMonth', {
        price: yearlyPerMonth({ yearlyCents: each.priceCents }, locale.value),
      })
}

const loadPlans = async () => {
  loading.value = true
  const [me, answer] = await Promise.all([api.me(), api.plans(apiLocale.value)])
  if (me.ok) account.value = me.data
  loading.value = false
  if (!answer.ok) {
    offline.value = true
    return
  }
  offline.value = false
  live.value = answer.data
}

const signOut = async () => {
  const done = await api.logout()
  if (done.ok) {
    account.value = { signedIn: false }
    await loadPlans()
  }
}

const pay = async (each: PlanOffer) => {
  if (paying.value || !live.value) return
  const method = methods[each.plan]
  if (!method) {
    payErrors[each.plan] = 'pickMethod'
    return
  }
  if (live.value.declaration && !declared[each.plan]) {
    payErrors[each.plan] = 'declaration_required'
    return
  }
  payErrors[each.plan] = undefined
  paying.value = each.plan
  const result = await api.checkout({
    plan: each.plan,
    cycle: each.cycle,
    method,
    declared: Boolean(live.value.declaration) && Boolean(declared[each.plan]),
    locale: apiLocale.value,
  })
  if (result.ok) {
    window.location.assign(result.data.checkoutUrl)
    return
  }
  paying.value = undefined
  if (result.code === 'purchase_paid') {
    await navigateTo(localePath('/assinar/pronto'))
    return
  }
  payErrors[each.plan] = result.code
  if (
    [
      'checkout_refused',
      'already_subscribed',
      'method_unavailable',
      'pro_unavailable',
      'guardian_required',
    ].includes(result.code)
  ) {
    await loadPlans()
  }
}

// A pay button left pressed by the browser's back cache would block a second try.
const onShow = (event: PageTransitionEvent) => {
  if (event.persisted) paying.value = undefined
}

onMounted(async () => {
  window.addEventListener('pageshow', onShow)
  const token = takeFragment(window as unknown as Record<string, unknown>, 'c')
  if (token) {
    const handoff = await api.handoff(token)
    if (!handoff.ok) notice.value = handoff.code
  }
  await loadPlans()
  // Stacked on a phone, the open Premium card would hide the Pro the link came for.
  if (chosen.value?.plan === 'coaching' && window.matchMedia('(max-width: 63.99rem)').matches) {
    await nextTick()
    document.getElementById('plan-coaching')?.scrollIntoView()
  }
})

onBeforeUnmount(() => window.removeEventListener('pageshow', onShow))
</script>

<template>
  <div class="subscribe-page">
    <SiteNav />
    <main id="conteudo">
      <header class="intro">
        <h1 class="title">{{ t('subscribe.heading') }}</h1>
        <p class="lead">{{ t('subscribe.lead') }}</p>
        <div class="who">
          <template v-if="who && account?.signedIn">
            <p class="pill">
              <span class="dot" aria-hidden="true" />
              {{
                account.scope === 'account'
                  ? t('subscribe.signedInAs', { who })
                  : t('subscribe.buyingFor', { who })
              }}
            </p>
            <button
              v-if="account.scope === 'account'"
              type="button"
              class="text-link"
              @click="signOut"
            >
              {{ t('subscribe.signOut') }}
            </button>
            <NuxtLinkLocale
              v-else
              :to="{ path: '/entrar', query: { voltar: 'assinar' } }"
              class="text-link"
              >{{ t('subscribe.notYou') }} {{ t('subscribe.signInOther') }}</NuxtLinkLocale
            >
          </template>
          <p v-else-if="!loading">
            {{ t('subscribe.haveAccount', { name: brand.name }) }}
            <NuxtLinkLocale
              :to="{
                path: '/entrar',
                query: chosen
                  ? { voltar: 'assinar', plano: slugOf(chosen) }
                  : { voltar: 'assinar' },
              }"
              class="text-link"
              >{{ t('subscribe.signIn') }}</NuxtLinkLocale
            >
          </p>
        </div>
      </header>

      <div class="notes" aria-live="polite">
        <p v-if="notice" class="note">{{ errorText(notice) }}</p>
        <p v-if="blocked" class="note">
          {{ t('subscribe.guardianBlocked') }}
          <a :href="whatsApp" target="_blank" rel="noopener" class="text-link">{{
            t('subscribe.openWhatsApp')
          }}</a>
        </p>
        <p v-if="offline" class="note" role="alert">
          {{ t('subscribe.offline') }}
          <button type="button" class="text-link" @click="loadPlans">
            {{ t('subscribe.retry') }}
          </button>
        </p>
        <p v-else-if="loading" class="loading">{{ t('subscribe.loading') }}</p>
      </div>

      <ul class="cards" :aria-label="t('subscribe.cardsLabel')">
        <li
          v-for="each in cards"
          :id="`plan-${each.plan}`"
          :key="each.plan"
          class="card"
          :class="{ picked: sameChoice(each, chosen) }"
        >
          <div class="name-row">
            <h2 class="name">
              {{ each.plan === 'premium' ? t('subscribe.titles.premium') : each.title }}
            </h2>
            <p v-if="each.plan === 'coaching' && !each.blocked" class="chip">
              {{ t('pricing.recommended') }}
            </p>
          </div>
          <p class="plan-who">
            {{ each.plan === 'premium' ? t('pricing.premiumWho') : t('pricing.coachingWho') }}
          </p>
          <PlanSwitch
            v-if="each.plan === 'premium'"
            :model-value="premiumCycle"
            :options="cycles"
            :label="t('pricing.periodLabel')"
            @update:model-value="pickCycle"
          />

          <template v-if="each.blocked === 'pro_unavailable'">
            <p class="price soon">
              <span class="amount">{{ t('pricing.soon') }}</span>
            </p>
            <p class="equiv">{{ t('pricing.soonNote') }}</p>
            <a :href="notifyLink" target="_blank" rel="noopener" class="button button--quiet">{{
              t('pricing.notifyMe')
            }}</a>
          </template>

          <template v-else>
            <template v-if="each.plan === 'coaching'">
              <p class="price">
                <span class="lead-line">{{
                  t('pricing.installmentLead', {
                    months: each.months ?? 12,
                    installments: installmentOf(each).count,
                  })
                }}</span>
                <s v-if="struckOf(each)" class="was" :aria-label="struckOf(each)?.label">{{
                  struckOf(each)?.text
                }}</s>
                <span class="amount"
                  ><span class="unit currency">{{
                    moneyParts(installmentOf(each).cents, locale).currency
                  }}</span
                  >{{ moneyParts(installmentOf(each).cents, locale).amount
                  }}<span class="unit">{{ t('pricing.perMonthShort') }}</span></span
                >
              </p>
              <p class="equiv">
                {{ t('pricing.installmentTotal', { total: money(each.priceCents, locale) }) }}
              </p>
              <div v-if="each.discountCents && each.fullCents" class="credit">
                <p>
                  {{
                    t('subscribe.proFrom', {
                      full: money(each.fullCents, locale),
                      total: money(each.priceCents, locale),
                    })
                  }}
                </p>
                <ul>
                  <li v-for="credit in each.credits ?? []" :key="credit.from">
                    {{
                      t('subscribe.proCredit', {
                        from: dayMonth(credit.from, locale),
                        until: dayMonth(credit.until, locale),
                        amount: money(credit.cents, locale),
                      })
                    }}
                  </li>
                </ul>
              </div>
              <NuxtLinkLocale
                v-else-if="each.signInToDiscount && !known"
                :to="{ path: '/entrar', query: { voltar: 'assinar', plano: 'pro' } }"
                class="text-link discount"
                >{{ t('subscribe.signInToDiscount') }}</NuxtLinkLocale
              >
            </template>
            <template v-else>
              <p class="price">
                <s v-if="struckOf(each)" class="was" :aria-label="struckOf(each)?.label">{{
                  struckOf(each)?.text
                }}</s>
                <span class="amount"
                  ><span class="unit currency">{{
                    moneyParts(each.priceCents, locale).currency
                  }}</span
                  >{{ moneyParts(each.priceCents, locale).amount }}</span
                >
                <span class="per">{{
                  each.cycle === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear')
                }}</span>
              </p>
              <p class="equiv">
                {{ each.cycle === 'monthly' ? orYearly : yearlyNote(each) }}
              </p>
            </template>

            <p v-if="each.blocked === 'guardian_required'" class="equiv blocked">
              {{ t('subscribe.proGuardian') }}
            </p>

            <form v-if="buyable(each)" class="pay" @submit.prevent="pay(each)">
              <fieldset>
                <legend>{{ t('subscribe.howToPay') }}</legend>
                <label
                  v-for="option in each.methods"
                  :key="option.method"
                  class="method"
                  :class="{ off: option.blocked }"
                >
                  <input
                    v-model="methods[each.plan]"
                    type="radio"
                    :name="`method-${each.plan}`"
                    :value="option.method"
                    :disabled="Boolean(option.blocked)"
                    @change="focusPlan(each)"
                  />
                  <span class="method-text">
                    <span class="method-name">{{ methodLabel(option) }}</span>
                    <span class="method-note">{{ methodNote(each, option) }}</span>
                  </span>
                </label>
              </fieldset>

              <ul class="points">
                <template v-if="each.plan === 'coaching'">
                  <li>{{ t('subscribe.proPoints.months', { months: each.months ?? 12 }) }}</li>
                  <li>{{ t('subscribe.proPoints.cancelsMonthly') }}</li>
                </template>
                <li v-else-if="each.cycle === 'monthly'">{{ t('subscribe.cancelAnytime') }}</li>
                <li>{{ t('subscribe.guarantee') }}</li>
                <li v-if="!known">
                  {{
                    each.plan === 'coaching'
                      ? t('subscribe.proPoints.activate', { months: each.months ?? 12 })
                      : t('subscribe.activateLater')
                  }}
                </li>
                <li>
                  <NuxtLinkLocale to="/termos" class="text-link" target="_blank">{{
                    t('subscribe.readTerms')
                  }}</NuxtLinkLocale>
                </li>
              </ul>

              <div class="pay-end">
                <label v-if="live?.declaration" class="declare">
                  <input v-model="declared[each.plan]" type="checkbox" />
                  <span>{{ live.declaration.text }}</span>
                </label>

                <p v-if="payErrors[each.plan]" class="error" role="alert">
                  {{
                    payErrors[each.plan] === 'pickMethod'
                      ? t('subscribe.pickMethod')
                      : errorText(payErrors[each.plan] as SiteErrorCode)
                  }}
                </p>

                <button
                  type="submit"
                  class="button pay-button"
                  :disabled="Boolean(paying) || !live || offline"
                  :aria-busy="paying === each.plan"
                >
                  {{ paying === each.plan ? t('subscribe.paying') : t('subscribe.pay') }}
                </button>
                <p class="secure">{{ t('subscribe.secure') }}</p>
              </div>
            </form>
          </template>
        </li>
      </ul>

      <PaymentBadges class="badges" :installments="most" />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
main {
  display: grid;
  gap: 2rem;
  padding: clamp(3rem, 1.5rem + 5vw, 6rem) var(--margin) var(--gap-band);
}

.intro {
  display: grid;
  gap: 1.25rem;
}

.title {
  font-size: var(--step-display);
  line-height: 0.98;
}

.lead {
  max-width: 44ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.who {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  min-height: 2.5rem;
  font-size: var(--step-small);
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0 1rem;
  border-radius: 999px;
  background: var(--card);
  font-weight: 500;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--green);
}

.text-link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--green);
  font: inherit;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.22em;
  cursor: pointer;
}

.notes {
  display: grid;
  gap: 0.75rem;
}

.notes:empty {
  display: none;
}

.note {
  max-width: 60ch;
  padding: 0.875rem 1.125rem;
  border-radius: var(--radius-small);
  background: var(--sand);
  font-size: var(--step-small);
}

.loading {
  color: var(--muted);
  font-size: var(--step-small);
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 2rem 1.75rem 1.75rem;
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: inset 0 0 0 2px transparent; /* taste-skill-ignore: the ring that marks the chosen plan, not a shadow */
  transition: box-shadow 200ms var(--ease-out);
}

.card.picked {
  box-shadow: inset 0 0 0 2px var(--green); /* taste-skill-ignore: the ring that marks the chosen plan */
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

.plan-who {
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

.was {
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

.lead-line {
  flex-basis: 100%;
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.equiv {
  color: var(--muted);
  font-size: var(--step-small);
}

.blocked {
  color: var(--ink);
}

.credit {
  display: grid;
  gap: 0.375rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-small);
  background: var(--mint);
  font-size: var(--step-small);
}

.credit p {
  font-weight: 700;
}

.credit ul {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.discount {
  font-size: var(--step-small);
}

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pay {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--tone);
}

/* The two pay buttons line up however long each card's list runs. */
.pay-end {
  display: grid;
  gap: 1rem;
  margin-top: auto;
}

fieldset {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.method {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-small);
  background: var(--ground);
  cursor: pointer;
  transition: box-shadow 160ms var(--ease-out);
}

.method:has(input:checked) {
  box-shadow: inset 0 0 0 2px var(--green); /* taste-skill-ignore: the ring of the chosen method */
}

.method.off {
  cursor: not-allowed;
  opacity: 0.7;
}

.method input,
.declare input {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0.125rem 0 0;
  accent-color: var(--green);
}

.method-text {
  display: grid;
  gap: 0.125rem;
}

.method-name {
  font-weight: 500;
}

.method-note {
  color: var(--muted);
  font-size: var(--step-small);
}

.points {
  display: grid;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-small);
}

.points li {
  position: relative;
  padding-left: 1.25rem;
}

.points li::before {
  content: '';
  position: absolute;
  top: 0.55em;
  left: 0.125rem;
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background: var(--green);
}

.declare {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: var(--step-small);
  cursor: pointer;
}

.error {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-small);
  background: var(--peach);
  font-size: var(--step-small);
}

.pay-button {
  width: 100%;
}

.secure {
  color: var(--muted);
  font-size: var(--step-small);
  text-align: center;
}

.badges {
  justify-content: center;
}

@media (max-width: 63.99rem) {
  .cards {
    grid-template-columns: 1fr;
    max-width: 36rem;
  }
}

@media (max-width: 47.99rem) {
  .card {
    padding: 1.5rem;
  }
}
</style>
