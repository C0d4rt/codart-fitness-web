<template>
  <section class="moment" aria-labelledby="moment-title">
    <figure class="photo">
      <img
        src="/images/marmitas.jpg"
        alt="Três marmitas de vidro com arroz, milho, tomate, pepino e azeitonas, vistas de cima"
        width="1920"
        height="1440"
        loading="lazy"
      />
    </figure>
    <div class="copy" data-reveal>
      <h2 id="moment-title" class="title">Do preparo ao prato</h2>
      <p>
        Comeu, mandou uma mensagem. É fácil porque é no WhatsApp, que você já usa o dia todo: ele
        anota, soma e diz quanto falta.
      </p>
      <div class="note" data-ui>
        <p class="note-head">Fitness · agora</p>
        <p>Almoço registrado: arroz, feijão e frango, 416 kcal.</p>
        <p class="note-figure">Faltam 1.384 kcal</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.moment {
  display: grid;
  grid-template-columns: 7fr 5fr;
  margin: var(--gap-section) var(--margin) 0;
  overflow: hidden;
  border-radius: 2rem;
  background: var(--ink);
  color: #ffffff;
}

.photo {
  overflow: hidden;
}

.photo img {
  width: 100%;
  height: 100%;
  min-height: 26rem;
  object-fit: cover;
}

@media (prefers-reduced-motion: no-preference) {
  .photo img {
    animation: drift linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }
}

@keyframes drift {
  from {
    transform: scale(1.12);
  }
  to {
    transform: scale(1);
  }
}

.copy {
  display: grid;
  align-content: center;
  gap: 1.5rem;
  padding: clamp(2rem, 1rem + 3vw, 4rem);
}

.title {
  max-width: 12ch;
  font-size: var(--step-head);
}

.copy > p {
  max-width: 34ch;
  color: #dbe7e0;
  font-size: var(--step-body);
}

.note {
  display: grid;
  gap: 0.375rem;
  padding: 1.125rem 1.25rem;
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
  }
  .photo img {
    min-height: 0;
    aspect-ratio: 16 / 10;
  }
}
</style>
