<script setup lang="ts">
import { BLACK_FRIDAY_ENDS_AT } from '#shared/promo'

defineProps<{ boxes?: boolean }>()

const { t } = useI18n()
const left = useCountdown(BLACK_FRIDAY_ENDS_AT)
const two = (value: number) => String(value).padStart(2, '0')

const parts = computed(() =>
  left.value
    ? [
        {
          id: 'days',
          value: String(left.value.days),
          unit: t('promo.days', { n: left.value.days }),
        },
        { id: 'hours', value: two(left.value.hours), unit: t('promo.hours') },
        { id: 'minutes', value: two(left.value.minutes), unit: t('promo.minutes') },
        { id: 'seconds', value: two(left.value.seconds), unit: t('promo.seconds') },
      ]
    : [],
)
</script>

<template>
  <span v-if="left" class="clock" :class="{ boxes }" role="timer" aria-live="off">
    <template v-if="boxes">
      <span v-for="part in parts" :key="part.id" class="box">
        <span class="value">{{ part.value }}</span>
        <span class="unit">{{ part.unit }}</span>
      </span>
    </template>
    <template v-else>
      {{ parts[0]!.value }} {{ parts[0]!.unit }}
      <span class="time">{{ parts[1]!.value }}:{{ parts[2]!.value }}:{{ parts[3]!.value }}</span>
    </template>
  </span>
</template>

<style scoped>
.clock {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.time {
  margin-left: 0.25rem;
}

.boxes {
  display: inline-grid;
  grid-auto-flow: column;
  gap: 0.5rem;
}

.box {
  display: grid;
  justify-items: center;
  min-width: 4.25rem;
  padding: 0.625rem 0.5rem 0.5rem;
  border-radius: var(--radius-small);
  background: rgb(255 255 255 / 0.08);
}

.value {
  font-size: var(--step-title);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.unit {
  color: rgb(255 255 255 / 0.6);
  font-size: 0.8125rem;
}
</style>
