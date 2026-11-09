<script setup lang="ts">
const { t } = useI18n()
const anchors = useAnchors()
const menuId = useId()

const links = computed(() => [
  { to: `/#${anchors.value.how}`, label: t('nav.howItWorks') },
  { to: '/recursos', label: t('nav.features') },
  { to: '/planos', label: t('nav.plans') },
  { to: `/#${anchors.value.faq}`, label: t('nav.faq') },
])

const trigger = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()

// Like the language list, it lives in the top layer and is placed under its button on every open,
// starting at the button and never past the screen's edge.
const place = (event: Event) => {
  if ((event as ToggleEvent).newState !== 'open' || !trigger.value || !menu.value) {
    return
  }
  const box = trigger.value.getBoundingClientRect()
  const room = document.documentElement.clientWidth - 16 - (menu.value.offsetWidth || 208)
  menu.value.style.top = `${box.bottom + 8}px`
  menu.value.style.left = `${Math.max(16, Math.min(box.left, room))}px`
}

const close = () => menu.value?.hidePopover()
</script>

<template>
  <div class="site-menu">
    <button
      ref="trigger"
      type="button"
      class="trigger"
      v-bind="{ popovertarget: menuId }"
      :aria-label="t('nav.menu')"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 6h13M3.5 10h13M3.5 14h13" /></svg>
    </button>
    <div :id="menuId" ref="menu" v-bind="{ popover: 'auto' }" class="menu" @beforetoggle="place">
      <ul :aria-label="t('nav.label')">
        <li v-for="link in links" :key="link.to">
          <NuxtLinkLocale :to="link.to" class="item" @click="close">{{
            link.label
          }}</NuxtLinkLocale>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.trigger {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--tone);
  color: var(--ink);
  cursor: pointer;
  transition:
    background-color 160ms ease,
    transform 160ms var(--ease-out);
}

.trigger:active {
  transform: scale(0.97);
}

.trigger svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.7;
}

.trigger:focus-visible,
.item:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

.menu {
  position: fixed;
  inset: auto;
  margin: 0;
  padding: 0.375rem;
  border: 1px solid var(--tone);
  border-radius: 1rem;
  background: var(--card);
  color: var(--ink);
  box-shadow: 0 12px 32px rgb(16 36 26 / 0.12); /* taste-skill-ignore: a menu over the page needs to lift off it */
  opacity: 0;
  transform: scale(0.96);
  width: 13rem;
  transform-origin: top left;
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
  display: flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 0.875rem;
  border-radius: 0.75rem;
  color: var(--ink);
  font-size: var(--step-small);
  font-weight: 500;
  text-decoration: none;
  transition: background-color 160ms ease;
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
}

@supports (backdrop-filter: blur(1px)) {
  .menu {
    background: color-mix(in srgb, var(--card) 80%, transparent);
    backdrop-filter: blur(18px) saturate(1.6);
  }
}
</style>
