<script setup lang="ts">
import type { ChatMessage, ChatScreen } from '#shared/chat'
import { thousands } from '#shared/locale'
import type { Feature } from '#shared/plans'

defineProps<{ features: Feature[] }>()

const { t } = useI18n()
const locale = useSiteLocale().value

const STEPS: { id: string; messages: ChatMessage[] }[] = [
  { id: 'tell', messages: [{ from: 'you', text: t('how.tell.message'), time: '12:41' }] },
  { id: 'log', messages: [{ from: 'bot', text: t('how.log.message'), time: '12:41' }] },
  {
    id: 'left',
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
  {
    id: 'remind',
    messages: [
      { from: 'bot', text: t('how.remind.message'), time: '11:30', day: t('how.tomorrow') },
    ],
  },
]
const LAST = STEPS.length - 1

/* The whole conversation is in the page; with script, it builds up one step at a time once it is seen. */
const step = ref(LAST)
const screen = computed<ChatScreen>(() => ({
  id: `how-${step.value}`,
  label: t(`how.${STEPS[step.value]!.id}.label`),
  messages: STEPS.slice(0, step.value + 1).flatMap((each) => each.messages),
}))

const STEP_MS = 3400
const FIRST_MS = 1600
const playing = ref(false)
const stage = ref<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined
let observer: IntersectionObserver | undefined

const next = (wait: number) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    step.value += 1
    if (step.value < LAST) next(STEP_MS)
    else playing.value = false
  }, wait)
}

const pick = (index: number) => {
  clearTimeout(timer)
  playing.value = false
  step.value = index
}

onMounted(() => {
  if (!stage.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  step.value = 0
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      observer?.disconnect()
      playing.value = true
      next(FIRST_MS)
    },
    { threshold: 0.35 },
  )
  observer.observe(stage.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(timer)
})

const RELATED = ['diary', 'photos', 'barcode', 'quickAdd', 'backfill', 'reminders'] as const
const anchors = useAnchors()
</script>

<template>
  <section :id="anchors.how" class="how" aria-labelledby="how-title">
    <div class="head" data-reveal>
      <h2 id="how-title" class="title"><TextLines :text="t('how.title')" /></h2>
      <p class="lead">{{ t('how.lead') }}</p>
    </div>
    <div ref="stage" class="stage">
      <ol class="steps" :aria-label="t('how.steps')">
        <li v-for="(each, index) in STEPS" :key="each.id">
          <button
            type="button"
            class="step"
            :class="{ done: index < step, now: index === step }"
            :aria-pressed="index === step"
            @click="pick(index)"
          >
            <span class="track">
              <span
                :key="playing && index === step ? `run-${step}` : 'still'"
                class="fill"
                :class="{ running: playing && index === step }"
                :style="{ '--ms': `${index === 0 ? FIRST_MS : STEP_MS}ms` }"
              />
            </span>
            <span class="number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="clause">{{ t(`how.${each.id}.clause`) }}</span>
          </button>
        </li>
      </ol>
      <div class="window"><ChatWindow :screen="screen" flat typing grow /></div>
      <p class="visually-hidden" aria-live="polite">{{ screen.label }}</p>
    </div>
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

.stage {
  display: grid;
  gap: clamp(1rem, 0.5rem + 1.5vw, 1.75rem);
  padding: clamp(1rem, 0.5rem + 1.5vw, 1.75rem);
  border-radius: var(--radius-panel);
  background: var(--tone);
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  display: grid;
  gap: 0.375rem;
  width: 100%;
  height: 100%;
  padding: 1rem 1.125rem 1.125rem;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: var(--muted);
  text-align: left;
  cursor: pointer;
  transition:
    background-color 200ms ease,
    color 200ms ease,
    box-shadow 200ms ease,
    transform 160ms var(--ease-out);
}

.step.now {
  background: var(--card);
  color: var(--ink);
  box-shadow: var(--shadow-card);
}

.step.done {
  color: var(--ink);
}

.step:active {
  transform: scale(0.98);
}

@media (hover: hover) and (pointer: fine) {
  .step:not(.now):hover {
    background: color-mix(in oklab, var(--card) 55%, transparent);
  }
}

.track {
  height: 3px;
  margin-bottom: 0.625rem;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in oklab, var(--ink) 12%, transparent);
}

.fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--green);
  transform: scaleX(0);
  transform-origin: left;
}

.done .fill,
.now .fill {
  transform: none;
}

.now .fill.running {
  animation: fill var(--ms) linear both;
}

.number {
  font-size: var(--step-small);
  font-variant-numeric: tabular-nums;
}

.now .number {
  color: var(--green);
  font-weight: 600;
}

.clause {
  font-size: clamp(1.0625rem, 0.95rem + 0.4vw, 1.3125rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.window {
  height: 30rem;
}

@keyframes fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: none;
  }
}

@media (max-width: 63.99rem) {
  .head {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 47.99rem) {
  .stage {
    margin-inline: calc(var(--margin) * -0.5);
    border-radius: var(--radius);
  }
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .step {
    padding: 0.75rem 0.875rem 0.875rem;
  }
  .clause {
    font-size: var(--step-small);
  }
  .window {
    height: 31rem;
  }
  .window :deep(.chat) {
    font-size: 0.9375rem;
  }
  .window :deep(.thread) {
    padding-inline: 0.875rem;
  }
}

@media (forced-colors: active) {
  .step.now {
    outline: 2px solid Highlight;
  }
}
</style>
