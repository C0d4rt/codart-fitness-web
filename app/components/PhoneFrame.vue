<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'

defineProps<{ screen: ChatScreen }>()
</script>

<template>
  <div class="phone" data-ui>
    <div class="screen">
      <ChatWindow :screen="screen" class="chat-in-phone" />
    </div>
  </div>
</template>

<style scoped>
.phone {
  width: 100%;
  padding: 0.75rem;
  border-radius: 3rem;
  background: #0b0f0e;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.08); /* taste-skill-ignore: the device's own bezel edge (data-ui fragment) */
}

.screen {
  overflow: hidden;
  border-radius: 2.4rem;
  background: var(--chat-bg);
}

.chat-in-phone {
  width: 100%;
  max-height: none;
  border-radius: 0;
}

.chat-in-phone :deep(.bar) {
  padding-top: 1.75rem;
}
</style>
