<script setup lang="ts">
import { type Catalog, money, yearlyPerMonth } from '#shared/plans'

const props = defineProps<{ catalog: Catalog; headingLevel?: 'h2' | 'h3' }>()

const premiumOnly = computed(() =>
  props.catalog.premium.features.filter((feature) => feature.plan === 'premium'),
)

const list = (names: string[]): string =>
  names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`

const lower = (name: string) => name.charAt(0).toLowerCase() + name.slice(1)
const upper = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
</script>

<template>
  <section class="fields" aria-label="Planos">
    <div id="premium" class="field premium">
      <component :is="headingLevel ?? 'h2'" class="name">{{ catalog.premium.name }}</component>
      <p class="who">Para quem quer a foto do prato e saber o que comer.</p>
      <p class="includes">
        Tudo do Básico, mais {{ list(premiumOnly.map((feature) => lower(feature.name))) }}.
      </p>
      <div class="foot">
        <p class="price">
          <span class="amount">{{ money(catalog.premium.monthlyCents) }}</span>
          <span class="period">por mês</span>
          <span class="yearly">
            ou {{ money(catalog.premium.yearlyCents) }} por ano ({{
              yearlyPerMonth(catalog.premium)
            }}
            por mês)
          </span>
        </p>
        <WhatsAppButton location="plans-premium" inverse />
      </div>
    </div>
    <div id="basic" class="field basic">
      <component :is="headingLevel ?? 'h2'" class="name">{{ catalog.basic.name }}</component>
      <p class="who">Para quem quer o diário inteiro, por texto e áudio.</p>
      <p class="includes">
        {{ upper(list(catalog.basic.features.map((feature) => lower(feature.name)))) }}.
      </p>
      <div class="foot">
        <p class="price">
          <span class="amount">{{ money(catalog.basic.monthlyCents) }}</span>
          <span class="period">por mês</span>
          <span class="yearly">
            ou {{ money(catalog.basic.yearlyCents) }} por ano ({{ yearlyPerMonth(catalog.basic) }}
            por mês)
          </span>
        </p>
        <WhatsAppButton location="plans-basic" label="Começar pelo teste" />
      </div>
    </div>
    <p class="trial">
      Os {{ catalog.trialDays }} dias grátis são do Premium, sem cartão, a partir da primeira
      mensagem. No fim, você escolhe o plano na própria conversa, no Pix ou no cartão.
    </p>
  </section>
</template>

<style scoped>
.fields {
  display: grid;
  grid-template-columns: 7fr 5fr;
}

.field {
  min-width: 0;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 1.25rem;
  min-height: 90svh;
  padding: 2.5rem var(--margin) 2.5rem;
}

.premium {
  background: var(--field);
  color: var(--field-ink);
}

.basic {
  background: var(--surface);
  color: var(--ink);
}

.name {
  font-size: var(--step-head);
}

.who {
  max-width: 26ch;
  font-size: var(--step-lead);
  line-height: 1.3;
}

.includes {
  max-width: 52ch;
  align-self: start;
}

.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

.price {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  column-gap: 0.75rem;
}

.amount {
  font-family: var(--font-display);
  font-size: calc(var(--step-display) * 0.5);
  line-height: 0.9;
  letter-spacing: -0.04em;
  font-variant-numeric: lining-nums;
}

.basic .amount {
  font-size: var(--step-head);
}

.yearly {
  grid-column: 1 / -1;
  font-size: var(--step-small);
}

.trial {
  grid-column: 1 / -1;
  max-width: 64ch;
  padding: 2rem var(--margin) 0;
}

@media (max-width: 63.99rem) {
  .fields {
    grid-template-columns: 1fr;
  }
  .field {
    min-height: 70svh;
    padding: 1.5rem 1.25rem;
  }
  .amount {
    font-size: calc(var(--step-display) * 0.8);
  }
  .basic .amount {
    font-size: calc(var(--step-display) * 0.6);
  }
  .foot :deep(.button) {
    width: 100%;
  }
}
</style>
