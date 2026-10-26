<script setup lang="ts">
import { PHOTO_CREDITS } from '#shared/photos'

import { brand } from '~/brand'

const consent = useConsent()
</script>

<template>
  <footer class="footer" data-chapter="ink">
    <div class="top">
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
    </div>
    <div class="small">
      <p>
        Alimentos da Tabela Brasileira de Composição de Alimentos (TACO, NEPA/Unicamp) e do
        <a href="https://world.openfoodfacts.org" rel="noopener">Open Food Facts</a>, sob a licença
        <a href="https://opendatacommons.org/licenses/odbl/1-0/" rel="noopener">ODbL</a>. Gasto dos
        exercícios pelo Compendium of Physical Activities.
      </p>
      <p>
        Fotos:
        <template v-for="(photo, index) in PHOTO_CREDITS" :key="photo.page">
          <a :href="photo.page" rel="noopener">{{ photo.title }}</a
          >, de {{ photo.author }},
          <a :href="photo.licenceUrl" rel="noopener">{{ photo.licence }}</a
          >{{ index === PHOTO_CREDITS.length - 1 ? '.' : '; ' }}
        </template>
      </p>
      <p>
        © 2026 {{ brand.company.name }} · CNPJ {{ brand.company.cnpj }} · {{ brand.company.city }}
      </p>
    </div>
    <p class="name" aria-hidden="true">{{ brand.name.toLowerCase() }}</p>
  </footer>
</template>

<style scoped>
.footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  overflow: hidden;
  padding: calc(var(--header) + 2rem) var(--margin) 0;
  background: var(--ink);
  color: var(--paper);
}

.top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem 3rem;
}

.what {
  font-weight: 500;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links a,
.link {
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
    color: var(--lime);
  }
}

.small {
  display: grid;
  gap: 0.75rem;
  max-width: 96ch;
  font-size: var(--step-small);
}

.name {
  margin-top: 2rem;
  color: var(--lime);
  font-size: clamp(7rem, 2rem + 24vw, 26rem);
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: -0.06em;
  white-space: nowrap;
  transform: translateY(18%);
}

@media (max-width: 47.99rem) {
  .name {
    font-size: 40vw;
  }
}
</style>
