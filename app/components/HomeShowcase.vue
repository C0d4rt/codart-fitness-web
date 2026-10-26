<script setup lang="ts">
import { SHOWCASE_OUTPUTS, type ShowcaseOutput, showcaseScreen } from '#shared/screens'

const selected = useState<ShowcaseOutput>('showcase', () => 'day')
const screen = computed(() => showcaseScreen(selected.value))

const CAPTIONS: Record<ShowcaseOutput, string> = {
  day: 'O total do dia e quanto falta, a cada registro ou quando você perguntar.',
  week: 'Toda segunda, o resumo da semana anterior, com um gráfico das calorias e dos macros.',
  weight: 'A evolução desde o primeiro registro, ou dos últimos 30 ou 90 dias.',
  nutrients: 'Sódio, fibra, açúcar e mais, contra os valores de referência da ANVISA.',
  file: 'Tudo numa planilha, para abrir no Excel ou levar à consulta. No Premium.',
}

const PHOTOS: Record<ShowcaseOutput, { src: string; width: number; height: number }> = {
  day: { src: '/images/prato-feito.jpg', width: 1600, height: 1073 },
  week: { src: '/images/corrida.jpg', width: 1600, height: 1200 },
  weight: { src: '/images/treino.jpg', width: 1400, height: 931 },
  nutrients: { src: '/images/mangas.jpg', width: 1024, height: 768 },
  file: { src: '/images/halter.jpg', width: 1400, height: 931 },
}
</script>

<template>
  <section id="o-que-volta" class="showcase" data-chapter="paper" aria-labelledby="showcase-title">
    <h2 id="showcase-title" class="title">O que ele te devolve</h2>
    <div class="index" data-reveal>
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
    </div>

    <div class="stage">
      <div class="disc">
        <Transition name="fade">
          <img
            :key="selected"
            :src="PHOTOS[selected].src"
            alt=""
            :width="PHOTOS[selected].width"
            :height="PHOTOS[selected].height"
            loading="lazy"
          />
        </Transition>
      </div>
      <ChatWindow :screen="screen" class="answer" />
    </div>

    <p class="caption" aria-live="polite">{{ CAPTIONS[selected] }}</p>
  </section>
</template>

<style scoped>
.showcase {
  --disc: min(64vh, 40vw);
  display: grid;
  grid-template-columns: 1fr var(--disc) minmax(12rem, 1fr);
  grid-template-rows: 1fr auto;
  align-items: end;
  column-gap: 2.5rem;
  min-height: 100svh;
  padding: calc(var(--header) + 4rem) var(--margin) 4rem;
}

.title {
  grid-column: 1;
  grid-row: 1;
  align-self: start;
}

.index {
  grid-column: 1;
  grid-row: 2;
  display: grid;
  gap: 0.25rem;
}

.stage {
  grid-column: 2;
  grid-row: 1 / 3;
}

.caption {
  grid-column: 3;
  grid-row: 1 / 3;
}

.title,
.name {
  font-size: var(--step-lead);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.12;
}

.title {
  max-width: 9ch;
  margin-bottom: 0.5rem;
  color: var(--green-ink);
}

.names {
  display: grid;
  justify-items: start;
}

.name {
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition:
    color 180ms ease,
    transform 160ms var(--ease-out);
}

.name[aria-pressed='true'] {
  color: var(--ink);
  font-weight: 700;
}

.name:active {
  transform: scale(0.98);
}

@media (hover: hover) and (pointer: fine) {
  .name:hover {
    color: var(--ink);
  }
}

.stage {
  display: grid;
  place-items: center;
  align-self: center;
}

.disc,
.answer {
  grid-area: 1 / 1;
}

.disc {
  position: relative;
  width: var(--disc);
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 50%;
  background: var(--lime);
}

.disc img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.answer {
  position: relative;
  width: min(100%, 22rem);
  max-height: calc(var(--disc) * 0.92);
  transform: translateY(-14%);
}

.caption {
  max-width: 24ch;
  align-self: center;
  font-size: var(--step-body);
  font-weight: 500;
}

.fade-enter-active {
  transition: opacity 300ms ease;
}

.fade-leave-active {
  transition: opacity 300ms ease 100ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 63.99rem) {
  .showcase {
    --disc: 86vw;
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
    min-height: auto;
    padding-top: calc(var(--header) + 2rem);
  }
  .title,
  .index,
  .stage,
  .caption {
    grid-column: 1;
    grid-row: auto;
  }
  .answer {
    width: 78vw;
    max-height: calc(var(--disc) * 0.86);
    transform: none;
  }
  .names {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }
  .name {
    flex: none;
    font-size: 1.625rem;
    scroll-snap-align: start;
  }
  .caption {
    max-width: none;
    font-size: 1rem;
  }
}
</style>
