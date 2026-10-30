<script setup lang="ts">
const SHORT: Record<string, string> = { pt: 'BR', en: 'EN' }

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const menuId = useId()

const options = computed(() =>
  locales.value.map((each) => ({
    code: each.code,
    name: each.name ?? each.code,
    language: each.language ?? undefined,
    short: SHORT[each.code] ?? each.code.toUpperCase(),
    path: switchLocalePath(each.code),
  })),
)
const current = computed(
  () => options.value.find((option) => option.code === locale.value) ?? options.value[0],
)

const trigger = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()

// The list lives in the top layer, away from the button: it is placed under it on every open.
const place = (event: Event) => {
  if ((event as ToggleEvent).newState !== 'open' || !trigger.value || !menu.value) {
    return
  }
  const box = trigger.value.getBoundingClientRect()
  menu.value.style.top = `${box.bottom + 8}px`
  menu.value.style.right = `${document.documentElement.clientWidth - box.right}px`
}

const close = () => menu.value?.hidePopover()
</script>

<template>
  <div class="language">
    <button
      ref="trigger"
      type="button"
      class="trigger"
      v-bind="{ popovertarget: menuId }"
      :aria-label="`${t('nav.language')}: ${current?.name}`"
    >
      <span>{{ current?.short }}</span>
      <svg class="chevron" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M3 4.5 6 7.5 9 4.5" />
      </svg>
    </button>
    <div :id="menuId" ref="menu" v-bind="{ popover: 'auto' }" class="menu" @beforetoggle="place">
      <ul :aria-label="t('nav.language')">
        <li v-for="option in options" :key="option.code">
          <NuxtLink
            :to="option.path"
            class="item"
            :hreflang="option.language"
            :lang="option.language"
            :aria-current="option.code === locale ? 'true' : undefined"
            @click="close"
          >
            <span class="code" aria-hidden="true">{{ option.short }}</span>
            <span>{{ option.name }}</span>
            <svg v-if="option.code === locale" class="check" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 2.75rem;
  padding: 0 0.75rem 0 0.875rem;
  border: 0;
  border-radius: 999px;
  background: var(--tone);
  color: var(--ink);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    transform 160ms var(--ease-out);
}

.trigger:active {
  transform: scale(0.97);
}

.trigger:focus-visible,
.item:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

.chevron {
  width: 0.75rem;
  height: 0.75rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
  transition: transform 200ms var(--ease-out);
}

.language:has(.menu:popover-open) .chevron {
  transform: rotate(180deg);
}

.menu {
  position: fixed;
  inset: auto;
  min-width: 11rem;
  margin: 0;
  padding: 0.375rem;
  border: 1px solid var(--tone);
  border-radius: 1rem;
  background: var(--card);
  color: var(--ink);
  box-shadow: 0 12px 32px rgb(16 36 26 / 0.12); /* taste-skill-ignore: a menu over the page needs to lift off it */
  opacity: 0;
  transform: scale(0.96);
  transform-origin: top right;
  transition:
    opacity 160ms var(--ease-out),
    transform 160ms var(--ease-out),
    overlay 160ms allow-discrete,
    display 160ms allow-discrete;
}

.menu:popover-open {
  opacity: 1;
  transform: none;
}

@starting-style {
  .menu:popover-open {
    opacity: 0;
    transform: scale(0.96);
  }
}

.menu ul {
  display: grid;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: grid;
  grid-template-columns: 2rem 1fr 1rem;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0 0.75rem;
  border-radius: 0.75rem;
  color: var(--ink);
  font-size: var(--step-small);
  font-weight: 500;
  text-decoration: none;
  transition: background-color 160ms ease;
}

.code {
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.check {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: var(--green);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

@media (hover: hover) and (pointer: fine) {
  .trigger:hover {
    background: color-mix(in oklab, var(--tone) 85%, var(--ink));
  }
  .item:hover {
    background: var(--tone);
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu,
  .menu:popover-open {
    transform: none;
  }
  .chevron {
    transition: none;
  }
}
</style>
