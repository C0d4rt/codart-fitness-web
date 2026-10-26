<script setup lang="ts">
import { brand } from '~/brand'

const route = useRoute()
const url = computed(
  () => brand.siteUrl + (route.path === '/' ? '/' : route.path.replace(/\/$/, '')),
)

useHead({
  titleTemplate: (title) =>
    title && title !== brand.name ? `${title} · ${brand.name}` : brand.name,
  meta: [
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f7f9f8' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#042a30' },
  ],
  link: [
    { rel: 'canonical', href: url },
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
  ],
  // Before first paint, so content meant to rise in is hidden from the start instead of flashing.
  script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
})

useSeoMeta({
  ogUrl: url,
  ogSiteName: brand.name,
  ogImage: `${brand.siteUrl}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: brand.tagline,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineOrganization({
    name: brand.company.name,
    legalName: brand.company.name,
    taxID: brand.company.cnpj,
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
