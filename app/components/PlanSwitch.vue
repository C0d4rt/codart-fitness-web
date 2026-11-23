<script setup lang="ts" generic="T extends string | number">
const props = defineProps<{ options: readonly { value: T; label: string }[]; label: string }>()
const model = defineModel<T>({ required: true })

const at = computed(() =>
  Math.max(
    0,
    props.options.findIndex((each) => each.value === model.value),
  ),
)
</script>

<template>
  <div
    class="switch"
    role="group"
    :aria-label="label"
    :style="{ '--at': at, '--n': options.length }"
  >
    <span class="glide" aria-hidden="true" />
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="option.value === model"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--tone);
}

/* One highlight under every option, so the switch reads as a move rather than a swap. */
.glide {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0.25rem;
  width: calc((100% - 0.5rem) / var(--n, 2));
  border-radius: 999px;
  background: var(--card);
  transform: translateX(calc(var(--at, 0) * 100%));
  transition: transform 260ms var(--ease-in-out);
}

@media (prefers-reduced-motion: reduce) {
  .glide {
    transition: none;
  }
}

.switch button {
  position: relative;
  min-width: 6.5rem;
  min-height: 2.5rem;
  padding: 0 1.125rem;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--muted);
  font-weight: 500;
  cursor: pointer;
  transition:
    color 200ms ease,
    transform 160ms var(--ease-out);
}

.switch button[aria-pressed='true'] {
  color: var(--ink);
}

.switch button:active {
  transform: scale(0.97);
}
</style>
