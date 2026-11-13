<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { thousands } from '#shared/locale'
import type { Feature } from '#shared/plans'

defineProps<{ features: Feature[] }>()

const { t } = useI18n()
const locale = useSiteLocale().value
const anchors = useAnchors()

const PROTEIN = { total: 728, logged: 6, days: 7, goal: 130 }

const screen: ChatScreen = {
  id: 'assistant',
  label: t('assistant.label'),
  messages: [
    { from: 'you', text: t('assistant.chat.memoryQuestion'), time: '20:14' },
    {
      from: 'bot',
      text: t('assistant.chat.memoryAnswer', { goal: thousands(1800, locale) }),
      time: '20:14',
    },
    { from: 'you', text: t('assistant.chat.weekQuestion'), time: '20:15' },
    {
      from: 'bot',
      text: t('assistant.chat.weekAnswer', {
        ...PROTEIN,
        average: Math.round(PROTEIN.total / PROTEIN.logged),
      }),
      time: '20:15',
    },
    { from: 'you', text: t('assistant.chat.creatineQuestion'), time: '20:16' },
    { from: 'bot', text: t('assistant.chat.creatineAnswer'), time: '20:16' },
  ],
}

const POINTS = [
  { id: 'memory', shape: 'person' },
  { id: 'numbers', shape: 'chart' },
  { id: 'source', shape: 'book' },
] as const

const RELATED = ['pantry', 'mealSuggestion', 'weekSummary', 'foodRanking', 'nutrients'] as const
</script>

<template>
  <section :id="anchors.assistant" class="assistant" aria-labelledby="assistant-title">
    <div class="intro" data-reveal>
      <h2 id="assistant-title" class="title"><TextLines :text="t('assistant.title')" /></h2>
      <p class="lead">{{ t('assistant.lead') }}</p>
    </div>

    <div class="phone">
      <ChatWindow :screen="screen" class="chat" />
    </div>

    <ul class="points" :aria-label="t('assistant.pointsLabel')" data-reveal>
      <li v-for="(point, index) in POINTS" :key="point.id" class="point" :style="{ '--i': index }">
        <span class="mark"><FeatureIcon :shape="point.shape" class="icon" /></span>
        <h3 class="name">{{ t(`assistant.points.${point.id}.name`) }}</h3>
        <p class="text">{{ t(`assistant.points.${point.id}.text`) }}</p>
      </li>
    </ul>

    <FeatureChips :features="features" :ids="RELATED" :label="t('chips.label')" class="related" />
  </section>
</template>

<style scoped>
.assistant {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  grid-template-areas:
    'phone .'
    'phone intro'
    'phone points'
    'phone related'
    'phone .';
  grid-template-rows: 1fr auto auto auto 1fr;
  gap: 2.5rem clamp(3rem, 1rem + 5vw, 7rem);
  padding: var(--gap-section) var(--margin) 0;
}

.intro {
  grid-area: intro;
  display: grid;
  gap: 1.5rem;
}

.title {
  font-size: var(--step-head);
}

.lead {
  max-width: 38ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.phone {
  --scale: 0.9;

  grid-area: phone;
  display: grid;
  place-items: center;
  align-self: start;
  padding: clamp(1.5rem, 0.5rem + 3vw, 3.5rem) 1rem;
  border-radius: 2.5rem;
  background: var(--card);
}

/* Three exchanges have to fit one screen: a slightly larger phone, whose text stops growing at its
   cap, and bubbles that take a little more of its width. */
.phone .chat {
  width: min(100%, 21rem);
  zoom: var(--scale);
}

.phone .chat :deep(.bubble) {
  max-width: 92%;
}

.points {
  grid-area: points;
  display: grid;
  gap: 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.point {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  grid-template-areas:
    'mark name'
    'mark text';
  column-gap: 1.125rem;
  row-gap: 0.25rem;
}

.mark {
  grid-area: mark;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--mint);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--green);
}

.name {
  grid-area: name;
  align-self: center;
  font-size: var(--step-title);
  letter-spacing: -0.025em;
}

.text {
  grid-area: text;
  max-width: 40ch;
  color: var(--muted);
}

.related {
  grid-area: related;
  align-self: start;
}

@media (max-width: 63.99rem) {
  .assistant {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'intro' 'phone' 'points' 'related';
    grid-template-rows: auto;
  }
}

@media (max-width: 47.99rem) {
  .phone {
    --scale: 0.84;

    padding: 1.25rem 0.75rem;
    border-radius: 2rem;
  }
}
</style>
