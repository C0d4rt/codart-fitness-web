<script setup lang="ts">
const SLIDE_MS = 220
const SHORT: Record<string, string> = { pt: 'BR', en: 'EN' }

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const options = computed(() =>
  locales.value.map((each) => ({
    code: each.code,
    name: each.name ?? each.code,
    language: each.language ?? undefined,
    short: SHORT[each.code] ?? each.code.toUpperCase(),
    path: switchLocalePath(each.code),
  })),
)

const shown = ref(locale.value)
const position = computed(() =>
  Math.max(
    0,
    options.value.findIndex((option) => option.code === shown.value),
  ),
)

const choose = (event: MouseEvent, code: typeof locale.value, path: string) => {
  // A new tab keeps the browser's own way.
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return
  }
  event.preventDefault()
  if (code === locale.value || !path) {
    return
  }
  shown.value = code
  // Each page mounts its own header: the thumb lands before the page changes.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.setTimeout(() => navigateTo(path), still ? 0 : SLIDE_MS)
}
</script>

<template>
  <div class="switch" role="group" :aria-label="t('nav.language')">
    <span
      class="thumb"
      aria-hidden="true"
      :style="{
        width: `calc((100% - 0.5rem) / ${options.length})`,
        transform: `translateX(${position * 100}%)`,
      }"
    />
    <NuxtLink
      v-for="option in options"
      :key="option.code"
      v-slot="{ href }"
      :to="option.path"
      custom
    >
      <a
        :href="href ?? option.path"
        class="option"
        :hreflang="option.language"
        :lang="option.language"
        :aria-label="option.name"
        :aria-current="option.code === locale ? 'true' : undefined"
        :data-shown="option.code === shown"
        @click="choose($event, option.code, option.path)"
        >{{ option.short }}</a
      >
    </NuxtLink>
  </div>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--tone);
}

.thumb {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0.25rem;
  border-radius: 999px;
  background: var(--card);
  transition: transform 220ms var(--ease-in-out);
}

.option {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 2.75rem;
  min-height: 2.25rem;
  padding: 0 0.75rem;
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition:
    color 200ms ease,
    transform 160ms var(--ease-out);
}

.option[data-shown='true'] {
  color: var(--ink);
}

.option:active {
  transform: scale(0.97);
}

.option:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

@media (hover: hover) and (pointer: fine) {
  .option:hover {
    color: var(--ink);
  }
}

@media (prefers-reduced-motion: reduce) {
  .thumb {
    transition: none;
  }
}
</style>
