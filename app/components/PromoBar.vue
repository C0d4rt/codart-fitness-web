<script setup lang="ts">
import { installmentCents, money } from '#shared/plans'

const { t } = useI18n()
const locale = useSiteLocale()
const prices = usePrices(await usePlans())
const blackFriday = useBlackFriday()
const { inInstallments } = useInstallmentWords()

const installments = computed(() => prices.value.premium.yearlyInstallments ?? 1)
const yearlyInstallment = (totalCents: number) =>
  installmentCents({ totalCents, installments: installments.value })
const offer = computed(() => {
  const { premium } = prices.value
  const now = yearlyInstallment(premium.yearlyCents)
  return premium.yearlyPixCents === undefined
    ? t('promo.offerShort', { installment: money(now, locale.value) })
    : t('promo.offer', {
        installments: inInstallments(installments.value, now),
        pix: money(premium.yearlyPixCents, locale.value),
      })
})
const offerShort = computed(() =>
  t('promo.offerShort', {
    installment: money(yearlyInstallment(prices.value.premium.yearlyCents), locale.value),
  }),
)
</script>

<template>
  <NuxtLinkLocale v-if="blackFriday" to="/planos" class="promo-bar">
    <span class="label">{{ t('promo.label') }}</span>
    <span class="offer wide">{{ offer }}</span>
    <span class="offer narrow">{{ offerShort }}</span>
    <span class="ends">
      <span class="ends-word">{{ t('promo.endsIn') }}</span>
      <CountdownClock />
    </span>
    <span class="see" aria-hidden="true">{{ t('promo.see') }} →</span>
  </NuxtLinkLocale>
</template>

<style scoped>
.promo-bar {
  position: relative;
  z-index: 31;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.375rem 1rem;
  padding: 0.625rem var(--margin);
  background: var(--black);
  color: #ffffff;
  font-size: var(--step-small);
  line-height: 1.35;
  text-align: center;
  text-decoration: none;
}

.label {
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  background: #3fd27f;
  color: #07130c;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.offer {
  font-weight: 500;
}

.narrow {
  display: none;
}

.ends {
  color: rgb(255 255 255 / 0.7);
}

.ends :deep(.clock) {
  margin-left: 0.25rem;
  color: #ffffff;
  font-weight: 600;
}

.see {
  color: #3fd27f;
  font-weight: 600;
}

@media (hover: hover) and (pointer: fine) {
  .promo-bar:hover .see {
    text-decoration: underline;
  }
}

@media (max-width: 47.99rem) {
  .wide,
  .see,
  .ends-word {
    display: none;
  }
  .narrow {
    display: inline;
  }
}
</style>
