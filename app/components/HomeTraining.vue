<template>
  <section id="treino" class="training" data-chapter="ink" aria-labelledby="training-title">
    <div class="words" data-reveal>
      <h2 id="training-title" class="title">O treino entra no diário.</h2>
      <p>
        Conte como contaria a um amigo: "supino 3 × 8 com 60 kg e 30 minutos de corrida". O diário
        anota cada exercício e estima o gasto pelo Compendium of Physical Activities.
      </p>
      <p>
        Salve o treino A com um nome e, na próxima vez, só diga que fez. No resumo da semana, os
        dias de treino e as calorias gastas aparecem ao lado do que você comeu.
      </p>
    </div>
    <figure class="lift">
      <img
        src="/images/halter.jpg"
        alt="Uma mão com luva de treino segurando um halter vermelho de 2 kg"
        width="1400"
        height="931"
        loading="lazy"
      />
    </figure>
    <figure class="run">
      <img
        src="/images/corrida.jpg"
        alt="Uma pessoa correndo num parque na névoa da manhã"
        width="1600"
        height="1200"
        loading="lazy"
      />
    </figure>
  </section>
</template>

<style scoped>
.training {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1.5rem;
  row-gap: 3rem;
  padding: calc(var(--header) + 5rem) var(--margin) 6rem;
  background: var(--ink);
  color: var(--paper);
}

.words {
  grid-column: 1 / 6;
  grid-row: 1;
  display: grid;
  align-content: start;
  gap: 1.5rem;
}

.title {
  max-width: 13ch;
  margin-bottom: 0.5rem;
  color: var(--lime);
  font-size: var(--step-head);
}

.words p {
  max-width: 40ch;
}

.lift {
  grid-column: 1 / 6;
  grid-row: 2;
  align-self: end;
}

.run {
  grid-column: 7 / 13;
  grid-row: 1 / 3;
}

figure {
  overflow: hidden;
}

figure img {
  width: 100%;
  object-fit: cover;
}

.lift img {
  aspect-ratio: 3 / 2;
  object-position: 50% 55%;
}

.run img {
  height: 100%;
  aspect-ratio: 4 / 5;
  object-position: 45% 50%;
}

@media (max-width: 63.99rem) {
  .training {
    grid-template-columns: 1fr 1fr;
    row-gap: 1rem;
    padding-top: calc(var(--header) + 3rem);
  }
  .words {
    grid-column: 1 / -1;
    margin-bottom: 2rem;
  }
  .lift,
  .run {
    grid-row: 2;
  }
  .lift {
    grid-column: 1;
  }
  .run {
    grid-column: 2;
  }
  .lift img,
  .run img {
    height: auto;
    aspect-ratio: 4 / 5;
  }
}
</style>
