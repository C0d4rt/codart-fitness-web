<script setup lang="ts">
const props = defineProps<{ trialDays: number }>()

const { t, tm, rt } = useI18n()

const QUESTIONS = computed(() =>
  (tm('faq.items') as { q: string; a: string }[]).map((item) => ({
    question: rt(item.q),
    answer: rt(item.a, { days: props.trialDays }),
  })),
)
const anchors = useAnchors()
</script>

<template>
  <section :id="anchors.faq" class="faq" aria-labelledby="faq-title">
    <div class="head">
      <h2 id="faq-title" class="title"><TextLines :text="t('faq.title')" /></h2>
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
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 3rem clamp(3rem, 1rem + 5vw, 6rem);
  align-items: start;
  padding: var(--gap-section) var(--margin) 0;
}

.head {
  position: sticky;
  top: calc(var(--header) + 2rem);
  display: grid;
  gap: 1.5rem;
}

.title {
  font-size: var(--step-head);
}

.head p {
  max-width: 30ch;
  color: var(--muted);
}

.list {
  border-top: 1px solid var(--line); /* taste-skill-ignore: the owner chose hairline dividers for the questions */
}

details {
  border-bottom: 1px solid var(--line); /* taste-skill-ignore: the owner chose hairline dividers for the questions */
}

summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  min-height: 4.75rem;
  padding: 1rem 0;
  font-size: var(--step-title);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.25;
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
  color: var(--muted);
}

.plus::before,
.plus::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  margin-top: -0.75px;
  border-radius: 1px;
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
  max-width: 58ch;
  padding: 0 2.5rem 1.75rem 0;
}

details[open] p {
  animation: open 280ms var(--ease-out);
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}

@media (hover: hover) and (pointer: fine) {
  summary span:first-child {
    transition: color 160ms ease;
  }
  details:not([open]) summary:hover span:first-child {
    color: var(--green);
  }
}

@media (prefers-reduced-motion: reduce) {
  details[open] p {
    animation: none;
  }
  .plus::before,
  .plus::after {
    transition: none;
  }
}

@media (max-width: 63.99rem) {
  .faq {
    grid-template-columns: minmax(0, 1fr);
  }
  .head {
    position: static;
  }
}
</style>
