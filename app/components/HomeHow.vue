<script setup lang="ts">
import { goalScreen, logModeScreen, reminderScreen } from '#shared/screens'

const STAGES = [
  { name: 'Começar', clause: 'Primeiro, mande o oi.' },
  { name: 'Contar', clause: 'Depois, conte o que comeu.' },
  { name: 'Saber', clause: 'Na hora, veja quanto falta.' },
  { name: 'Voltar', clause: 'Sumiu? Um lembrete, só um.' },
] as const

const SCREENS = [undefined, logModeScreen('audio'), goalScreen(1800), reminderScreen(true)]

const stage = ref(0)
const current = computed(() => STAGES[stage.value] ?? STAGES[0])
const screen = computed(() => SCREENS[stage.value])
</script>

<template>
  <section id="como-funciona" class="how" data-chapter="paper" aria-labelledby="how-clause">
    <div class="words" data-reveal>
      <Transition name="swap" mode="out-in">
        <h2 id="how-clause" :key="stage" class="clause" aria-live="polite">
          {{ current.clause }}
        </h2>
      </Transition>
      <p v-if="stage === 0" class="note">
        O botão abre o WhatsApp com a primeira mensagem escrita. Mande, e o teste começa ali, sem
        cadastro e sem cartão.
      </p>
      <p v-else-if="stage === 1" class="note">
        Por texto, áudio ou foto, do jeito que falaria. O diário acha os alimentos na tabela TACO,
        soma e responde em segundos.
      </p>
      <p v-else-if="stage === 2" class="note">
        A meta sai do seu peso, da altura, da idade e da atividade, e muda pela conversa quando você
        quiser.
      </p>
      <p v-else class="note">
        Se você some por um dia, chega uma mensagem curta para retomar. Responda "parar" e ela não
        volta.
      </p>
    </div>

    <div class="proof">
      <Transition name="swap" mode="out-in">
        <ComposeBar v-if="screen === undefined" key="compose" class="compose" />
        <ChatWindow v-else :key="screen.id" :screen="screen" />
      </Transition>
    </div>

    <div class="track">
      <label class="visually-hidden" for="how-stage">Etapa</label>
      <input
        id="how-stage"
        v-model.number="stage"
        type="range"
        min="0"
        :max="STAGES.length - 1"
        step="1"
        :aria-valuetext="current.name"
        :style="{ '--done': `${(stage / (STAGES.length - 1)) * 100}%` }"
      />
      <ol class="names">
        <li v-for="(each, index) in STAGES" :key="each.name">
          <button type="button" :aria-pressed="stage === index" @click="stage = index">
            {{ each.name }}
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.how {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
  min-height: 88svh;
}

.words {
  grid-column: 1;
  display: grid;
  align-content: start;
  gap: 1.5rem;
  padding: calc(var(--header) + 3rem) var(--margin) 2rem;
}

.clause {
  max-width: 11ch;
  font-size: var(--step-head);
}

.note {
  max-width: 34ch;
}

.proof {
  grid-column: 2;
  grid-row: 1 / 3;
  display: grid;
  place-items: center;
  padding: calc(var(--header) + 2rem) var(--margin) 7rem;
  background: var(--mint);
}

.compose {
  max-width: 27.5rem;
}

.track {
  grid-column: 1 / -1;
  grid-row: 2;
  z-index: 1;
  display: grid;
  gap: 0.75rem;
  padding: 0 1.75rem 2rem;
}

input[type='range'] {
  width: 100%;
  height: 2rem;
  margin: 0;
  background: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

input[type='range']::-webkit-slider-runnable-track {
  height: 8px;
  background: linear-gradient(
    to right,
    var(--ink) var(--done),
    var(--surface) var(--done)
  ); /* taste-skill-ignore: a hard stop, two flat fills of the track */
}

input[type='range']::-moz-range-track {
  height: 8px;
  background: var(--surface);
}

input[type='range']::-moz-range-progress {
  height: 8px;
  background: var(--ink);
}

input[type='range']::-webkit-slider-thumb {
  width: 2rem;
  height: 2rem;
  margin-top: -12px;
  border: 3px solid var(--ink);
  border-radius: 50%;
  background: var(--lime);
  appearance: none;
  -webkit-appearance: none;
  transition: transform 160ms var(--ease-out);
}

input[type='range']::-moz-range-thumb {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--ink);
  border-radius: 50%;
  background: var(--lime);
}

input[type='range']:active::-webkit-slider-thumb {
  transform: scale(1.12);
}

.names {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
}

.names li:nth-child(2),
.names li:nth-child(3) {
  text-align: center;
}

.names li:last-child {
  text-align: right;
}

.names button {
  min-height: 2.75rem;
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-weight: 500;
  cursor: pointer;
  transition: color 180ms ease;
}

.names button[aria-pressed='true'] {
  color: var(--ink);
}

@media (hover: hover) and (pointer: fine) {
  .names button:hover {
    color: var(--ink);
  }
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms var(--ease-out);
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.swap-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .swap-enter-from {
    transform: none;
  }
}

@media (max-width: 63.99rem) {
  .how {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    min-height: auto;
  }
  .proof {
    grid-column: 1;
    grid-row: 2;
    min-height: 46svh;
    padding: 1.5rem 1rem;
  }
  .proof :deep(.chat) {
    max-height: 42svh;
  }
  .track {
    grid-row: 3;
    padding: 1.25rem var(--margin) 0;
  }
  .words {
    grid-row: 1;
    padding: calc(var(--header) + 2rem) var(--margin) 1.5rem;
  }
  .clause {
    font-size: 9.5vw;
  }
  .names {
    grid-template-columns: 1fr 1fr;
  }
  .names li {
    text-align: left !important;
  }
}
</style>
