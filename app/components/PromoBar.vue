<script setup lang="ts">
import { installmentCents, money } from '#shared/plans'

const { t } = useI18n()
const locale = useSiteLocale()
const catalog = await usePlans()
const prices = usePrices(catalog)
const endsAt = useBlackFriday(catalog)
const perMonth = computed(() => {
  const { premium } = prices.value
  return money(
    installmentCents({
      totalCents: premium.yearlyCents,
      installments: premium.yearlyInstallments ?? 1,
    }),
    locale.value,
  )
})
const offer = computed(() => t('promo.offer', { price: perMonth.value }))
</script>

<template>
  <NuxtLinkLocale v-if="endsAt" to="/planos" class="promo-bar">
    <span class="label">{{ t('promo.label') }}</span>
    <span class="offer">{{ offer }}</span>
    <span class="ends">
      <span class="ends-word">{{ t('promo.endsIn') }}</span>
      <CountdownClock :ends-at="endsAt" />
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
  background: var(--promo-black);
  color: #ffffff;
  font-size: var(--step-small);
  line-height: 1.35;
  text-align: center;
  text-decoration: none;
}

.label {
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  background: #04db60;
  color: #001724;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.offer {
  font-weight: 500;
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
  color: #04db60;
  font-weight: 600;
}

@media (hover: hover) and (pointer: fine) {
  .promo-bar:hover .see {
    text-decoration: underline;
  }
}

@media (max-width: 47.99rem) {
  .see,
  .ends-word {
    display: none;
  }
}
</style>
