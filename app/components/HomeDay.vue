<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { FEATURE_COPY } from '#shared/featureCopy'
import { clock } from '#shared/locale'
import type { Feature } from '#shared/plans'
import { logModeScreen } from '#shared/screens'

import type { DayFigures } from './DayCard.vue'

defineProps<{ features: Feature[] }>()

const locale = useSiteLocale().value
const { t } = useI18n()

const fromFeature = (id: string): ChatScreen => ({
  id: `day-${id}`,
  label: FEATURE_COPY[locale][id]?.headline ?? '',
  messages: FEATURE_COPY[locale][id]?.exchange ?? [],
})

/* Each card repeats the numbers its conversation already says, never new ones. */
const MOMENTS: { id: string; screen: ChatScreen; figures: DayFigures }[] = [
  {
    id: 'breakfast',
    screen: logModeScreen('audio', locale),
    figures: {
      kind: 'energy',
      day: 'today',
      eaten: 234,
      goal: 1800,
      macros: { protein: 9, carbs: 38, fat: 5 },
    },
  },
  {
    id: 'reminder',
    screen: fromFeature('reminders'),
    figures: { kind: 'energy', day: 'yesterday', eaten: 1760, goal: 1800 },
  },
  {
    id: 'left',
    screen: fromFeature('dayGoal'),
    figures: {
      kind: 'energy',
      day: 'today',
      eaten: 1240,
      goal: 1800,
      macros: { protein: 78, carbs: 140, fat: 38 },
    },
  },
  { id: 'workout', screen: fromFeature('workouts'), figures: { kind: 'burn', kcal: 357 } },
  {
    id: 'nutrients',
    screen: fromFeature('nutrients'),
    figures: { kind: 'sodium', mg: 1480, max: 2000 },
  },
]
const TIMES = Object.fromEntries(
  MOMENTS.map((moment) => [moment.id, clock(moment.screen.messages[0]?.time ?? '', locale)]),
)

const selected = useState('day-moment', () => MOMENTS[0]!.id)
const picked = computed(() => MOMENTS.find((each) => each.id === selected.value) ?? MOMENTS[0]!)
const current = computed(() => picked.value.screen)
const replied = ref<string>()

const RELATED = [
  'reminders',
  'mealReminders',
  'workouts',
  'savedWorkouts',
  'fasting',
  'foodRanking',
] as const
const anchors = useAnchors()
</script>

<template>
  <section :id="anchors.day" class="day" aria-labelledby="day-title">
    <div class="head" data-reveal>
      <h2 id="day-title" class="title"><TextLines :text="t('day.title')" /></h2>
      <p class="lead">{{ t('day.lead') }}</p>
    </div>

    <div class="body">
      <div class="moments" role="group" :aria-label="t('day.label')">
        <ul>
          <li v-for="moment in MOMENTS" :key="moment.id">
            <button
              type="button"
              class="moment"
              :aria-pressed="selected === moment.id"
              @click="selected = moment.id"
            >
              <span class="time">{{ TIMES[moment.id] }}</span>
              <span class="what">
                <span class="name">{{ t(`day.moments.${moment.id}.name`) }}</span>
                <span class="note">{{ t(`day.moments.${moment.id}.note`) }}</span>
              </span>
            </button>
          </li>
        </ul>
      </div>
      <p class="picked">{{ t(`day.moments.${selected}.note`) }}</p>

      <div class="answer">
        <ChatWindow :screen="current" flat typing class="chat" @replied="replied = $event" />
        <div class="card-slot">
          <Transition name="card">
            <DayCard v-if="replied === current.id" :key="current.id" :figures="picked.figures" />
          </Transition>
        </div>
      </div>
      <FeatureChips :features="features" :ids="RELATED" :label="t('chips.label')" class="related" />
      <p class="visually-hidden" aria-live="polite">{{ current.label }}</p>
    </div>
  </section>
</template>

<style scoped>
.day {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2.5rem, 1.5rem + 2vw, 4rem);
  padding: var(--gap-section) var(--margin) 0;
}

.head {
  display: grid;
  gap: 1.5rem;
}

.title {
  font-size: var(--step-head);
}

.lead {
  max-width: 40ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.body {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  grid-template-areas:
    'moments answer'
    'related answer';
  grid-template-rows: auto 1fr;
  gap: 2.5rem clamp(2rem, 1rem + 3vw, 4rem);
}

.moments {
  grid-area: moments;
}

.moments ul {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.related {
  grid-area: related;
  align-self: start;
}

.picked {
  display: none;
  grid-area: picked;
  color: var(--muted);
}

.moment {
  display: grid;
  grid-template-columns: 4.75rem minmax(0, 1fr);
  align-items: baseline;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  border: 0;
  border-radius: 1.25rem;
  background: transparent;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    transform 160ms var(--ease-out);
}

.moment[aria-pressed='true'] {
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.moment:active {
  transform: scale(0.985);
}

@media (hover: hover) and (pointer: fine) {
  .moment:not([aria-pressed='true']):hover {
    background: color-mix(in oklab, var(--card) 55%, transparent);
  }
}

.time {
  color: var(--muted);
  font-size: var(--step-small);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.moment[aria-pressed='true'] .time {
  color: var(--green);
  font-weight: 500;
}

.what {
  display: grid;
  gap: 0.25rem;
}

.name {
  font-size: var(--step-title);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.note {
  color: var(--muted);
  font-size: var(--step-small);
}

/* The window and the card keep fixed heights whatever the moment, so choosing never moves the page. */
.answer {
  grid-area: answer;
  display: grid;
  grid-template-rows: 27rem 10.5rem;
  gap: 0.875rem;
  padding: clamp(1rem, 0.5rem + 1.5vw, 1.75rem);
  border-radius: var(--radius-panel);
  background: var(--tone);
}

.card-slot {
  display: grid;
  align-content: start;
}

.card-enter-active {
  transition:
    opacity 300ms var(--ease-out),
    transform 300ms var(--ease-out);
}

.card-leave-active {
  transition: opacity 120ms ease;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.card-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .card-enter-from {
    transform: none;
  }
}

@media (max-width: 63.99rem) {
  .body {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'moments' 'answer' 'related';
    grid-template-rows: auto;
  }
}

/* On a phone the moments wrap as short pills, so the conversation stays right under them. */
@media (max-width: 47.99rem) {
  .body {
    grid-template-areas: 'moments' 'picked' 'answer' 'related';
    gap: 1.25rem;
  }
  .moments ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .moment {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: auto;
    min-height: 2.75rem;
    padding: 0 1.125rem;
    border-radius: 999px;
    background: var(--card);
    white-space: nowrap;
  }
  .moment[aria-pressed='true'] {
    background: var(--ink);
    color: var(--card);
  }
  .moment[aria-pressed='true'] .time {
    color: var(--mint);
  }
  .name {
    font-size: var(--step-small);
    letter-spacing: 0;
  }
  .note {
    display: none;
  }
  .picked {
    display: block;
  }
  .related {
    margin-top: 1.25rem;
  }
  .answer {
    grid-template-rows: 30rem 11.5rem;
    margin-inline: calc(var(--margin) * -0.5);
    border-radius: var(--radius);
  }
  .answer .chat {
    font-size: 0.9375rem;
  }
  .answer .chat :deep(.thread) {
    padding-inline: 0.875rem;
  }
}

@media (forced-colors: active) {
  .moment[aria-pressed='true'] {
    outline: 2px solid Highlight;
  }
}
</style>
