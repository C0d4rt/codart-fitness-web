<script setup lang="ts">
import { renderSVG } from 'uqr'

const props = defineProps<{ value: string; label: string }>()

const src = computed(
  () =>
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      renderSVG(props.value, { ecc: 'M', border: 2, blackColor: '#001724', whiteColor: '#ffffff' }),
    )}`,
)
</script>

<template>
  <img class="qr" :src="src" :alt="label" width="208" height="208" />
</template>

<style scoped>
.qr {
  width: 13rem;
  height: 13rem;
  border-radius: var(--radius-small);
  background: #ffffff;
  image-rendering: pixelated;
}
</style>
