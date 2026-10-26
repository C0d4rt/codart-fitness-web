<script setup lang="ts">
import { brand } from '~/brand'

const consent = useConsent()
const href = useWhatsAppLink(() => brand.whatsappGreeting)
const { $analytics } = useNuxtApp()
</script>

<template>
  <footer class="footer">
    <div class="tile statement">
      <p class="say">{{ brand.name }}: seu assistente de saúde no WhatsApp.</p>
      <p class="legal">© 2026 {{ brand.company.name }}</p>
    </div>
    <ul class="tile nav">
      <li><NuxtLink to="/planos">Planos</NuxtLink></li>
      <li><NuxtLink to="/#como-funciona">Como funciona</NuxtLink></li>
      <li><NuxtLink to="/#perguntas">Perguntas</NuxtLink></li>
    </ul>
    <ul class="tile nav">
      <li><NuxtLink to="/termos">Termos</NuxtLink></li>
      <li><NuxtLink to="/privacidade">Privacidade</NuxtLink></li>
      <li><NuxtLink to="/creditos">Créditos</NuxtLink></li>
      <li v-if="consent.needed">
        <button type="button" class="link" @click="consent.reopen()">Cookies</button>
      </li>
    </ul>
    <div class="tile contact">
      <p class="label">Contato</p>
      <a :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a>
    </div>
    <div class="tile name" aria-hidden="true">{{ brand.name.toLowerCase() }}</div>
    <a
      class="tile invite"
      :href="href"
      target="_blank"
      rel="noopener"
      @click="$analytics?.lead('footer')"
    >
      <span>Testar 7 dias grátis</span>
      <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" />
      </svg>
    </a>
  </footer>
</template>

<style scoped>
.footer {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0.5rem;
  margin-top: var(--gap-section);
  padding: 0 0.75rem 0.75rem;
}

.tile {
  margin: 0;
  padding: 1.5rem;
  border-radius: var(--radius);
  background: var(--card);
  list-style: none;
}

.statement {
  grid-column: 1 / 5;
  display: grid;
  align-content: space-between;
  min-height: 13.75rem;
}

.say {
  max-width: 22ch;
  font-size: var(--step-lead);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.legal {
  color: var(--muted);
  font-size: var(--step-small);
}

.nav {
  grid-column: span 3;
  display: grid;
  align-content: start;
  gap: 0.375rem;
}

.nav a,
.link,
.contact a {
  text-decoration: none;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .nav a:hover,
  .link:hover,
  .contact a:hover {
    text-decoration: underline;
  }
}

.contact {
  grid-column: 11 / 13;
  display: grid;
  align-content: space-between;
}

.label {
  color: var(--muted);
}

.name {
  grid-column: 1 / 9;
  display: grid;
  place-items: center;
  min-height: 20rem;
  background: var(--ink);
  color: var(--mint);
  font-size: clamp(4rem, 1rem + 9vw, 10rem);
  font-weight: 700;
  letter-spacing: -0.06em;
}

.invite {
  grid-column: 9 / 13;
  display: grid;
  align-content: space-between;
  background: var(--green);
  color: var(--green-ink);
  font-size: var(--step-lead);
  font-weight: 700;
  text-decoration: none;
  transition: background-color 200ms ease;
}

.invite svg {
  justify-self: end;
  transition: transform 200ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .invite:hover {
    background: #12663f;
  }
  .invite:hover svg {
    transform: translateX(4px);
  }
}

@media (max-width: 63.99rem) {
  .statement {
    grid-column: 1 / 7;
  }
  .nav {
    grid-column: span 3;
  }
  .contact {
    grid-column: 1 / 7;
  }
  .name {
    grid-column: 1 / -1;
    min-height: 12rem;
  }
  .invite {
    grid-column: 7 / 13;
    grid-row: 2;
  }
}

@media (max-width: 47.99rem) {
  .footer {
    grid-template-columns: 1fr 1fr;
  }
  .name {
    grid-column: 1 / -1;
    grid-row: 1;
    min-height: 10rem;
  }
  .invite {
    grid-column: 1 / -1;
    grid-row: 2;
    min-height: 8rem;
  }
  .nav {
    grid-column: span 1;
  }
  .contact,
  .statement {
    grid-column: 1 / -1;
  }
}
</style>
