<script setup lang="ts">
import { brand } from '~/brand'

const { t } = useI18n()
const anchors = useAnchors()

const scrolled = ref(false)
let frame = 0
const measure = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => (scrolled.value = window.scrollY > 8))
}
onMounted(() => {
  measure()
  window.addEventListener('scroll', measure, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', measure)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <a class="skip" href="#conteudo">{{ t('nav.skip') }}</a>
    <nav class="nav" :aria-label="t('nav.label')">
      <NuxtLinkLocale to="/" class="wordmark">
        <span class="mark" aria-hidden="true" />{{ brand.name.toLowerCase() }}
      </NuxtLinkLocale>
      <ul class="links">
        <li>
          <NuxtLinkLocale :to="`/#${anchors.how}`">{{ t('nav.howItWorks') }}</NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale to="/recursos">{{ t('nav.features') }}</NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale to="/planos">{{ t('nav.plans') }}</NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale :to="`/#${anchors.faq}`">{{ t('nav.faq') }}</NuxtLinkLocale>
        </li>
      </ul>
      <div class="actions">
        <SiteMenu class="phone-menu" />
        <LanguageMenu />
        <WhatsAppButton location="nav" :label="t('cta.try')" class="nav-action" />
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* The header stays within reach; once the page moves under it, it frosts over what passes beneath. */
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid transparent;
  transition:
    background-color 200ms var(--ease-out),
    border-color 200ms var(--ease-out);
}

.site-header.scrolled {
  border-bottom-color: var(--tone);
  background: var(--bg);
}

@supports (backdrop-filter: blur(1px)) {
  .site-header.scrolled {
    background: color-mix(in srgb, var(--bg) 82%, transparent);
    backdrop-filter: blur(16px) saturate(1.6);
  }
}

.skip {
  position: absolute;
  top: 0.75rem;
  left: var(--margin);
  z-index: 1;
  padding: 0.625rem 1rem;
  border-radius: 999px;
  background: var(--ink);
  color: var(--bg);
  font-weight: 500;
  text-decoration: none;
  transform: translateY(-200%);
}

.skip:focus-visible {
  transform: none;
}

.nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 5rem;
  padding: 0 var(--margin);
  font-size: var(--step-small);
}

.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: start;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.mark {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background: var(--green);
  box-shadow: inset 0 0 0 0.3rem var(--mint); /* taste-skill-ignore: a ring drawn as the logo mark, not a shadow */
}

.links {
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 500;
}

.links a {
  color: var(--muted);
  text-decoration: none;
  transition: color 160ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .links a:hover {
    color: var(--ink);
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-self: end;
  gap: 0.75rem;
}

.nav-action {
  min-height: 2.75rem;
  padding: 0 1.25rem;
  font-size: var(--step-small);
}

.phone-menu {
  display: none;
}

@media (max-width: 63.99rem) {
  .nav {
    grid-template-columns: 1fr auto;
  }
  .links {
    display: none;
  }
  .phone-menu {
    display: block;
  }
}

@media (max-width: 26rem) {
  .actions {
    gap: 0.5rem;
  }
  .nav-action {
    padding: 0 0.875rem;
  }
}
</style>
