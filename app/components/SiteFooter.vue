<script setup lang="ts">
import { brand } from '~/brand'

const consent = useConsent()
const { t } = useI18n()
const anchors = useAnchors()
const locale = useSiteLocale()
</script>

<template>
  <footer class="footer">
    <div class="top">
      <div class="brand">
        <NuxtLinkLocale to="/" class="wordmark">
          <span class="mark" aria-hidden="true" />{{ brand.name.toLowerCase() }}
        </NuxtLinkLocale>
        <p class="tagline">{{ brand.tagline[locale] }}</p>
      </div>
      <nav class="columns" :aria-label="t('footer.label')">
        <div class="column">
          <p class="column-title">{{ t('footer.product') }}</p>
          <ul>
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
        </div>
        <div class="column">
          <p class="column-title">{{ t('footer.company') }}</p>
          <ul>
            <li>
              <NuxtLinkLocale to="/termos">{{ t('footer.terms') }}</NuxtLinkLocale>
            </li>
            <li>
              <NuxtLinkLocale to="/privacidade">{{ t('footer.privacy') }}</NuxtLinkLocale>
            </li>
            <li>
              <NuxtLinkLocale to="/creditos">{{ t('footer.credits') }}</NuxtLinkLocale>
            </li>
            <li>
              <NuxtLinkLocale to="/contato">{{ t('footer.contact') }}</NuxtLinkLocale>
            </li>
            <li v-if="consent.needed">
              <button type="button" class="link" @click="consent.reopen()">
                {{ t('footer.cookies') }}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <p class="legal">© 2026 {{ brand.company.name }}</p>
  </footer>
</template>

<style scoped>
.footer {
  display: grid;
  gap: clamp(3rem, 2rem + 4vw, 6rem);
  margin-top: var(--gap-section);
  padding: clamp(3.5rem, 2rem + 4vw, 6rem) var(--margin) 2.5rem;
  background: var(--ink);
  color: #ffffff;
  font-size: var(--step-small);
}

.footer :focus-visible {
  outline-color: var(--mint);
}

.top {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 3rem;
}

.brand {
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 1rem;
}

.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-size: var(--step-title);
  font-weight: 700;
  letter-spacing: -0.045em;
  text-decoration: none;
}

.mark {
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background: var(--green);
  box-shadow: inset 0 0 0 0.22em var(--mint); /* taste-skill-ignore: a ring drawn as the logo mark, not a shadow */
}

.tagline {
  max-width: 24ch;
  color: #c3cfc9;
  font-size: var(--step-body);
}

.columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
}

.column {
  display: grid;
  align-content: start;
  gap: 1rem;
}

.column-title {
  color: #c3cfc9;
}

.column ul {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.column a,
.link {
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
  color: #ffffff;
  font-weight: 500;
  text-decoration: none;
  transition: color 160ms ease;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .column a:hover,
  .link:hover {
    color: var(--mint);
  }
}

.legal {
  color: #c3cfc9;
}

@media (max-width: 47.99rem) {
  .top {
    grid-template-columns: 1fr;
  }
}
</style>
