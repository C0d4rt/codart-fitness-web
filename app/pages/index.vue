<script setup lang="ts">
import { money } from '#shared/plans'
import { HERO_SCREEN } from '#shared/screens'

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
    <div class="stack">
      <SiteNav />

      <header id="hero" class="hero">
        <h1 class="headline display">
          <span class="line"><span>Conte o que</span></span>
          {{ ' ' }}
          <span class="line"><span>você comeu</span></span>
        </h1>
        <div class="device">
          <PhoneFrame :screen="HERO_SCREEN" />
        </div>
        <div class="left">
          <p>
            Seu diário de dieta e treino dentro do WhatsApp. Mande texto, áudio ou foto e saiba na
            hora quanto falta da meta.
          </p>
          <WhatsAppButton location="hero" />
        </div>
        <p class="right">
          {{ catalog.trialDays }} dias grátis com tudo do Premium, sem cartão.<br />
          Depois, a partir de {{ from }} por mês.
        </p>
      </header>

      <HomeHow />
      <HomeShowcase />
      <HomeFeatures />
      <PlanReceipt :catalog="catalog" />
      <HomeSources />
      <HomeFaq :trial-days="catalog.trialDays" />
      <HomeStart />
    </div>
    <SiteFooter />
  </div>
</template>

<style scoped>
.stack {
  position: relative;
  z-index: 1;
  background: var(--ground);
}

.hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr minmax(16rem, 22rem) 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 3rem;
  height: calc(100svh - 5rem);
  min-height: 40rem;
  overflow: hidden;
  padding: 0 var(--margin);
}

.headline {
  grid-column: 1 / -1;
  justify-self: center;
  margin-top: 6svh;
  font-size: var(--step-display);
  line-height: 0.95;
  text-align: center;
}

.line {
  display: block;
  overflow: hidden;
}

.line > span {
  display: block;
}

.device {
  grid-column: 2;
  grid-row: 2;
  position: relative;
  z-index: 1;
  margin-top: -1.2vw;
}

.left,
.right {
  grid-row: 2;
  align-self: end;
  margin-bottom: 2.5rem;
}

.left {
  grid-column: 1;
  display: grid;
  justify-items: start;
  gap: 1.5rem;
  max-width: 21rem;
}

.left p {
  color: var(--ink);
}

.right {
  grid-column: 3;
  justify-self: end;
  max-width: 19rem;
  color: var(--muted);
  font-size: var(--step-small);
  text-align: right;
}

@media (prefers-reduced-motion: no-preference) {
  .line > span {
    animation: rise 1s var(--ease-out) both;
  }
  .line + .line > span {
    animation-delay: 90ms;
  }
  .device {
    animation: shutter 1.1s var(--ease-out) 250ms both;
  }
  .left,
  .right {
    animation: appear 700ms var(--ease-out) 650ms both;
  }
}

@keyframes rise {
  from {
    transform: translateY(105%);
  }
}

@keyframes shutter {
  from {
    clip-path: inset(100% 0 0 0);
    transform: translateY(8%) scale(1.04);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (max-width: 63.99rem) {
  .hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
    min-height: 0;
    overflow: visible;
  }
  .headline {
    font-size: 8.6vw;
  }
  .device {
    grid-column: 1;
    grid-row: 2;
    justify-self: center;
    width: min(64vw, 20rem);
    height: 62svh;
    overflow: hidden;
    margin-top: 1.5rem;
  }
  .left,
  .right {
    grid-column: 1;
    margin: 2rem 0 0;
  }
  .left {
    grid-row: 3;
    max-width: none;
  }
  .right {
    grid-row: 4;
    justify-self: start;
    text-align: left;
  }
}
</style>
