<script setup lang="ts">
import { money } from '#shared/plans'
import { HERO_SCREEN } from '#shared/screens'

import { brand } from '~/brand'

const catalog = await usePlans()
const from = money(catalog.basic.monthlyCents)

useSeoMeta({
  title: `${brand.name}: seu assistente de saúde no WhatsApp`,
  description: `Conte o que comeu por texto, áudio ou foto no WhatsApp e saiba quanto falta da sua meta. Treinos, peso e jejum na mesma conversa. ${catalog.trialDays} dias grátis, sem cartão; depois, a partir de ${from} por mês.`,
  ogTitle: `${brand.name}: seu assistente de saúde no WhatsApp`,
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
        <h1 class="headline">Seu assistente de saúde no WhatsApp</h1>
        <p class="lead">
          Hoje ele cuida da sua alimentação e dos seus treinos. Conte o que comeu por texto, áudio
          ou foto e saiba na hora quanto falta da meta.
        </p>
        <div class="actions">
          <WhatsAppButton location="hero" />
          <NuxtLink to="/#como-funciona" class="secondary">Ver como funciona</NuxtLink>
        </div>
        <p class="terms">
          {{ catalog.trialDays }} dias grátis com tudo do Premium, sem cartão. Depois, a partir de
          {{ from }} por mês.
        </p>
      </div>

      <div class="stage">
        <div class="phone">
          <PhoneFrame :screen="HERO_SCREEN" />
        </div>
        <div class="float today" data-ui>
          <p class="float-title">Hoje</p>
          <CalorieRing :eaten="1240" :goal="1800" :size="112" />
          <p class="float-note">Faltam 560 kcal</p>
        </div>
        <div class="float macros" data-ui>
          <p class="float-title">Macros do dia</p>
          <ul>
            <li>
              <span>Proteína</span><span class="grams">78 g</span>
              <i class="meter"><b style="--w: 65%; --c: var(--protein)" /></i>
            </li>
            <li>
              <span>Carboidrato</span><span class="grams">140 g</span>
              <i class="meter"><b style="--w: 70%; --c: var(--carbs)" /></i>
            </li>
            <li>
              <span>Gordura</span><span class="grams">38 g</span>
              <i class="meter"><b style="--w: 63%; --c: var(--fat)" /></i>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <HomeHow />
    <HomeBento />
    <HomeShowcase />
    <HomeAssistant />
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
  max-width: 18ch;
  font-size: var(--step-display);
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

.stage {
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  place-items: center;
  height: min(80svh, 46rem);
  overflow: hidden;
  border-radius: 2rem;
  background: var(--mint);
}

.phone {
  width: min(21rem, 66%);
  margin-top: 8rem;
}

@media (prefers-reduced-motion: no-preference) {
  .phone {
    animation: rise 1s var(--ease-out) 150ms both;
  }
  .float {
    animation: pop 700ms var(--ease-out) both;
  }
  .today {
    animation-delay: 700ms;
  }
  .macros {
    animation-delay: 850ms;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
}

.float {
  position: absolute;
  display: grid;
  gap: 0.625rem;
  padding: 1.125rem 1.25rem;
  border-radius: 1.25rem;
  background: var(--card);
  font-size: var(--step-small);
}

.today {
  top: 2.5rem;
  left: 2rem;
  justify-items: center;
}

.macros {
  right: 2rem;
  bottom: 3rem;
  width: 15rem;
}

.float-title {
  justify-self: start;
  font-weight: 700;
}

.float-note {
  color: var(--green);
  font-weight: 500;
}

.macros ul {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.macros li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem 0.5rem;
}

.grams {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.meter {
  grid-column: 1 / -1;
  display: block;
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background: var(--tone);
}

.meter b {
  display: block;
  width: var(--w);
  height: 100%;
  border-radius: 3px;
  background: var(--c);
}

@media (max-width: 63.99rem) {
  .hero {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .stage {
    height: 36rem;
  }
}

@media (max-width: 47.99rem) {
  .stage {
    height: 30rem;
  }
  .phone {
    width: 78%;
    margin-top: 5rem;
  }
  .today {
    top: 1rem;
    left: 1rem;
    padding: 0.875rem;
  }
  .macros {
    display: none;
  }
}
</style>
