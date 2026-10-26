<script setup lang="ts">
const STAGES = [
  {
    name: 'Comece',
    text: 'Toque no botão: o WhatsApp abre com a primeira mensagem escrita. Mande, e o teste de 7 dias começa ali, sem cadastro e sem cartão.',
    photo: {
      src: '/images/iogurte.jpg',
      width: 1100,
      height: 1650,
      alt: 'Uma tigela de iogurte com frutas ao lado de uma jarra de leite',
    },
  },
  {
    name: 'Conte',
    text: 'Por texto, áudio ou foto, do jeito que você falaria. Os alimentos saem da tabela TACO, com gramas ou medidas de casa, como "uma concha".',
    photo: {
      src: '/images/salada.jpg',
      width: 1400,
      height: 933,
      alt: 'Uma salada com rúcula, ovos e cenoura numa travessa branca',
    },
  },
  {
    name: 'Saiba',
    text: 'Cada resposta traz o total do dia e quanto falta da meta, com proteína, carboidrato e gordura. A meta sai do seu peso, altura, idade e atividade.',
    photo: {
      src: '/images/frutas.jpg',
      width: 1400,
      height: 941,
      alt: 'Framboesas e mirtilos num prato branco',
    },
  },
  {
    name: 'Acompanhe',
    text: 'Treinos com o gasto estimado, a evolução do peso e, toda segunda, o resumo da semana com o que você comeu e treinou.',
    photo: {
      src: '/images/corrida.jpg',
      width: 1600,
      height: 1200,
      alt: 'Uma pessoa correndo num parque na névoa da manhã',
    },
  },
] as const

const open = ref(0)
</script>

<template>
  <section id="como-funciona" class="how" aria-labelledby="how-title">
    <div class="intro" data-reveal>
      <h2 id="how-title" class="title display">Como funciona</h2>
      <p>
        Nada para instalar e nenhuma tabela para consultar. Você conversa no WhatsApp, e o diário
        faz as contas por você.
      </p>
    </div>

    <div class="row">
      <div
        v-for="(stage, index) in STAGES"
        :key="stage.name"
        class="panel"
        :class="[`tint-${index + 1}`, { open: open === index }]"
      >
        <button
          :id="`stage-${index}`"
          type="button"
          class="tab"
          :aria-expanded="open === index"
          :aria-controls="`stage-body-${index}`"
          @click="open = index"
        >
          <span class="name">{{ stage.name }}</span>
        </button>
        <div
          :id="`stage-body-${index}`"
          class="body"
          role="region"
          :aria-labelledby="`stage-${index}`"
          :hidden="open !== index"
        >
          <div class="words">
            <h3 class="open-name display">{{ stage.name }}</h3>
            <p>{{ stage.text }}</p>
          </div>
          <figure class="photo">
            <img
              :src="stage.photo.src"
              :alt="stage.photo.alt"
              :width="stage.photo.width"
              :height="stage.photo.height"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how {
  display: grid;
  gap: 4rem;
  padding: var(--gap-section) var(--margin) 0;
}

.intro {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  align-items: end;
}

.title {
  grid-column: 1 / 6;
  font-size: var(--step-head);
}

.intro p {
  grid-column: 7 / 12;
  max-width: 40ch;
  font-size: var(--step-lead);
  line-height: 1.4;
}

.row {
  display: flex;
  height: 32.5rem;
}

.panel {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  color: var(--ink);
  transition: flex-grow 450ms var(--ease-in-out);
}

.panel.open {
  flex-grow: 5.5;
}

.tint-1 {
  background: var(--tint-1);
}

.tint-2 {
  background: var(--tint-2);
}

.tint-3 {
  background: var(--tint-3);
}

.tint-4 {
  background: var(--tint-4);
  color: var(--ground);
}

.tab {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem 1.25rem;
  border: 0;
  background: none;
  cursor: pointer;
}

.open .tab {
  pointer-events: none;
  inset: 0 auto auto 0;
  width: 1px;
  height: 1px; /* taste-skill-ignore: visually hidden label, not a rule */
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
}

.name {
  font-size: var(--step-body);
  font-weight: 500;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
}

@media (hover: hover) and (pointer: fine) {
  .panel:not(.open) .tab:hover .name {
    text-decoration: underline;
  }
}

.body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 100%;
  padding: 2.25rem;
  animation: show 500ms var(--ease-out) 150ms both;
}

.words {
  display: grid;
  grid-template-rows: auto 1fr;
  align-content: space-between;
}

.open-name {
  font-size: var(--step-lead);
}

.words p {
  align-self: end;
  max-width: 36ch;
  font-size: var(--step-body);
}

.body[hidden] {
  display: none;
}

.photo {
  overflow: hidden;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes show {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
  }
  .body {
    animation: none;
  }
}

@media (max-width: 47.99rem) {
  .intro {
    grid-template-columns: 1fr;
    row-gap: 1.25rem;
  }
  .title,
  .intro p {
    grid-column: 1;
  }
  .row {
    flex-direction: column;
    height: auto;
  }
  .panel,
  .panel.open {
    flex: none;
  }
  .tab {
    position: static;
    width: 100%;
    min-height: 4rem;
    align-items: center;
  }
  .open .tab {
    position: absolute;
  }
  .name {
    writing-mode: horizontal-tb;
    transform: none;
    font-size: 1.125rem;
  }
  .body {
    grid-template-columns: 1fr;
    height: auto;
    padding: 1.5rem 1.25rem;
  }
  .photo img {
    aspect-ratio: 4 / 3;
    height: auto;
  }
  .open-name {
    font-size: 1.5rem;
  }
}
</style>
