<script setup lang="ts">
import { brand } from '~/brand'

const catalog = await usePlans()
const { t } = useI18n()
const tagline = brand.tagline[useSiteLocale().value]
const anchors = useAnchors()

useSeoMeta({
  title: tagline,
  description: t('home.description', { days: catalog.trialDays }),
  ogTitle: `${tagline} · ${brand.name}`,
  ogDescription: t('home.ogDescription', { days: catalog.trialDays }),
  ogType: 'website',
})

// The i18n defaults of nuxt-schema-org drop this link unless the company is the module identity.
useSchemaOrg([defineWebPage({ about: { '@id': `${brand.siteUrl}/#identity` } })])
</script>

<template>
  <div class="page">
    <SiteNav />

    <header id="hero" class="hero">
      <div class="copy" data-reveal>
        <h1 class="headline">{{ t('home.headline') }}</h1>
        <p class="lead">{{ t('home.lead') }}</p>
        <div class="actions">
          <WhatsAppButton location="hero" />
          <NuxtLinkLocale :to="`/#${anchors.how}`" class="secondary">{{
            t('home.seeHow')
          }}</NuxtLinkLocale>
        </div>
        <p class="terms">{{ t('home.terms', { days: catalog.trialDays }) }}</p>
      </div>
      <HeroDemo />
    </header>

    <HomeHow />
    <HomeBento />
    <HomeMoment />
    <HomeShowcase />
    <PlanCards :catalog="catalog" />
    <HomeFaq :trial-days="catalog.trialDays" />
    <SiteFooter />
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 6fr 5fr;
  align-items: center;
  gap: 3rem;
  min-height: calc(100svh - 5rem);
  padding: 2rem var(--margin) 4rem;
}

.copy {
  display: grid;
  justify-items: start;
  gap: 1.75rem;
}

.headline {
  max-width: 13ch;
  font-size: var(--step-display);
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.lead {
  max-width: 34ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}

.secondary {
  font-weight: 500;
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .secondary:hover {
    text-decoration: underline;
  }
}

.terms {
  color: var(--muted);
  font-size: var(--step-small);
}

@media (max-width: 63.99rem) {
  .hero {
    grid-template-columns: 1fr;
    min-height: 0;
  }
}
</style>
