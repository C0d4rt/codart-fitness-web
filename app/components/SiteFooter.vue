<script setup lang="ts">
import { brand } from '~/brand'

const consent = useConsent()
</script>

<template>
  <footer class="footer">
    <div class="row">
      <NuxtLink to="/" class="wordmark">
        <span class="mark" aria-hidden="true" />{{ brand.name.toLowerCase() }}
      </NuxtLink>
      <ul class="links">
        <li><NuxtLink to="/termos">Termos</NuxtLink></li>
        <li><NuxtLink to="/privacidade">Privacidade</NuxtLink></li>
        <li><NuxtLink to="/creditos">Créditos</NuxtLink></li>
        <li v-if="consent.needed">
          <button type="button" class="link" @click="consent.reopen()">Cookies</button>
        </li>
      </ul>
      <a class="email" :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a>
    </div>
    <p class="legal">© 2026 {{ brand.company.name }}</p>
  </footer>
</template>

<style scoped>
.footer {
  display: grid;
  gap: 1.5rem;
  margin-top: var(--gap-section);
  padding: 2.5rem var(--margin) 2rem;
  background: var(--card);
  font-size: var(--step-small);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem 2.5rem;
}

.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.mark {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background: var(--green);
  box-shadow: inset 0 0 0 0.3rem var(--mint); /* taste-skill-ignore: a ring drawn as the logo mark, not a shadow */
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 500;
}

.links a,
.link,
.email {
  color: var(--muted);
  text-decoration: none;
  transition: color 160ms ease;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .links a:hover,
  .link:hover,
  .email:hover {
    color: var(--ink);
  }
}

.legal {
  color: var(--muted);
}
</style>
