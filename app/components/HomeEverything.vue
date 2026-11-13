<script setup lang="ts">
import type { Feature } from '#shared/plans'

defineProps<{ features: Feature[] }>()

const { t } = useI18n()
const anchors = useAnchors()
</script>

<template>
  <section :id="anchors.everything" class="everything" aria-labelledby="everything-title">
    <div class="head" data-reveal>
      <h2 id="everything-title" class="title"><TextLines :text="t('everything.title')" /></h2>
      <p class="lead">{{ t('everything.lead') }}</p>
    </div>
    <FeatureChips :features="features" :label="t('everything.label')" class="cloud" />
    <NuxtLinkLocale to="/recursos" class="link">{{ t('bento.seeAll') }}</NuxtLinkLocale>
  </section>
</template>

<style scoped>
.everything {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  gap: 2.5rem;
  padding: var(--gap-section) var(--margin) 0;
  text-align: center;
}

.head {
  display: grid;
  justify-items: center;
  gap: 1.5rem;
}

.title {
  font-size: var(--step-head);
}

.lead {
  text-wrap: balance;
  max-width: 40ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.cloud {
  justify-content: center;
  max-width: 68rem;
}

.link {
  color: var(--green);
  font-weight: 500;
}
</style>
