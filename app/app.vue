<script setup lang="ts">
import { brand } from '~/brand'

const locale = useSiteLocale()
const localeHead = useLocaleHead({ dir: false })

useHead({
  htmlAttrs: { lang: () => localeHead.value.htmlAttrs.lang },
  titleTemplate: (title) =>
    title && title !== brand.name ? `${title} · ${brand.name}` : brand.name,
  meta: [
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f7f9f8' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#042a30' },
  ],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
  // Before first paint, so content meant to rise in is hidden from the start instead of flashing.
  script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
})

// The module writes the home page as the bare origin, while the sitemap writes it with "/".
const rooted = <T,>(url: T) => (url === brand.siteUrl ? `${brand.siteUrl}/` : url)

useHead(() => ({
  link: localeHead.value.link.map((link) => ({ ...link, href: rooted(link.href) })),
  meta: localeHead.value.meta.map((meta) => ({ ...meta, content: rooted(meta.content) })),
}))

useSeoMeta({
  ogSiteName: brand.name,
  ogImage: `${brand.siteUrl}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => brand.tagline[locale.value],
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineOrganization({
    name: brand.company.name,
    legalName: brand.company.name,
    taxID: brand.company.cnpj,
    email: () => brand.email[locale.value].support,
    url: 'https://codart.dev',
  }),
])
</script>

<template>
  <NuxtPage />
  <ConsentBanner />
</template>
