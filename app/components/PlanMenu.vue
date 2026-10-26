<script setup lang="ts">
import { type Catalog, money, yearlyPerMonth } from '#shared/plans'

const props = defineProps<{ catalog: Catalog }>()

const list = (names: string[]): string =>
  names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`
const lower = (name: string) => name.charAt(0).toLowerCase() + name.slice(1)
const upper = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const premiumOnly = computed(() =>
  props.catalog.premium.features.filter((feature) => feature.plan === 'premium'),
)

const groups = computed(() => [
  {
    id: 'premium',
    plan: props.catalog.premium,
    who: 'Para quem quer a foto do prato e saber o que comer.',
    includes: `Tudo do Básico, mais ${list(premiumOnly.value.map((feature) => lower(feature.name)))}.`,
  },
  {
    id: 'basic',
    plan: props.catalog.basic,
    who: 'Para quem quer o diário inteiro, por texto e áudio.',
    includes: `${upper(list(props.catalog.basic.features.map((feature) => lower(feature.name))))}.`,
  },
])
</script>

<template>
  <section class="menu" aria-labelledby="menu-title">
    <div class="side">
      <h2 id="menu-title" class="title">Os planos</h2>
      <figure class="photo">
        <img
          src="/images/salada.jpg"
          alt="Uma salada com rúcula, ovos e cenoura numa travessa branca"
          width="1400"
          height="933"
          loading="lazy"
        />
      </figure>
    </div>
    <div class="groups">
      <div v-for="group in groups" :id="group.id" :key="group.id" class="group" data-reveal>
        <h3 class="group-name">{{ group.plan.name }}</h3>
        <p class="who">{{ group.who }}</p>
        <div class="item">
          <span>Por mês</span>
          <span class="price">{{ money(group.plan.monthlyCents) }}</span>
        </div>
        <div class="item">
          <span>Por ano</span>
          <span class="price">{{ money(group.plan.yearlyCents) }}</span>
        </div>
        <p class="detail">Equivale a {{ yearlyPerMonth(group.plan) }} por mês no plano anual.</p>
        <p class="includes">{{ group.includes }}</p>
      </div>
      <div class="close">
        <p>
          Os {{ catalog.trialDays }} dias grátis são do Premium, sem cartão, a partir da primeira
          mensagem. No fim, você escolhe o plano na própria conversa, no Pix ou no cartão.
        </p>
        <WhatsAppButton location="plans" />
        <NuxtLink to="/planos" class="link">Ver tudo o que cada plano faz</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.menu {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  padding: var(--gap-section) var(--margin) 0;
}

.side {
  grid-column: 1 / 4;
  display: grid;
  align-content: start;
  gap: 2rem;
}

.title {
  font-size: var(--step-head);
}

.photo {
  overflow: hidden;
}

.photo img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.groups {
  grid-column: 5 / 13;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 4rem;
  row-gap: 3.5rem;
  align-content: start;
}

.group {
  display: grid;
  align-content: start;
  gap: 0.875rem;
  scroll-margin-top: 2rem;
}

.group-name {
  margin-bottom: 0.25rem;
  font-size: var(--step-lead);
  font-weight: 500;
}

.who,
.detail,
.includes {
  max-width: 36ch;
  color: var(--muted);
  font-size: var(--step-body);
}

.item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: var(--step-body);
}

.price {
  font-variant-numeric: tabular-nums;
}

.close {
  grid-column: 1 / -1;
  display: grid;
  justify-items: start;
  gap: 1.25rem;
}

.close p {
  max-width: 52ch;
}

.link {
  font-weight: 500;
}

@media (max-width: 47.99rem) {
  .menu {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .photo {
    width: 60%;
  }
  .groups {
    grid-template-columns: 1fr;
  }
  .close :deep(.button) {
    width: 100%;
  }
}
</style>
