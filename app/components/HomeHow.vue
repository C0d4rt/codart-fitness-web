<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { thousands } from '#shared/locale'
import type { Feature } from '#shared/plans'

defineProps<{ features: Feature[] }>()

const { t } = useI18n()
const locale = useSiteLocale().value

const STEPS: { id: string; clause: string; screen: ChatScreen }[] = [
  {
    id: 'tell',
    clause: t('how.tell.clause'),
    screen: {
      id: 'how-tell',
      label: t('how.tell.label'),
      messages: [{ from: 'you', text: t('how.tell.message'), time: '12:41' }],
    },
  },
  {
    id: 'log',
    clause: t('how.log.clause'),
    screen: {
      id: 'how-log',
      label: t('how.log.label'),
      messages: [{ from: 'bot', text: t('how.log.message'), time: '12:41' }],
    },
  },
  {
    id: 'left',
    clause: t('how.left.clause'),
    screen: {
      id: 'how-left',
      label: t('how.left.label'),
      messages: [
        { from: 'you', text: t('how.left.question'), time: '12:42' },
        {
          from: 'bot',
          text: t('how.left.answer', {
            left: thousands(1384, locale),
            goal: thousands(1800, locale),
          }),
          time: '12:42',
        },
      ],
    },
  },
  {
    id: 'remind',
    clause: t('how.remind.clause'),
    screen: {
      id: 'how-remind',
      label: t('how.remind.label'),
      messages: [{ from: 'bot', text: t('how.remind.message'), time: '11:30' }],
    },
  },
]

const RELATED = ['diary', 'photos', 'barcode', 'quickAdd', 'backfill', 'reminders'] as const
const anchors = useAnchors()
</script>

<template>
  <section :id="anchors.how" class="how" aria-labelledby="how-title">
    <div class="head" data-reveal>
      <h2 id="how-title" class="title"><TextLines :text="t('how.title')" /></h2>
      <p class="lead">{{ t('how.lead') }}</p>
    </div>
    <ol class="steps" data-reveal>
      <li v-for="step in STEPS" :key="step.id" class="step">
        <p class="clause">{{ step.clause }}</p>
        <ChatWindow :screen="step.screen" bare class="chat" />
      </li>
    </ol>
    <FeatureChips :features="features" :ids="RELATED" :label="t('chips.label')" />
  </section>
</template>

<style scoped>
.how {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  padding: var(--gap-section) var(--margin) 0;
}

.head {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: end;
  gap: 1.5rem 3rem;
}

.title {
  font-size: var(--step-head);
}

.lead {
  max-width: 34ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2.5rem;
  margin: 0;
  padding: clamp(1.75rem, 1rem + 2vw, 2.75rem);
  border-radius: var(--radius);
  background: var(--card);
  list-style: none;
}

.step {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
  min-height: 11rem;
}

.clause {
  font-size: var(--step-title);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.step .chat {
  align-self: end;
}

/* Without the thread's padding, clipping would cut the bubble tails and the last bubble's shadow. */
.step .chat :deep(.screen) {
  overflow: visible;
  background: transparent;
}

.step .chat :deep(.thread) {
  padding: 0;
  overflow: visible;
}

.step .chat :deep(.bot .bubble) {
  --fill: var(--ground);
}

@media (max-width: 63.99rem) {
  .head {
    grid-template-columns: minmax(0, 1fr);
  }
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 47.99rem) {
  .steps {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
  .step {
    min-height: 0;
  }
}
</style>
