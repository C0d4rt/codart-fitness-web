<script setup lang="ts">
import { brand } from '~/brand'
import {
  canSignInAfterActivation,
  purchaseSettled,
  purchaseView,
  type PurchaseView,
  slugOf,
} from '#shared/purchaseFlow'
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

const purchase = ref<Purchase>()
const view = ref<PurchaseView | 'checking'>('checking')
const failure = ref<SiteErrorCode>()
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

const signInHere = async (now: Purchase) => {
  if (!canSignInAfterActivation(now, Date.now())) {
    signIn.value = 'closed'
    return
  }
  signIn.value = 'busy'
  const session = await api.purchaseSession()
  if (!session.ok) {
    signIn.value = 'closed'
    return
  }
  const me = await api.me()
  if (me.ok) account.value = me.data
  signIn.value = 'done'
}

const check = async (): Promise<'again' | 'done'> => {
  const answer = await api.purchase()
  if (!answer.ok) {
    if (view.value === 'checking') failure.value = answer.code
    return ['network', 'unavailable', 'rate_limited'].includes(answer.code) ? 'again' : 'done'
  }
  failure.value = undefined
  purchase.value = answer.data
  view.value = purchaseView(answer.data)
  if (view.value === 'activated' && signIn.value === 'idle') await signInHere(answer.data)
  return purchaseSettled(view.value) ? 'done' : 'again'
}

const watchPurchase = () => polling.start({ everyMs: 3000, forMs: 10 * 60 * 1000, tick: check })

onMounted(watchPurchase)
</script>

<template>
  <AccountPage :heading="t('subscribeDone.title')">
    <template v-if="view === 'checking'">
      <p v-if="failure" class="error" role="alert">{{ errorText(failure) }}</p>
      <p v-else class="status">{{ t('subscribeDone.checking') }}</p>
      <div v-if="failure" class="actions">
        <button type="button" class="button" @click="watchPurchase">
          {{ t('subscribeDone.tryAgain') }}
        </button>
      </div>
    </template>

    <template v-else-if="view === 'waiting'">
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

    <template v-else-if="view === 'confirmed'">
      <h2 class="heading">{{ t('subscribeDone.confirmedHeading') }}</h2>
      <p>{{ t('subscribeDone.confirmedText', { plan: planName }) }}</p>
      <div class="actions">
        <a :href="whatsApp" target="_blank" rel="noopener" class="button">{{
          t('subscribe.openWhatsApp')
        }}</a>
      </div>
    </template>

    <template v-else-if="view === 'activate' && purchase?.link && purchase.message">
      <h2 class="heading">{{ t('subscribeDone.activateHeading') }}</h2>
      <p>{{ t('subscribeDone.activateText', { name: brand.name }) }}</p>
      <WhatsAppCode :link="purchase.link" :message="purchase.message" />
      <p v-if="!polling.timedOut.value" class="status">{{ t('signIn.waiting') }}</p>
    </template>

    <template v-else-if="view === 'activated'">
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

    <template v-else-if="view === 'refused' || view === 'expired'">
      <h2 class="heading">{{ t(`subscribeDone.${view}Heading`) }}</h2>
      <p>{{ t(`subscribeDone.${view}Text`) }}</p>
      <div class="actions">
        <NuxtLinkLocale :to="retryPath" class="button">{{
          view === 'refused' ? t('subscribeDone.tryAgain') : t('subscribeDone.choosePlan')
        }}</NuxtLinkLocale>
      </div>
    </template>

    <template v-else-if="view === 'refunded'">
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

    <template v-if="polling.timedOut.value && (view === 'waiting' || view === 'activate')">
      <p class="muted">{{ t('subscribeDone.timeout') }}</p>
      <div class="actions">
        <button type="button" class="button button--quiet" @click="watchPurchase">
          {{ t('subscribeDone.refresh') }}
        </button>
      </div>
    </template>
  </AccountPage>
</template>
