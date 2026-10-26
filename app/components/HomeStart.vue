<template>
  <section class="start" aria-labelledby="comece">
    <div class="panel">
      <div class="copy" data-reveal>
        <h2 id="comece" class="title">Comece pelo almoço de hoje</h2>
        <p>
          O WhatsApp abre com a primeira mensagem escrita. Mande, e os 7 dias grátis começam ali,
          sem cadastro e sem cartão.
        </p>
        <WhatsAppButton location="start" inverse />
      </div>
      <figure class="photo">
        <img
          src="/images/laranja.jpg"
          alt="Mãos cortando uma laranja numa tábua de madeira"
          width="1024"
          height="684"
          loading="lazy"
        />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.start {
  padding: var(--gap-section) var(--margin) 0;
}

.panel {
  display: grid;
  grid-template-columns: 7fr 5fr;
  overflow: hidden;
  border-radius: 2rem;
  background: var(--green);
  color: var(--green-ink);
}

.copy {
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 1.5rem;
  padding: clamp(2rem, 1rem + 4vw, 5rem);
}

.title {
  max-width: 14ch;
  font-size: var(--step-head);
}

.copy p {
  max-width: 40ch;
  color: #eef8f2;
}

.photo img {
  width: 100%;
  height: 100%;
  min-height: 24rem;
  object-fit: cover;
}

@media (max-width: 47.99rem) {
  .panel {
    grid-template-columns: 1fr;
  }
  .photo img {
    min-height: 0;
    aspect-ratio: 16 / 10;
  }
  .copy :deep(.button) {
    width: 100%;
  }
}
</style>
