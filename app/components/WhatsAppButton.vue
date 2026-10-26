<script setup lang="ts">
const props = withDefaults(
  defineProps<{ location: string; text?: string; inverse?: boolean; label?: string }>(),
  { text: undefined, inverse: false, label: undefined },
)

const trialDays = useTrialDays()
const text = computed(
  () =>
    props.label ?? (trialDays.value ? `Testar ${trialDays.value} dias grátis` : 'Testar grátis'),
)
const href = useWhatsAppLink(() => props.text)
const { $analytics } = useNuxtApp()
</script>

<template>
  <a
    class="button"
    :class="{ 'button--inverse': inverse }"
    :href="href"
    target="_blank"
    rel="noopener"
    @click="$analytics?.lead(location)"
  >
    {{ text }}
  </a>
</template>
