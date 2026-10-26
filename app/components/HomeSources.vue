<template>
  <section class="sources" aria-labelledby="fontes">
    <h2 id="fontes" class="lead">Os números vêm de</h2>
    <ul class="names">
      <li>Tabela TACO, Unicamp</li>
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
  gap: 1.5rem 3rem;
  margin-top: var(--gap-section);
  padding: 8rem var(--margin);
  background: var(--surface);
}

.lead {
  font-size: var(--step-body);
  letter-spacing: -0.01em;
}

.names {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-lead);
  letter-spacing: -0.02em;
}

@media (max-width: 47.99rem) {
  .sources {
    display: grid;
    padding: 5rem var(--margin);
  }
  .names {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    font-size: var(--step-body);
  }
}
</style>
