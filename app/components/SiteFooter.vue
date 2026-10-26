<script setup lang="ts">
import { brand } from '~/brand'

const consent = useConsent()
</script>

<template>
  <footer class="footer">
    <img class="photo" src="/images/corrida.jpg" alt="" width="1600" height="1200" loading="lazy" />
    <div class="top">
      <ul class="links">
        <li><NuxtLink to="/planos">Planos</NuxtLink></li>
        <li><NuxtLink to="/termos">Termos</NuxtLink></li>
        <li><NuxtLink to="/privacidade">Privacidade</NuxtLink></li>
        <li><NuxtLink to="/creditos">Créditos</NuxtLink></li>
        <li v-if="consent.needed">
          <button type="button" class="link" @click="consent.reopen()">Cookies</button>
        </li>
      </ul>
      <p class="contact">
        {{ brand.name }}: diário de dieta e treino no WhatsApp<br />
        <a :href="`mailto:${brand.company.email}`">{{ brand.company.email }}</a>
      </p>
    </div>
    <div class="bottom">
      <p class="name" aria-hidden="true">{{ brand.name.toLowerCase() }}</p>
      <p class="legal">© 2026 {{ brand.company.name }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100svh;
  overflow: hidden;
  padding: 2rem var(--margin) 2rem;
  color: var(--paper);
}

.photo {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6);
}

.top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem 3rem;
}

.links {
  display: grid;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links a,
.link {
  text-decoration: none;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .links a:hover,
  .link:hover,
  .contact a:hover {
    text-decoration: underline;
  }
}

.contact {
  text-align: right;
}

.contact a {
  text-decoration: none;
}

.bottom {
  grid-row: 3;
  display: grid;
  gap: 0.75rem;
}

.name {
  font-size: clamp(5rem, 1rem + 17vw, 18rem);
  font-weight: 500;
  line-height: 0.8;
  letter-spacing: -0.06em;
  white-space: nowrap;
}

.legal {
  font-size: var(--step-small);
}

@media (max-width: 47.99rem) {
  .footer {
    min-height: 88svh;
  }
  .contact {
    text-align: left;
  }
  .name {
    font-size: 24vw;
  }
}
</style>
