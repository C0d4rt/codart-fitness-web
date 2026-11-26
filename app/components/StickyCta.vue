<script setup lang="ts">
const { t } = useI18n()
const consent = useConsent()
const nuxtApp = useNuxtApp()
const route = useRoute()
const onAccountPage = computed(() => route.meta.account === true)

/* On a phone the bar keeps the trial a thumb away, but only past the first screen
   and never while another trial button, the closing or the footer is on screen. */
const shown = ref(false)
const covering = new Set<Element>()
let observer: IntersectionObserver | undefined
let frame = 0

const measure = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    shown.value = window.scrollY > window.innerHeight * 0.6 && covering.size === 0
  })
}

const watchCovers = () => {
  observer?.disconnect()
  covering.clear()
  document.querySelectorAll('[data-cta]').forEach((element) => observer?.observe(element))
  measure()
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) covering.add(entry.target)
      else covering.delete(entry.target)
    }
    measure()
  })
  window.addEventListener('scroll', measure, { passive: true })
  requestAnimationFrame(watchCovers)
})

nuxtApp.hook('page:finish', () => void requestAnimationFrame(watchCovers))

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', measure)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <Transition name="sticky">
    <aside
      v-if="shown && !onAccountPage && !consent.showBanner.value"
      class="sticky-cta tone-dark"
      :aria-label="t('stickyCta.label')"
    >
      <p class="text">{{ t('stickyCta.text') }}</p>
      <WhatsAppButton location="sticky" :label="t('cta.try')" class="action" />
    </aside>
  </Transition>
</template>

<style scoped>
.sticky-cta {
  position: fixed;
  right: var(--margin);
  bottom: calc(0.75rem + env(safe-area-inset-bottom));
  left: var(--margin);
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
  border-radius: 999px;
}

.text {
  font-size: var(--step-small);
  font-weight: 500;
  line-height: 1.25;
}

.action {
  flex: none;
  min-height: 2.75rem;
  padding: 0 1.25rem;
  font-size: var(--step-small);
}

@media (min-width: 48rem) {
  .sticky-cta {
    display: none;
  }
}

.sticky-enter-active {
  transition:
    opacity 240ms var(--ease-out),
    transform 280ms var(--ease-out);
}

.sticky-leave-active {
  transition:
    opacity 160ms ease,
    transform 180ms ease;
}

.sticky-enter-from,
.sticky-leave-to {
  opacity: 0;
  transform: translateY(120%);
}

@media (prefers-reduced-motion: reduce) {
  .sticky-enter-from,
  .sticky-leave-to {
    transform: none;
  }
}
</style>
