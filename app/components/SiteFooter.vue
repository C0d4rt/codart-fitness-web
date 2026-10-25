<script setup lang="ts">
import { brand } from '~/brand'

const consent = useConsent()
</script>

<template>
  <footer class="footer">
    <p class="what">{{ brand.name }}: diário de dieta e treino no WhatsApp</p>
    <ul class="links">
      <li><NuxtLink to="/planos">Planos</NuxtLink></li>
      <li><NuxtLink to="/termos">Termos</NuxtLink></li>
      <li><NuxtLink to="/privacidade">Privacidade</NuxtLink></li>
      <li v-if="consent.needed">
        <button type="button" class="link" @click="consent.reopen()">Cookies</button>
      </li>
      <li>
        <a :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a>
      </li>
    </ul>
    <p class="who">
      © 2026 {{ brand.company.name }} · CNPJ {{ brand.company.cnpj }} · {{ brand.company.city }}
    </p>
    <p class="credits">
      Alimentos da Tabela Brasileira de Composição de Alimentos (TACO, NEPA/Unicamp) e do
      <a href="https://world.openfoodfacts.org" rel="noopener">Open Food Facts</a>, sob a licença
      <a href="https://opendatacommons.org/licenses/odbl/1-0/" rel="noopener">ODbL</a>. Gasto dos
      exercícios pelo Compendium of Physical Activities.
    </p>
  </footer>
</template>

<style scoped>
.footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
  gap: 1rem 2rem;
  margin-top: 30svh;
  padding: 0 var(--margin) 1.875rem;
  font-size: 0.9375rem;
}

.what,
.who,
.credits {
  color: var(--muted);
}

.who {
  text-align: right;
}

.credits {
  grid-column: 1 / -1;
  max-width: 72ch;
  font-size: var(--step-small);
}

.credits a {
  color: var(--ink);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links a {
  text-decoration: none;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .links a:hover,
  .link:hover {
    text-decoration: underline;
  }
}

@media (max-width: 63.99rem) {
  .footer {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-top: 20svh;
    padding-bottom: 1.5rem;
  }
  .who {
    text-align: left;
  }
}
</style>
