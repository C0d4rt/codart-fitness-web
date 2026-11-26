<script setup lang="ts">
import type { Feature } from '#shared/plans'

const props = defineProps<{ features: Feature[]; ids?: readonly string[]; label: string }>()

const localePath = useLocalePath()

type Tone = 'log' | 'goal' | 'train' | 'nudge' | 'pro'

const TONE: Record<string, Tone> = {
  dayGoal: 'goal',
  goalPercent: 'goal',
  mealGoals: 'goal',
  goalGrams: 'goal',
  weekdayGoals: 'goal',
  weekSummary: 'goal',
  weight: 'goal',
  nutrients: 'goal',
  foodRanking: 'goal',
  csvExport: 'goal',
  workouts: 'train',
  savedWorkouts: 'train',
  readyPrograms: 'train',
  periodizedTraining: 'train',
  fasting: 'train',
  reminders: 'nudge',
  mealReminders: 'nudge',
  anamnesis: 'pro',
  swapDiet: 'pro',
  professionalReview: 'pro',
  checkIns: 'pro',
  coachChat: 'pro',
  moreReplies: 'pro',
}

const shown = computed(() =>
  props.ids === undefined
    ? props.features
    : props.ids.flatMap((id) => props.features.filter((feature) => feature.id === id)),
)
</script>

<template>
  <ul class="feature-chips" :aria-label="label">
    <li v-for="feature in shown" :key="feature.id">
      <NuxtLink
        :to="localePath(`/recursos#${feature.id}`)"
        class="chip"
        :data-tone="TONE[feature.id] ?? 'log'"
      >
        <span class="tile"><FeatureIcon :feature="feature.id" /></span>
        <span>{{ feature.name }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.feature-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  --tile: var(--mint);
  --tile-ink: var(--green);

  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 2.75rem;
  padding: 0.375rem 1.125rem 0.375rem 0.4375rem;
  border-radius: 999px;
  background: var(--card);
  color: var(--ink);
  font-size: var(--step-small);
  font-weight: 500;
  line-height: 1.25;
  text-decoration: none;
  box-shadow: var(--shadow-chip);
  transition:
    box-shadow 200ms var(--ease-out),
    transform 200ms var(--ease-out);
}

.chip[data-tone='goal'] {
  --tile: var(--sky);
  --tile-ink: #2c64a0;
}

.chip[data-tone='train'] {
  --tile: #fbe7cc;
  --tile-ink: #a35d0c;
}

.chip[data-tone='nudge'] {
  --tile: var(--peach);
  --tile-ink: #a83c52;
}

.chip[data-tone='pro'] {
  --tile: var(--sand);
  --tile-ink: #4f6b16;
}

.tile {
  display: grid;
  flex: none;
  place-items: center;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 50%;
  background: var(--tile);
  color: var(--tile-ink);
}

.chip:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .chip:hover {
    box-shadow: var(--shadow-lift);
    transform: translateY(-2px);
  }
  .chip:hover:active {
    transform: translateY(-2px) scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .chip:hover,
  .chip:hover:active {
    transform: none;
  }
}

@media (forced-colors: active) {
  .chip {
    border: 1px solid LinkText;
  }
}
</style>
