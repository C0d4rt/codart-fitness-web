<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const { t } = useI18n()

useSeoMeta({ title: t('notFound.title'), robots: 'noindex' })
</script>

<template>
  <div class="error">
    <SiteNav />
    <main>
      <h1>{{ t('notFound.heading') }}</h1>
      <i18n-t keypath="notFound.text" tag="p">
        <template #back>
          <NuxtLinkLocale to="/">{{ t('notFound.back') }}</NuxtLinkLocale>
        </template>
      </i18n-t>
    </main>
  </div>
</template>

<style scoped>
.error {
  padding: 0 var(--margin);
}

main {
  display: grid;
  gap: 1.5rem;
  min-height: 70svh;
  align-content: center;
}

h1 {
  font-size: var(--step-head);
}
</style>
