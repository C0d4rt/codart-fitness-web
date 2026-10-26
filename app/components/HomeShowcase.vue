<script setup lang="ts">
import { SHOWCASE_OUTPUTS, type ShowcaseOutput, showcaseScreen } from '#shared/screens'

const selected = useState<ShowcaseOutput>('showcase', () => 'day')
const screen = computed(() => showcaseScreen(selected.value))

const NOTES: Record<ShowcaseOutput, string> = {
  day: 'O total do dia e quanto falta, a cada registro ou quando você perguntar.',
  week: 'Toda segunda, o resumo da semana anterior, com um gráfico das calorias e dos macros.',
  weight: 'A evolução desde o primeiro registro, ou dos últimos 30 ou 90 dias.',
  nutrients: 'Sódio, fibra, açúcar e mais, contra os valores de referência da ANVISA.',
  file: 'Tudo numa planilha, para abrir no Excel ou levar à consulta. No Premium.',
}
</script>

<template>
  <section id="o-que-volta" class="showcase" aria-labelledby="showcase-title">
    <div class="panel">
      <div class="side">
        <h2 id="showcase-title" class="title">Pergunte, e ele responde</h2>
        <div class="tabs" role="group" aria-label="Escolha uma resposta para ver">
          <button
            v-for="output in SHOWCASE_OUTPUTS"
            :key="output.id"
            type="button"
            class="tab"
            :aria-pressed="selected === output.id"
            @click="selected = output.id"
          >
            {{ output.name }}
          </button>
        </div>
        <p class="note" aria-live="polite">{{ NOTES[selected] }}</p>
      </div>
      <div class="answer">
        <Transition name="swap" mode="out-in">
          <ChatWindow :key="screen.id" :screen="screen" class="sheet" />
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  padding: var(--gap-section) var(--margin) 0;
}

.panel {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 3rem;
  align-items: center;
  padding: clamp(1.5rem, 1rem + 3vw, 4rem);
  border-radius: 2rem;
  background: var(--card);
}

.side {
  display: grid;
  gap: 1.75rem;
}

.title {
  font-size: var(--step-head);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tab {
  min-height: 2.75rem;
  padding: 0 1.125rem;
  border: 0;
  border-radius: 999px;
  background: var(--tone);
  color: var(--ink);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 160ms var(--ease-out);
}

.tab[aria-pressed='true'] {
  background: var(--green);
  color: var(--green-ink);
}

.tab:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .tab:not([aria-pressed='true']):hover {
    background: var(--mint);
  }
}

.note {
  max-width: 36ch;
  color: var(--muted);
}

.answer {
  display: grid;
  place-items: center;
  min-height: 30rem;
  padding: 2rem;
  border-radius: 1.5rem;
  background: var(--mint);
}

.sheet {
  width: min(24rem, 100%);
}

.swap-enter-active {
  transition:
    opacity 220ms var(--ease-out),
    transform 260ms var(--ease-out);
}

.swap-leave-active {
  transition: opacity 120ms ease;
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
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
  .panel {
    grid-template-columns: 1fr;
  }
  .answer {
    min-height: 0;
    padding: 1.25rem;
  }
}
</style>
