<script setup lang="ts">
import { goalScreen, HERO_SCREEN, logModeScreen, WORKOUT_SCREEN } from '#shared/screens'

const FIRST = { caption: 'O almoço contado por texto', screen: HERO_SCREEN }

const EXAMPLES = [
  FIRST,
  { caption: 'O café da manhã por áudio', screen: logModeScreen('audio') },
  { caption: 'A foto do prato', screen: logModeScreen('photo') },
  { caption: 'Quanto falta da meta', screen: goalScreen(1800) },
  { caption: 'O treino do dia', screen: WORKOUT_SCREEN },
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
      <div class="phone">
        <PhoneFrame :screen="current.screen" />
      </div>
    </div>
    <p class="caption" aria-live="polite">{{ current.caption }}</p>
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
  place-items: start center;
  height: min(70svh, 40rem);
  overflow: hidden;
  padding-top: 3rem;
  border-radius: 2rem;
  background: var(--mint);
}

.phone {
  width: min(22rem, 70%);
}

@media (prefers-reduced-motion: no-preference) {
  .phone {
    animation: rise 1s var(--ease-out) 150ms both;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
}

.caption {
  justify-self: center;
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

@media (max-width: 47.99rem) {
  .stage {
    height: 30rem;
    padding-top: 2rem;
  }
  .phone {
    width: 80%;
  }
}
</style>
