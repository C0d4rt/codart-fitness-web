<script setup lang="ts">
const { t } = useI18n()

/* What the assistant really sends, drawn by its own code from sample data. */
const OUTPUTS = [
  { id: 'sheet', src: '/images/ficha-do-treino.webp', width: 900, height: 1444 },
  { id: 'pdf', src: '/images/plano-de-treino-pdf.webp', width: 1000, height: 1414 },
  { id: 'week', src: '/images/resumo-da-semana.webp', width: 900, height: 1109 },
] as const
</script>

<template>
  <section class="outputs" aria-labelledby="outputs-title">
    <div class="head" data-reveal>
      <h2 id="outputs-title" class="title"><TextLines :text="t('outputs.title')" /></h2>
      <p class="lead">{{ t('outputs.lead') }}</p>
    </div>
    <div class="shelf" data-reveal>
      <figure v-for="output in OUTPUTS" :key="output.id" class="output" :class="output.id">
        <div class="frame">
          <img
            :src="output.src"
            :width="output.width"
            :height="output.height"
            :alt="t(`outputs.items.${output.id}.alt`)"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption>
          <span class="name">{{ t(`outputs.items.${output.id}.name`) }}</span>
          <span class="text">{{ t(`outputs.items.${output.id}.text`) }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.outputs {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  padding: var(--gap-section) var(--margin) 0;
}

.head {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: end;
  gap: 1.5rem 3rem;
}

.title {
  font-size: var(--step-head);
}

.lead {
  max-width: 38ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

/* The tall sheet leads; the PDF page and the chart stack beside it. */
.shelf {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  grid-template-areas:
    'sheet pdf'
    'sheet week';
  gap: 0.75rem;
}

.output {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  gap: 1.25rem;
  padding: clamp(1.25rem, 0.75rem + 1.5vw, 2rem);
  border-radius: var(--radius-panel);
  background: var(--card);
}

.sheet {
  grid-area: sheet;
}

.pdf {
  grid-area: pdf;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto;
  align-items: center;
}

.week {
  grid-area: week;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto;
  align-items: center;
}

.frame {
  align-self: start;
  overflow: hidden;
  border-radius: var(--radius-small);
}

.frame img {
  width: 100%;
  height: auto;
}

/* A page and a chart read as files when they sit on a grey sheet, as a phone previews them. */
.pdf .frame,
.week .frame {
  align-self: center;
  padding: clamp(0.75rem, 0.5rem + 1vw, 1.25rem);
  background: var(--tone);
}

.pdf .frame img,
.week .frame img {
  border-radius: 0.375rem;
}

figcaption {
  display: grid;
  gap: 0.375rem;
}

.name {
  font-size: var(--step-title);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.text {
  color: var(--muted);
}

@media (max-width: 63.99rem) {
  .head {
    grid-template-columns: minmax(0, 1fr);
  }
  .shelf {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'sheet' 'pdf' 'week';
  }
  .sheet .frame {
    max-width: 28rem;
    justify-self: center;
  }
}

@media (max-width: 47.99rem) {
  .pdf,
  .week {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
