<script setup lang="ts">
import { SHOWCASE_OUTPUTS, type ShowcaseOutput, showcaseScreen } from '#shared/screens'

const selected = useState<ShowcaseOutput>('showcase', () => 'day')
const stage = useStage()
const screen = computed(() => showcaseScreen(selected.value))

const CAPTIONS: Record<ShowcaseOutput, string> = {
  day: 'O total do dia e quanto falta, a cada registro ou quando você perguntar.',
  week: 'Toda segunda, o resumo da semana anterior, com um gráfico das calorias e dos macros.',
  weight: 'A evolução desde o primeiro registro, ou dos últimos 30 ou 90 dias.',
  nutrients: 'Sódio, fibra, açúcar e mais, contra os valores de referência da ANVISA.',
  file: 'Tudo numa planilha, para abrir no Excel ou levar à consulta. No Premium.',
}

const choose = (id: ShowcaseOutput) => {
  selected.value = id
  stage.value = showcaseScreen(id)
}
</script>

<template>
  <section id="o-que-volta" class="showcase" data-stage="showcase">
    <h2 class="heading">O que ele te devolve</h2>
    <div class="names" role="group" aria-label="Escolha uma resposta para ver">
      <button
        v-for="output in SHOWCASE_OUTPUTS"
        :key="output.id"
        type="button"
        class="name"
        :aria-pressed="selected === output.id"
        @click="choose(output.id)"
      >
        {{ output.name }}
      </button>
    </div>
    <p class="caption" aria-live="polite">{{ CAPTIONS[selected] }}</p>
    <div class="inline-stage">
      <ChatWindow :screen="screen" />
    </div>
  </section>
</template>

<style scoped>
.showcase {
  display: grid;
  gap: 2rem;
}

.heading {
  font-size: var(--step-head);
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
  font-family: var(--font-display);
  font-size: var(--step-head);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-align: left;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition:
    color 180ms ease,
    transform 140ms var(--ease-out);
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

.caption {
  max-width: var(--measure);
}

@media (max-width: 63.99rem) {
  .names {
    display: flex;
    gap: 1.25rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }
  .name {
    flex: none;
    font-size: 1.375rem;
    scroll-snap-align: start;
  }
}
</style>
