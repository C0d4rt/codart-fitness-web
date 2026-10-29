<script setup lang="ts">
import { brand } from '~/brand'

const props = defineProps<{ title: string; mailbox: 'support' | 'privacy' }>()

const { t } = useI18n()
const locale = useSiteLocale()
const email = computed(() => brand.email[locale.value][props.mailbox])

useSeoMeta({ title: props.title, robots: 'noindex' })
</script>

<template>
  <div class="legal">
    <SiteNav />
    <main>
      <h1>{{ title }}</h1>
      <p>{{ t('legal.pending') }}</p>
      <slot />
      <i18n-t keypath="legal.questions" tag="p">
        <template #email>
          <a :href="`mailto:${email}`">{{ email }}</a>
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
  max-width: 62ch;
  min-height: 60svh;
  padding-top: 14svh;
}

h1 {
  font-size: var(--step-head);
}
</style>
