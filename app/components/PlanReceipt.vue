<script setup lang="ts">
import { type Catalog, money, yearlyPerMonth } from '#shared/plans'

const props = defineProps<{ catalog: Catalog }>()

const planId = ref<'premium' | 'basic'>('premium')
const period = ref<'month' | 'year'>('month')

const plan = computed(() =>
  planId.value === 'premium' ? props.catalog.premium : props.catalog.basic,
)
const price = computed(() =>
  money(period.value === 'month' ? plan.value.monthlyCents : plan.value.yearlyCents),
)
const highlights = computed(() =>
  planId.value === 'premium'
    ? [
        'Tudo do Básico',
        ...props.catalog.premium.features
          .filter((feature) => feature.plan === 'premium')
          .slice(0, 3)
          .map((feature) => feature.name),
      ]
    : props.catalog.basic.features.slice(0, 4).map((feature) => feature.name),
)
</script>

<template>
  <section class="pricing" aria-labelledby="pricing-title">
    <div class="side" data-reveal>
      <h2 id="pricing-title" class="title display">Planos</h2>
      <p>
        Os {{ catalog.trialDays }} dias grátis têm tudo do Premium e não pedem cartão. No fim, você
        escolhe o plano na própria conversa e paga no Pix ou no cartão.
      </p>
      <div class="choice" role="group" aria-label="Plano">
        <button
          id="premium"
          type="button"
          :aria-pressed="planId === 'premium'"
          @click="planId = 'premium'"
        >
          {{ catalog.premium.name }}
        </button>
        <button
          id="basic"
          type="button"
          :aria-pressed="planId === 'basic'"
          @click="planId = 'basic'"
        >
          {{ catalog.basic.name }}
        </button>
      </div>
      <div class="choice" role="group" aria-label="Período">
        <button type="button" :aria-pressed="period === 'month'" @click="period = 'month'">
          Mensal
        </button>
        <button type="button" :aria-pressed="period === 'year'" @click="period = 'year'">
          Anual
        </button>
      </div>
      <div class="actions">
        <WhatsAppButton location="plans" />
        <NuxtLink to="/planos" class="link">Tudo o que cada plano faz</NuxtLink>
      </div>
    </div>

    <div class="slip" aria-live="polite" data-ui>
      <p class="slip-name">{{ plan.name }}, {{ period === 'month' ? 'mensal' : 'anual' }}</p>
      <ul class="rows">
        <li>
          <span>{{ catalog.trialDays }} dias de teste</span
          ><span class="amount">{{ money(0) }}</span>
        </li>
        <li v-for="item in highlights" :key="item">
          <span>{{ item }}</span
          ><span class="amount">incluso</span>
        </li>
        <li v-if="period === 'year'">
          <span>Equivale por mês</span><span class="amount">{{ yearlyPerMonth(plan) }}</span>
        </li>
      </ul>
      <div class="bar" />
      <p class="total">
        <span class="total-label">{{ period === 'month' ? 'Por mês' : 'Por ano' }}</span>
        <span class="total-amount">{{ price }}</span>
      </p>
      <p class="fine">Depois do teste. Cancele quando quiser, pela conversa.</p>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  margin-top: 6rem;
  padding: 0 var(--margin) 6rem;
  background: var(--surface);
}

.side {
  grid-column: 1 / 7;
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 1.75rem;
  padding-top: 6rem;
}

.title {
  font-size: var(--step-head);
}

.side > p {
  max-width: 44ch;
}

.choice {
  display: inline-grid;
  grid-auto-flow: column;
  padding: 0.25rem;
  background: var(--ground);
}

.choice button {
  min-width: 7.5rem;
  min-height: 2.75rem;
  padding: 0 1.25rem;
  border: 0;
  background: none;
  color: var(--muted);
  cursor: pointer;
  transition:
    background-color 200ms ease,
    color 200ms ease,
    transform 160ms var(--ease-out);
}

.choice button[aria-pressed='true'] {
  background: var(--raised);
  color: var(--ink);
}

.choice button:active {
  transform: scale(0.97);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.link {
  color: var(--ink);
  font-weight: 500;
}

.slip {
  grid-column: 8 / 12;
  align-self: start;
  display: grid;
  gap: 1.25rem;
  width: 23.75rem;
  max-width: 100%;
  padding: 3rem 1.75rem 3.5rem;
  background: var(--bone);
  color: var(--bone-ink);
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 12px),
    95% 100%,
    90% calc(100% - 12px),
    85% 100%,
    80% calc(100% - 12px),
    75% 100%,
    70% calc(100% - 12px),
    65% 100%,
    60% calc(100% - 12px),
    55% 100%,
    50% calc(100% - 12px),
    45% 100%,
    40% calc(100% - 12px),
    35% 100%,
    30% calc(100% - 12px),
    25% 100%,
    20% calc(100% - 12px),
    15% 100%,
    10% calc(100% - 12px),
    5% 100%,
    0 calc(100% - 12px)
  );
}

.slip-name {
  font-weight: 500;
  text-align: center;
}

.rows {
  display: grid;
  gap: 0.875rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-small);
}

.rows li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.amount {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.bar {
  height: 4px;
  background: var(--bone-ink);
}

.total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.total-amount {
  font-size: var(--step-head);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
}

.fine {
  color: #4a524d;
  font-size: var(--step-small);
}

@media (max-width: 63.99rem) {
  .pricing {
    grid-template-columns: 1fr;
    row-gap: 3rem;
  }
  .side,
  .slip {
    grid-column: 1;
  }
  .side {
    padding-top: 4rem;
  }
  .slip {
    justify-self: center;
    width: min(86vw, 23.75rem);
  }
  .actions :deep(.button) {
    width: 100%;
  }
}
</style>
