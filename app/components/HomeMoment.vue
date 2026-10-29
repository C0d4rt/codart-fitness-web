<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { logModeScreen } from '#shared/screens'

const { t } = useI18n()

const base = logModeScreen('photo')
const photoScreen: ChatScreen = {
  ...base,
  messages: base.messages.map((message) =>
    message.attachment?.kind === 'photo'
      ? {
          ...message,
          attachment: {
            ...message.attachment,
            label: t('moment.photoLabel'),
            src: '/images/salada.jpg',
          },
        }
      : message,
  ),
}
</script>

<template>
  <section class="moment" aria-labelledby="moment-title">
    <div class="copy" data-reveal>
      <h2 id="moment-title" class="title">{{ t('moment.title') }}</h2>
      <p>{{ t('moment.text') }}</p>
    </div>
    <div class="stage">
      <ChatWindow :screen="photoScreen" class="chat" />
    </div>
  </section>
</template>

<style scoped>
.moment {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  align-items: center;
  gap: 2rem;
  margin: var(--gap-section) var(--margin) 0;
  padding: clamp(2rem, 1rem + 3vw, 4rem);
  border-radius: 2rem;
  background: var(--card);
  color: var(--ink);
}

.copy {
  display: grid;
  gap: 1.5rem;
}

.title {
  max-width: 12ch;
  font-size: var(--step-head);
}

.copy > p {
  max-width: 34ch;
  color: var(--muted);
  font-size: var(--step-body);
}

.stage {
  display: grid;
  place-items: center;
}

.stage .chat {
  width: min(28rem, 100%);
}

@media (max-width: 63.99rem) {
  .moment {
    grid-template-columns: 1fr;
  }
}
</style>
