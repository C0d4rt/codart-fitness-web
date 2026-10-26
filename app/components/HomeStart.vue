<template>
  <section class="start" aria-labelledby="comece">
    <p class="aside" data-reveal>
      <span>Sem cadastro, sem cartão e sem app novo. Só uma conversa.</span>
    </p>
    <div class="card" data-reveal>
      <h2 id="comece" class="title display">Comece hoje</h2>
      <p>O WhatsApp abre com a primeira mensagem escrita. Mande, e os 7 dias grátis começam ali.</p>
      <WhatsAppButton location="start" inverse class="send" />
    </div>
  </section>
</template>

<style scoped>
.start {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  align-items: end;
  min-height: 62svh;
  margin-top: var(--gap-section);
  overflow: hidden;
  padding: 4rem var(--margin) 0;
  background: var(--tint-1);
}

.aside {
  grid-column: 1 / 5;
  align-self: end;
  margin-bottom: 4rem;
  font-size: var(--step-lead);
  line-height: 1.35;
}

.card {
  grid-column: 6 / 13;
  display: grid;
  justify-items: center;
  gap: 1.25rem;
  margin-bottom: -3.75rem;
  padding: 3rem 3rem 6.75rem;
  background: var(--bone);
  color: var(--bone-ink);
  text-align: center;
  aspect-ratio: 7 / 5;
  align-content: center;
  transform: rotate(2deg);
  transform-origin: bottom center;
}

.title {
  font-size: var(--step-head);
}

.card p {
  max-width: 36ch;
}

.send {
  width: 100%;
  min-height: 3.5rem;
  margin-top: 0.75rem;
}

@media (max-width: 63.99rem) {
  .start {
    grid-template-columns: 1fr;
    row-gap: 2.5rem;
    min-height: auto;
  }
  .aside,
  .card {
    grid-column: 1;
    margin-bottom: 0;
  }
  .card {
    justify-self: center;
    width: 90%;
    aspect-ratio: auto;
    margin-bottom: -2rem;
    padding: 2.5rem 1.5rem 4.5rem;
    transform: rotate(1deg);
  }
}
</style>
