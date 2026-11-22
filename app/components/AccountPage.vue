<script setup lang="ts">
defineProps<{ heading: string; lead?: string }>()
</script>

<template>
  <div class="account-page">
    <SiteNav />
    <main id="conteudo">
      <header class="intro">
        <h1 class="title">{{ heading }}</h1>
        <p v-if="lead" class="lead">{{ lead }}</p>
      </header>
      <section class="panel" aria-live="polite">
        <slot />
      </section>
      <slot name="after" />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
main {
  display: grid;
  align-content: start;
  gap: 2rem;
  max-width: calc(46rem + 2 * var(--margin));
  min-height: 70svh;
  padding: clamp(3rem, 1.5rem + 5vw, 6rem) var(--margin) var(--gap-band);
}

.intro {
  display: grid;
  gap: 1.25rem;
}

.title {
  font-size: var(--step-head);
}

.lead {
  max-width: 40ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.panel {
  display: grid;
  gap: 1.25rem;
  padding: clamp(1.5rem, 1rem + 2vw, 2.5rem);
  border-radius: var(--radius);
  background: var(--card);
}

.panel :deep(.status) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.panel :deep(.status)::before {
  content: '';
  flex: none;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 1.6s var(--ease-in-out) infinite;
}

.panel :deep(.heading) {
  font-size: var(--step-title);
}

.panel :deep(.muted) {
  color: var(--muted);
  font-size: var(--step-small);
}

.panel :deep(.error) {
  padding: 0.875rem 1rem;
  border-radius: var(--radius-small);
  background: var(--peach);
  font-size: var(--step-small);
}

.panel :deep(.actions) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel :deep(.status)::before {
    animation: none;
  }
}
</style>
