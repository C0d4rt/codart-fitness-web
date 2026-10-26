<script setup lang="ts">
import { brand } from '~/brand'
</script>

<template>
  <header class="site-header">
    <nav class="nav" aria-label="Principal">
      <NuxtLink to="/" class="wordmark display">{{ brand.name }}</NuxtLink>
      <ul class="links">
        <li><NuxtLink to="/#como-funciona">Como funciona</NuxtLink></li>
        <li><NuxtLink to="/planos">Planos</NuxtLink></li>
        <li><NuxtLink to="/#perguntas">Perguntas</NuxtLink></li>
      </ul>
      <WhatsAppButton location="nav" label="Testar grátis" class="nav-action" />
    </nav>
  </header>
</template>

<style scoped>
.nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 5rem;
  padding: 0 var(--margin);
  font-size: var(--step-small);
}

.wordmark {
  justify-self: start;
  font-size: 1rem;
  text-decoration: none;
}

.links {
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links a {
  color: var(--muted);
  text-decoration: none;
  transition: color 160ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .links a:hover {
    color: var(--ink);
  }
}

.nav-action {
  justify-self: end;
  min-height: 2.75rem;
  padding: 0 1.25rem;
  font-size: var(--step-small);
}

@media (max-width: 47.99rem) {
  .nav {
    grid-template-columns: 1fr auto;
  }
  .links {
    display: none;
  }
}
</style>
