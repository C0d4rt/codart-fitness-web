<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { FEATURE_COPY } from '#shared/featureCopy'
import { clock } from '#shared/locale'
import { logModeScreen } from '#shared/screens'

const locale = useSiteLocale().value
const { t } = useI18n()

const fromFeature = (id: string): ChatScreen => ({
  id: `day-${id}`,
  label: FEATURE_COPY[locale][id]?.headline ?? '',
  messages: FEATURE_COPY[locale][id]?.exchange ?? [],
})

const MOMENTS = [
  { id: 'breakfast', screen: logModeScreen('audio', locale) },
  { id: 'reminder', screen: fromFeature('reminders') },
  { id: 'left', screen: fromFeature('dayGoal') },
  { id: 'workout', screen: fromFeature('workouts') },
  { id: 'nutrients', screen: fromFeature('nutrients') },
].map((moment) => ({ ...moment, time: clock(moment.screen.messages[0]?.time ?? '', locale) }))

const selected = useState('day-moment', () => MOMENTS[0]!.id)
const current = computed(
  () => (MOMENTS.find((each) => each.id === selected.value) ?? MOMENTS[0]!).screen,
)

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
              <span class="time">{{ moment.time }}</span>
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
        <ChatWindow :screen="current" class="chat" />
      </div>
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
  grid-template-areas: 'moments answer';
  align-items: start;
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

/* The panel keeps the phone's height whatever the conversation, so choosing never moves the page. */
.answer {
  --scale: 0.9;

  grid-area: answer;
  display: grid;
  place-items: center;
  height: calc(min(38rem, 100svh - 8rem) * var(--scale) + 5rem);
  border-radius: 2.5rem;
  background: var(--tone);
}

.answer .chat {
  zoom: var(--scale);
}

@media (max-width: 63.99rem) {
  .body {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'moments' 'answer';
  }
}

/* On a phone the moments wrap as short pills, so the conversation stays right under them. */
@media (max-width: 47.99rem) {
  .body {
    grid-template-areas: 'moments' 'picked' 'answer';
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
  .answer {
    --scale: 0.84;

    height: calc(min(38rem, 100svh - 8rem) * var(--scale) + 2.5rem);
    border-radius: 2rem;
  }
}

@media (forced-colors: active) {
  .moment[aria-pressed='true'] {
    outline: 2px solid Highlight;
  }
}
</style>
