<script setup lang="ts">
const props = defineProps<{ text: string }>()

const sentences = computed(() => props.text.split(/(?<=[.?!])\s+/))
</script>

<template>
  <template v-for="(sentence, index) in sentences" :key="index">
    <span class="sentence">{{ sentence }}</span
    >{{ index < sentences.length - 1 ? ' ' : '' }}
  </template>
</template>
