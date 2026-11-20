<script setup lang="ts">
const { t } = useI18n()
const trialDays = useTrialDays()
</script>

<template>
  <section class="closing" aria-labelledby="closing-title" data-reveal>
    <h2 id="closing-title" class="heading"><TextLines :text="t('closing.title')" /></h2>
    <p class="lead">{{ t('closing.lead', { days: trialDays }) }}</p>
    <WhatsAppButton location="closing" :label="t('cta.try')" class="action" />
  </section>
</template>

<style scoped>
.closing {
  display: grid;
  justify-items: center;
  margin: var(--gap-section) var(--margin) 0;
  padding: clamp(5rem, 3rem + 6vw, 9rem) var(--margin);
  border-radius: var(--radius);
  background:
    linear-gradient(var(--scrim), var(--scrim)),
    url('/images/atleta-na-academia.jpg') center 30% / cover var(--night);
  color: #ffffff;
  text-align: center;
}

.heading {
  font-size: var(--step-head);
}

.lead {
  text-wrap: balance;
  max-width: 34ch;
  margin-top: 1.75rem;
  color: #dfe4e0;
  font-size: var(--step-lead);
  line-height: 1.4;
}

.action {
  margin-top: 2.25rem;
}

@media (max-width: 47.99rem) {
  .action {
    width: 100%;
  }
}
</style>
