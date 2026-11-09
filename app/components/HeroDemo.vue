<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { FEATURE_COPY } from '#shared/featureCopy'
import { goalScreen, heroScreen, logModeScreen, workoutScreen } from '#shared/screens'

const locale = useSiteLocale().value

const fromFeature = (id: string): ChatScreen[] => {
  const copy = FEATURE_COPY[locale][id]
  return copy === undefined
    ? []
    : [{ id: `hero-${id}`, label: copy.headline, messages: copy.exchange }]
}

const FIRST = heroScreen(locale)

const EXAMPLES = [
  FIRST,
  logModeScreen('audio', locale),
  logModeScreen('photo', locale),
  ...fromFeature('barcode'),
  goalScreen(1800, locale),
  ...fromFeature('mealSuggestion'),
  ...fromFeature('mealGoals'),
  workoutScreen(locale),
  ...fromFeature('fasting'),
  ...fromFeature('weekSummary'),
  ...fromFeature('weight'),
  ...fromFeature('nutrients'),
  ...fromFeature('recipes'),
  ...fromFeature('csvExport'),
]

const index = ref(0)
const current = computed(() => EXAMPLES[index.value] ?? FIRST)
const { t } = useI18n()
const hovered = ref(false)
const focused = ref(false)
const stopped = ref(false)
const offscreen = ref(false)
const rotates = ref(false)
const demo = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | undefined
let watcher: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  rotates.value = true
  watcher = new IntersectionObserver(([entry]) => (offscreen.value = !entry?.isIntersecting))
  if (demo.value) watcher.observe(demo.value)
  timer = setInterval(() => {
    if (hovered.value || focused.value || stopped.value || offscreen.value || document.hidden)
      return
    index.value = (index.value + 1) % EXAMPLES.length
  }, 4500)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  watcher?.disconnect()
})
</script>

<template>
  <div
    ref="demo"
    class="demo"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="focused = false"
  >
    <div class="stage">
      <Transition name="swap" mode="out-in">
        <ChatWindow :key="current.id" :screen="current" class="chat" />
      </Transition>
      <button
        v-if="rotates"
        type="button"
        class="toggle"
        :aria-pressed="stopped"
        :aria-label="stopped ? t('hero.play') : t('hero.pause')"
        :title="stopped ? t('hero.play') : t('hero.pause')"
        @click="stopped = !stopped"
      >
        <svg v-if="stopped" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5.5v13l10.5-6.5z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 1rem;
}

.toggle {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--card);
  color: var(--ink);
  cursor: pointer;
  transition: transform 160ms var(--ease-out);
}

.toggle svg {
  width: 1.125rem;
  height: 1.125rem;
  fill: currentColor;
}

.toggle:active {
  transform: scale(0.97);
}

.stage {
  --scale: 0.88;

  position: relative;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: minmax(0, 100%);
  place-items: center;
  height: calc(min(38rem, 100svh - 8rem) * var(--scale) + 4rem);
  overflow: hidden;
  padding: 2rem;
  border-radius: 2rem;
  background: var(--mint);
}

/* The same phone as the rest of the page, only smaller, status bar included. */
.stage .chat {
  zoom: var(--scale);
}

.swap-enter-active {
  transition:
    opacity 260ms var(--ease-out),
    transform 320ms var(--ease-out);
}

.swap-leave-active {
  transition: opacity 160ms ease;
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.swap-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .swap-enter-from {
    transform: none;
  }
}

@media (max-width: 47.99rem) {
  .stage {
    height: calc(min(38rem, 100svh - 8rem) * var(--scale) + 2rem);
    padding: 1rem;
  }
}
</style>
