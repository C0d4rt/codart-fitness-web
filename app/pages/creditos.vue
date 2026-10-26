<script setup lang="ts">
import { PHOTO_CREDITS } from '#shared/photos'

import { brand } from '~/brand'

useSeoMeta({
  title: 'Créditos',
  description: `De onde vêm os dados e as fotos do ${brand.name}, e quem faz o produto.`,
})
</script>

<template>
  <div class="credits">
    <SiteNav />
    <main>
      <h1>Créditos</h1>

      <section aria-labelledby="dados">
        <h2 id="dados">Os dados</h2>
        <p>
          Alimentos da Tabela Brasileira de Composição de Alimentos (TACO, NEPA/Unicamp) e do
          <a href="https://world.openfoodfacts.org" rel="noopener">Open Food Facts</a>, sob a
          licença <a href="https://opendatacommons.org/licenses/odbl/1-0/" rel="noopener">ODbL</a>.
          Gasto dos exercícios pelo Compendium of Physical Activities.
        </p>
      </section>

      <section aria-labelledby="fotos">
        <h2 id="fotos">As fotos</h2>
        <ul>
          <li v-for="photo in PHOTO_CREDITS" :key="photo.page">
            <a :href="photo.page" rel="noopener">{{ photo.title }}</a
            >, de {{ photo.author }},
            <a :href="photo.licenceUrl" rel="noopener">{{ photo.licence }}</a
            >.
          </li>
        </ul>
      </section>

      <section aria-labelledby="empresa">
        <h2 id="empresa">A empresa</h2>
        <p>
          {{ brand.company.name }}, CNPJ {{ brand.company.cnpj }}, {{ brand.company.city }}.
          Contato: <a :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a
          >.
        </p>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
main {
  display: grid;
  gap: 3rem;
  max-width: 62ch;
  min-height: 60svh;
  padding: 14svh var(--margin) var(--gap-section);
}

h1 {
  font-size: var(--step-head);
}

section {
  display: grid;
  gap: 1rem;
}

h2 {
  font-size: var(--step-lead);
}

ul {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
