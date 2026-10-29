<script setup lang="ts">
import { brand } from '~/brand'
import { LEGAL, LEGAL_EFFECTIVE, LEGAL_VERSION } from '#shared/legal'

const props = defineProps<{
  title: string
  doc: 'terms' | 'privacy'
  mailbox: 'support' | 'privacy'
}>()

const { t } = useI18n()
const locale = useSiteLocale()
const email = computed(() => brand.email[locale.value][props.mailbox])
const content = computed(() => LEGAL[locale.value][props.doc])
const effective = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'pt-BR', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${LEGAL_EFFECTIVE}T00:00:00Z`)),
)

useSeoMeta({ title: props.title })
</script>

<template>
  <div class="legal">
    <SiteNav />
    <main>
      <h1>{{ title }}</h1>
      <p class="version">
        {{ t('legal.version', { version: LEGAL_VERSION, date: effective }) }}
      </p>
      <p>{{ content.intro }}</p>
      <section v-for="section in content.sections" :key="section.title">
        <h2>{{ section.title }}</h2>
        <p v-for="paragraph in section.paragraphs ?? []" :key="paragraph">{{ paragraph }}</p>
        <ul v-if="section.items">
          <li v-for="item in section.items" :key="item">{{ item }}</li>
        </ul>
      </section>
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

h2 {
  margin-bottom: 0.75rem;
  font-size: 1.375rem;
}

section {
  display: grid;
  gap: 0.75rem;
}

ul {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding-left: 1.25rem;
}

.version {
  color: var(--muted);
  font-size: var(--step-small);
}
</style>
