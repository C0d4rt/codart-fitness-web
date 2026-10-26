<script setup lang="ts">
import { brand } from '~/brand'

useSeoMeta({
  title: 'Contato',
  description: `Fale com a equipe do ${brand.name} por email.`,
})
</script>

<template>
  <div class="page">
    <SiteNav />
    <main>
      <header class="intro">
        <h1 class="title">Contato</h1>
        <p class="lead">Dúvidas, sugestões ou algo com a sua assinatura, escreva para a gente</p>
      </header>

      <div class="tiles">
        <a class="tile email" :href="`mailto:${brand.company.email}`">
          <span class="label">Email</span>
          <span class="address">{{ brand.company.email }}</span>
        </a>
        <NuxtLink class="tile faq" to="/#perguntas">
          <span class="label">Antes de escrever</span>
          <span class="address">Perguntas frequentes</span>
        </NuxtLink>
      </div>

      <p class="company">
        {{ brand.company.name }}, <span class="nowrap">CNPJ {{ brand.company.cnpj }}</span
        >, {{ brand.company.city }}
      </p>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
main {
  display: grid;
  gap: 2.5rem;
  padding: 4rem var(--margin) 0;
}

.intro {
  display: grid;
  gap: 1.25rem;
}

.title {
  font-size: var(--step-display);
}

.lead {
  max-width: 52ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.tiles {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 0.75rem;
}

.tile {
  display: grid;
  align-content: space-between;
  gap: 3rem;
  min-height: 10rem;
  padding: 2rem;
  border-radius: 2rem;
  text-decoration: none;
  transition: transform 160ms var(--ease-out);
}

.tile:active {
  transform: scale(0.97);
}

.email {
  background: var(--mint);
}

.faq {
  background: var(--card);
}

.label {
  color: var(--muted);
  font-weight: 500;
}

.address {
  font-size: var(--step-lead);
  font-weight: 700;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

@media (hover: hover) and (pointer: fine) {
  .address {
    text-decoration: underline transparent;
    text-underline-offset: 0.2em;
    transition: text-decoration-color 160ms ease;
  }
  .tile:hover .address {
    text-decoration-color: currentColor;
  }
}

.company {
  color: var(--muted);
  font-size: var(--step-small);
}

.nowrap {
  white-space: nowrap;
}

@media (max-width: 47.99rem) {
  .tiles {
    grid-template-columns: 1fr;
  }
  .tile {
    min-height: 9rem;
    gap: 1.5rem;
  }
}
</style>
