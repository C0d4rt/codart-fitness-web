<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: t('notFound.title'), robots: 'noindex' })
</script>

<template>
  <div class="missing">
    <SiteNav />
    <main>
      <h1>{{ t('notFound.heading') }}</h1>
      <i18n-t keypath="notFound.text" tag="p">
        <template #back>
          <NuxtLinkLocale to="/">{{ t('notFound.back') }}</NuxtLinkLocale>
        </template>
      </i18n-t>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
main {
  display: grid;
  padding-inline: var(--margin);
  gap: 1.5rem;
  min-height: 60svh;
  align-content: center;
}

h1 {
  font-size: var(--step-head);
}
</style>
