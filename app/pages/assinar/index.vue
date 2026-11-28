<script setup lang="ts">
import { brand } from '~/brand'
import { takeFragment } from '#shared/fragment'
import { money as moneyText, moneyParts, yearlyPerMonth } from '#shared/plans'
import {
  cheaperPixOf,
  choiceOfSlug,
  defaultMethod,
  installmentOf,
  methodPriceOf,
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
const prices = usePrices(catalog)
const blackFriday = useBlackFriday(catalog)
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
const offer = computed(() => live.value ?? offerFromCatalog(prices.value, titles.value))
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
const premiumCycle = ref<PlanOffer['cycle']>('yearly')
watch(
  chosen,
  (now) => {
    if (now?.plan === 'premium') premiumCycle.value = now.cycle
  },
  { immediate: true },
)
type PlanId = PlanOffer['plan']
const methods = reactive<Partial<Record<PlanId, PayMethod['method']>>>({})
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

const orPix = (each: PlanOffer) => {
  const cents = cheaperPixOf(each)
  return cents === undefined ? undefined : t('pricing.orPix', { price: money(cents, locale.value) })
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

const methodLabel = (each: PlanOffer, pay: PayMethod) => {
  if (pay.method === 'pix') {
    return each.cycle === 'yearly' ? t('subscribe.methods.pixUpfront') : t('subscribe.methods.pix')
  }
  return pay.installments && pay.installments > 1
    ? t('subscribe.methods.cardInstallments', { installments: pay.installments })
    : t('subscribe.methods.card')
}

const methodNote = (each: PlanOffer, pay: PayMethod) => {
  if (pay.blocked === 'already_subscribed') return t('subscribe.methodNotes.alreadySubscribed')
  const price = money(methodPriceOf(each, pay), locale.value)
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
  if (paying.value || loading.value || !live.value) return
  const method = methods[each.plan]
  if (!method) {
    payErrors[each.plan] = 'pickMethod'
    return
  }
  payErrors[each.plan] = undefined
  paying.value = each.plan
  const result = await api.checkout({
    plan: each.plan,
    cycle: each.cycle,
    method,
    // Buying is the declaration the terms ask of whoever pays (terms 15), shown above the button.
    declared: Boolean(live.value.declaration),
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
      'declaration_required',
    ].includes(result.code)
  ) {
    await loadPlans()
  }
}

// The offer the API gave before the prices switched is the old one.
watch(blackFriday, (on, was) => {
  if (was && !on && !loading.value) void loadPlans()
})

// A page from the browser's back cache may hold an old offer and a pay button left pressed.
const onShow = (event: PageTransitionEvent) => {
  if (!event.persisted) return
  paying.value = undefined
  if (!loading.value) void loadPlans()
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

      <OfferPanel :catalog="catalog" />

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
            <p v-if="blackFriday && !each.blocked" class="chip chip--deal">
              {{ t('promo.label') }}
            </p>
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
              <p v-if="orPix(each)" class="pix">{{ orPix(each) }}</p>
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
            <template v-else-if="each.cycle === 'yearly' && installmentOf(each).count > 1">
              <p class="price">
                <span class="lead-line">{{
                  t('pricing.yearlyLead', { installments: installmentOf(each).count })
                }}</span>
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
              <p v-if="orPix(each)" class="pix">{{ orPix(each) }}</p>
            </template>
            <template v-else>
              <p class="price">
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
              <p v-if="each.cycle !== 'monthly'" class="equiv">{{ yearlyNote(each) }}</p>
              <p v-if="orPix(each)" class="pix">{{ orPix(each) }}</p>
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
                  <span class="method-icon">
                    <PixMark v-if="option.method === 'pix'" class="pix-mark" />
                    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                      <path d="M3 10h18M6.5 14.5h4" />
                    </svg>
                  </span>
                  <span class="method-text">
                    <span class="method-name">{{ methodLabel(each, option) }}</span>
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
                <li v-if="methods[each.plan] === 'pix'">{{ t('subscribe.pixPrepaid') }}</li>
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
                <p v-if="payErrors[each.plan]" class="error" role="alert">
                  {{
                    payErrors[each.plan] === 'pickMethod'
                      ? t('subscribe.pickMethod')
                      : errorText(payErrors[each.plan] as SiteErrorCode)
                  }}
                </p>

                <p
                  v-if="live?.declaration"
                  :id="`declaration-${each.plan}`"
                  class="equiv declaration"
                >
                  {{ live.declaration.text }}
                </p>
                <button
                  type="submit"
                  class="button pay-button"
                  :disabled="Boolean(paying) || loading || !live || offline"
                  :aria-busy="paying === each.plan"
                  :aria-describedby="live?.declaration ? `declaration-${each.plan}` : undefined"
                >
                  {{ paying === each.plan ? t('subscribe.paying') : t('subscribe.pay') }}
                </button>
                <p class="secure">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
                    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
                  </svg>
                  {{ t('subscribe.secure') }}
                </p>
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
  background: var(--green-mark);
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
  padding: 2.25rem 2rem 2rem;
  border-radius: var(--radius-panel);
  background: var(--card);
  box-shadow:
    inset 0 0 0 2px transparent,
    var(
      --shadow-card
    ); /* taste-skill-ignore: the ring that marks the chosen plan, over the card shadow */
  transition: box-shadow 200ms var(--ease-out);
}

.card.picked {
  box-shadow:
    inset 0 0 0 2px var(--green),
    var(--shadow-card); /* taste-skill-ignore: the ring that marks the chosen plan */
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
  margin-right: auto;
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
  background: var(--promo-black);
  color: #ffffff;
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

.soon .amount {
  color: var(--muted);
  font-size: var(--step-figure);
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

.pix {
  font-size: var(--step-small);
  font-weight: 600;
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
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  border-radius: var(--radius-small);
  background: var(--ground);
  cursor: pointer;
  transition:
    box-shadow 160ms var(--ease-out),
    background-color 160ms ease;
}

.method:has(input:checked) {
  background: var(--card);
}

.method-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--mint);
  color: var(--green);
}

.method-icon svg {
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.method-icon .pix-mark {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
  stroke: none;
}

.method:has(input:checked) {
  box-shadow: inset 0 0 0 2px var(--green); /* taste-skill-ignore: the ring of the chosen method */
}

.method.off {
  cursor: not-allowed;
  opacity: 0.7;
}

.method input {
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
  background: var(--green-mark);
}

.error {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-small);
  background: var(--peach);
  font-size: var(--step-small);
}

.declaration {
  text-align: center;
}

.pay-button {
  width: 100%;
}

.secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  color: var(--muted);
  font-size: var(--step-small);
  text-align: center;
}

.secure svg {
  flex: none;
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
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
