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
    <div class="index">
      <h2 id="showcase-title" class="title">O que ele te devolve</h2>
      <div class="names" role="group" aria-label="Escolha uma resposta para ver">
        <button
          v-for="output in SHOWCASE_OUTPUTS"
          :key="output.id"
          type="button"
          class="name"
          :aria-pressed="selected === output.id"
          @click="selected = output.id"
        >
          {{ output.name }}
        </button>
      </div>
      <p class="note" aria-live="polite">{{ NOTES[selected] }}</p>
    </div>
    <div class="stage">
      <Transition name="swap" mode="out-in">
        <ChatWindow :key="screen.id" :screen="screen" class="sheet" />
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  padding: var(--gap-section) var(--margin) 0;
}

.index {
  grid-column: 1 / 6;
  display: grid;
  align-content: center;
  gap: 2rem;
}

.title {
  color: var(--muted);
  font-size: var(--step-lead);
}

.names {
  display: grid;
  justify-items: start;
}

.name {
  padding: 0.125rem 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-size: var(--step-head);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-align: left;
  cursor: pointer;
  transition:
    color 180ms ease,
    transform 160ms var(--ease-out);
}

.name[aria-pressed='true'] {
  color: var(--ink);
}

.name:active {
  transform: scale(0.98);
}

@media (hover: hover) and (pointer: fine) {
  .name:hover {
    color: var(--ink);
  }
}

.note {
  max-width: 34ch;
}

.stage {
  grid-column: 7 / 13;
  display: grid;
  justify-items: start;
  align-items: start;
  height: 38rem;
  overflow: hidden;
  padding: 4.5rem 0 0 4rem;
  background: var(--surface);
}

.sheet {
  width: min(25rem, 100%);
  max-height: none;
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

@media (max-width: 63.99rem) {
  .showcase {
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  .index,
  .stage {
    grid-column: 1;
  }
  .names {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.25rem;
  }
  .name {
    font-size: 1.5rem;
  }
  .stage {
    height: auto;
    max-height: 32rem;
    padding: 1.25rem 0 1.25rem 1rem;
  }
  .sheet {
    width: min(22rem, calc(100% - 1rem));
  }
}
</style>
