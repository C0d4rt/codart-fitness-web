<template>
  <section id="como-funciona" class="day" aria-labelledby="day-title">
    <h2 id="day-title" class="title">Um dia no diário</h2>

    <figure class="photo morning">
      <img
        src="/images/iogurte.jpg"
        alt="Uma tigela de iogurte com frutas ao lado de uma jarra de leite"
        width="1100"
        height="1650"
        loading="lazy"
      />
    </figure>
    <div class="text morning-text" data-reveal>
      <p>
        <strong>De manhã, um áudio.</strong> Grave no caminho: "pão francês e café com leite". Em
        segundos volta anotado, com 234 kcal e quanto ainda falta da meta.
      </p>
    </div>

    <figure class="photo lunch">
      <img
        src="/images/salada.jpg"
        alt="Uma salada com rúcula, ovos e cenoura numa travessa branca"
        width="1400"
        height="933"
        loading="lazy"
      />
    </figure>
    <div class="text lunch-text" data-reveal>
      <p>
        <strong>No almoço, uma foto.</strong> Fotografe o prato, confira o que foi visto e corrija
        as gramas antes de registrar. As contas saem da tabela TACO.
      </p>
    </div>

    <figure class="photo evening">
      <img
        src="/images/corrida.jpg"
        alt="Uma pessoa correndo num parque na névoa da manhã"
        width="1600"
        height="1200"
        loading="lazy"
      />
    </figure>
    <div class="text evening-text" data-reveal>
      <p>
        <strong>À noite, o treino.</strong> Diga "30 minutos de corrida" e o diário estima o gasto.
        Toda segunda chega o resumo da semana, com o que você comeu e treinou.
      </p>
    </div>
  </section>
</template>

<style scoped>
.day {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto 13.75rem auto 11.25rem auto;
  column-gap: var(--gutter);
  padding: var(--gap-section) var(--margin) 0;
}

.title {
  grid-column: 7 / 13;
  grid-row: 1;
  font-size: var(--step-head);
}

.photo {
  overflow: hidden;
}

.photo img {
  width: 100%;
  object-fit: cover;
}

.morning {
  grid-column: 1 / 5;
  grid-row: 1 / 3;
}

.morning img {
  aspect-ratio: 3 / 4;
}

.morning-text {
  grid-column: 5 / 8;
  grid-row: 1 / 3;
  align-self: end;
}

.lunch {
  grid-column: 6 / 9;
  grid-row: 3;
}

.lunch img {
  aspect-ratio: 1;
}

.lunch-text {
  grid-column: 9 / 12;
  grid-row: 3;
}

.evening {
  grid-column: 8 / 13;
  grid-row: 5;
}

.evening img {
  aspect-ratio: 16 / 10;
}

.evening-text {
  grid-column: 3 / 7;
  grid-row: 5;
}

.text p {
  max-width: 36ch;
}

.text strong {
  font-weight: 500;
}

@media (max-width: 47.99rem) {
  .day {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .title {
    margin-bottom: 1rem;
  }
  .morning {
    width: 100%;
  }
  .lunch {
    width: 62%;
    align-self: flex-end;
    margin-top: 2.5rem;
  }
  .lunch-text {
    align-self: flex-end;
    width: 62%;
  }
  .evening {
    width: 78%;
    margin-top: 2.5rem;
  }
}
</style>
