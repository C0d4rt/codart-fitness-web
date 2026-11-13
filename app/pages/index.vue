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

const features = computed(() => catalog.groups.flatMap((group) => group.features))
</script>

<template>
  <div class="page">
    <SiteNav />

    <main id="conteudo">
      <section id="hero" class="hero">
        <div class="copy">
          <h1 class="headline"><TextLines :text="t('home.headline')" /></h1>
          <p class="lead">{{ t('home.lead') }}</p>
          <div class="actions">
            <WhatsAppButton location="hero" />
            <NuxtLinkLocale :to="`/#${anchors.how}`" class="secondary">
              {{ t('home.seeHow') }}
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5" />
              </svg>
            </NuxtLinkLocale>
          </div>
          <p class="terms">{{ t('home.terms', { days: catalog.trialDays }) }}</p>
        </div>
        <HeroDemo />
      </section>

      <HomeAssistant :features="features" />
      <HomeHow :features="features" />
      <HomeBento :features="features" />
      <HomeDay :features="features" />
      <HomeEverything :features="features" />
      <PlanCards :catalog="catalog" />
      <HomeFaq :trial-days="catalog.trialDays" />
      <SiteClosing />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2.5rem, 1.5rem + 3vw, 4.5rem);
  padding: clamp(3rem, 1.5rem + 5vw, 6.5rem) var(--margin) 0;
}

.copy {
  display: grid;
  justify-items: center;
  text-align: center;
}

.headline {
  font-size: var(--step-display);
  line-height: 0.98;
}

.lead {
  text-wrap: balance;
  max-width: 40ch;
  margin-top: clamp(1.5rem, 1rem + 1vw, 2rem);
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem 2rem;
  margin-top: 2.25rem;
}

.secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  font-weight: 500;
  text-decoration: none;
}

.secondary svg {
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 200ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .secondary:hover svg {
    transform: translateX(3px);
  }
}

.terms {
  margin-top: 1.25rem;
  color: var(--muted);
  font-size: var(--step-small);
}

/* A thumb reaches a full-width button anywhere along the bottom of the screen. */
@media (max-width: 47.99rem) {
  .actions,
  .actions :deep(.button) {
    width: 100%;
  }
}
</style>
