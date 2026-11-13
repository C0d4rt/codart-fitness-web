<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { FEATURE_COPY } from '#shared/featureCopy'
import { thousands } from '#shared/locale'
import { heroScreen, logModeScreen } from '#shared/screens'

const locale = useSiteLocale().value
const { t } = useI18n()

const fromFeature = (id: string): ChatScreen => ({
  id: `hero-${id}`,
  label: FEATURE_COPY[locale][id]?.headline ?? '',
  messages: FEATURE_COPY[locale][id]?.exchange ?? [],
})

const CHOICES = [
  { id: 'lunch', feature: 'diary', screen: heroScreen(locale) },
  { id: 'photo', feature: 'photos', screen: logModeScreen('photo', locale) },
  { id: 'barcode', feature: 'barcode', screen: fromFeature('barcode') },
  { id: 'dinner', feature: 'mealSuggestion', screen: fromFeature('mealSuggestion') },
  { id: 'recipe', feature: 'recipes', screen: fromFeature('recipes') },
]

const selected = ref(CHOICES[0]!.id)
const current = computed(
  () => (CHOICES.find((each) => each.id === selected.value) ?? CHOICES[0]!).screen,
)

const EATEN = 1240
const GOAL = 1800
const RADIUS = 194
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const offset = CIRCUMFERENCE * (1 - EATEN / GOAL)
</script>

<template>
  <div class="demo" :style="{ '--circumference': CIRCUMFERENCE }">
    <div class="stage">
      <svg class="ring" viewBox="0 0 400 400" aria-hidden="true">
        <circle class="track" cx="200" cy="200" :r="RADIUS" />
        <circle
          class="value"
          cx="200"
          cy="200"
          :r="RADIUS"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="offset"
        />
      </svg>
      <p class="reading">
        <strong>{{ thousands(EATEN, locale) }}</strong>
        <span>{{ t('ring.ofGoal', { goal: thousands(GOAL, locale) }) }}</span>
      </p>
      <div class="phone">
        <ChatWindow :screen="current" class="chat" />
      </div>
    </div>
    <div class="asks" role="group" :aria-label="t('hero.chipsLabel')">
      <button
        v-for="choice in CHOICES"
        :key="choice.id"
        type="button"
        class="ask"
        :aria-pressed="selected === choice.id"
        @click="selected = choice.id"
      >
        <FeatureIcon :feature="choice.feature" class="icon" />
        <span>{{ t(`hero.chips.${choice.id}`) }}</span>
        <svg class="ticks" viewBox="0 0 18 12" aria-hidden="true">
          <path d="M1.5 6.5 4.75 9.75 11 2.5M7.25 9.75 13.5 2.5" />
        </svg>
      </button>
    </div>
    <p class="visually-hidden" aria-live="polite">{{ current.label }}</p>
  </div>
</template>

<style scoped>
/* The day's goal ring is the stage: the phone stands inside it, the visitor's questions beside it. */
.demo {
  --scale: 0.78;
  --phone: calc(min(38rem, 100svh - 8rem) * var(--scale));
  --ring: calc(var(--phone) * 1.16);

  display: grid;
  grid-template-columns: var(--ring) auto;
  align-items: center;
}

.stage {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--ring);
  height: var(--ring);
}

.ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

circle {
  fill: none;
  stroke-width: 9;
  stroke-linecap: round;
}

.track {
  stroke: var(--tone);
}

.value {
  stroke: var(--green);
}

@media (prefers-reduced-motion: no-preference) {
  .value {
    animation: fill 1.2s var(--ease-out) 300ms both;
  }
}

@keyframes fill {
  from {
    stroke-dashoffset: var(--circumference);
  }
}

.reading {
  position: absolute;
  top: 50%;
  left: 7%;
  display: grid;
  width: calc((var(--ring) - var(--phone) * 71.6 / 147.6) / 2 - 7%);
  line-height: 1.15;
  transform: translateY(-50%);
}

.reading strong {
  font-size: var(--step-title);
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.reading span {
  color: var(--muted);
  font-size: var(--step-small);
}

/* The phone keeps its full height from the first paint, whichever conversation it shows. */
.phone {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: var(--phone);
}

.phone .chat {
  zoom: var(--scale);
}

.asks {
  position: relative;
  display: grid;
  justify-items: start;
  gap: 0.625rem;
  margin-left: calc(var(--phone) * -0.33);
}

/* Each question is a message the visitor could send: it lands in the phone. */
.ask {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.875rem 0.5rem 0.75rem;
  border: 0;
  border-radius: 1.25rem 1.25rem 1.25rem 0.375rem;
  background: var(--card);
  color: var(--ink);
  font-size: var(--step-small);
  font-weight: 500;
  line-height: 1.25;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms var(--ease-out);
}

.icon {
  flex: none;
  color: var(--green);
  transition: color 160ms ease;
}

.ticks {
  flex: none;
  width: 1.125rem;
  height: 0.75rem;
  fill: none;
  stroke: var(--chat-tick);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ask:not([aria-pressed='true']) .ticks {
  display: none;
}

.ask[aria-pressed='true'] {
  background: var(--ink);
  color: var(--card);
}

.ask[aria-pressed='true'] .icon {
  color: var(--mint);
}

.ask:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .ask:not([aria-pressed='true']):hover {
    background: var(--tone);
  }
}

/* Without script the questions could not change anything, so the first conversation stands alone. */
:global(html:not(.js) .asks) {
  display: none;
}

/* On a phone the ring is as wide as the screen, the phone stands in front of it, and the questions
   follow underneath. */
@media (max-width: 47.99rem) {
  .demo {
    --scale: 0.76;
    --ring: min(100%, 26rem);

    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: 2rem;
  }
  .stage {
    height: var(--phone);
  }
  .ring {
    inset: auto 0;
    height: auto;
    aspect-ratio: 1;
  }
  .reading {
    display: none;
  }
  .asks {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-left: 0;
  }
  .ask {
    font-size: 0.875rem;
  }
}

@media (forced-colors: active) {
  .ask {
    border: 1px solid ButtonText;
  }
  .ask[aria-pressed='true'] {
    background: Highlight;
    color: HighlightText;
  }
}
</style>
