<script setup lang="ts">
const CARDS = [
  {
    name: 'Áudio',
    text: 'Grave no caminho. Em segundos volta anotado, com as calorias e o que falta.',
    photo: {
      src: '/images/brunch.jpg',
      width: 1600,
      height: 1100,
      alt: 'Uma tigela de frutas vista de cima',
    },
    tone: 'one',
    turn: -4,
  },
  {
    name: 'Foto do prato',
    text: 'Fotografe, confira o que foi visto e corrija as gramas. No Premium e no teste.',
    photo: {
      src: '/images/refeicao.jpg',
      width: 1400,
      height: 934,
      alt: 'Uma pessoa comendo uma salada de beterraba',
    },
    tone: 'two',
    turn: 2,
  },
  {
    name: 'Treino',
    text: '"Supino 3 × 8 com 60 kg." O gasto é estimado pelo Compendium of Physical Activities.',
    photo: {
      src: '/images/halter.jpg',
      width: 1400,
      height: 931,
      alt: 'Uma mão com luva de treino segurando um halter vermelho',
    },
    tone: 'three',
    turn: -2,
  },
  {
    name: 'Jejum',
    text: 'Diga "faço jejum 16:8" uma vez, e o aviso chega quando a janela terminar.',
    photo: {
      src: '/images/treino.jpg',
      width: 1400,
      height: 931,
      alt: 'Uma pessoa treinando com halter em casa',
    },
    tone: 'four',
    turn: 4,
  },
] as const

const table = ref<HTMLElement>()
const dealt = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        dealt.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.35 },
  )
  if (table.value) observer.observe(table.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section id="do-seu-jeito" class="features" aria-labelledby="features-title">
    <div class="intro" data-reveal>
      <h2 id="features-title" class="title display">Do seu jeito</h2>
      <p>Quatro jeitos de registrar e acompanhar, todos dentro da mesma conversa.</p>
    </div>
    <ul ref="table" class="table" :class="{ dealt }">
      <li
        v-for="(card, index) in CARDS"
        :key="card.name"
        class="card"
        :class="card.tone"
        :style="{ '--n': index, '--turn': `${card.turn}deg` }"
      >
        <h3 class="name display">{{ card.name }}</h3>
        <figure class="photo">
          <img
            :src="card.photo.src"
            :alt="card.photo.alt"
            :width="card.photo.width"
            :height="card.photo.height"
            loading="lazy"
          />
        </figure>
        <p>{{ card.text }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.features {
  display: grid;
  gap: 4rem;
  padding: var(--gap-section) var(--margin) 0;
}

.intro {
  display: grid;
  gap: 1rem;
}

.title {
  font-size: var(--step-head);
}

.intro p {
  max-width: 40ch;
}

.table {
  position: relative;
  height: 30rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  --x: calc((var(--n) - 1.5) * 15.625rem);
  position: absolute;
  top: 2rem;
  left: 50%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1.25rem;
  width: 21.25rem;
  height: 25rem;
  margin-left: -10.625rem;
  padding: 1.75rem;
  padding-right: 7.375rem;
  transform: translateX(var(--x)) rotate(var(--turn));
  transition: transform 900ms var(--ease-out);
  transition-delay: calc(var(--n) * 120ms);
}

.js .table:not(.dealt) .card {
  transform: translateX(var(--x)) translateY(70%) rotate(0deg);
  opacity: 0;
}

.js .card {
  transition:
    transform 900ms var(--ease-out),
    opacity 400ms ease;
  transition-delay: calc(var(--n) * 120ms);
}

.one {
  background: var(--tint-2);
}

.two {
  background: var(--tint-4);
  color: var(--ground);
}

.three {
  background: var(--bone);
  color: var(--ground);
}

.four {
  background: var(--tint-3);
}

.name {
  font-size: var(--step-lead);
  line-height: 1.05;
}

.photo {
  align-self: center;
  overflow: hidden;
}

.photo img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.card p {
  font-size: var(--step-small);
  line-height: 1.45;
}

@media (min-width: 72rem) and (hover: hover) and (pointer: fine) {
  .dealt .card:hover {
    transform: translateX(var(--x)) translateY(-10px) rotate(var(--turn));
    transition-delay: 0ms;
    transition-duration: 300ms;
  }
}

@media (prefers-reduced-motion: reduce) {
  .js .table:not(.dealt) .card {
    transform: translateX(var(--x)) rotate(var(--turn));
  }
  .card,
  .js .card {
    transition: opacity 200ms ease;
  }
}

@media (max-width: 71.99rem) {
  .table {
    display: grid;
    justify-items: center;
    height: auto;
  }
  .card,
  .js .table:not(.dealt) .card {
    position: static;
    width: min(100%, 24rem);
    height: auto;
    margin: -1.25rem 0 0;
    padding-right: 1.75rem;
    transform: rotate(calc(var(--turn) / 2));
  }
  .card:first-child {
    margin-top: 0;
  }
  .photo img {
    aspect-ratio: 16 / 10;
  }
}
</style>
