<script setup lang="ts">
import {
  bestPackage,
  type Catalog,
  installmentCents,
  money,
  packageInstallmentCents,
} from '#shared/plans'

const props = defineProps<{ catalog: Catalog }>()

const { t } = useI18n()
const locale = useSiteLocale()
const blackFriday = useBlackFriday()
const prices = usePrices(() => props.catalog)
const { inInstallments } = useInstallmentWords()

const lines = computed(() => {
  const premium = prices.value.premium
  const installments = premium.yearlyInstallments ?? 1
  const yearly =
    installments > 1
      ? installmentCents({ totalCents: premium.yearlyCents, installments })
      : premium.yearlyCents
  const result = [
    t(
      premium.yearlyPixCents === undefined
        ? 'pricing.blackFriday.yearlyCard'
        : 'pricing.blackFriday.yearly',
      {
        installments: inInstallments(installments, yearly),
        pix: money(premium.yearlyPixCents ?? 0, locale.value),
      },
    ),
  ]
  const coaching = prices.value.coaching
  const pack = coaching.available ? bestPackage(coaching.packages) : undefined
  if (pack?.pixCents !== undefined) {
    result.push(
      t('pricing.blackFriday.coaching', {
        plan: coaching.name,
        installments: inInstallments(pack.installments, packageInstallmentCents(pack)),
        pix: money(pack.pixCents, locale.value),
      }),
    )
  }
  return result
})
</script>

<template>
  <div v-if="blackFriday" class="offer" role="note">
    <div class="offer-words">
      <p class="offer-title">{{ t('pricing.blackFriday.title') }}</p>
      <p v-for="line in lines" :key="line" class="offer-line">{{ line }}</p>
    </div>
    <div class="offer-clock">
      <p class="offer-ends">{{ t('promo.endsIn') }}</p>
      <CountdownClock boxes />
    </div>
  </div>
</template>

<style scoped>
.offer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem 2rem;
  padding: clamp(1.5rem, 1rem + 1.5vw, 2.25rem) clamp(1.5rem, 1rem + 2vw, 2.75rem);
  border-radius: var(--radius-panel);
  background: var(--black);
  color: #ffffff;
}

.offer-words {
  display: grid;
  gap: 0.25rem;
}

.offer-title {
  margin-bottom: 0.25rem;
  color: #3fd27f;
  font-size: var(--step-title);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.offer-line {
  font-size: var(--step-body);
}

.offer-clock {
  display: grid;
  gap: 0.5rem;
}

.offer-ends {
  color: rgb(255 255 255 / 0.65);
  font-size: var(--step-small);
}
</style>
