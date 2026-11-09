<script setup lang="ts">
const { t } = useI18n()
const trialDays = useTrialDays()
</script>

<template>
  <section class="closing" aria-labelledby="closing-title" data-reveal>
    <div class="band">
      <h2 id="closing-title" class="heading">{{ t('closing.title') }}</h2>
      <div class="act">
        <p class="lead">{{ t('closing.lead', { days: trialDays }) }}</p>
        <WhatsAppButton location="closing" :label="t('cta.try')" inverse />
        <p class="note">{{ t('closing.note') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.closing {
  padding: var(--gap-section) var(--margin) 0;
}

.band {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 2.5rem 4rem;
  align-items: end;
  padding: clamp(2.5rem, 1.5rem + 4vw, 5rem);
  border-radius: 2rem;
  background: var(--green);
  color: var(--green-ink);
}

.heading {
  max-width: 14ch;
  font-size: var(--step-head);
  line-height: 1;
  letter-spacing: -0.04em;
}

.act {
  display: grid;
  justify-items: start;
  gap: 1.25rem;
}

.lead {
  font-size: var(--step-lead);
  line-height: 1.35;
}

.note {
  max-width: 36ch;
  font-size: var(--step-small);
}

.closing :focus-visible {
  outline-color: var(--card);
}

@media (max-width: 47.99rem) {
  .band {
    grid-template-columns: 1fr;
    border-radius: 1.5rem;
  }
}
</style>
