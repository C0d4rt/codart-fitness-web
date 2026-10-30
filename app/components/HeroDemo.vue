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
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    if (paused.value || document.hidden) return
    index.value = (index.value + 1) % EXAMPLES.length
  }, 4500)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="demo" @mouseenter="paused = true" @mouseleave="paused = false">
    <div class="stage">
      <Transition name="swap" mode="out-in">
        <ChatWindow :key="current.id" :screen="current" class="chat" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 1rem;
}

.stage {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: minmax(0, 100%);
  place-items: center;
  height: min(70svh, 38rem);
  overflow: hidden;
  padding: 2rem;
  border-radius: 2rem;
  background: var(--mint);
}

.stage .chat {
  width: min(22.5rem, 100%);
  max-height: 100%;
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
    height: 30rem;
    padding: 1rem;
  }
}
</style>
