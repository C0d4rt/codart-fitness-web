<script setup lang="ts">
const SOURCES = [
  'da Tabela TACO, da Unicamp',
  'do Open Food Facts',
  'do Compendium of Physical Activities',
  'da rotulagem da ANVISA',
] as const

const lit = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => (lit.value = (lit.value + 1) % SOURCES.length), 2000)
})
onBeforeUnmount(() => clearInterval(timer))

const joiner = (index: number) =>
  index === SOURCES.length - 1 ? '.' : index === SOURCES.length - 2 ? ' e ' : ', '
</script>

<template>
  <section class="sources" data-chapter="paper" aria-labelledby="fontes">
    <div class="words" data-reveal>
      <h2 id="fontes" class="title">De onde vêm os números</h2>
      <p class="sentence">
        As contas vêm
        <template v-for="(source, index) in SOURCES" :key="source">
          <span class="name" :class="{ lit: lit === index }">{{ source }}</span
          >{{ joiner(index) }}
        </template>
      </p>
      <p class="estimate">O que é estimado vem marcado como estimativa.</p>
    </div>
    <figure class="picture">
      <img
        src="/images/mangas.jpg"
        alt="Mangas empilhadas numa banca de frutas em São Paulo"
        width="1024"
        height="768"
        loading="lazy"
      />
    </figure>
  </section>
</template>

<style scoped>
.sources {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1.5rem;
  align-items: center;
  padding: var(--gap-section) var(--margin) 0;
}

.words {
  grid-column: 1 / 8;
  display: grid;
  gap: 2rem;
}

.title {
  max-width: 12ch;
  font-size: var(--step-head);
}

.sentence {
  max-width: 36ch;
  color: var(--muted);
  font-size: var(--step-lead);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.015em;
}

.estimate {
  font-weight: 500;
}

.name {
  transition: color 400ms ease;
}

.name.lit {
  color: var(--ink);
  font-weight: 700;
}

.picture {
  grid-column: 9 / 13;
  overflow: hidden;
}

.picture img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

@media (max-width: 63.99rem) {
  .sources {
    grid-template-columns: 1fr;
    row-gap: 2.5rem;
  }
  .words,
  .picture {
    grid-column: 1;
  }
  .picture img {
    aspect-ratio: 4 / 3;
  }
}
</style>
