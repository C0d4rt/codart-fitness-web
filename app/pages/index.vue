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
      <figure class="small">
        <img
          src="/images/frutas.jpg"
          alt="Framboesas e mirtilos num prato branco"
          width="1400"
          height="941"
        />
      </figure>
      <h1 class="headline">
        <span class="line one"><span>Conte o</span></span
        >{{ ' ' }}
        <span class="line two"><span>que comeu.</span></span>
      </h1>
      <figure class="tall">
        <img
          src="/images/brunch.jpg"
          alt="Uma tigela de frutas com kiwi, banana e amoras, vista de cima"
          width="1600"
          height="1100"
        />
      </figure>
      <div class="lead">
        <p>
          Um diário de dieta e treino dentro do WhatsApp. Mande texto, áudio ou foto e saiba quanto
          falta da meta.
        </p>
        <WhatsAppButton location="hero" />
        <p class="terms">
          {{ catalog.trialDays }} dias grátis com tudo do Premium, sem cartão. Depois, a partir de
          {{ from }} por mês.
        </p>
      </div>
    </header>

    <HomeDay />
    <HomeShowcase />
    <HomeFeatures />
    <PlanMenu :catalog="catalog" />
    <HomeSources />
    <HomeFaq :trial-days="catalog.trialDays" />
    <HomeStart />
    <SiteFooter />
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 30svh auto auto auto;
  column-gap: var(--gutter);
  min-height: calc(100svh - 5.5rem);
  padding: 0 var(--margin);
}

.small {
  grid-column: 10 / 13;
  grid-row: 1;
  align-self: end;
  margin-bottom: 1.25rem;
}

.small img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.headline {
  grid-column: 1 / -1;
  grid-row: 2;
  display: block;
  font-size: var(--step-display);
  line-height: 1;
  letter-spacing: -0.045em;
}

.line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.08em;
}

.line > span {
  display: block;
}

.one {
  padding-left: calc((100% + var(--gutter)) / 12);
}

.two {
  padding-left: calc((100% + var(--gutter)) / 12 * 5);
}

@media (prefers-reduced-motion: no-preference) {
  .line > span {
    animation: rise 900ms var(--ease-out) both;
  }
  .two > span {
    animation-delay: 110ms;
  }
  .lead {
    animation: appear 700ms var(--ease-out) 420ms both;
  }
}

@keyframes rise {
  from {
    transform: translateY(105%);
  }
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

.tall {
  grid-column: 2 / 5;
  grid-row: 3 / 5;
  margin-top: 1.5rem;
  overflow: hidden;
}

.tall img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 50% 50%;
}

.lead {
  grid-column: 6 / 12;
  grid-row: 3;
  display: grid;
  justify-items: start;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.lead > p:first-child {
  max-width: 36ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.35;
}

.terms {
  color: var(--muted);
  font-size: var(--step-small);
}

@media (max-width: 47.99rem) {
  .hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    min-height: auto;
  }
  .small {
    grid-column: 1;
    grid-row: 1;
    justify-self: end;
    width: 46%;
    margin: 1rem 0 1.5rem;
  }
  .headline {
    grid-row: 2;
    font-size: 14vw;
  }
  .one {
    padding-left: 0;
  }
  .two {
    padding-left: 18vw;
  }
  .tall {
    grid-column: 1;
    grid-row: 3;
    width: 72%;
  }
  .lead {
    grid-column: 1;
    grid-row: 4;
    margin-top: 1.5rem;
  }
}
</style>
