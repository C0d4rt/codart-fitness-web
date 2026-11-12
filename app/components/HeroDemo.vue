<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { FEATURE_COPY } from '#shared/featureCopy'
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
</script>

<template>
  <div class="stage">
    <div class="ask">
      <div class="bar" aria-hidden="true">
        <svg class="glyph" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
        <span class="placeholder">{{ t('hero.placeholder') }}</span>
        <svg class="glyph" viewBox="0 0 24 24">
          <path
            d="M12 3.5a2.75 2.75 0 0 1 2.75 2.75v5a2.75 2.75 0 0 1-5.5 0v-5A2.75 2.75 0 0 1 12 3.5z"
          />
          <path d="M6.5 10.75a5.5 5.5 0 0 0 11 0M12 16.25v4" />
        </svg>
        <span class="send">
          <svg viewBox="0 0 24 24"><path d="M12 19V5.5M6.5 11 12 5.5l5.5 5.5" /></svg>
        </span>
      </div>
      <div class="hero-chips" role="group" :aria-label="t('hero.chipsLabel')">
        <button
          v-for="choice in CHOICES"
          :key="choice.id"
          type="button"
          class="chip"
          :aria-pressed="selected === choice.id"
          @click="selected = choice.id"
        >
          <FeatureIcon :feature="choice.feature" class="icon" />
          {{ t(`hero.chips.${choice.id}`) }}
        </button>
      </div>
    </div>
    <div class="phone">
      <ChatWindow :screen="current" class="chat" />
    </div>
    <p class="visually-hidden" aria-live="polite">{{ current.label }}</p>
  </div>
</template>

<style scoped>
/* A wash of the page's own greens and blues: the one coloured field on the page, behind the live demo. */
.stage {
  --scale: 0.9;

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 2rem 3rem;
  padding: clamp(1.5rem, 0.5rem + 3.5vw, 4rem);
  border-radius: 2.5rem;
  background-color: #eaf1ee;
  background-image: /* taste-skill-ignore: the owner asked for a soft wash of the palette here */
    radial-gradient(60% 70% at 12% 18%, #d5ecdf 0%, transparent 70%),
    radial-gradient(55% 65% at 92% 22%, #dbe7f3 0%, transparent 70%),
    radial-gradient(70% 60% at 60% 100%, #e6efd6 0%, transparent 75%);
}

.ask {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
  justify-self: end;
  width: min(100%, 31rem);
}

.bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 4rem;
  padding: 0 0.625rem 0 1.25rem;
  border-radius: 999px;
  background: var(--card);
  color: var(--muted);
}

.glyph {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.placeholder {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.send {
  display: grid;
  flex: none;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--green);
  color: var(--green-ink);
}

.send svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0 1rem 0 0.875rem;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.72);
  color: var(--ink);
  font-size: var(--step-small);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms var(--ease-out);
}

.icon {
  color: var(--green);
  transition: color 160ms ease;
}

.chip[aria-pressed='true'] {
  background: var(--ink);
  color: var(--card);
}

.chip[aria-pressed='true'] .icon {
  color: var(--mint);
}

.chip:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .chip:not([aria-pressed='true']):hover {
    background: var(--card);
  }
}

/* Without script the chips could not change anything, so the first conversation stands alone. */
:global(html:not(.js) .hero-chips) {
  display: none;
}

/* The phone keeps its full height from the first paint, whichever conversation it shows. */
.phone {
  display: grid;
  grid-template-columns: 100%;
  place-items: center start;
  width: 100%;
  height: calc(min(38rem, 100svh - 8rem) * var(--scale));
}

.phone .chat {
  zoom: var(--scale);
}

@media (max-width: 63.99rem) {
  .stage {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }
  .ask {
    justify-self: center;
  }
  .phone {
    place-items: center;
  }
  .hero-chips {
    justify-content: center;
  }
}

@media (max-width: 47.99rem) {
  .stage {
    --scale: 0.84;

    padding: 1.25rem 0.75rem;
    border-radius: 2rem;
  }
  .bar .glyph:first-child {
    display: none;
  }
  .hero-chips {
    gap: 0.375rem;
  }
  .chip {
    gap: 0.375rem;
    padding: 0 0.875rem 0 0.75rem;
    font-size: 0.875rem;
  }
  .icon {
    width: 1rem;
    height: 1rem;
  }
}

@media (forced-colors: active) {
  .chip {
    border: 1px solid ButtonText;
  }
  .chip[aria-pressed='true'] {
    background: Highlight;
    color: HighlightText;
  }
}
</style>
