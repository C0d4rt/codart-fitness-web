<script setup lang="ts">
defineProps<{ installments: number }>()

const { t } = useI18n()
</script>

<template>
  <ul class="payments" :aria-label="t('pricing.payments.label')">
    <li>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      </svg>
      {{ t('pricing.payments.secure') }}
    </li>
    <li>
      <PixMark class="pix" />
      {{ t('pricing.payments.pix') }}
    </li>
    <li>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
        <path d="M3 10h18M6.5 14.5h4" />
      </svg>
      {{ t('pricing.payments.card') }}
    </li>
    <li v-if="installments > 1">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      </svg>
      {{ t('pricing.payments.installments', { installments }) }}
    </li>
  </ul>
</template>

<style scoped>
.payments {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.payments li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0 1rem 0 0.875rem;
  border-radius: 999px;
  background: var(--card);
  color: var(--muted);
  font-size: var(--step-small);
}

.payments svg {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: var(--green);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.payments .pix {
  width: 1rem;
  height: 1rem;
  fill: var(--green);
  stroke: none;
}
</style>
