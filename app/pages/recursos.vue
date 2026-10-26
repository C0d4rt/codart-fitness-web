<script setup lang="ts">
import { brand } from '~/brand'

const catalog = await usePlans()

useSeoMeta({
  title: 'Recursos',
  description: `Tudo o que o ${brand.name} faz no WhatsApp, com um exemplo de conversa para cada recurso. ${catalog.trialDays} dias grátis com tudo do Premium.`,
})

const planLine = (plan: 'basic' | 'premium') =>
  plan === 'basic' ? 'No Básico e no Premium' : 'Só no Premium e no teste'
</script>

<template>
  <div class="page">
    <SiteNav />
    <header class="intro">
      <h1 class="title">Recursos</h1>
      <p class="lead">Tudo o que dá para fazer na conversa, com exemplos de verdade</p>
    </header>

    <section
      v-for="group in catalog.groups"
      :key="group.id"
      class="group"
      :aria-labelledby="`group-${group.id}`"
    >
      <h2 :id="`group-${group.id}`" class="group-name">{{ group.name }}</h2>
      <article v-for="feature in group.features" :id="feature.id" :key="feature.id" class="feature">
        <div class="words">
          <h3 class="headline">{{ feature.headline }}</h3>
          <p class="plan" :class="feature.plan">
            {{ feature.name }} · {{ planLine(feature.plan) }}
          </p>
          <p class="how-to">{{ feature.howTo }}</p>
        </div>
        <div class="example">
          <ChatWindow
            :screen="{ id: feature.id, label: feature.headline, messages: feature.exchange }"
            class="chat"
          />
        </div>
      </article>
    </section>

    <HomeStart />
    <SiteFooter />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1.25rem;
  padding: 4rem var(--margin) 2rem;
}

.title {
  font-size: var(--step-display);
}

.lead {
  max-width: 44ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.group {
  display: grid;
  gap: 4rem;
  padding: 6rem var(--margin) 0;
}

.group-name {
  margin-bottom: 0.75rem;
  font-size: var(--step-head);
}

.feature {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 3rem;
  align-items: center;
  scroll-margin-top: 1.5rem;
}

.words {
  display: grid;
  gap: 0.75rem;
}

.headline {
  font-size: var(--step-lead);
  line-height: 1.15;
}

.plan {
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.plan.premium {
  color: var(--green);
}

.how-to {
  max-width: 44ch;
}

.example {
  display: grid;
  place-items: center end;
}

.chat {
  width: min(26rem, 100%);
}

@media (max-width: 63.99rem) {
  .feature {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
