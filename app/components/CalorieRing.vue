<script setup lang="ts">
const props = withDefaults(defineProps<{ eaten: number; goal: number; size?: number }>(), {
  size: 120,
})

const radius = 52
const circumference = 2 * Math.PI * radius
const share = computed(() => Math.min(props.eaten / props.goal, 1))
const thousands = (value: number) => value.toLocaleString('pt-BR')
</script>

<template>
  <figure class="ring" :style="{ '--size': `${size}px`, '--share': share }">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="track" cx="60" cy="60" :r="radius" />
      <circle
        class="value"
        cx="60"
        cy="60"
        :r="radius"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference * (1 - share)"
      />
    </svg>
    <figcaption>
      <strong>{{ thousands(eaten) }}</strong>
      <span>de {{ thousands(goal) }} kcal</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.ring {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--size);
  height: var(--size);
}

svg {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}

circle {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
}

.track {
  stroke: var(--tone);
}

.value {
  stroke: var(--green);
}

@media (prefers-reduced-motion: no-preference) {
  .value {
    animation: fill 1.2s var(--ease-out) 300ms both;
  }
}

@keyframes fill {
  from {
    stroke-dashoffset: 326.73;
  }
}

figcaption {
  display: grid;
  justify-items: center;
  line-height: 1.15;
}

strong {
  font-size: calc(var(--size) * 0.2);
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

span {
  color: var(--muted);
  font-size: calc(var(--size) * 0.1);
}
</style>
