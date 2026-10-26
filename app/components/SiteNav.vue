<script setup lang="ts">
import { brand } from '~/brand'
</script>

<template>
  <header class="site-header">
    <nav class="nav" aria-label="Principal">
      <NuxtLink to="/" class="wordmark">
        <span class="mark" aria-hidden="true" />{{ brand.name.toLowerCase() }}
      </NuxtLink>
      <ul class="links">
        <li><NuxtLink to="/#como-funciona">Como funciona</NuxtLink></li>
        <li><NuxtLink to="/recursos">Recursos</NuxtLink></li>
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: start;
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
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 500;
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

@media (max-width: 63.99rem) {
  .nav {
    grid-template-columns: 1fr auto;
  }
  .links {
    display: none;
  }
}
</style>
