<script setup lang="ts">
import { brand } from '~/brand'

defineProps<{ home?: boolean }>()
</script>

<template>
  <nav class="nav" aria-label="Principal">
    <NuxtLink v-if="!home" to="/" class="wordmark">{{ brand.name.toLowerCase() }}</NuxtLink>
    <ul>
      <li><NuxtLink to="/#como-funciona">Como funciona</NuxtLink></li>
      <li><NuxtLink to="/planos">Planos</NuxtLink></li>
      <li><NuxtLink to="/#perguntas">Perguntas</NuxtLink></li>
      <li><WhatsAppButton location="nav" label="Testar grátis" class="nav-action" /></li>
    </ul>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
  min-height: 5rem;
  font-size: var(--step-small);
}

.wordmark {
  margin-right: auto;
  font-family: var(--font-display);
  font-size: 1.75rem;
  letter-spacing: -0.03em;
  text-decoration: none;
}

ul {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

a:not(.button) {
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  a:not(.button):hover {
    text-decoration: underline;
  }
}

.nav-action {
  min-height: 2.75rem;
  padding: 0 1.125rem;
  font-size: 0.9375rem;
}

@media (max-width: 47.99rem) {
  ul li:not(:last-child):not(:nth-child(2)) {
    display: none;
  }
  ul {
    gap: 1.25rem;
  }
}
</style>
