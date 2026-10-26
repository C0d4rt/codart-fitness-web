<script setup lang="ts">
useSeoMeta({ title: 'Página não encontrada', robots: 'noindex' })
</script>

<template>
  <div class="missing">
    <SiteNav />
    <main>
      <h1>Esta página não existe</h1>
      <p>O endereço pode ter mudado. <NuxtLink to="/">Voltar ao começo</NuxtLink>.</p>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
main {
  display: grid;
  padding-inline: var(--margin);
  gap: 1.5rem;
  min-height: 60svh;
  align-content: center;
}

h1 {
  font-size: var(--step-head);
}
</style>
