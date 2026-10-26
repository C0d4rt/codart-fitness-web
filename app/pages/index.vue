<script setup lang="ts">
import { money } from '#shared/plans'

import { brand } from '~/brand'

const catalog = await usePlans()
const from = money(catalog.basic.monthlyCents)

useSeoMeta({
  title: `${brand.name}: diário de dieta e treino no WhatsApp`,
  description: `Conte o que comeu por texto, áudio ou foto no WhatsApp e saiba quanto falta da sua meta. ${catalog.trialDays} dias grátis, sem cartão; depois, a partir de ${from} por mês.`,
  ogTitle: `${brand.name}: diário de dieta e treino no WhatsApp`,
  ogDescription: `Conte o que comeu e saiba quanto falta da meta. ${catalog.trialDays} dias grátis.`,
  ogType: 'website',
  ogLocale: 'pt_BR',
})
</script>

<template>
  <div class="page">
    <SiteNav />

    <header id="hero" class="hero">
      <div class="upper" data-chapter="paper" />
      <div class="lower" data-chapter="green" />
      <h1 class="headline">
        Conte o que<br />
        <span class="slot"
          ><img
            src="/images/brunch.jpg"
            alt="Uma tigela de frutas com kiwi, banana e amoras, vista de cima"
            width="1600"
            height="1100" /></span
        >comeu.
      </h1>
      <div class="hero-copy" data-reveal>
        <p class="claim">
          Seu diário de dieta e treino no WhatsApp: mande texto, áudio ou foto e saiba quanto falta
          da meta.
        </p>
        <WhatsAppButton location="hero" />
        <p class="terms">
          {{ catalog.trialDays }} dias grátis com tudo do Premium, sem cartão. Depois, a partir de
          {{ from }} por mês.
        </p>
      </div>
    </header>

    <HomeHow />
    <HomeShowcase />
    <HomeFeatures />
    <HomeTraining />

    <PlanFields :catalog="catalog" />
    <p class="more" data-chapter="paper">
      <NuxtLink to="/planos">Ver tudo o que cada plano faz, com exemplos</NuxtLink>
    </p>
    <HomeSources />
    <HomeFaq :trial-days="catalog.trialDays" />
    <HomeStart />
    <SiteFooter />
  </div>
</template>

<style scoped>
.hero {
  --seam: 52svh;
  position: relative;
  display: grid;
  min-height: calc(100svh + 12svh);
  overflow: hidden;
}

.upper,
.lower {
  position: absolute;
  inset-inline: 0;
}

.upper {
  top: 0;
  height: var(--seam);
  background: var(--paper);
}

.lower {
  top: var(--seam);
  bottom: 0;
  background: var(--green);
}

.headline {
  position: absolute;
  top: calc(var(--seam) - 1.22em);
  left: 50%;
  width: max-content;
  color: var(--ink);
  font-size: var(--step-display);
  line-height: 0.9;
  letter-spacing: -0.045em;
  text-align: center;
  transform: translateX(-50%);
}

.slot {
  display: inline-block;
  width: 2.1em;
  height: 0.74em;
  margin-right: 0.18em;
  overflow: hidden;
  border-radius: 0.14em;
  vertical-align: -0.02em;
}

.slot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 55% 48%;
}

@media (prefers-reduced-motion: no-preference) {
  .slot img {
    animation: drift 14s var(--ease-in-out) infinite alternate;
  }
}

@keyframes drift {
  from {
    transform: scale(1.04);
  }
  to {
    transform: scale(1.22) translateX(-6%);
  }
}

.hero-copy {
  position: relative;
  align-self: end;
  justify-self: center;
  display: grid;
  justify-items: center;
  gap: 1.5rem;
  max-width: 48rem;
  padding: 0 var(--margin) 4.5rem;
  color: var(--ink);
  text-align: center;
}

.claim {
  font-size: var(--step-lead);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.015em;
}

.terms {
  font-size: var(--step-small);
  font-weight: 500;
}

.more {
  padding: 2rem var(--margin) 0;
  font-weight: 500;
}

@media (max-width: 47.99rem) {
  .hero {
    --seam: 42svh;
    min-height: 100svh;
  }
  .headline {
    font-size: 16vw;
  }
  .hero-copy {
    padding-bottom: 2.5rem;
  }
  .claim {
    max-width: 28ch;
    font-size: 1.125rem;
  }
}
</style>
