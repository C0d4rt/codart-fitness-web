<script setup lang="ts">
import { thousands } from '#shared/locale'

export type DayFigures =
  | {
      kind: 'energy'
      day: 'today' | 'yesterday'
      eaten: number
      goal: number
      macros?: { protein: number; carbs: number; fat: number }
    }
  | { kind: 'burn'; kcal: number }
  | { kind: 'sodium'; mg: number; max: number }

const props = defineProps<{ figures: DayFigures }>()

const { t } = useI18n()
const locale = useSiteLocale()
const n = (value: number) => thousands(value, locale.value)

const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const

const view = computed(() => {
  const figures = props.figures
  if (figures.kind === 'burn') {
    return {
      title: t('day.card.workout'),
      when: t('day.card.today'),
      number: n(figures.kcal),
      unit: t('day.card.burned'),
      segments: [],
      legend: [],
      note: t('day.card.burnNote'),
    }
  }
  if (figures.kind === 'sodium') {
    return {
      title: t('day.card.sodium'),
      when: t('day.card.today'),
      number: n(figures.mg),
      unit: t('day.card.sodiumOf', { max: n(figures.max) }),
      segments: [{ id: 'sodium', share: figures.mg / figures.max }],
      legend: [],
      note: t('day.card.sodiumLeft', { left: n(figures.max - figures.mg) }),
    }
  }
  const { macros } = figures
  return {
    title: t('day.card.energy'),
    when: t(`day.card.${figures.day}`),
    number: n(macros ? figures.goal - figures.eaten : figures.eaten),
    unit: t(macros ? 'day.card.left' : 'day.card.logged'),
    segments: macros
      ? (['protein', 'carbs', 'fat'] as const).map((id) => ({
          id,
          share: (macros[id] * KCAL_PER_GRAM[id]) / figures.goal,
        }))
      : [{ id: 'eaten', share: figures.eaten / figures.goal }],
    legend: macros
      ? (['protein', 'carbs', 'fat'] as const).map((id) => ({
          id,
          text: t(`day.card.${id}`, { grams: macros[id] }),
        }))
      : [],
    note: macros
      ? t('day.card.goal', { goal: n(figures.goal) })
      : t('day.card.ofGoal', {
          percent: Math.round((figures.eaten / figures.goal) * 100),
          goal: n(figures.goal),
        }),
  }
})
</script>

<template>
  <article class="day-card" aria-hidden="true">
    <header class="head">
      <span class="title">{{ view.title }}</span>
      <span class="when">{{ view.when }}</span>
    </header>
    <p class="number">
      {{ view.number }}<span class="unit">{{ view.unit }}</span>
    </p>
    <div v-if="view.segments.length" class="bar">
      <i
        v-for="(segment, index) in view.segments"
        :key="segment.id"
        :class="segment.id"
        :style="{ '--share': segment.share, '--n': index }"
      />
    </div>
    <ul v-if="view.legend.length" class="legend">
      <li v-for="item in view.legend" :key="item.id" :class="item.id">{{ item.text }}</li>
    </ul>
    <p class="note">{{ view.note }}</p>
  </article>
</template>

<style scoped>
.day-card {
  display: grid;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem 1.375rem;
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: var(--step-small);
}

.title {
  font-weight: 600;
}

.when {
  color: var(--muted);
}

.number {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.5rem;
  font-size: var(--step-figure);
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.unit {
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
  letter-spacing: 0;
}

.bar {
  display: flex;
  gap: 2px;
  height: 0.625rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--tone);
}

.bar i {
  flex: none;
  width: calc(var(--share) * 100%);
  border-radius: 999px;
  background: var(--green-mark);
  transform-origin: left;
  animation: grow 700ms var(--ease-out) both;
  animation-delay: calc(120ms + var(--n) * 90ms);
}

.bar .carbs {
  background: var(--carbs);
}

.bar .fat {
  background: var(--fat);
}

.bar .sodium {
  background: var(--carbs);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-small);
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
}

.legend li::before {
  content: '';
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--protein);
}

.legend .carbs::before {
  background: var(--carbs);
}

.legend .fat::before {
  background: var(--fat);
}

.note {
  color: var(--muted);
  font-size: var(--step-small);
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar i {
    animation: none;
  }
}
</style>
