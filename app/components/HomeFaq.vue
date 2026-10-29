<script setup lang="ts">
const props = defineProps<{ trialDays: number }>()

const { t, tm, rt } = useI18n()

const QUESTIONS = computed(() =>
  (tm('faq.items') as { q: string; a: string }[]).map((item) => ({
    question: rt(item.q),
    answer: rt(item.a, { days: props.trialDays }),
  })),
)
</script>

<template>
  <section id="perguntas" class="faq" aria-labelledby="faq-title">
    <div class="head">
      <h2 id="faq-title" class="title">{{ t('faq.title') }}</h2>
      <p>{{ t('faq.lead') }}</p>
    </div>
    <div class="list">
      <details
        v-for="(each, index) in QUESTIONS"
        :key="each.question"
        name="faq"
        :open="index === 0"
      >
        <summary>
          <span>{{ each.question }}</span>
          <span class="plus" aria-hidden="true" />
        </summary>
        <p>{{ each.answer }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: 3rem;
  align-items: start;
  padding: var(--gap-section) var(--margin) 0;
}

.head {
  position: sticky;
  top: 6rem;
  display: grid;
  gap: 1rem;
}

.title {
  max-width: 10ch;
  font-size: var(--step-head);
}

.head p {
  color: var(--muted);
}

.list {
  display: grid;
  gap: 0.5rem;
}

details {
  border-radius: 1.125rem;
  background: var(--card);
  transition: background-color 220ms ease;
}

details[open] {
  background: var(--mint);
}

summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  min-height: 4.5rem;
  padding: 0 1.5rem;
  font-size: var(--step-body);
  font-weight: 700;
  letter-spacing: -0.015em;
  list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

.plus {
  position: relative;
  flex: none;
  width: 1rem;
  height: 1rem;
}

.plus::before,
.plus::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 3px;
  margin-top: -1.5px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 220ms var(--ease-out);
}

.plus::after {
  transform: rotate(90deg);
}

details[open] .plus::after {
  transform: rotate(0deg);
}

details p {
  max-width: 56ch;
  padding: 0 1.5rem 1.5rem;
  color: var(--ink);
}

details[open] p {
  animation: open 320ms var(--ease-out);
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}

@media (hover: hover) and (pointer: fine) {
  details:not([open]):hover {
    background: color-mix(in oklab, var(--card) 70%, var(--mint));
  }
}

@media (prefers-reduced-motion: reduce) {
  details[open] p {
    animation: none;
  }
}

@media (max-width: 63.99rem) {
  .faq {
    grid-template-columns: 1fr;
  }
  .head {
    position: static;
  }
  .title {
    max-width: none;
  }
}
</style>
