<script setup lang="ts">
import { PHOTO_CREDITS } from '#shared/photos'

import { brand } from '~/brand'

const { t } = useI18n()

useSeoMeta({
  title: t('credits.title'),
  description: t('credits.description', { name: brand.name }),
})
</script>

<template>
  <div class="credits">
    <SiteNav />
    <main>
      <h1>{{ t('credits.title') }}</h1>

      <section aria-labelledby="dados">
        <h2 id="dados">{{ t('credits.data.title') }}</h2>
        <i18n-t keypath="credits.data.text" tag="p">
          <template #openFoodFacts>
            <a href="https://world.openfoodfacts.org" rel="noopener">Open Food Facts</a>
          </template>
          <template #odbl>
            <a href="https://opendatacommons.org/licenses/odbl/1-0/" rel="noopener">ODbL</a>
          </template>
        </i18n-t>
      </section>

      <section aria-labelledby="fotos">
        <h2 id="fotos">{{ t('credits.photos.title') }}</h2>
        <ul>
          <li v-for="photo in PHOTO_CREDITS" :key="photo.page">
            <a :href="photo.page" rel="noopener">{{ photo.title }}</a
            >{{ t('credits.photos.byAuthor', { author: photo.author }) }}
            <a :href="photo.licenceUrl" rel="noopener">{{ photo.licence }}</a
            >.
          </li>
        </ul>
      </section>

      <section aria-labelledby="empresa">
        <h2 id="empresa">{{ t('credits.company.title') }}</h2>
        <p>
          {{
            t('credits.company.text', {
              name: brand.company.name,
              cnpj: brand.company.cnpj,
              city: brand.company.city,
            })
          }}
          <a :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a
          >.
        </p>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
main {
  display: grid;
  gap: 3rem;
  max-width: 62ch;
  min-height: 60svh;
  padding: 14svh var(--margin) var(--gap-section);
}

h1 {
  font-size: var(--step-head);
}

section {
  display: grid;
  gap: 1rem;
}

h2 {
  font-size: var(--step-lead);
}

ul {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
