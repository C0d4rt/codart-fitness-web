<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { decimal, LANGUAGE, thousands } from '#shared/locale'
import type { Feature } from '#shared/plans'

defineProps<{ features: Feature[] }>()

const { t } = useI18n()
const anchors = useAnchors()
const locale = useSiteLocale()

/* The same sample week the two charts were drawn from by codart-messaging's own code. */
const WEEK = [2160, 1820, 2230, 1790, 2180, 2470, 1840]
const GOAL = 2100
const EATEN_TODAY = 1540
const WEIGHT = { from: 84.6, now: 80.8, since: Date.UTC(2026, 8, 28) }

const figures = computed(() => ({
  goal: thousands(GOAL, locale.value),
  average: thousands(WEEK.reduce((sum, value) => sum + value, 0) / WEEK.length, locale.value),
  logged: WEEK.length,
  days: WEEK.length,
}))

const weight = computed(() => ({
  now: decimal(WEIGHT.now, locale.value),
  delta: `−${decimal(WEIGHT.from - WEIGHT.now, locale.value)}`,
  date: new Intl.DateTimeFormat(LANGUAGE[locale.value], {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(WEIGHT.since),
}))

const today = computed<ChatScreen>(() => ({
  id: 'bento-today',
  label: t('bento.day.label'),
  messages: [
    {
      from: 'bot',
      text: t('bento.day.answer', {
        eaten: thousands(EATEN_TODAY, locale.value),
        left: thousands(GOAL - EATEN_TODAY, locale.value),
        goal: thousands(GOAL, locale.value),
      }),
      time: '17:10',
    },
  ],
}))

const RELATED = ['dayGoal', 'mealGoals', 'weekSummary', 'weight', 'nutrients', 'csvExport'] as const
</script>

<template>
  <section :id="anchors.bento" class="bento" aria-labelledby="bento-title">
    <div class="words">
      <div class="intro" data-reveal>
        <h2 id="bento-title" class="title"><TextLines :text="t('bento.title')" /></h2>
        <p class="lead">{{ t('bento.lead') }}</p>
        <NuxtLinkLocale to="/recursos" class="link">{{ t('bento.seeAll') }}</NuxtLinkLocale>
      </div>
      <FeatureChips :features="features" :ids="RELATED" :label="t('chips.label')" />
    </div>
    <div class="grid">
      <figure class="tile week">
        <figcaption class="tile-title">{{ t('bento.week.title') }}</figcaption>
        <div class="figure">
          <p class="number">
            {{ figures.average }}<span class="unit">{{ t('bento.week.unit') }}</span>
          </p>
          <p class="badge">{{ t('bento.week.badge', figures) }}</p>
        </div>
        <img
          src="/images/resumo-da-semana.webp"
          width="900"
          height="1109"
          :alt="t('bento.week.chartLabel', figures)"
          loading="lazy"
          decoding="async"
          class="chart"
        />
      </figure>

      <figure class="tile day">
        <figcaption class="tile-title">{{ t('bento.day.title') }}</figcaption>
        <ChatWindow :screen="today" bare class="chat" />
      </figure>

      <figure class="tile weight">
        <figcaption class="tile-title">{{ t('bento.weight.title') }}</figcaption>
        <div class="figure">
          <p class="number">
            {{ weight.now }}<span class="unit">{{ t('bento.weight.unit') }}</span>
          </p>
          <p class="badge">{{ t('bento.weight.badge', weight) }}</p>
        </div>
        <img
          src="/images/evolucao-do-peso.webp"
          width="900"
          height="667"
          :alt="t('bento.weight.alt')"
          loading="lazy"
          decoding="async"
          class="chart"
        />
        <p class="tile-text">{{ t('bento.weight.text') }}</p>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: center;
  gap: 3rem clamp(3rem, 1rem + 5vw, 6rem);
  padding: var(--gap-section) var(--margin) 0;
}

.words {
  display: grid;
  gap: 2rem;
}

.intro {
  display: grid;
  justify-items: start;
  gap: 1.5rem;
}

.title {
  font-size: var(--step-head);
}

.lead {
  max-width: 36ch;
  color: var(--muted);
}

.link {
  color: var(--green);
  font-weight: 500;
}

/* The tall week chart leads; today's answer and the weight chart stack beside it. */
.grid {
  order: -1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-areas:
    'week day'
    'week weight';
  gap: 0.75rem;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 1.5rem;
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.tile-title {
  font-weight: 500;
}

.tile-text {
  color: var(--muted);
  font-size: var(--step-small);
}

.figure {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
}

.number {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  font-size: var(--step-figure);
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.number .unit {
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
  letter-spacing: 0;
}

.badge {
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: var(--mint);
  color: var(--green);
  font-size: var(--step-small);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.week .chart {
  margin-block: auto;
}

.week {
  grid-area: week;
}

.day {
  grid-area: day;
}

.weight {
  grid-area: weight;
}

/* The charts are the very images the assistant sends; their own off-white ground frames them. */
.chart {
  align-self: center;
  width: 100%;
  height: auto;
  border-radius: var(--radius-small);
}

.day .chat :deep(.bubble) {
  max-width: 94%;
}

@media (max-width: 63.99rem) {
  .bento {
    grid-template-columns: minmax(0, 1fr);
  }
  .grid {
    order: 0;
  }
}

@media (max-width: 47.99rem) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'day' 'week' 'weight';
  }
}
</style>
