<script setup lang="ts">
const props = withDefaults(
  defineProps<{ location: string; text?: string; quiet?: boolean; label?: string }>(),
  { text: undefined, quiet: false, label: undefined },
)

const { t } = useI18n()
const text = computed(() => props.label ?? t('cta.try'))
const href = useWhatsAppLink(() => props.text)
const { $analytics } = useNuxtApp()
</script>

<template>
  <a
    class="button"
    :class="{ 'button--quiet': quiet }"
    :href="href"
    target="_blank"
    rel="noopener"
    @click="$analytics?.lead(location)"
  >
    {{ text }}
  </a>
</template>
