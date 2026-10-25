<script setup lang="ts">
import { brand } from '~/brand'

const FIRST = {
  trial: brand.whatsappGreeting,
  plans: 'Oi! Quero ver os planos',
} as const

const intent = ref<keyof typeof FIRST>('trial')
const message = ref<string>(FIRST.trial)
watch(intent, (value) => {
  message.value = FIRST[value]
})

const href = useWhatsAppLink(message)
const { $analytics } = useNuxtApp()
</script>

<template>
  <section class="start" aria-labelledby="comece">
    <div class="closing">
      <h2 id="comece" class="line">Comece pelo almoço</h2>
      <p>
        O WhatsApp abre com a mensagem escrita. Mande, e os 7 dias grátis começam ali, sem cadastro
        e sem cartão.
      </p>
    </div>
    <div class="dialog" data-ui>
      <p class="dialog-title">Nova conversa com {{ brand.name }}</p>
      <div class="segmented" role="group" aria-label="O que você quer">
        <button type="button" :aria-pressed="intent === 'trial'" @click="intent = 'trial'">
          Testar grátis
        </button>
        <button type="button" :aria-pressed="intent === 'plans'" @click="intent = 'plans'">
          Ver os planos
        </button>
      </div>
      <label class="field">
        <span>Sua primeira mensagem</span>
        <textarea v-model="message" rows="3" maxlength="300" />
      </label>
      <a
        class="send"
        :href="href"
        target="_blank"
        rel="noopener"
        @click="$analytics?.lead('start')"
      >
        Abrir no WhatsApp
      </a>
    </div>
  </section>
</template>

<style scoped>
.start {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1.5rem;
  align-items: center;
  min-height: 90svh;
  margin-top: clamp(6rem, 3rem + 6vw, 10rem);
  padding: 2.5rem var(--margin);
  background: var(--field);
  color: var(--field-ink);
}

.closing {
  grid-column: 1 / 6;
  align-self: end;
  display: grid;
  gap: 1.25rem;
}

.line {
  font-size: clamp(3.5rem, 1rem + 6vw, 7rem);
  line-height: 0.92;
  letter-spacing: -0.03em;
}

.closing p {
  max-width: 34ch;
}

.dialog {
  grid-column: 7 / 12;
  display: grid;
  gap: 1rem;
  width: min(100%, 27.5rem);
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--bg);
  color: var(--ink);
  font-size: 0.9375rem;
  box-shadow: 0 24px 48px rgb(0 0 0 / 0.22); /* taste-skill-ignore: the product dialog casts its own shadow (data-ui fragment) */
}

.dialog-title {
  font-weight: 500;
  font-size: 1.0625rem;
}

.segmented {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.25rem;
  border-radius: 0.625rem;
  background: var(--surface);
  color: var(--muted);
}

.segmented button {
  min-height: 2.5rem;
  border: 0;
  border-radius: 0.5rem;
  background: none;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition:
    background-color 180ms ease,
    transform 140ms var(--ease-out);
}

.segmented button[aria-pressed='true'] {
  background: var(--bg);
  color: var(--ink);
  font-weight: 500;
}

.segmented button:active {
  transform: scale(0.97);
}

.field {
  display: grid;
  gap: 0.375rem;
  color: var(--muted);
}

textarea {
  padding: 0.75rem;
  border: 1px solid color-mix(in oklab, var(--ink) 22%, transparent);
  border-radius: 0.5rem;
  background: var(--bg);
  color: var(--ink);
  font: inherit;
  font-size: 16px;
  resize: none;
}

.send {
  display: grid;
  place-items: center;
  min-height: 3.25rem;
  border-radius: 0.625rem;
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 500;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  transition: transform 140ms var(--ease-out);
}

.send:active {
  transform: scale(0.97);
}

@media (max-width: 63.99rem) {
  .start {
    grid-template-columns: 1fr;
    align-content: space-between;
    row-gap: 2.5rem;
    min-height: 84svh;
    padding: 1.5rem 1rem;
  }
  .closing,
  .dialog {
    grid-column: 1;
  }
  .closing {
    align-self: start;
  }
  .line {
    font-size: 13vw;
  }
  .dialog {
    width: 100%;
  }
  .send {
    min-height: 3.25rem;
  }
}
</style>
