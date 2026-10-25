<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

useSeoMeta({ title: 'Página não encontrada', robots: 'noindex' })
</script>

<template>
  <div class="error">
    <SiteNav />
    <main>
      <h1>Esta página não existe</h1>
      <p>O endereço pode ter mudado. <NuxtLink to="/">Voltar ao começo</NuxtLink>.</p>
    </main>
  </div>
</template>

<style scoped>
.error {
  padding: 0 var(--margin);
}

main {
  display: grid;
  gap: 1.5rem;
  min-height: 70svh;
  align-content: center;
}

h1 {
  font-size: var(--step-head);
}
</style>
