<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { FEATURE_COPY } from '#shared/featureCopy'
import { goalScreen, HERO_SCREEN, logModeScreen, WORKOUT_SCREEN } from '#shared/screens'

const FIRST = { caption: 'O almoço contado por texto', screen: HERO_SCREEN }

const fromFeature = (id: string): { caption: string; screen: ChatScreen }[] => {
  const copy = FEATURE_COPY[id]
  return copy === undefined
    ? []
    : [
        {
          caption: copy.headline,
          screen: { id: `hero-${id}`, label: copy.headline, messages: copy.exchange },
        },
      ]
}

const EXAMPLES = [
  FIRST,
  { caption: 'O café da manhã por áudio', screen: logModeScreen('audio') },
  { caption: 'A foto do prato', screen: logModeScreen('photo') },
  ...fromFeature('barcode'),
  { caption: 'Quanto falta da meta', screen: goalScreen(1800) },
  ...fromFeature('mealSuggestion'),
  ...fromFeature('mealGoals'),
  { caption: 'O treino do dia', screen: WORKOUT_SCREEN },
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
        <ChatWindow :key="current.screen.id" :screen="current.screen" class="chat" />
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
  width: min(26rem, 100%);
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
