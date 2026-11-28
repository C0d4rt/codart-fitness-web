<script setup lang="ts">
import { brand } from '~/brand'

const consent = useConsent()
const { t } = useI18n()
const anchors = useAnchors()
const { backToTop } = useHomeLink()
const locale = useSiteLocale()
</script>

<template>
  <footer class="footer" data-cta>
    <div class="top">
      <div class="brand">
        <NuxtLinkLocale to="/" class="wordmark" :aria-label="brand.name" @click="backToTop">
          <img src="/brand/mark.svg" alt="" width="1169" height="636" class="symbol" />
          <span class="logo" aria-hidden="true"
            >{{ brand.nameParts[0] }}<span class="ally">{{ brand.nameParts[1] }}</span></span
          >
        </NuxtLinkLocale>
        <p class="tagline">{{ brand.tagline[locale] }}</p>
        <ul class="social">
          <li>
            <a
              :href="brand.social.instagram[locale]"
              target="_blank"
              rel="noopener"
              :aria-label="t('footer.instagram', { name: brand.name })"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.25" cy="6.75" r="0.6" class="dot" />
              </svg>
            </a>
          </li>
          <li>
            <a
              :href="brand.social.facebook"
              target="_blank"
              rel="noopener"
              :aria-label="t('footer.facebook', { name: brand.name })"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 4H14a3.5 3.5 0 0 0-3.5 3.5V20M7.5 10.5h7" />
              </svg>
            </a>
          </li>
        </ul>
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
            <li>
              <NuxtLinkLocale to="/assinar">{{ t('footer.subscribe') }}</NuxtLinkLocale>
            </li>
            <li>
              <NuxtLinkLocale to="/entrar">{{ t('nav.signIn') }}</NuxtLinkLocale>
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
    <p class="legal">
      <span>© 2026 {{ brand.company.name }}</span>
      <span>{{ t('footer.cnpj', { cnpj: brand.company.cnpj }) }}</span>
      <span>{{ brand.company.city[locale] }}</span>
    </p>
  </footer>
</template>

<style scoped>
.footer {
  display: grid;
  gap: clamp(3rem, 2rem + 4vw, 6rem);
  margin-top: var(--gap-section);
  padding: clamp(3.5rem, 2rem + 4vw, 6rem) var(--margin) 2.5rem;
  background: var(--black);
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
  gap: 0.75rem;
  text-decoration: none;
}

.symbol {
  width: auto;
  height: 2.5rem;
}

.logo {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}

.ally {
  color: #04db60;
}

.tagline {
  max-width: 24ch;
  color: #c3cfc9;
  font-size: var(--step-body);
}

.social {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.social a {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid rgb(255 255 255 / 0.16);
  border-radius: 0.75rem;
  color: #c3cfc9;
  transition:
    color 160ms ease,
    border-color 160ms ease;
}

.social svg {
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.social .dot {
  fill: currentColor;
}

@media (hover: hover) and (pointer: fine) {
  .social a:hover {
    border-color: var(--mint);
    color: var(--mint);
  }
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  color: #c3cfc9;
}

@media (max-width: 47.99rem) {
  .top {
    grid-template-columns: 1fr;
  }
}
</style>
