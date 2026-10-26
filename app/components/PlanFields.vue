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
    <div id="premium" class="field premium" data-chapter="green">
      <component :is="headingLevel ?? 'h2'" class="name">{{ catalog.premium.name }}</component>
      <p class="who">Para quem quer a foto do prato e saber o que comer.</p>
      <p class="includes">
        Tudo do Básico, mais {{ list(premiumOnly.map((feature) => lower(feature.name))) }}.
      </p>
      <div class="foot" data-reveal>
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
        <WhatsAppButton location="plans-premium" />
      </div>
    </div>
    <div id="basic" class="field basic" data-chapter="lime">
      <component :is="headingLevel ?? 'h2'" class="name">{{ catalog.basic.name }}</component>
      <p class="who">Para quem quer o diário inteiro, por texto e áudio.</p>
      <p class="includes">
        {{ upper(list(catalog.basic.features.map((feature) => lower(feature.name)))) }}.
      </p>
      <div class="foot" data-reveal>
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
    <p class="trial" data-chapter="paper">
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
  padding: calc(var(--header) + 2.5rem) var(--margin) 2.5rem;
  color: var(--ink);
}

.premium {
  background: var(--green);
}

.basic {
  background: var(--lime);
}

.name {
  font-size: var(--step-head);
}

.who {
  max-width: 26ch;
  font-size: var(--step-lead);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.015em;
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
  font-size: var(--step-display);
  font-weight: 700;
  line-height: 0.88;
  letter-spacing: -0.05em;
  font-variant-numeric: lining-nums;
}

.basic .amount {
  font-size: var(--step-head);
}

.period {
  font-weight: 500;
}

.yearly {
  grid-column: 1 / -1;
  margin-top: 0.75rem;
  font-size: var(--step-small);
  font-weight: 500;
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
    padding: calc(var(--header) + 1.5rem) var(--margin) 1.5rem;
  }
  .name {
    font-size: 12vw;
  }
  .price {
    grid-template-columns: auto;
  }
  .amount {
    font-size: 18vw;
  }
  .basic .amount {
    font-size: 13vw;
  }
  .foot :deep(.button) {
    width: 100%;
  }
}
</style>
