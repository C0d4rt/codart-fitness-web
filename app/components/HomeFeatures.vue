<script setup lang="ts">
const ROWS = [
  {
    title: 'Do jeito que você falaria',
    text: 'Texto, áudio ou foto do prato, do rótulo ou do código de barras. O diário entende "uma concha de feijão" e "duas colheres de arroz".',
    photo: {
      src: '/images/brunch.jpg',
      width: 1600,
      height: 1100,
      alt: 'Uma tigela de frutas vista de cima',
    },
    shape: 'portrait',
  },
  {
    title: 'A meta é sua',
    text: 'Ela sai do seu peso, da altura, da idade e da atividade, e muda pela conversa. Divida por refeição, defina macros em gramas ou outra meta para o fim de semana.',
    photo: {
      src: '/images/refeicao.jpg',
      width: 1400,
      height: 934,
      alt: 'Uma pessoa comendo uma salada de beterraba numa mesa de madeira',
    },
    shape: 'wide',
  },
  {
    title: 'O que jantar, dentro do que falta',
    text: 'Pergunte e receba três ideias que cabem no que falta da meta, preferindo o que já está na sua despensa.',
    photo: {
      src: '/images/frutas.jpg',
      width: 1400,
      height: 941,
      alt: 'Framboesas e mirtilos num prato branco',
    },
    shape: 'square',
  },
  {
    title: 'Jejum sem olhar o relógio',
    text: 'Diga "faço jejum 16:8" uma vez. O jejum começa na última refeição, e o aviso chega quando a janela terminar.',
    photo: {
      src: '/images/halter.jpg',
      width: 1400,
      height: 931,
      alt: 'Uma mão com luva de treino segurando um halter vermelho',
    },
    shape: 'portrait',
  },
  {
    title: 'Um lembrete, e só um',
    text: 'Se você some por um dia, chega uma mensagem curta para retomar. Responda "parar" e ela não volta.',
    photo: {
      src: '/images/treino.jpg',
      width: 1400,
      height: 931,
      alt: 'Uma pessoa treinando com halter em casa',
    },
    shape: 'wide',
  },
] as const
</script>

<template>
  <section id="do-seu-jeito" class="features" aria-labelledby="features-title">
    <div class="opening">
      <h2 id="features-title" class="statement">Feito para caber no seu dia.</h2>
    </div>
    <div v-for="row in ROWS" :key="row.title" class="row" data-reveal>
      <div class="words">
        <h3 class="row-title">{{ row.title }}</h3>
        <p>{{ row.text }}</p>
      </div>
      <figure class="photo" :class="row.shape">
        <img
          :src="row.photo.src"
          :alt="row.photo.alt"
          :width="row.photo.width"
          :height="row.photo.height"
          loading="lazy"
        />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.features {
  display: grid;
  gap: 7rem;
  padding: var(--gap-section) var(--margin) 0;
}

.opening {
  display: grid;
  align-items: center;
  min-height: 44svh;
  padding-left: calc((100% + var(--gutter)) / 12 * 4);
}

.statement {
  max-width: 13ch;
  font-size: var(--step-head);
}

.row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  align-items: start;
}

.words {
  grid-column: 5 / 10;
  display: grid;
  gap: 1rem;
}

.row-title {
  font-size: var(--step-lead);
}

.words p {
  max-width: 34ch;
  color: var(--muted);
}

.photo {
  grid-column: 10 / 13;
  justify-self: end;
  overflow: hidden;
}

.photo img {
  width: 100%;
  object-fit: cover;
}

.portrait {
  width: 15rem;
}

.portrait img {
  aspect-ratio: 4 / 5;
}

.wide {
  width: 20rem;
}

.wide img {
  aspect-ratio: 3 / 2;
}

.square {
  width: 11.25rem;
}

.square img {
  aspect-ratio: 1;
}

@media (max-width: 63.99rem) {
  .portrait {
    width: 12rem;
  }
  .wide {
    width: 15rem;
  }
}

@media (max-width: 47.99rem) {
  .features {
    gap: 4rem;
  }
  .opening {
    min-height: 30svh;
    padding-left: 0;
  }
  .row {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .photo {
    justify-self: auto;
  }
  .portrait {
    width: 100%;
  }
  .wide {
    width: 70%;
    align-self: flex-end;
  }
  .square {
    width: 55%;
  }
}
</style>
