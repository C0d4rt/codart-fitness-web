<script setup lang="ts">
import type { Catalog } from '#shared/plans'

defineProps<{ groups: Catalog['groups'] }>()

const { t } = useI18n()
const anchors = useAnchors()
const localePath = useLocalePath()
</script>

<template>
  <section :id="anchors.everything" class="everything" aria-labelledby="everything-title">
    <div class="head" data-reveal>
      <h2 id="everything-title" class="title"><TextLines :text="t('everything.title')" /></h2>
      <p class="lead">{{ t('everything.lead') }}</p>
    </div>
    <nav class="index" :aria-label="t('everything.label')">
      <div v-for="group in groups" :key="group.id" class="group">
        <h3 class="group-name">{{ group.name }}</h3>
        <ul>
          <li v-for="feature in group.features" :key="feature.id">
            <NuxtLink :to="localePath(`/recursos#${feature.id}`)" class="feature">
              <FeatureIcon :feature="feature.id" class="icon" />
              <span>{{ feature.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
    <NuxtLinkLocale to="/recursos" class="link">{{ t('bento.seeAll') }}</NuxtLinkLocale>
  </section>
</template>

<style scoped>
.everything {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: start;
  gap: clamp(2.5rem, 1.5rem + 2vw, 4rem);
  padding: var(--gap-section) var(--margin) 0;
}

.head {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: end;
  gap: 1.5rem 3rem;
  width: 100%;
}

.title {
  font-size: var(--step-head);
}

.lead {
  max-width: 34ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

/* Groups flow down balanced columns: two on a phone, more as the width allows, up to four. */
.index {
  width: 100%;
  columns: 2;
  column-gap: clamp(1rem, 0.5rem + 3vw, 4rem);
}

.group {
  display: grid;
  gap: 0.5rem;
  padding-bottom: 2.5rem;
  break-inside: avoid;
}

.group-name {
  font-size: var(--step-title);
  letter-spacing: -0.02em;
}

.group ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  padding-block: 0.375rem;
  color: var(--ink);
  line-height: 1.3;
  text-decoration: none;
  transition: color 160ms ease;
}

.icon {
  flex: none;
  color: var(--green);
  transition: transform 200ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .feature:hover {
    color: var(--green);
  }
  .feature:hover .icon {
    transform: translateX(2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .icon {
    transition: none;
  }
}

.link {
  color: var(--green);
  font-weight: 500;
}

@media (min-width: 64rem) {
  .index {
    columns: 3;
  }
}

@media (min-width: 100rem) {
  .index {
    columns: 4;
  }
}

@media (max-width: 63.99rem) {
  .head {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 47.99rem) {
  .group {
    padding-bottom: 1.75rem;
  }
  .group-name {
    font-size: var(--step-body);
    font-weight: 700;
  }
  .feature {
    gap: 0.5rem;
    align-items: flex-start;
    min-height: 2.25rem;
    font-size: var(--step-small);
  }
  .icon {
    margin-top: 0.125rem;
  }
}
</style>
