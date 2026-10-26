<template>
  <section class="assistant" aria-labelledby="assistant-title">
    <figure class="photo">
      <img
        src="/images/agua.jpg"
        alt="Uma pessoa bebendo água na sala depois de treinar em casa"
        width="1200"
        height="1804"
        loading="lazy"
      />
    </figure>
    <div class="copy" data-reveal>
      <h2 id="assistant-title" class="title">Um assistente que cresce com você</h2>
      <p>
        Hoje ele cuida do que você come e de como você treina. A ideia é ir além: um assistente de
        saúde que acompanha a sua rotina na conversa que você já usa todo dia.
      </p>
      <ul class="facts">
        <li><strong>Sem app novo.</strong> Tudo no WhatsApp, no celular ou no computador.</li>
        <li><strong>Seus dados, seus.</strong> Diga "quero apagar minha conta" e tudo some.</li>
        <li><strong>Números com fonte.</strong> TACO, Open Food Facts e Compendium.</li>
      </ul>
    </div>
    <figure class="photo small">
      <img
        src="/images/celular-tapete.jpg"
        alt="Uma pessoa sentada no tapete de treino conferindo o celular"
        width="1400"
        height="933"
        loading="lazy"
      />
    </figure>
  </section>
</template>

<style scoped>
.assistant {
  display: grid;
  grid-template-columns: 5fr 4fr 3fr;
  gap: 0.75rem;
  margin-top: var(--gap-section);
  padding: 0 var(--margin);
}

.photo {
  overflow: hidden;
  border-radius: var(--radius);
}

.photo img {
  width: 100%;
  height: 100%;
  min-height: 30rem;
  object-fit: cover;
}

.copy {
  display: grid;
  align-content: center;
  gap: 1.5rem;
  padding: 2.5rem;
  border-radius: var(--radius);
  background: var(--card);
}

.title {
  font-size: clamp(1.75rem, 1rem + 1.6vw, 2.5rem);
}

.copy p {
  color: var(--muted);
}

.facts {
  display: grid;
  gap: 0.875rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-small);
}

.facts strong {
  font-weight: 700;
}

@media (max-width: 63.99rem) {
  .assistant {
    grid-template-columns: 1fr 1fr;
  }
  .copy {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .photo img {
    min-height: 18rem;
  }
}

@media (max-width: 47.99rem) {
  .assistant {
    grid-template-columns: 1fr;
  }
  .small {
    display: none;
  }
  .copy {
    padding: 1.75rem;
  }
}
</style>
