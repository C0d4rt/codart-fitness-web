<script setup lang="ts">
import { brand } from '~/brand'
import {
  canSignInAfterActivation,
  purchaseSettled,
  purchaseView,
  type PurchaseView,
  slugOf,
} from '#shared/purchaseFlow'
import type { PollAnswer } from '#shared/poller'
import type { Purchase } from '#shared/siteApi'
import type { SiteErrorCode } from '#shared/siteErrors'

definePageMeta({ account: true })

const { t } = useI18n()
const api = useSiteApi()
const account = useSiteAccount()
const errorText = useSiteError()
const polling = usePolling()
const whatsApp = useWhatsAppLink(null)

useSeoMeta({ title: t('subscribeDone.title'), robots: 'noindex' })

type View = { kind: PurchaseView } | { kind: 'error'; code: SiteErrorCode }

const TRANSIENT: readonly SiteErrorCode[] = ['network', 'unavailable', 'rate_limited']
const WAITING: readonly View['kind'][] = ['checking', 'waiting', 'activate']

const purchase = ref<Purchase>()
const view = ref<View>({ kind: 'checking' })
const signIn = ref<'idle' | 'busy' | 'done' | 'closed'>('idle')

const planName = computed(() => {
  const each = purchase.value
  if (!each?.plan) return 'Premium'
  if (each.plan === 'coaching') return t('subscribe.titles.coaching')
  return each.cycle === 'yearly'
    ? t('subscribe.titles.premiumYearly')
    : t('subscribe.titles.premiumMonthly')
})
const retryPath = computed(() => {
  const each = purchase.value
  return each?.plan && each.cycle
    ? { path: '/assinar', query: { plano: slugOf({ plan: each.plan, cycle: each.cycle }) } }
    : { path: '/assinar' }
})
const who = computed(() => whoOf(account.value))

const signInHere = async (now: Purchase, signal: AbortSignal) => {
  if (!canSignInAfterActivation(now, Date.now())) {
    signIn.value = 'closed'
    return
  }
  signIn.value = 'busy'
  const session = await api.purchaseSession(signal)
  if (!session.ok) {
    signIn.value = 'closed'
    return
  }
  const me = await api.me()
  if (me.ok) account.value = me.data
  signIn.value = 'done'
}

const check = async (signal: AbortSignal): Promise<PollAnswer> => {
  const answer = await api.purchase(signal)
  if (signal.aborted) return 'done'
  if (!answer.ok) {
    const transient = TRANSIENT.includes(answer.code)
    // A hiccup while the payment page is already shown keeps it; anything else must say so.
    if (!transient || view.value.kind === 'checking' || view.value.kind === 'error') {
      view.value = { kind: 'error', code: answer.code }
    }
    if (!transient) return 'done'
    return answer.code === 'rate_limited' ? 'slower' : 'again'
  }
  purchase.value = answer.data
  const kind = purchaseView(answer.data)
  view.value = { kind }
  if (kind === 'activated' && signIn.value === 'idle') await signInHere(answer.data, signal)
  return purchaseSettled(kind) ? 'done' : 'again'
}

const watchPurchase = () => polling.start({ everyMs: 3000, forMs: 10 * 60 * 1000, tick: check })

onMounted(watchPurchase)
</script>

<template>
  <AccountPage :heading="t('subscribeDone.title')">
    <template v-if="view.kind === 'checking'">
      <p v-if="!polling.timedOut.value" class="status">{{ t('subscribeDone.checking') }}</p>
    </template>

    <template v-else-if="view.kind === 'error'">
      <p class="error" role="alert">{{ errorText(view.code) }}</p>
      <div class="actions">
        <button type="button" class="button" @click="watchPurchase">
          {{ t('subscribeDone.tryAgain') }}
        </button>
      </div>
    </template>

    <template v-else-if="view.kind === 'waiting'">
      <h2 class="heading">{{ t('subscribeDone.waitingHeading') }}</h2>
      <p>
        {{
          purchase?.method === 'pix'
            ? t('subscribeDone.waitingPix')
            : t('subscribeDone.waitingCard')
        }}
      </p>
      <p v-if="!polling.timedOut.value" class="status">{{ t('subscribeDone.checking') }}</p>
    </template>

    <template v-else-if="view.kind === 'confirmed'">
      <h2 class="heading">{{ t('subscribeDone.confirmedHeading') }}</h2>
      <p>{{ t('subscribeDone.confirmedText', { plan: planName }) }}</p>
      <div class="actions">
        <a :href="whatsApp" target="_blank" rel="noopener" class="button">{{
          t('subscribe.openWhatsApp')
        }}</a>
      </div>
    </template>

    <template v-else-if="view.kind === 'activate' && purchase?.link && purchase.message">
      <h2 class="heading">{{ t('subscribeDone.activateHeading') }}</h2>
      <p>{{ t('subscribeDone.activateText', { name: brand.name }) }}</p>
      <WhatsAppCode :link="purchase.link" :message="purchase.message" />
      <p v-if="!polling.timedOut.value" class="status">{{ t('signIn.waiting') }}</p>
    </template>

    <template v-else-if="view.kind === 'activated'">
      <h2 class="heading">{{ t('subscribeDone.activatedHeading') }}</h2>
      <p>{{ t('subscribeDone.activatedText', { plan: planName }) }}</p>
      <p v-if="signIn === 'busy'" class="status">{{ t('subscribeDone.signingIn') }}</p>
      <p v-else-if="signIn === 'done' && who" class="muted">
        {{ t('subscribeDone.signedIn', { who }) }}
      </p>
      <p v-else-if="signIn === 'closed'" class="muted">{{ t('subscribeDone.signInLater') }}</p>
      <div class="actions">
        <a :href="whatsApp" target="_blank" rel="noopener" class="button">{{
          t('subscribe.openWhatsApp')
        }}</a>
      </div>
    </template>

    <template v-else-if="view.kind === 'refused' || view.kind === 'expired'">
      <h2 class="heading">{{ t(`subscribeDone.${view.kind}Heading`) }}</h2>
      <p>{{ t(`subscribeDone.${view.kind}Text`) }}</p>
      <div class="actions">
        <NuxtLinkLocale :to="retryPath" class="button">{{
          view.kind === 'refused' ? t('subscribeDone.tryAgain') : t('subscribeDone.choosePlan')
        }}</NuxtLinkLocale>
      </div>
    </template>

    <template v-else-if="view.kind === 'refunded'">
      <h2 class="heading">{{ t('subscribeDone.refundedHeading') }}</h2>
      <p>{{ t('subscribeDone.refundedText') }}</p>
    </template>

    <template v-else>
      <h2 class="heading">{{ t('subscribeDone.noneHeading') }}</h2>
      <p>{{ t('subscribeDone.noneText') }}</p>
      <div class="actions">
        <NuxtLinkLocale to="/assinar/ativar" class="button button--quiet">{{
          t('subscribeDone.haveCode')
        }}</NuxtLinkLocale>
        <NuxtLinkLocale to="/assinar" class="button button--quiet">{{
          t('subscribeDone.choosePlan')
        }}</NuxtLinkLocale>
      </div>
    </template>

    <template v-if="polling.timedOut.value && WAITING.includes(view.kind)">
      <p class="muted">{{ t('subscribeDone.timeout') }}</p>
      <div class="actions">
        <button type="button" class="button button--quiet" @click="watchPurchase">
          {{ t('subscribeDone.refresh') }}
        </button>
      </div>
    </template>
  </AccountPage>
</template>
