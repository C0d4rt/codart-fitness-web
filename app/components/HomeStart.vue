<script setup lang="ts">
import { brand } from '~/brand'

const href = useWhatsAppLink(() => brand.whatsappGreeting)
const { $analytics } = useNuxtApp()
</script>

<template>
  <section class="start" aria-labelledby="comece">
    <div class="strip" aria-hidden="true">
      <img src="/images/brunch.jpg" alt="" width="1600" height="1100" loading="lazy" />
      <img src="/images/halter.jpg" alt="" width="1400" height="931" loading="lazy" />
      <img src="/images/frutas.jpg" alt="" width="1400" height="941" loading="lazy" />
    </div>
    <div class="band" data-reveal>
      <h2 id="comece" class="title">Comece pelo almoço de hoje.</h2>
      <p class="statement">
        <a :href="href" target="_blank" rel="noopener" @click="$analytics?.lead('start')"
          >Mande um oi no WhatsApp</a
        >
        e teste por 7 dias, com tudo do Premium.
      </p>
      <p class="small">
        O WhatsApp abre com a mensagem escrita. Sem cadastro, sem cartão e sem app novo.
      </p>
    </div>
  </section>
</template>

<style scoped>
.start {
  margin-top: 0;
}

.strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.strip img {
  width: 100%;
  height: 40svh;
  object-fit: cover;
}

.band {
  display: grid;
  align-content: center;
  gap: 1.5rem;
  min-height: 44svh;
  padding: 4rem var(--margin);
  background: var(--ink);
  color: var(--paper);
}

.title {
  max-width: 14ch;
  font-size: var(--step-head);
}

.statement {
  max-width: 30ch;
  font-size: var(--step-lead);
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.statement a {
  text-decoration-thickness: 2px;
  text-underline-offset: 0.18em;
  transition: color 200ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .statement a:hover {
    color: #b9d8c6;
  }
}

.small {
  max-width: 40ch;
  color: #c4ccc7;
  font-size: var(--step-small);
}

@media (max-width: 47.99rem) {
  .strip {
    grid-template-columns: 1fr 1fr;
  }
  .strip img:first-child {
    grid-column: 1 / -1;
    height: auto;
    aspect-ratio: 4 / 3;
  }
  .strip img:not(:first-child) {
    height: auto;
    aspect-ratio: 1;
  }
}
</style>
