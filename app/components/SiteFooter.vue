<script setup lang="ts">
import { brand } from '~/brand'

const consent = useConsent()
</script>

<template>
  <footer class="footer">
    <div class="columns">
      <div>
        <p class="first">{{ brand.name }}</p>
        <p>Diário de dieta e treino no WhatsApp</p>
      </div>
      <ul>
        <li class="first"><NuxtLink to="/planos">Planos</NuxtLink></li>
        <li><NuxtLink to="/#como-funciona">Como funciona</NuxtLink></li>
        <li><NuxtLink to="/#perguntas">Perguntas</NuxtLink></li>
      </ul>
      <ul>
        <li class="first"><NuxtLink to="/termos">Termos</NuxtLink></li>
        <li><NuxtLink to="/privacidade">Privacidade</NuxtLink></li>
        <li><NuxtLink to="/creditos">Créditos</NuxtLink></li>
        <li v-if="consent.needed">
          <button type="button" class="link" @click="consent.reopen()">Cookies</button>
        </li>
      </ul>
      <div>
        <p class="first">Contato</p>
        <a :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a>
      </div>
    </div>
    <div class="bottom">
      <p class="name display" aria-hidden="true">{{ brand.name }}</p>
      <p class="legal">© 2026 {{ brand.company.name }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 64svh;
  padding: 2.5rem var(--margin) 1.5rem;
  background: var(--bone);
  color: var(--bone-ink);
}

.columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem var(--gutter);
  font-size: var(--step-small);
}

.columns ul {
  display: grid;
  align-content: start;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.columns p,
.columns li,
.columns a {
  color: #4a524d;
}

.columns .first,
.columns .first a {
  color: var(--bone-ink);
  font-weight: 500;
}

.columns a,
.link {
  text-decoration: none;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  color: #4a524d;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .columns a:hover,
  .link:hover {
    text-decoration: underline;
  }
}

.bottom {
  grid-row: 3;
  display: grid;
  gap: 1.25rem;
}

.name {
  font-size: 13.4vw;
  line-height: 0.85;
  white-space: nowrap;
}

.legal {
  font-size: var(--step-small);
}

@media (max-width: 47.99rem) {
  .footer {
    min-height: 56svh;
  }
  .columns {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
