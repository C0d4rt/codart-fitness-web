<script setup lang="ts">
import { brand } from '~/brand'

const props = defineProps<{ title: string }>()

useSeoMeta({ title: props.title, robots: 'noindex' })
</script>

<template>
  <div class="legal">
    <SiteNav />
    <main>
      <h1>{{ title }}</h1>
      <p>
        O texto definitivo está em revisão jurídica e entra aqui antes do lançamento. Até lá, vale o
        que a conversa mostra ao começar.
      </p>
      <slot />
      <p>
        Dúvidas: <a :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a
        >.
      </p>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.legal {
  padding: 0 var(--margin);
}

main {
  display: grid;
  gap: 1.5rem;
  max-width: 62ch;
  min-height: 60svh;
  padding-top: 14svh;
}

h1 {
  font-size: var(--step-head);
}

.legal :deep(.footer) {
  padding-inline: 0;
}
</style>
