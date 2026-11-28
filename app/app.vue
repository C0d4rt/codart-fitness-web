<script setup lang="ts">
import { brand } from '~/brand'
import { FRAGMENT_SCRIPT } from '#shared/fragment'

const locale = useSiteLocale()
const localeHead = useLocaleHead({ dir: false })

useHead({
  htmlAttrs: { lang: () => localeHead.value.htmlAttrs.lang },
  titleTemplate: (title) =>
    title && title !== brand.name ? `${title} · ${brand.name}` : brand.name,
  meta: [
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f4f7f5' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#001724' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ],
  // Before first paint, so content meant to rise in is hidden from the start instead of flashing.
  script: [
    { innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' },
    { innerHTML: FRAGMENT_SCRIPT, tagPosition: 'head' },
  ],
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
    sameAs: [brand.social.instagram.pt, brand.social.facebook],
  }),
])
</script>

<template>
  <NuxtPage />
  <StickyCta />
  <ConsentBanner />
</template>
