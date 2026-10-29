<script setup lang="ts">
import { decimal, thousands } from '#shared/locale'

const { t } = useI18n()

const WEIGHT = [72.4, 72.3, 72.3, 72.1, 72.2, 72.0, 71.8]
const WEEK = [1820, 1690, 1760, 0, 1710, 1880, 1700]
const GOAL = 1800
const FLOOR = 1200
const CEILING = 2000

const weightPath = computed(() => {
  const max = 72.5
  const min = 71.7
  return WEIGHT.map((value, index) => {
    const x = (index / (WEIGHT.length - 1)) * 300
    const y = ((max - value) / (max - min)) * 100
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
})

const height = (value: number) =>
  value === 0 ? '4%' : `${((value - FLOOR) / (CEILING - FLOOR)) * 100}%`
const anchors = useAnchors()
const locale = useSiteLocale()

const EATEN_TODAY = 1240
const LOGGED = WEEK.filter((value) => value > 0)
const figures = computed(() => ({
  left: thousands(GOAL - EATEN_TODAY, locale.value),
  goal: thousands(GOAL, locale.value),
  average: thousands(LOGGED.reduce((sum, value) => sum + value, 0) / LOGGED.length, locale.value),
  logged: LOGGED.length,
  days: WEEK.length,
  weight: decimal(WEIGHT.at(-1)!, locale.value),
  delta: decimal(WEIGHT.at(-1)! - WEIGHT[0]!, locale.value),
}))
</script>

<template>
  <section :id="anchors.bento" class="bento" aria-labelledby="bento-title">
    <div class="intro" data-reveal>
      <h2 id="bento-title" class="title">{{ t('bento.title') }}</h2>
      <p>{{ t('bento.lead') }}</p>
      <NuxtLinkLocale to="/recursos" class="link">{{ t('bento.seeAll') }}</NuxtLinkLocale>
    </div>

    <div class="grid">
      <article class="tile day" data-ui>
        <p class="tile-title">{{ t('bento.day.title') }}</p>
        <CalorieRing :eaten="EATEN_TODAY" :goal="GOAL" :size="150" />
        <p class="tile-text">{{ t('bento.day.text', figures) }}</p>
      </article>

      <article class="tile week" data-ui>
        <p class="tile-title">{{ t('bento.week.title') }}</p>
        <div class="bars" role="img" :aria-label="t('bento.week.chartLabel', figures)">
          <span
            v-for="(value, index) in WEEK"
            :key="index"
            class="bar"
            :class="{ over: value > GOAL, missing: value === 0 }"
            :style="{ '--h': height(value) }"
          />
          <span class="goal-line" :style="{ '--g': height(GOAL) }" />
        </div>
        <p class="tile-text">{{ t('bento.week.text', figures) }}</p>
      </article>

      <article class="tile weight" data-ui>
        <p class="tile-title">{{ t('bento.weight.title') }}</p>
        <p class="big">
          {{ t('bento.weight.value', figures) }}
          <span class="delta">{{ t('bento.weight.delta', figures) }}</span>
        </p>
        <svg viewBox="0 0 300 100" class="line" aria-hidden="true" preserveAspectRatio="none">
          <path :d="weightPath" />
        </svg>
        <p class="tile-text">{{ t('bento.weight.text') }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.bento {
  display: grid;
  gap: 2.5rem;
  padding: var(--gap-section) var(--margin) 0;
}

.intro {
  display: grid;
  gap: 1rem;
}

.title {
  max-width: 16ch;
  font-size: var(--step-head);
}

.intro p {
  color: var(--muted);
  font-size: var(--step-lead);
}

.link {
  justify-self: start;
  color: var(--green);
  font-weight: 500;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.tile {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1.25rem;
  min-height: 21rem;
  padding: 1.5rem;
  border-radius: var(--radius);
  background: var(--card);
}

.tile-title {
  font-weight: 700;
}

.tile-text {
  color: var(--muted);
  font-size: var(--step-small);
}

.day {
  justify-items: center;
  background: var(--mint);
}

.day .tile-title,
.day .tile-text {
  justify-self: start;
}

.day :deep(.ring) {
  align-self: center;
}

.weight {
  background: var(--sky);
}

.bars {
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  align-self: center;
  gap: 0.5rem;
  height: 8.5rem;
}

.bar {
  height: var(--h);
  border-radius: 0.375rem;
  background: var(--green);
}

.bar.over {
  background: var(--carbs);
}

.bar.missing {
  background: var(--tone);
}

.goal-line {
  position: absolute;
  inset: auto 0 var(--g);
  height: 2px;
  background: var(--ink);
  opacity: 0.35;
}

.big {
  align-self: center;
  font-size: var(--step-head);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.delta {
  color: #0f5c3c;
  font-size: var(--step-body);
  font-weight: 500;
  letter-spacing: 0;
}

.line {
  width: 100%;
  height: 4rem;
  overflow: visible;
}

.weight {
  grid-template-rows: auto auto 1fr auto;
}

.line path {
  fill: none;
  stroke: var(--fat);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

@media (max-width: 63.99rem) {
  .grid {
    grid-template-columns: 1fr;
  }
  .tile {
    min-height: 0;
  }
}
</style>
