<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { money } from '#shared/plans'
import { PLANS_SCREEN } from '#shared/screens'

import { brand } from '~/brand'

const catalog = await usePlans()

useSeoMeta({
  title: 'Planos e o que cada um faz',
  description: `O Premium e o Básico do ${brand.name}, função por função, com exemplos de conversa. ${catalog.trialDays} dias grátis com tudo do Premium.`,
})

const plansScreen = PLANS_SCREEN({
  premium: money(catalog.premium.monthlyCents),
  basic: money(catalog.basic.monthlyCents),
  trialDays: catalog.trialDays,
})

const screenOf = (id: string): ChatScreen | undefined => {
  if (id === 'intro') return plansScreen
  const feature = catalog.premium.features.find((each) => each.id === id)
  return feature === undefined
    ? undefined
    : { id: `feature-${feature.id}`, label: feature.headline, messages: feature.exchange }
}

useStageObserver(screenOf)

const planLine = (plan: 'basic' | 'premium') =>
  plan === 'basic' ? 'No Básico e no Premium.' : 'Só no Premium, e no teste.'
</script>

<template>
  <div class="page">
    <SiteNav />
    <div class="split">
      <div class="stage-col">
        <StagePanel :fallback="plansScreen" />
      </div>
      <div class="column">
        <header class="intro" data-stage="intro">
          <h1 class="title">Planos e o que cada um faz</h1>
          <p class="lead">
            Cada função com um exemplo da conversa, nas palavras e nos números que o diário usa. Os
            {{ catalog.trialDays }} dias grátis têm tudo do Premium.
          </p>
          <ul class="jump">
            <li>
              <a href="#premium">Premium, {{ money(catalog.premium.monthlyCents) }} por mês</a>
            </li>
            <li>
              <a href="#basic">Básico, {{ money(catalog.basic.monthlyCents) }} por mês</a>
            </li>
          </ul>
        </header>

        <section v-for="group in catalog.groups" :key="group.id" class="group">
          <h2 class="group-name display">{{ group.name }}</h2>
          <article
            v-for="feature in group.features"
            :id="feature.id"
            :key="feature.id"
            class="feature"
            :data-stage="feature.id"
          >
            <h3 class="headline">{{ feature.headline }}</h3>
            <p class="plan" :class="feature.plan">
              {{ feature.name }}. {{ planLine(feature.plan) }}
            </p>
            <p>{{ feature.howTo }}</p>
            <div class="inline-stage">
              <ChatWindow
                :screen="{ id: feature.id, label: feature.headline, messages: feature.exchange }"
              />
            </div>
          </article>
        </section>
      </div>
    </div>

    <PlanMenu :catalog="catalog" />
    <HomeStart />
    <SiteFooter />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1.5rem;
  min-height: 80svh;
  align-content: start;
}

.title {
  margin-top: 18svh;
  font-size: var(--step-head);
}

.lead {
  font-size: var(--step-lead);
  line-height: 1.35;
}

.jump {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.group {
  display: grid;
  gap: 4rem;
}

.group-name {
  font-size: var(--step-head);
}

.feature {
  display: grid;
  gap: 0.875rem;
  min-height: 40vh;
  align-content: start;
  scroll-margin-top: 2rem;
}

.headline {
  font-size: var(--step-lead);
  line-height: 1.15;
}

.plan {
  color: var(--muted);
  font-weight: 500;
}

.plan.premium {
  color: var(--ink);
}

@media (max-width: 63.99rem) {
  .intro {
    min-height: auto;
  }
  .title {
    margin-top: 3rem;
  }
  .feature {
    min-height: auto;
  }
}
</style>
