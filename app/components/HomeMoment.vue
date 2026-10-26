<template>
  <section class="moment" aria-labelledby="moment-title">
    <img
      class="photo"
      src="/images/marmitas.jpg"
      alt="Três marmitas de vidro com arroz, milho, tomate, pepino e azeitonas, vistas de cima"
      width="1920"
      height="1440"
      loading="lazy"
    />
    <div class="scrim" />
    <div class="copy">
      <h2 id="moment-title" class="title">Do preparo ao prato</h2>
      <p>
        Comeu, mandou uma mensagem. Sem abrir app e sem procurar alimento em lista: ele está na
        conversa que você já abre o dia todo.
      </p>
    </div>
    <div class="note" data-ui>
      <p class="note-head">Fitness · agora</p>
      <p>Almoço registrado: arroz, feijão e frango, 416 kcal.</p>
      <p class="note-figure">Faltam 1.384 kcal</p>
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
  min-height: 86svh;
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
    transform: scale(1.1) translateY(-3%);
  }
  to {
    transform: scale(1.02) translateY(3%);
  }
}

.scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgb(8 24 16 / 0.5);
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
    min-height: 72svh;
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
