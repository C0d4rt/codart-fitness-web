<script setup lang="ts">
import { brand } from '~/brand'
</script>

<template>
  <header class="site-header">
    <nav class="nav" aria-label="Principal">
      <ul class="left">
        <li><NuxtLink to="/planos">Planos</NuxtLink></li>
        <li class="extra"><NuxtLink to="/#como-funciona">Como funciona</NuxtLink></li>
        <li class="extra"><NuxtLink to="/#perguntas">Perguntas</NuxtLink></li>
      </ul>
      <NuxtLink to="/" class="wordmark">{{ brand.name.toLowerCase() }}</NuxtLink>
      <WhatsAppButton location="nav" label="Testar grátis" class="nav-action" />
    </nav>
  </header>
</template>

<style scoped>
.nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 5.5rem;
  padding: 0 var(--margin);
  font-size: var(--step-small);
}

.left {
  display: flex;
  gap: 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.left a {
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .left a:hover {
    text-decoration: underline;
  }
}

.wordmark {
  font-size: var(--step-lead);
  font-weight: 500;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.nav-action {
  justify-self: end;
  min-height: 2.75rem;
  padding: 0 1.25rem;
  font-size: var(--step-small);
}

@media (max-width: 47.99rem) {
  .extra {
    display: none;
  }
}
</style>
