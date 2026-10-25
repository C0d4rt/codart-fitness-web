<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'

const props = defineProps<{ fallback: ChatScreen }>()
const stage = useStage()
const screen = computed(() => stage.value ?? props.fallback)
</script>

<template>
  <aside class="stage" aria-label="A conversa com o diário">
    <ChatWindow :screen="screen" />
  </aside>
</template>

<style scoped>
.stage {
  position: sticky;
  top: 0;
  display: grid;
  place-items: center;
  height: 100svh;
  padding: 1.25rem 0 1.25rem 1.25rem;
}

.stage::before {
  content: '';
  position: absolute;
  inset: 1.25rem 0 1.25rem 1.25rem;
  z-index: -1;
  background: var(--surface);
}
</style>
