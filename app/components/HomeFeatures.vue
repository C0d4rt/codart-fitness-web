<script setup lang="ts">
const BANDS = [
  {
    id: 'audio',
    sentence: 'Mande um áudio no caminho.',
    consequence: 'Sete segundos de áudio e o café da manhã está anotado: 234 kcal.',
    tone: 'lime',
  },
  {
    id: 'photo',
    sentence: 'Fotografe o prato inteiro.',
    consequence:
      'Você confere o que foi visto e corrige as gramas antes de registrar. No Premium e no teste.',
    tone: 'mango',
  },
  {
    id: 'suggestion',
    sentence: 'Pergunte o que jantar.',
    consequence: 'Faltam 620 kcal? Vêm três ideias que cabem nisso, do que tem na sua despensa.',
    tone: 'mint',
  },
  {
    id: 'meals',
    sentence: 'Divida a meta por refeição.',
    consequence: 'Café 20%, almoço 30%, lanche 10% e jantar 40%, e cada registro diz quanto cabe.',
    tone: 'green',
  },
  {
    id: 'fasting',
    sentence: 'Faça jejum sem olhar o relógio.',
    consequence: 'Diga "faço jejum 16:8" uma vez, e o aviso chega quando as 16 horas terminarem.',
    tone: 'surface',
  },
] as const

const on = ref<Record<string, boolean>>({ audio: true, photo: true })
const toggle = (id: string) => (on.value[id] = !on.value[id])
</script>

<template>
  <section id="do-seu-jeito" class="features" data-chapter="paper">
    <h2 class="title">Do seu jeito, no seu ritmo.</h2>
    <div
      v-for="band in BANDS"
      :key="band.id"
      class="band"
      :class="[band.tone, { on: on[band.id] }]"
      :data-chapter="on[band.id] ? band.tone : 'paper'"
    >
      <div class="words">
        <h3 :id="`band-${band.id}`" class="sentence">{{ band.sentence }}</h3>
        <p class="consequence" :hidden="!on[band.id]">{{ band.consequence }}</p>
      </div>
      <button
        type="button"
        role="switch"
        class="switch"
        data-ui
        :aria-checked="on[band.id] ? 'true' : 'false'"
        :aria-labelledby="`band-${band.id}`"
        @click="toggle(band.id)"
      >
        <span class="knob" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.features {
  display: grid;
}

.title {
  padding: calc(var(--header) + 3rem) var(--margin) 2.5rem;
  font-size: var(--step-head);
}

.band {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2rem;
  min-height: 20vh;
  padding: 1.75rem var(--margin);
  color: var(--muted);
  transition:
    background-color 300ms ease,
    color 300ms ease;
}

.band.on {
  color: var(--ink);
}

.band.on.lime {
  background: var(--lime);
}

.band.on.mango {
  background: var(--mango);
}

.band.on.mint {
  background: var(--mint);
}

.band.on.green {
  background: var(--green);
}

.band.on.surface {
  background: var(--surface);
}

.words {
  display: grid;
  gap: 0.5rem;
}

.sentence {
  font-size: var(--step-head);
  letter-spacing: -0.035em;
  line-height: 1.02;
}

.consequence {
  max-width: 52ch;
  font-size: var(--step-body);
  font-weight: 500;
}

.consequence:not([hidden]) {
  animation: open 320ms var(--ease-out);
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}

.switch {
  position: relative;
  width: 4.75rem;
  height: 2.5rem;
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  background: color-mix(in oklab, var(--ink) 18%, transparent);
  cursor: pointer;
  transition: background-color 220ms ease;
}

.knob {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--paper);
  transition: transform 260ms var(--ease-out);
}

.switch[aria-checked='true'] {
  background: var(--ink);
}

.switch[aria-checked='true'] .knob {
  background: var(--lime);
  transform: translateX(2.25rem);
}

.switch:active .knob {
  width: 2.375rem;
}

.switch[aria-checked='true']:active .knob {
  transform: translateX(1.875rem);
}

@media (prefers-reduced-motion: reduce) {
  .consequence:not([hidden]) {
    animation: none;
  }
}

@media (max-width: 47.99rem) {
  .band {
    min-height: 8.25rem;
    gap: 1rem;
  }
  .sentence {
    font-size: 1.625rem;
  }
  .consequence {
    font-size: 0.9375rem;
  }
}
</style>
