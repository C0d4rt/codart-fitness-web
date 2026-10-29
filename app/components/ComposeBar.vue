<script setup lang="ts">
import { brand } from '~/brand'

const trialDays = useTrialDays()
</script>

<template>
  <figure class="compose" data-ui :aria-label="$t('compose.label')">
    <span class="field">{{ brand.greeting(trialDays) }}</span>
    <span class="send" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M3 20.5 21 12 3 3.5l.02 6.6L15 12 3.02 13.9z" fill="currentColor" />
      </svg>
    </span>
  </figure>
</template>

<style scoped>
.compose {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.625rem;
  border-radius: 0.75rem;
  background: var(--chat-bg);
  color: var(--chat-ink);
  font-size: 0.9375rem;
}

.field {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 1.5rem;
  background: var(--chat-bot);
}

.send {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--chat-bar);
  color: var(--chat-bar-ink);
}
</style>
