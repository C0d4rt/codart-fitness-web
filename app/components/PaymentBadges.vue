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
      <!-- The Pix symbol, from the logo of the Banco Central do Brasil. -->
      <svg class="pix" viewBox="0 5.746 78.518 78.518" aria-hidden="true">
        <g transform="translate(-535.594 -20.809)">
          <path
            d="m596.827 86.62c-3.08 0-5.978-1.199-8.156-3.377l-11.777-11.777c-.827-.829-2.268-.827-3.095 0l-11.82 11.82c-2.178 2.177-5.076 3.377-8.156 3.377h-2.321l14.916 14.915c4.658 4.658 12.211 4.658 16.869 0l14.958-14.958z"
          />
          <path
            d="m553.824 44.963c3.08 0 5.978 1.199 8.156 3.377l11.82 11.822c.851.852 2.241.855 3.095-.001l11.777-11.778c2.178-2.177 5.076-3.377 8.156-3.377h1.419l-14.958-14.958c-4.659-4.658-12.211-4.658-16.869 0l-14.915 14.915z"
          />
          <path
            d="m610.618 57.379-9.039-9.039c-.199.08-.415.129-.642.129h-4.11c-2.125 0-4.205.862-5.706 2.364l-11.776 11.777c-1.102 1.102-2.55 1.653-3.997 1.653-1.448 0-2.895-.551-3.997-1.652l-11.821-11.821c-1.501-1.503-3.581-2.364-5.706-2.364h-5.054c-.216 0-.417-.051-.607-.122l-9.075 9.075c-4.658 4.658-4.658 12.211 0 16.869l9.075 9.075c.19-.072.392-.122.607-.122h5.054c2.125 0 4.205-.861 5.706-2.364l11.82-11.82c2.136-2.135 5.861-2.135 7.995.001l11.776 11.776c1.501 1.502 3.581 2.364 5.706 2.364h4.11c.228 0 .443.05.642.129l9.039-9.039c4.658-4.658 4.658-12.211 0-16.869"
          />
        </g>
      </svg>
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
