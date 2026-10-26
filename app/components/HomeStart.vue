<template>
  <section class="start" data-chapter="ink" aria-labelledby="comece">
    <h2 id="comece" class="line" data-reveal><span>Comece pelo almoço.</span></h2>
    <div class="foot">
      <p>
        O WhatsApp abre com a mensagem escrita. Mande, e os 7 dias grátis começam ali, sem cadastro
        e sem cartão.
      </p>
      <WhatsAppButton location="start" inverse />
    </div>
  </section>
</template>

<style scoped>
.start {
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 90svh;
  margin-top: clamp(5rem, 3rem + 5vw, 8rem);
  padding: calc(var(--header) + 4rem) var(--margin) 2.5rem;
  background: var(--ink);
  color: var(--paper);
}

.line {
  max-width: 11ch;
  color: var(--lime);
  font-size: var(--step-display);
  line-height: 0.9;
  letter-spacing: -0.05em;
}

.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem 3rem;
}

.foot p {
  max-width: 38ch;
  font-size: var(--step-body);
}

@media (max-width: 47.99rem) {
  .start {
    min-height: 80svh;
  }
  .line {
    font-size: 16vw;
  }
  .foot :deep(.button) {
    width: 100%;
  }
}
</style>
