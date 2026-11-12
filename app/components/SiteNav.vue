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
/* The header floats as a pill over the page, and only casts a shadow once something passes under it. */
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  padding: 0.75rem var(--margin) 0;
  pointer-events: none;
}

.skip {
  position: absolute;
  top: 0.75rem;
  left: var(--margin);
  z-index: 1;
  padding: 0.625rem 1rem;
  border-radius: 999px;
  background: var(--ink);
  color: var(--card);
  font-weight: 500;
  text-decoration: none;
  transform: translateY(-200%);
  pointer-events: auto;
}

.skip:focus-visible {
  transform: none;
}

.nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 4rem;
  padding: 0 0.625rem 0 1.5rem;
  border-radius: 999px;
  background: var(--card);
  font-size: var(--step-small);
  pointer-events: auto;
  transition: box-shadow 240ms var(--ease-out);
}

.scrolled .nav {
  box-shadow: /* taste-skill-ignore: the owner's floating header, lifted only while content passes under it */
    0 1px 2px rgb(16 36 26 / 0.06),
    0 10px 30px -12px rgb(16 36 26 / 0.18);
}

.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: start;
  font-size: var(--step-body);
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
  gap: 0.5rem;
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
  .site-header {
    padding-inline: 0.75rem;
  }
  .nav {
    padding: 0 0.375rem 0 1.125rem;
  }
  .actions {
    gap: 0.375rem;
  }
  .nav-action {
    padding: 0 0.875rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav {
    transition: none;
  }
}

@media (forced-colors: active) {
  .nav {
    border: 1px solid CanvasText;
  }
}
</style>
