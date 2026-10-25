<script setup lang="ts">
import { money } from '#shared/plans'
import {
  goalScreen,
  HERO_SCREEN,
  HOW_SCREEN,
  logModeScreen,
  type LogMode,
  reminderScreen,
  type ShowcaseOutput,
  showcaseScreen,
} from '#shared/screens'

import { brand } from '~/brand'

const DIARY_SCREEN = logModeScreen('text')

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

const showcase = useState<ShowcaseOutput>('showcase', () => 'day')
const mode = useState<LogMode>('mode', () => 'text')
const goal = useState('goal', () => 1800)
const reminders = useState('reminders', () => true)

useStageObserver((id) => {
  switch (id) {
    case 'hero':
    case 'how':
      return HERO_SCREEN
    case 'showcase':
      return showcaseScreen(showcase.value)
    case 'mode':
      return logModeScreen(mode.value)
    case 'goal':
      return goalScreen(goal.value)
    case 'reminder':
      return reminderScreen(reminders.value)
    default:
      return undefined
  }
})
</script>

<template>
  <div class="page">
    <div class="split">
      <div class="stage-col">
        <StagePanel :fallback="HERO_SCREEN" />
      </div>
      <div class="column">
        <header class="hero" data-stage="hero">
          <SiteNav home />
          <h1 class="wordmark">
            {{ brand.name.toLowerCase()
            }}<span class="visually-hidden"> : diário de dieta e treino no WhatsApp</span>
          </h1>
          <div class="hero-copy" data-reveal>
            <p class="claim">
              Seu diário de dieta e treino, no WhatsApp. Conte o que comeu e saiba quanto falta.
            </p>
            <p>
              {{ catalog.trialDays }} dias grátis com tudo do Premium, sem cartão. Depois, a partir
              de {{ from }} por mês.
            </p>
            <WhatsAppButton location="hero" class="hero-action" />
          </div>
          <div class="inline-stage hero-stage"><ChatWindow :screen="HERO_SCREEN" /></div>
        </header>

        <section id="como-funciona" class="how" data-stage="how">
          <h2 class="heading">Três mensagens e pronto</h2>
          <div class="steps">
            <div class="step" data-reveal>
              <p>
                <strong>Para começar,</strong> toque no botão. O WhatsApp abre com a primeira
                mensagem escrita; mande, e o teste de {{ catalog.trialDays }} dias começa ali, sem
                cadastro e sem cartão.
              </p>
              <ComposeBar />
            </div>
            <div class="step" data-reveal>
              <p>
                <strong>Depois, conte o que comeu.</strong> Por texto, áudio ou foto, do jeito que
                falaria. O diário acha os alimentos na tabela TACO, soma e responde em segundos.
              </p>
              <ChatWindow :screen="DIARY_SCREEN" bare />
            </div>
            <div class="step" data-reveal>
              <p>
                <strong>A partir daí,</strong> cada resposta diz quanto falta da meta. Se você some
                por um dia, chega um lembrete curto, e "parar" desliga.
              </p>
              <ChatWindow :screen="HOW_SCREEN" bare />
            </div>
          </div>
        </section>

        <HomeShowcase />
        <HomeFeatures />
      </div>
    </div>

    <PlanFields :catalog="catalog" />
    <p class="more">
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
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100svh;
}

.hero > :deep(.nav) {
  order: 0;
}

.hero-copy {
  display: grid;
  gap: 1.5rem;
  align-content: start;
  padding-top: 26svh;
  padding-bottom: calc(var(--step-display) + 4rem);
}

.claim {
  max-width: 26ch;
  font-size: var(--step-lead);
  line-height: 1.3;
}

.hero-copy > p:not(.claim) {
  max-width: 40ch;
  color: var(--muted);
}

.hero-action {
  justify-self: start;
}

.wordmark {
  position: absolute;
  top: calc(100svh - var(--step-display) * 0.9 - 2.5rem);
  right: var(--margin);
  z-index: 2;
  margin: 0;
  font-size: var(--step-display);
  line-height: 0.9;
  letter-spacing: -0.04em;
  white-space: nowrap;
  pointer-events: none;
  transform-origin: right bottom;
}

@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .wordmark {
      animation: settle linear both;
      animation-timeline: scroll(root);
      animation-range: 0 100svh;
    }
  }
}

@keyframes settle {
  to {
    transform: scale(0.94);
  }
}

.how {
  display: grid;
  gap: 3rem;
}

.heading {
  font-size: var(--step-head);
}

.steps {
  display: grid;
  gap: 4.5rem;
}

.step {
  display: grid;
  gap: 1.25rem;
}

.steps p {
  color: var(--muted);
}

.steps strong {
  color: var(--ink);
  font-weight: 500;
}

.more {
  padding: 2rem var(--margin) 0;
}

@media (max-width: 63.99rem) {
  .hero {
    min-height: auto;
    grid-template-rows: auto;
  }
  .hero-stage {
    order: 1;
    margin: 0 -0.5rem;
  }
  .hero-stage :deep(.chat) {
    max-height: 44svh;
  }
  .hero-copy {
    order: 3;
    padding: 1.5rem 0 0;
  }
  .wordmark {
    position: static;
    order: 2;
    margin-top: -3vw;
    font-size: 21vw;
    transform: none;
    animation: none;
  }
  .steps {
    gap: 2rem;
  }
}
</style>
