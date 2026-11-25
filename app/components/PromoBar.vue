<script setup lang="ts">
import { bestPackage, money } from '#shared/plans'

const { t } = useI18n()
const locale = useSiteLocale()
const catalog = await usePlans()
const blackFriday = useBlackFriday()

const yearly = computed(() => blackFriday.yearlyFrom(catalog.premium.yearlyCents))
const pro = computed(() =>
  catalog.coaching.available ? bestPackage(catalog.coaching.packages) : undefined,
)
const offer = computed(() => {
  const yearlyPrice = money(catalog.premium.yearlyCents, locale.value)
  const pack = pro.value
  return pack && blackFriday.coachingFrom(pack.totalCents)
    ? t('promo.offer', {
        yearly: yearlyPrice,
        plan: catalog.coaching.name,
        pro: money(pack.totalCents, locale.value),
      })
    : t('promo.offerShort', { yearly: yearlyPrice })
})
const offerShort = computed(() =>
  t('promo.offerShort', { yearly: money(catalog.premium.yearlyCents, locale.value) }),
)
</script>

<template>
  <NuxtLinkLocale v-if="blackFriday.on.value && yearly" to="/planos" class="promo-bar">
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
  font-size: 0.75rem;
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
