<script setup lang="ts">
const consent = useConsent()
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <Transition name="consent">
    <aside
      v-if="mounted && consent.showBanner.value"
      class="consent"
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
    >
      <h2 id="consent-title" class="title">Cookies</h2>
      <p id="consent-text">
        Com a sua permissão, usamos o Google Analytics e o pixel da Meta para contar visitas e medir
        anúncios. Sem ela, nada deles é carregado.
        <NuxtLink to="/privacidade">Privacidade</NuxtLink>
      </p>
      <div class="actions">
        <button type="button" class="button" @click="consent.choose('granted')">Aceitar</button>
        <button type="button" class="button button--quiet" @click="consent.choose('denied')">
          Recusar
        </button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.consent {
  position: fixed;
  z-index: 20;
  right: var(--margin);
  bottom: calc(var(--margin) + env(safe-area-inset-bottom));
  display: grid;
  gap: 0.75rem;
  width: min(26rem, calc(100vw - 2 * var(--margin)));
  padding: 1.25rem;
  background: var(--bg);
  color: var(--ink);
  font-size: 0.9375rem;
  box-shadow: /* taste-skill-ignore: a dialog that floats over the page */
    0 1px 2px rgb(0 0 0 / 0.08),
    0 12px 32px rgb(0 0 0 / 0.16);
}

.title {
  font-size: 1.375rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.actions .button {
  flex: 1;
  min-height: 2.75rem;
  padding: 0 1rem;
  font-size: 0.9375rem;
}

.button--quiet {
  background: var(--surface);
  color: var(--ink);
}

.consent-enter-active {
  transition:
    opacity 240ms var(--ease-out),
    transform 280ms var(--ease-out);
}

.consent-leave-active {
  transition:
    opacity 140ms ease,
    transform 160ms ease;
}

.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (prefers-reduced-motion: reduce) {
  .consent-enter-from,
  .consent-leave-to {
    transform: none;
  }
}
</style>
