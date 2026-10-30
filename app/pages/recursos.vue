<script setup lang="ts">
import { brand } from '~/brand'

const catalog = await usePlans()
const { t } = useI18n()

useSeoMeta({
  title: t('features.title'),
  description: t('features.description', { name: brand.name, days: catalog.trialDays }),
})

const planLine = (plan: 'basic' | 'premium') => t(`features.${plan}`)
</script>

<template>
  <div class="page">
    <SiteNav />
    <header class="intro">
      <h1 class="title">{{ t('features.title') }}</h1>
      <p class="lead">{{ t('features.lead') }}</p>
    </header>

    <section
      v-for="group in catalog.groups"
      :key="group.id"
      class="group"
      :aria-labelledby="`group-${group.id}`"
    >
      <h2 :id="`group-${group.id}`" class="group-name">{{ group.name }}</h2>
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

    <SiteFooter />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1.25rem;
  padding: 4rem var(--margin) 0;
}

.title {
  font-size: var(--step-display);
}

.lead {
  max-width: 44ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.group {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
  gap: 3rem;
  padding: 6rem var(--margin) 0;
}

.group-name {
  position: sticky;
  top: 6rem;
  align-self: start;
  font-size: clamp(1.75rem, 1.2rem + 1.6vw, 2.75rem);
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
  line-height: 1.15;
}

.plan {
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.plan.premium {
  color: var(--green);
}

.how-to {
  max-width: 44ch;
}

.example {
  display: grid;
  place-items: center start;
}

.chat {
  width: min(22.5rem, 100%);
}

@media (max-width: 63.99rem) {
  .group {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-top: 4rem;
  }
  .group-name {
    position: static;
  }
  .feature {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .example {
    place-items: stretch;
  }
  .chat {
    width: 100%;
  }
}
</style>
