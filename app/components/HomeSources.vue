<template>
  <section class="sources" aria-labelledby="fontes">
    <h2 id="fontes" class="lead">Os números vêm de</h2>
    <ul>
      <li>Tabela TACO, da Unicamp</li>
      <li>Open Food Facts</li>
      <li>Compendium of Physical Activities</li>
      <li>Rotulagem da ANVISA</li>
    </ul>
  </section>
</template>

<style scoped>
.sources {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem 3rem;
  padding: clamp(5rem, 3rem + 5vw, 9rem) var(--margin);
}

.lead {
  font-family: var(--font-text);
  font-size: var(--step-body);
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.4;
}

ul {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-lead);
}

@media (max-width: 63.99rem) {
  .sources {
    display: grid;
  }
  ul {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    font-size: 1.0625rem;
  }
}
</style>
