<script setup lang="ts">
import { SHOWCASE_OUTPUTS, type ShowcaseOutput, showcaseScreen } from '#shared/screens'

const selected = useState<ShowcaseOutput>('showcase', () => 'day')
const screen = computed(() => showcaseScreen(selected.value))

const FRAMES: Record<
  ShowcaseOutput,
  { src: string; width: number; height: number; fact: string; note: string }
> = {
  day: {
    src: '/images/salada.jpg',
    width: 1400,
    height: 933,
    fact: 'a cada registro',
    note: 'O total do dia e quanto falta, a cada registro ou quando você perguntar.',
  },
  week: {
    src: '/images/corrida.jpg',
    width: 1600,
    height: 1200,
    fact: 'toda segunda',
    note: 'Toda segunda, o resumo da semana anterior, com um gráfico das calorias e dos macros.',
  },
  weight: {
    src: '/images/treino.jpg',
    width: 1400,
    height: 931,
    fact: '30 ou 90 dias',
    note: 'A evolução desde o primeiro registro, ou dos últimos 30 ou 90 dias.',
  },
  nutrients: {
    src: '/images/frutas.jpg',
    width: 1400,
    height: 941,
    fact: 'ANVISA',
    note: 'Sódio, fibra, açúcar e mais, contra os valores de referência da ANVISA.',
  },
  file: {
    src: '/images/refeicao.jpg',
    width: 1400,
    height: 934,
    fact: 'no Premium',
    note: 'Tudo numa planilha, para abrir no Excel ou levar à consulta. No Premium.',
  },
}
</script>

<template>
  <section id="o-que-volta" class="showcase" aria-labelledby="showcase-title">
    <div class="side">
      <h2 id="showcase-title" class="title">O que ele te devolve</h2>
      <NuxtLink to="/planos" class="link">Ver cada função com exemplos</NuxtLink>
      <p class="note" aria-live="polite">{{ FRAMES[selected].note }}</p>
    </div>

    <div class="run">
      <div
        v-for="output in SHOWCASE_OUTPUTS"
        :key="output.id"
        class="frame"
        :class="{ lifted: selected === output.id }"
      >
        <ChatWindow v-if="selected === output.id" :screen="screen" class="answer" />
        <button
          v-else
          type="button"
          class="picture"
          tabindex="-1"
          aria-hidden="true"
          @click="selected = output.id"
        >
          <img
            :src="FRAMES[output.id].src"
            alt=""
            :width="FRAMES[output.id].width"
            :height="FRAMES[output.id].height"
            loading="lazy"
          />
        </button>
        <div class="meta">
          <button
            type="button"
            class="name"
            :aria-pressed="selected === output.id"
            @click="selected = output.id"
          >
            {{ output.name }}
          </button>
          <span class="fact">{{ FRAMES[output.id].fact }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  --row: 30vh;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  padding: var(--gap-section) var(--margin) 0;
}

.side {
  grid-column: 1 / 4;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 1rem;
  padding-right: var(--gutter);
}

.title {
  font-size: var(--step-lead);
  line-height: 1.15;
}

.link {
  font-weight: 500;
}

.note {
  align-self: end;
  max-width: 26ch;
  margin-bottom: 2.25rem;
  color: var(--muted);
  font-size: var(--step-small);
}

.run {
  grid-column: 4 / 13;
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.frame {
  flex: 1 1 0;
  min-width: 0;
  display: grid;
  gap: 0.5rem;
}

.lifted {
  flex: none;
}

.picture {
  display: block;
  width: 100%;
  height: var(--row);
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  overflow: hidden;
}

.picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .picture:hover img {
    transform: scale(1.04);
  }
}

.answer {
  width: min(21rem, 80vw);
  min-height: calc(var(--row) * 2.2);
  max-height: none;
  animation: lift 500ms var(--ease-out);
}

.answer :deep(.thread) {
  flex: 1;
}

@keyframes lift {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}

.meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0 0.75rem;
  font-size: var(--step-small);
}

.name {
  padding: 0;
  border: 0;
  background: none;
  color: var(--ink);
  font-weight: 400;
  text-align: left;
  cursor: pointer;
}

.name[aria-pressed='true'] {
  font-weight: 500;
  text-decoration: underline;
}

.fact {
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .answer {
    animation: none;
  }
}

@media (max-width: 63.99rem) {
  .showcase {
    --row: 22vw;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .note {
    margin: 0;
  }
  .run {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem 6px;
  }
  .lifted {
    grid-column: 1 / -1;
    order: -1;
  }
  .answer {
    width: 100%;
    height: auto;
    max-height: 70svh;
  }
}
</style>
