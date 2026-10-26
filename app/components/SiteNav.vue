<script setup lang="ts">
import { brand } from '~/brand'

const tone = useChapterTone()
</script>

<template>
  <header class="site-header" :data-tone="tone">
    <nav class="nav" aria-label="Principal">
      <NuxtLink to="/" class="wordmark">{{ brand.name.toLowerCase() }}</NuxtLink>
      <ul>
        <li class="extra"><NuxtLink to="/#como-funciona">Como funciona</NuxtLink></li>
        <li><NuxtLink to="/planos">Planos</NuxtLink></li>
        <li class="extra"><NuxtLink to="/#perguntas">Perguntas</NuxtLink></li>
        <li><WhatsAppButton location="nav" label="Testar grátis" class="nav-action" /></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  --header-bg: var(--paper);
  --header-ink: var(--ink);
  position: fixed;
  inset: 0 0 auto;
  z-index: 20;
  background: var(--header-bg);
  color: var(--header-ink);
  transition:
    background-color 300ms ease,
    color 300ms ease;
}

.site-header[data-tone='green'] {
  --header-bg: var(--green);
}

.site-header[data-tone='lime'] {
  --header-bg: var(--lime);
}

.site-header[data-tone='surface'] {
  --header-bg: var(--surface);
}

.site-header[data-tone='ink'] {
  --header-bg: var(--ink);
  --header-ink: var(--paper);
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: var(--header);
  padding: 0 var(--margin);
  font-size: var(--step-small);
  font-weight: 500;
}

.wordmark {
  margin-right: auto;
  font-size: var(--step-body);
  font-weight: 700;
  letter-spacing: -0.04em;
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
  padding: 0 1.25rem;
  font-size: var(--step-small);
}

.site-header[data-tone='ink'] .nav-action {
  background: var(--lime);
  color: var(--ink);
}

@media (max-width: 47.99rem) {
  .extra {
    display: none;
  }
  ul {
    gap: 1.25rem;
  }
}
</style>
