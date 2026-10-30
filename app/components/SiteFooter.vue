<script setup lang="ts">
import { brand } from '~/brand'

const consent = useConsent()
const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="row">
      <NuxtLinkLocale to="/" class="wordmark">
        <span class="mark" aria-hidden="true" />{{ brand.name.toLowerCase() }}
      </NuxtLinkLocale>
      <ul class="links">
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
      <p class="legal">© 2026 {{ brand.company.name }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: var(--gap-section);
  padding: 2.5rem var(--margin) 2rem;
  background: var(--card);
  font-size: var(--step-small);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem 2.5rem;
}

.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 500;
}

.links a,
.link {
  color: var(--muted);
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
  .links a:hover,
  .link:hover {
    color: var(--ink);
  }
}

.legal {
  color: var(--muted);
}
</style>
