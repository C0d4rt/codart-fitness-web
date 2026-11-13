<script setup lang="ts">
import type { Feature } from '#shared/plans'

const props = defineProps<{ features: Feature[]; ids?: readonly string[]; label: string }>()

const localePath = useLocalePath()

const shown = computed(() =>
  props.ids === undefined
    ? props.features
    : props.ids.flatMap((id) => props.features.filter((feature) => feature.id === id)),
)
</script>

<template>
  <ul class="feature-chips" :aria-label="label">
    <li v-for="feature in shown" :key="feature.id">
      <NuxtLink :to="localePath(`/recursos#${feature.id}`)" class="chip">
        <FeatureIcon :feature="feature.id" class="icon" />
        <span>{{ feature.name }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.feature-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 1rem 0.5rem 0.875rem;
  border-radius: 999px;
  background: var(--card);
  color: var(--ink);
  font-size: var(--step-small);
  font-weight: 500;
  line-height: 1.25;
  text-decoration: none;
  transition:
    background-color 160ms ease,
    transform 160ms var(--ease-out);
}

.icon {
  color: var(--green);
}

.chip:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .chip:hover {
    background: var(--tone);
  }
}

@media (forced-colors: active) {
  .chip {
    border: 1px solid LinkText;
  }
}
</style>
