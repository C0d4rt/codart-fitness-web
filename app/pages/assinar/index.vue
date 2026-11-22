<script setup lang="ts">
import { brand } from '~/brand'
import { takeFragment } from '#shared/fragment'
import { installmentCents, money as moneyText } from '#shared/plans'
import {
  choiceOfSlug,
  defaultMethod,
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
const method = ref<PayMethod['method']>()
const declared = ref(false)
const paying = ref(false)
const payError = ref<SiteErrorCode | 'pickMethod'>()

const chosenOffer = computed(() => plans.value.find((each) => sameChoice(each, chosen.value)))
const who = computed(() => whoOf(account.value))
const whatsApp = useWhatsAppLink(null)
const notifyLink = useWhatsAppLink(() => t('pricing.wantPlan', { plan: titles.value.coaching }))

// A price never breaks between the symbol and the amount.
const money = (cents: number, at: typeof locale.value) =>
  moneyText(cents, at).replace(/\s/g, '\u00a0')
const keyOf = (each: PlanChoice) => slugOf(each)
const buyable = (each: PlanOffer) => !each.blocked && !blocked.value && each.methods.length > 0

const choose = (each: PlanOffer) => {
  if (!buyable(each)) return
  chosen.value = { plan: each.plan, cycle: each.cycle }
  method.value = defaultMethod(each)
  payError.value = undefined
  void router.replace({ query: { plano: slugOf(each) } })
}

watch(chosenOffer, (now) => {
  if (now && (!method.value || !now.methods.some((each) => each.method === method.value))) {
    method.value = defaultMethod(now)
  }
})

const methodLabel = (each: PlanOffer, pay: PayMethod) => {
  if (pay.method === 'pix') return t('subscribe.methods.pix')
  if (pay.renews) return t('subscribe.methods.cardRenews')
  if (pay.installments && pay.installments > 1) {
    return each.plan === 'coaching'
      ? t('subscribe.methods.cardInstallments', { installments: pay.installments })
      : t('subscribe.methods.cardOnce', { installments: pay.installments })
  }
  return t('subscribe.methods.card')
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

const installmentsOf = (each: PlanOffer) =>
  Math.max(1, ...each.methods.map((pay) => pay.installments ?? 1))

const perInstallment = (each: PlanOffer) =>
  each.installmentCents && each.installmentCents > 0
    ? each.installmentCents
    : installmentCents({ totalCents: each.priceCents, installments: installmentsOf(each) })

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

const pay = async () => {
  const each = chosenOffer.value
  if (!each || paying.value || !live.value) return
  if (!method.value) {
    payError.value = 'pickMethod'
    return
  }
  if (live.value.declaration && !declared.value) {
    payError.value = 'declaration_required'
    return
  }
  payError.value = undefined
  paying.value = true
  const result = await api.checkout({
    plan: each.plan,
    cycle: each.cycle,
    method: method.value,
    declared: Boolean(live.value.declaration) && declared.value,
    locale: apiLocale.value,
  })
  if (result.ok) {
    window.location.assign(result.data.checkoutUrl)
    return
  }
  paying.value = false
  if (result.code === 'purchase_paid') {
    await navigateTo(localePath('/assinar/pronto'))
    return
  }
  payError.value = result.code
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
  if (event.persisted) paying.value = false
}

onMounted(async () => {
  window.addEventListener('pageshow', onShow)
  const token = takeFragment(window as unknown as Record<string, unknown>, 'c')
  if (token) {
    const handoff = await api.handoff(token)
    if (!handoff.ok) notice.value = handoff.code
  }
  await loadPlans()
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
          v-for="each in plans"
          :key="keyOf(each)"
          class="card"
          :class="{ pro: each.plan === 'coaching', picked: sameChoice(each, chosen) }"
        >
          <h2 class="name">{{ each.title }}</h2>

          <template v-if="each.blocked === 'pro_unavailable'">
            <p class="price soon">
              <span class="amount">{{ t('subscribe.soon') }}</span>
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
                  t('subscribe.proLead', {
                    months: each.months ?? 12,
                    installments: installmentsOf(each),
                  })
                }}</span>
                <span class="amount">{{ money(perInstallment(each), locale) }}</span>
              </p>
              <p class="equiv">
                {{ t('subscribe.proTotal', { total: money(each.priceCents, locale) }) }}
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
                <span class="amount">{{ money(each.priceCents, locale) }}</span>
                <span class="per">{{
                  each.cycle === 'monthly' ? t('subscribe.perMonth') : t('subscribe.perYear')
                }}</span>
              </p>
              <p class="equiv">
                {{
                  each.cycle === 'monthly'
                    ? t('subscribe.monthlyNote')
                    : t('subscribe.yearlyNote', {
                        installments: installmentsOf(each),
                        price: money(perInstallment(each), locale),
                      })
                }}
              </p>
            </template>

            <p v-if="each.blocked === 'guardian_required'" class="equiv blocked">
              {{ t('subscribe.proGuardian') }}
            </p>

            <button
              type="button"
              class="button choose"
              :class="{ 'button--quiet': !sameChoice(each, chosen) }"
              :aria-pressed="sameChoice(each, chosen)"
              :aria-controls="`pay-${keyOf(each)}`"
              :disabled="!buyable(each)"
              @click="choose(each)"
            >
              {{ sameChoice(each, chosen) ? t('subscribe.chosen') : t('subscribe.choose') }}
            </button>

            <form
              v-if="sameChoice(each, chosen) && buyable(each)"
              :id="`pay-${keyOf(each)}`"
              class="pay"
              @submit.prevent="pay"
            >
              <fieldset>
                <legend>{{ t('subscribe.howToPay') }}</legend>
                <label
                  v-for="option in each.methods"
                  :key="option.method"
                  class="method"
                  :class="{ off: option.blocked }"
                >
                  <input
                    v-model="method"
                    type="radio"
                    :name="`method-${keyOf(each)}`"
                    :value="option.method"
                    :disabled="Boolean(option.blocked)"
                  />
                  <span class="method-text">
                    <span class="method-name">{{ methodLabel(each, option) }}</span>
                    <span class="method-note">{{ methodNote(each, option) }}</span>
                  </span>
                </label>
              </fieldset>

              <ul class="points">
                <template v-if="each.plan === 'coaching'">
                  <li>{{ t('subscribe.proPoints.months', { months: each.months ?? 12 }) }}</li>
                  <li>{{ t('subscribe.proPoints.guarantee') }}</li>
                  <li v-if="!known">
                    {{ t('subscribe.proPoints.anonymous', { months: each.months ?? 12 }) }}
                  </li>
                  <li>{{ t('subscribe.proPoints.cancelsMonthly') }}</li>
                </template>
                <template v-else>
                  <li v-if="each.cycle === 'monthly'">{{ t('subscribe.premiumPoints.cancel') }}</li>
                  <li>{{ t('subscribe.premiumPoints.guarantee') }}</li>
                </template>
                <li v-if="!known">{{ t('subscribe.activateLater') }}</li>
                <li>
                  <NuxtLinkLocale to="/termos" class="text-link" target="_blank">{{
                    t('subscribe.readTerms')
                  }}</NuxtLinkLocale>
                </li>
              </ul>

              <label v-if="live?.declaration" class="declare">
                <input v-model="declared" type="checkbox" />
                <span>{{ live.declaration.text }}</span>
              </label>

              <p v-if="payError" class="error" role="alert">
                {{ payError === 'pickMethod' ? t('subscribe.pickMethod') : errorText(payError) }}
              </p>

              <button
                type="submit"
                class="button pay-button"
                :disabled="paying || !live || offline"
                :aria-busy="paying"
              >
                {{ paying ? t('subscribe.paying') : t('subscribe.pay') }}
              </button>
              <p class="secure">{{ t('subscribe.secure') }}</p>
            </form>
          </template>
        </li>
      </ul>

      <PaymentBadges class="badges" :installments="12" />
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
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

.card.pro {
  background: color-mix(in oklab, var(--card) 84%, var(--green));
}

.card.picked {
  box-shadow: inset 0 0 0 2px var(--green); /* taste-skill-ignore: the ring that marks the chosen plan */
}

.name {
  font-size: var(--step-lead);
}

.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.5rem;
}

.amount {
  font-size: var(--step-figure);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
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

.choose {
  margin-top: 0.5rem;
}

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pay {
  display: grid;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--tone);
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
