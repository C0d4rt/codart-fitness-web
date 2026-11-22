<script setup lang="ts">
import { brand } from '~/brand'
import { choiceOfSlug, loginStep, returnOf, slugOf } from '#shared/purchaseFlow'
import type { Login } from '#shared/siteApi'
import { clockTime, fullDate } from '#shared/siteDates'
import type { SiteErrorCode } from '#shared/siteErrors'

definePageMeta({ account: true })

type View =
  | { kind: 'checking' }
  | { kind: 'creating' }
  | { kind: 'code'; login: Login; entering: boolean }
  | { kind: 'ended'; reason: 'expired' | 'used' | 'lost' }
  | { kind: 'signedIn' }
  | { kind: 'signedOut' }
  | { kind: 'error'; code: SiteErrorCode }

const { t } = useI18n()
const locale = useSiteLocale()
const apiLocale = useApiLocale()
const api = useSiteApi()
const account = useSiteAccount()
const errorText = useSiteError()
const polling = usePolling()
const localePath = useLocalePath()
const route = useRoute()

useSeoMeta({
  title: t('signIn.title'),
  description: t('signIn.description', { name: brand.name }),
  robots: 'noindex',
})

const view = ref<View>({ kind: 'checking' })
const busy = ref(false)

const who = computed(() => whoOf(account.value))
const purchaseScope = computed(
  () => account.value?.signedIn === true && account.value.scope === 'purchase',
)
const standing = computed(() => {
  const me = account.value
  if (!me?.signedIn || !me.access) return undefined
  const { standing, plan, until } = me.access
  const date = until ? fullDate(until, locale.value) : undefined
  const name = plan === 'coaching' ? t('subscribe.titles.coaching') : 'Premium'
  switch (standing) {
    case 'trial':
      return date ? t('signIn.standing.trialUntil', { date }) : t('signIn.standing.trial')
    case 'subscriber':
      return date
        ? t('signIn.standing.subscriberUntil', { plan: name, date })
        : t('signIn.standing.subscriber', { plan: name })
    case 'expired':
      return t('signIn.standing.expired')
    case 'revoked':
      return t('signIn.standing.revoked')
    default:
      return t('signIn.standing.none')
  }
})

const goBack = async () => {
  const returnTo = returnOf(route.query.voltar)
  const returnPlan = choiceOfSlug(route.query.plano)
  if (returnTo !== 'assinar') return false
  await navigateTo(
    localePath({ path: '/assinar', query: returnPlan ? { plano: slugOf(returnPlan) } : {} }),
  )
  return true
}

const readMe = async () => {
  const me = await api.me()
  if (me.ok) account.value = me.data
  return me
}

const enter = async (): Promise<'again' | 'done'> => {
  if (view.value.kind !== 'code') return 'done'
  view.value = { ...view.value, entering: true }
  const session = await api.loginSession()
  if (!session.ok) {
    if (session.code === 'login_pending') return 'again'
    view.value =
      session.code === 'login_used'
        ? { kind: 'ended', reason: 'used' }
        : session.code === 'login_expired'
          ? { kind: 'ended', reason: 'expired' }
          : session.code === 'login_unknown'
            ? { kind: 'ended', reason: 'lost' }
            : { kind: 'error', code: session.code }
    return 'done'
  }
  await readMe()
  if (!(await goBack())) view.value = { kind: 'signedIn' }
  return 'done'
}

const watchCode = () =>
  polling.start({
    everyMs: 2000,
    forMs: 20 * 60 * 1000,
    tick: async () => {
      const status = await api.loginStatus()
      if (!status.ok) return 'again'
      const step = loginStep(status.data.status)
      if (step === 'wait') return 'again'
      if (step === 'exchange') return enter()
      view.value = { kind: 'ended', reason: step }
      return 'done'
    },
  })

const createCode = async () => {
  polling.stop()
  view.value = { kind: 'creating' }
  const login = await api.startLogin(apiLocale.value)
  if (!login.ok) {
    view.value = { kind: 'error', code: login.code }
    return
  }
  view.value = { kind: 'code', login: login.data, entering: false }
  watchCode()
}

const start = async () => {
  view.value = { kind: 'checking' }
  const me = await readMe()
  if (!me.ok) {
    view.value = { kind: 'error', code: me.code }
    return
  }
  if (me.data.signedIn && me.data.scope === 'account') {
    if (!(await goBack())) view.value = { kind: 'signedIn' }
    return
  }
  await createCode()
}

const signOut = async () => {
  busy.value = true
  const done = await api.logout()
  busy.value = false
  if (!done.ok) {
    view.value = { kind: 'error', code: done.code }
    return
  }
  account.value = { signedIn: false }
  view.value = { kind: 'signedOut' }
}

onMounted(start)
</script>

<template>
  <AccountPage :heading="t('signIn.heading')" :lead="t('signIn.lead')">
    <p v-if="view.kind === 'checking'" class="status">{{ t('signIn.checking') }}</p>
    <p v-else-if="view.kind === 'creating'" class="status">{{ t('signIn.creating') }}</p>

    <template v-else-if="view.kind === 'code'">
      <p v-if="purchaseScope && who" class="muted">{{ t('signIn.purchaseScope', { who }) }}</p>
      <p class="only-touch">{{ t('signIn.phoneStep') }}</p>
      <p class="only-pointer">{{ t('signIn.desktopStep') }}</p>
      <WhatsAppCode :link="view.login.link" :message="view.login.message" />
      <p class="status">
        {{ view.entering ? t('signIn.confirmed') : t('signIn.waiting') }}
      </p>
      <p class="muted">
        {{ t('signIn.expiresAt', { time: clockTime(view.login.expiresAt, locale) }) }}
      </p>
    </template>

    <template v-else-if="view.kind === 'ended'">
      <p class="heading">{{ t(`signIn.${view.reason}`) }}</p>
      <div class="actions">
        <button type="button" class="button" @click="createCode">{{ t('signIn.again') }}</button>
      </div>
    </template>

    <template v-else-if="view.kind === 'signedIn'">
      <h2 class="heading">{{ t('signIn.signedInHeading') }}</h2>
      <p v-if="who">{{ t('signIn.signedInAs', { who }) }}</p>
      <p v-if="standing" class="muted">{{ standing }}</p>
      <div class="actions">
        <NuxtLinkLocale to="/assinar" class="button">{{ t('signIn.plans') }}</NuxtLinkLocale>
        <button type="button" class="button button--quiet" :disabled="busy" @click="signOut">
          {{ busy ? t('signIn.signingOut') : t('signIn.signOut') }}
        </button>
      </div>
      <p class="muted">{{ t('signIn.sessionNote') }}</p>
    </template>

    <template v-else-if="view.kind === 'signedOut'">
      <p class="heading">{{ t('signIn.signedOut') }}</p>
      <div class="actions">
        <button type="button" class="button" @click="createCode">
          {{ t('subscribe.signIn') }}
        </button>
      </div>
    </template>

    <template v-else-if="view.kind === 'error'">
      <p class="error" role="alert">{{ errorText(view.code) }}</p>
      <div class="actions">
        <button type="button" class="button" @click="start">{{ t('subscribe.retry') }}</button>
      </div>
    </template>
  </AccountPage>
</template>
