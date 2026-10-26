<template>
  <section class="moment" aria-labelledby="moment-title">
    <img
      class="photo"
      src="/images/celular-academia.jpg"
      alt="Uma pessoa na academia olhando o celular entre um exercício e outro"
      width="1920"
      height="1282"
      loading="lazy"
    />
    <div class="scrim" />
    <div class="copy">
      <h2 id="moment-title" class="title">Entre uma série e outra</h2>
      <p>
        Uma mensagem e pronto. Sem abrir app, sem procurar alimento em lista: ele está na conversa
        que você já abre o dia todo.
      </p>
    </div>
    <div class="note" data-ui>
      <p class="note-head">Fitness · agora</p>
      <p>Treino registrado: supino reto 3 × 8 com 60 kg e 30 min de corrida.</p>
      <p class="note-figure">Cerca de 410 kcal gastas</p>
    </div>
  </section>
</template>

<style scoped>
.moment {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: end;
  min-height: 92svh;
  margin-top: var(--gap-section);
  overflow: hidden;
  padding: 4rem var(--margin);
  color: #ffffff;
}

.photo {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
}

@media (prefers-reduced-motion: no-preference) {
  .photo {
    animation: drift linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }
}

@keyframes drift {
  from {
    transform: scale(1.12) translateY(-3%);
  }
  to {
    transform: scale(1.02) translateY(3%);
  }
}

.scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgb(8 24 16 / 0.48);
}

.copy {
  grid-column: 1 / 7;
  display: grid;
  gap: 1.25rem;
}

.title {
  max-width: 14ch;
  font-size: var(--step-head);
}

.copy p {
  max-width: 38ch;
  font-size: var(--step-lead);
  line-height: 1.4;
}

.note {
  grid-column: 9 / 13;
  display: grid;
  gap: 0.5rem;
  padding: 1.25rem 1.375rem;
  border-radius: 1.25rem 1.25rem 1.25rem 0.25rem;
  background: var(--card);
  color: var(--ink);
  font-size: var(--step-small);
}

.note-head {
  color: var(--muted);
  font-weight: 500;
}

.note-figure {
  color: var(--green);
  font-size: var(--step-lead);
  font-weight: 700;
  letter-spacing: -0.02em;
}

@media (max-width: 63.99rem) {
  .moment {
    grid-template-columns: 1fr;
    row-gap: 2rem;
    min-height: 80svh;
  }
  .copy,
  .note {
    grid-column: 1;
  }
  .note {
    max-width: 22rem;
  }
}
</style>
