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
.missing {
  padding: 0 var(--margin);
}

main {
  display: grid;
  gap: 1.5rem;
  min-height: 60svh;
  align-content: center;
}

h1 {
  font-size: var(--step-head);
}

.missing :deep(.footer) {
  padding-inline: 0;
}
</style>
