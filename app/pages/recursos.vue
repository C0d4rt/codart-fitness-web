<script setup lang="ts">
import type { PlanId } from '#shared/plans'

import { brand } from '~/brand'

const catalog = await usePlans()
const { t } = useI18n()

useSeoMeta({
  title: t('features.title'),
  description: t('features.description', { name: brand.name, days: catalog.trialDays }),
})

const planLine = (plan: PlanId) => t(`features.${plan}`)
</script>

<template>
  <div class="page">
    <SiteNav />
    <main id="conteudo">
      <header class="intro">
        <h1 class="title">{{ t('features.title') }}</h1>
        <p class="lead">{{ t('features.lead') }}</p>
      </header>

      <div class="catalog">
        <nav class="group-index" :aria-label="t('features.groups')">
          <ul>
            <li v-for="group in catalog.groups" :key="group.id">
              <NuxtLink :to="{ hash: `#group-${group.id}` }">{{ group.name }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <section
          v-for="group in catalog.groups"
          :id="`group-${group.id}`"
          :key="group.id"
          class="group"
          :aria-labelledby="`group-${group.id}-name`"
        >
          <h2 :id="`group-${group.id}-name`" class="group-name">{{ group.name }}</h2>
          <div class="features">
            <article
              v-for="feature in group.features"
              :id="feature.id"
              :key="feature.id"
              class="feature"
            >
              <div class="words">
                <h3 class="headline">{{ feature.headline }}</h3>
                <p class="plan" :class="feature.plan">
                  {{ feature.name }} · {{ planLine(feature.plan) }}
                </p>
                <p class="how-to">{{ feature.howTo }}</p>
              </div>
              <div class="example">
                <ChatWindow
                  :screen="{ id: feature.id, label: feature.headline, messages: feature.exchange }"
                  class="chat"
                />
              </div>
            </article>
          </div>
        </section>
      </div>
      <SiteClosing />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1.75rem;
  padding: clamp(3rem, 1.5rem + 5vw, 6.5rem) var(--margin) 0;
}

.title {
  font-size: var(--step-display);
  line-height: 0.98;
}

.lead {
  max-width: 40ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.catalog {
  --below-header: var(--header);
  --index: 3.5rem;
}

.group-index {
  position: sticky;
  top: var(--below-header);
  z-index: 20;
  margin-top: 3rem;
  background: var(--ground);
}

.group-index ul {
  display: flex;
  gap: 0.5rem;
  min-height: var(--index);
  margin: 0;
  padding: 0.5rem var(--margin);
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.group-index ul::-webkit-scrollbar {
  display: none;
}

.group-index a {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 1.125rem;
  border-radius: 999px;
  background: var(--card);
  font-size: var(--step-small);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 160ms ease,
    transform 160ms var(--ease-out);
}

.group-index a:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .group-index a:hover {
    background: var(--tone);
  }
}

.group {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
  gap: 3rem;
  margin-top: 6rem;
  padding: 0 var(--margin);
}

.group-name {
  position: sticky;
  top: calc(var(--below-header) + var(--index) + 1.5rem);
  align-self: start;
  font-size: clamp(2rem, 1.3rem + 2vw, 3.25rem);
}

.features {
  display: grid;
  gap: 4rem;
}

.feature {
  display: grid;
  grid-template-columns: minmax(0, 30rem) minmax(0, 26rem);
  justify-content: space-between;
  gap: 3rem;
  align-items: center;
  scroll-margin-top: 1.5rem;
}

.words {
  display: grid;
  gap: 0.75rem;
}

.headline {
  font-size: var(--step-lead);
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.plan {
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.plan.coaching {
  color: var(--green);
}

.how-to {
  max-width: 44ch;
}

.example {
  display: grid;
  place-items: center;
  padding: clamp(1.5rem, 1rem + 2vw, 2.5rem);
  border-radius: var(--radius);
  background: var(--tone);
}

@media (max-width: 63.99rem) {
  .group {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 4rem;
  }
  .group-name {
    position: static;
  }
  .feature {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>

<style>
/* The router offsets anchors by this, and here they must clear the group index too. */
html:has(.group-index) {
  scroll-padding-top: 10rem;
}
</style>
