<script setup lang="ts">
import { brand } from '~/brand'

const { t } = useI18n()

useSeoMeta({
  title: t('contact.title'),
  description: t('contact.description', { name: brand.name }),
})
const anchors = useAnchors()
const locale = useSiteLocale()
const email = computed(() => brand.email[locale.value].support)
</script>

<template>
  <div class="page">
    <SiteNav />
    <main id="conteudo">
      <header class="intro">
        <h1 class="title">{{ t('contact.title') }}</h1>
        <p class="lead">{{ t('contact.lead') }}</p>
      </header>

      <div class="tiles">
        <a class="tile email" :href="`mailto:${email}`">
          <span class="label">{{ t('contact.email') }}</span>
          <span class="address">{{ email }}</span>
        </a>
        <NuxtLinkLocale class="tile faq" :to="`/#${anchors.faq}`">
          <span class="label">{{ t('contact.beforeWriting') }}</span>
          <span class="address">{{ t('contact.faq') }}</span>
        </NuxtLinkLocale>
      </div>

      <p class="company">
        {{ brand.company.name }},
        <span class="nowrap">{{ t('contact.taxId', { cnpj: brand.company.cnpj }) }}</span
        >, {{ brand.company.city[locale] }}
      </p>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
main {
  display: grid;
  gap: 3rem;
  padding: clamp(3rem, 1.5rem + 5vw, 6.5rem) var(--margin) 0;
}

.intro {
  display: grid;
  gap: 1.75rem;
}

.title {
  font-size: var(--step-display);
  line-height: 0.98;
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
  border-radius: var(--radius);
  background: var(--card);
  text-decoration: none;
  transition: transform 160ms var(--ease-out);
}

.tile:active {
  transform: scale(0.97);
}

.label {
  color: var(--muted);
  font-weight: 500;
}

.address {
  font-size: var(--step-lead);
  font-weight: 500;
  letter-spacing: -0.03em;
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
