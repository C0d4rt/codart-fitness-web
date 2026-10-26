<script setup lang="ts">
const NAMES = [
  'Tabela TACO',
  'Open Food Facts',
  'Compendium of Physical Activities',
  'Rotulagem ANVISA',
] as const
</script>

<template>
  <section class="sources" aria-labelledby="fontes">
    <div class="band" aria-hidden="true">
      <div class="track">
        <template v-for="copy in 2" :key="copy">
          <span v-for="name in NAMES" :key="`${copy}-${name}`" class="name display"
            >{{ name }}<span class="dot"
          /></span>
        </template>
      </div>
    </div>
    <h2 id="fontes" class="caption">
      Os números vêm da Tabela TACO (Unicamp), do Open Food Facts, do Compendium of Physical
      Activities e da rotulagem da ANVISA. O que é estimado vem marcado como estimativa.
    </h2>
  </section>
</template>

<style scoped>
.sources {
  display: grid;
  gap: 1.5rem;
}

.band {
  display: flex;
  align-items: center;
  height: 34vh;
  min-height: 14rem;
  overflow: hidden;
  background: var(--tint-1);
}

.track {
  display: flex;
  flex: none;
  animation: run 48s linear infinite;
}

.name {
  display: inline-flex;
  align-items: center;
  flex: none;
  padding-right: 3vw;
  font-size: var(--step-display);
  white-space: nowrap;
}

.dot {
  width: 0.3em;
  height: 0.3em;
  margin-left: 3vw;
  border-radius: 50%;
  background: var(--jade);
}

@keyframes run {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
  }
}

.caption {
  max-width: 62ch;
  padding: 0 var(--margin);
  color: var(--ink);
  font-size: var(--step-body);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.5;
}
</style>
