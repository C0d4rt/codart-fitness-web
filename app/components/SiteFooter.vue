<script setup lang="ts">
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
        <li><NuxtLink to="/creditos">Créditos</NuxtLink></li>
        <li v-if="consent.needed">
          <button type="button" class="link" @click="consent.reopen()">Cookies</button>
        </li>
        <li>
          <a :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a>
        </li>
      </ul>
    </div>
    <p class="small">© 2026 {{ brand.company.name }}</p>
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
