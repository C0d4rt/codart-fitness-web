<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { goalScreen, HERO_SCREEN, logModeScreen, WORKOUT_SCREEN } from '#shared/screens'

const PROMPTS: { id: string; text: string; screen: ChatScreen }[] = [
  { id: 'lunch', text: 'almocei arroz, feijão e frango', screen: HERO_SCREEN },
  { id: 'audio', text: 'mandar um áudio do café', screen: logModeScreen('audio') },
  { id: 'photo', text: 'mandar a foto do prato', screen: logModeScreen('photo') },
  { id: 'left', text: 'quanto falta?', screen: goalScreen(1800) },
  { id: 'workout', text: 'corri 30 min e fiz supino', screen: WORKOUT_SCREEN },
]

const chosen = ref('lunch')
const screen = computed(
  () => PROMPTS.find((each) => each.id === chosen.value)?.screen ?? HERO_SCREEN,
)
</script>

<template>
  <div class="demo">
    <div class="stage">
      <div class="phone">
        <PhoneFrame :screen="screen" />
      </div>
      <div class="float today" data-ui>
        <p class="float-title">Hoje</p>
        <CalorieRing :eaten="1240" :goal="1800" :size="112" />
        <p class="float-note">Faltam 560 kcal</p>
      </div>
      <div class="float macros" data-ui>
        <p class="float-title">Macros do dia</p>
        <ul>
          <li>
            <span>Proteína</span><span class="grams">78 g</span>
            <i class="meter"><b style="--w: 65%; --c: var(--protein)" /></i>
          </li>
          <li>
            <span>Carboidrato</span><span class="grams">140 g</span>
            <i class="meter"><b style="--w: 70%; --c: var(--carbs)" /></i>
          </li>
          <li>
            <span>Gordura</span><span class="grams">38 g</span>
            <i class="meter"><b style="--w: 63%; --c: var(--fat)" /></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="prompts" role="group" aria-label="Mande uma mensagem de exemplo e veja a resposta">
      <button
        v-for="(prompt, index) in PROMPTS"
        :key="prompt.id"
        type="button"
        class="prompt"
        :style="{ '--n': index }"
        :aria-pressed="chosen === prompt.id"
        @click="chosen = prompt.id"
      >
        <span>{{ prompt.text }}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M3 20.5 21 12 3 3.5l.02 6.6L15 12 3.02 13.9z" fill="currentColor" />
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

.stage {
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  place-items: center;
  height: min(62svh, 36rem);
  overflow: hidden;
  border-radius: 2rem;
  background: var(--mint);
}

.phone {
  width: min(21rem, 66%);
  margin-top: 8rem;
}

@media (prefers-reduced-motion: no-preference) {
  .phone {
    animation: rise 1s var(--ease-out) 150ms both;
  }
  .float {
    animation: pop 700ms var(--ease-out) both;
  }
  .today {
    animation-delay: 700ms;
  }
  .macros {
    animation-delay: 850ms;
  }
  .prompt {
    animation: pop 500ms var(--ease-out) both;
    animation-delay: calc(900ms + var(--n, 0) * 60ms);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
}

.float {
  position: absolute;
  display: grid;
  gap: 0.625rem;
  padding: 1.125rem 1.25rem;
  border-radius: 1.25rem;
  background: var(--card);
  font-size: var(--step-small);
}

.today {
  top: 2rem;
  left: 2rem;
  justify-items: center;
}

.macros {
  right: 2rem;
  bottom: 2.5rem;
  width: 15rem;
}

.float-title {
  justify-self: start;
  font-weight: 700;
}

.float-note {
  color: var(--green);
  font-weight: 500;
}

.macros ul {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.macros li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem 0.5rem;
}

.grams {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.meter {
  grid-column: 1 / -1;
  display: block;
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background: var(--tone);
}

.meter b {
  display: block;
  width: var(--w);
  height: 100%;
  border-radius: 3px;
  background: var(--c);
}

.prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.prompt {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0 0.875rem 0 1rem;
  border: 0;
  border-radius: 1.125rem 1.125rem 0.25rem 1.125rem;
  background: var(--card);
  color: var(--ink);
  font-size: var(--step-small);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 160ms var(--ease-out);
}

.prompt svg {
  color: var(--green);
  transition: transform 200ms var(--ease-out);
}

.prompt[aria-pressed='true'] {
  background: var(--chat-you);
}

.prompt:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .prompt:hover svg {
    transform: translateX(2px);
  }
  .prompt:not([aria-pressed='true']):hover {
    background: color-mix(in oklab, var(--card) 60%, var(--chat-you));
  }
}

@media (max-width: 47.99rem) {
  .stage {
    height: 30rem;
  }
  .phone {
    width: 78%;
    margin-top: 2.5rem;
  }
  .today,
  .macros {
    display: none;
  }
}
</style>
