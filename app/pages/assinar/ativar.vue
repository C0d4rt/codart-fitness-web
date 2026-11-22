<script setup lang="ts">
import { takeFragment } from '#shared/fragment'
import { activationCodeOf } from '#shared/purchaseFlow'
import type { SiteErrorCode } from '#shared/siteErrors'

definePageMeta({ account: true })

const { t } = useI18n()
const api = useSiteApi()
const errorText = useSiteError()
const localePath = useLocalePath()

useSeoMeta({ title: t('activate.title'), robots: 'noindex' })

const code = ref('')
const busy = ref(false)
const failure = ref<SiteErrorCode>()

const open = async (typed: string) => {
  const wanted = activationCodeOf(typed)
  if (!wanted) {
    failure.value = 'purchase_unknown'
    return
  }
  busy.value = true
  failure.value = undefined
  const opened = await api.openPurchase(wanted)
  if (opened.ok) {
    await navigateTo(localePath('/assinar/pronto'), { replace: true })
    return
  }
  busy.value = false
  failure.value = opened.code
}

onMounted(() => {
  const fromLink = takeFragment(window as unknown as Record<string, unknown>, 'a')
  if (fromLink) {
    code.value = fromLink
    void open(fromLink)
  }
})
</script>

<template>
  <AccountPage :heading="t('activate.heading')" :lead="t('activate.lead')">
    <form class="form" @submit.prevent="open(code)">
      <label class="field">
        <span class="label">{{ t('activate.label') }}</span>
        <input
          v-model="code"
          type="text"
          name="code"
          placeholder="ATV-XXXXXXXX"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          maxlength="32"
          required
        />
      </label>
      <p v-if="failure" class="error" role="alert">{{ errorText(failure) }}</p>
      <div class="actions">
        <button type="submit" class="button" :disabled="busy" :aria-busy="busy">
          {{ busy ? t('activate.opening') : t('activate.submit') }}
        </button>
      </div>
    </form>
  </AccountPage>
</template>

<style scoped>
.form {
  display: grid;
  gap: 1.25rem;
}

.field {
  display: grid;
  gap: 0.5rem;
}

.label {
  font-weight: 500;
}

input {
  min-height: 3.25rem;
  padding: 0 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-small);
  background: var(--ground);
  color: var(--ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: var(--step-body);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

input::placeholder {
  color: var(--muted);
  opacity: 0.6;
}

input:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 1px;
}

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
