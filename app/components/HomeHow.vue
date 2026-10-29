<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'

const { t } = useI18n()

const STEPS: { tone: string; clause: string; screen: ChatScreen }[] = [
  {
    tone: 'mint',
    clause: t('how.tell.clause'),
    screen: {
      id: 'how-tell',
      label: t('how.tell.label'),
      messages: [{ from: 'you', text: t('how.tell.message'), time: '12:41' }],
    },
  },
  {
    tone: 'sky',
    clause: t('how.log.clause'),
    screen: {
      id: 'how-log',
      label: t('how.log.label'),
      messages: [{ from: 'bot', text: t('how.log.message'), time: '12:41' }],
    },
  },
  {
    tone: 'peach',
    clause: t('how.left.clause'),
    screen: {
      id: 'how-left',
      label: t('how.left.label'),
      messages: [
        { from: 'you', text: t('how.left.question'), time: '12:42' },
        { from: 'bot', text: t('how.left.answer'), time: '12:42' },
      ],
    },
  },
  {
    tone: 'sand',
    clause: t('how.remind.clause'),
    screen: {
      id: 'how-remind',
      label: t('how.remind.label'),
      messages: [{ from: 'bot', text: t('how.remind.message'), time: '11:30' }],
    },
  },
]
</script>

<template>
  <section id="como-funciona" class="how" aria-labelledby="how-title">
    <h2 id="how-title" class="title">{{ t('how.title') }}</h2>
    <ol class="steps">
      <li v-for="step in STEPS" :key="step.tone" class="field" :class="step.tone">
        <p class="clause">{{ step.clause }}</p>
        <ChatWindow :screen="step.screen" bare class="chat" />
      </li>
    </ol>
  </section>
</template>

<style scoped>
.how {
  display: grid;
  gap: 2.5rem;
  padding: var(--gap-section) var(--margin) 0;
}

.title {
  font-size: var(--step-head);
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.field {
  display: grid;
  align-content: start;
  gap: 1.25rem;
  padding: 1.75rem 1.5rem;
  border-radius: var(--radius);
}

.mint {
  background: var(--mint);
}

.sky {
  background: var(--sky);
}

.peach {
  background: var(--peach);
}

.sand {
  background: var(--sand);
}

.clause {
  font-size: var(--step-lead);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.steps .field .chat {
  background: transparent;
}

.steps .field .chat :deep(.thread) {
  padding: 0;
}

@media (max-width: 63.99rem) {
  .steps {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 47.99rem) {
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
