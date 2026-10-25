<script setup lang="ts">
import { brand } from '~/brand'

useHead({
  titleTemplate: (title) =>
    title && title !== brand.name ? `${title} · ${brand.name}` : brand.name,
  meta: [
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f7f9f8' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#042a30' },
  ],
  // Before first paint, so content meant to rise in is hidden from the start instead of flashing.
  script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
})

useSchemaOrg([
  defineOrganization({
    name: brand.company.name,
    email: brand.company.email,
    url: 'https://codart.dev',
  }),
  defineWebSite({ name: brand.name }),
])
</script>

<template>
  <NuxtPage />
  <ConsentBanner />
</template>
