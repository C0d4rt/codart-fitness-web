<script setup lang="ts">
import { brand } from '~/brand'

const catalog = await usePlans()

useSeoMeta({
  title: `${brand.name}: seu assistente fitness no WhatsApp`,
  description: `Refeições, treinos, metas e peso numa conversa no WhatsApp, com respostas na hora. ${catalog.trialDays} dias grátis, sem cartão.`,
  ogTitle: `${brand.name}: seu assistente fitness no WhatsApp`,
  ogDescription: `Dieta e treino numa conversa. ${catalog.trialDays} dias grátis.`,
  ogType: 'website',
  ogLocale: 'pt_BR',
})
</script>

<template>
  <div class="page">
    <SiteNav />

    <header id="hero" class="hero">
      <div class="copy" data-reveal>
        <h1 class="headline">Seu assistente fitness</h1>
        <p class="lead">
          No WhatsApp. Ele anota suas refeições e treinos, acompanha suas metas e seu peso, e te
          responde na hora
        </p>
        <div class="actions">
          <WhatsAppButton location="hero" />
          <NuxtLink to="/#como-funciona" class="secondary">Ver como funciona</NuxtLink>
        </div>
        <p class="terms">{{ catalog.trialDays }} dias grátis com tudo do Premium</p>
      </div>
      <HeroDemo />
    </header>

    <HomeHow />
    <HomeBento />
    <HomeMoment />
    <HomeShowcase />
    <PlanCards :catalog="catalog" />
    <HomeFaq :trial-days="catalog.trialDays" />
    <HomeStart />
    <SiteFooter />
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 6fr 5fr;
  align-items: center;
  gap: 3rem;
  min-height: calc(100svh - 5rem);
  padding: 2rem var(--margin) 4rem;
}

.copy {
  display: grid;
  justify-items: start;
  gap: 1.75rem;
}

.headline {
  max-width: 13ch;
  font-size: var(--step-display);
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.lead {
  max-width: 34ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}

.secondary {
  font-weight: 500;
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .secondary:hover {
    text-decoration: underline;
  }
}

.terms {
  color: var(--muted);
  font-size: var(--step-small);
}

@media (max-width: 63.99rem) {
  .hero {
    grid-template-columns: 1fr;
    min-height: 0;
  }
}
</style>
