<script setup lang="ts">
import { brand } from '~/brand'

const { t } = useI18n()
const anchors = useAnchors()
const { backToTop } = useHomeLink()
const account = useSiteAccount()
const signedInAs = computed(() =>
  account.value?.signedIn && account.value.scope === 'account' ? whoOf(account.value) : undefined,
)

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
  <PromoBar />
  <header class="site-header" :class="{ scrolled }">
    <a class="skip" href="#conteudo">{{ t('nav.skip') }}</a>
    <nav class="nav" :aria-label="t('nav.label')">
      <NuxtLinkLocale to="/" class="wordmark" :aria-label="brand.name" @click="backToTop">
        <img src="/brand/mark.png" alt="" width="138" height="96" class="symbol" />
        <span class="logo" aria-hidden="true"
          >{{ brand.nameParts[0] }}<span class="ally">{{ brand.nameParts[1] }}</span></span
        >
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
        <NuxtLinkLocale to="/entrar" class="account-link">
          <template v-if="signedInAs">
            <span class="visually-hidden">{{ t('nav.account') }}:</span>
            <span class="signed" aria-hidden="true" />{{ signedInAs }}
          </template>
          <template v-else>{{ t('nav.signIn') }}</template>
        </NuxtLinkLocale>
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
  position: relative;
  isolation: isolate;
  border-radius: 999px;
  font-size: var(--step-small);
  pointer-events: auto;
  transition: box-shadow 240ms var(--ease-out);
}

/* The fill lives on its own layer: faint at the top, firming up with the first 160px of scroll. */
.nav::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: var(--card);
  opacity: 0.45;
  transition: opacity 400ms var(--ease-in-out);
}

.scrolled .nav::before {
  opacity: 1;
}

@supports (animation-timeline: scroll()) {
  .nav::before {
    animation: nav-firm ease-in-out both;
    animation-timeline: scroll(root);
    animation-range: 0 160px;
  }
}

@keyframes nav-firm {
  from {
    opacity: 0.45;
  }
  to {
    opacity: 1;
  }
}

.scrolled .nav {
  box-shadow: /* taste-skill-ignore: the owner's floating header, lifted only while content passes under it */
    0 1px 2px rgb(0 23 36 / 0.06),
    0 10px 30px -12px rgb(0 23 36 / 0.18);
}

.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: start;
  color: var(--ink);
  text-decoration: none;
}

.symbol {
  width: auto;
  height: 1.75rem;
}

.logo {
  font-size: 1.4375rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}

.ally {
  color: var(--green-mark);
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
  white-space: nowrap;
}

.phone-menu {
  display: none;
}

.account-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0 0.75rem;
  border-radius: 999px;
  color: var(--muted);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: color 160ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .account-link:hover {
    color: var(--ink);
  }
}

.signed {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--green-mark);
}

@media (max-width: 71.99rem) {
  .nav {
    grid-template-columns: 1fr auto;
  }
  .links,
  .account-link {
    display: none;
  }
  .phone-menu {
    display: block;
  }
}

/* On a phone the mark stands alone: the name would run under the menu buttons. */
@media (max-width: 30rem) {
  .logo {
    display: none;
  }
  .symbol {
    height: 1.875rem;
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
