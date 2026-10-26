<script setup lang="ts">
const props = defineProps<{ trialDays: number }>()

const CARDS = computed(() => [
  {
    topic: 'Começar',
    question: 'Preciso baixar algum app?',
    answer: 'Não. Tudo acontece numa conversa do WhatsApp, no celular ou no computador.',
  },
  {
    topic: 'Teste',
    question: 'Como funciona o teste grátis?',
    answer: `São ${props.trialDays} dias com tudo do Premium, contados da primeira mensagem. Não pedimos cartão. Quando acaba, o diário para de anotar até você escolher um plano, e tudo o que você registrou fica guardado.`,
  },
  {
    topic: 'Pagamento',
    question: 'Como eu pago e cancelo?',
    answer:
      'Na própria conversa: responda "assinar", escolha o plano e pague no Pix ou no cartão. Cancele quando quiser, pela conversa; o acesso continua até o fim do período pago. Nos 7 dias depois do pagamento, o reembolso sai sozinho, como prevê o Código de Defesa do Consumidor.',
  },
  {
    topic: 'Números',
    question: 'De onde vêm as calorias?',
    answer:
      'Da tabela TACO, da Unicamp; dos rótulos, pelo Open Food Facts; e do que você mesmo cadastrar. O que é estimado vem marcado como estimativa.',
  },
  {
    topic: 'Saúde',
    question: 'Ele substitui um nutricionista?',
    answer:
      'Não. O diário registra, soma e informa; não prescreve dieta nem treino. As sugestões são gerais, a partir da sua meta.',
  },
  {
    topic: 'Dados',
    question: 'E os meus dados?',
    answer:
      'Servem só para o seu diário. Diga "quero apagar minha conta" e tudo é apagado, como prevê a LGPD.',
  },
])

const open = ref(0)
</script>

<template>
  <section id="perguntas" class="faq" aria-labelledby="faq-title">
    <h2 id="faq-title" class="title display">Perguntas</h2>
    <div class="drawer">
      <div
        v-for="(card, index) in CARDS"
        :key="card.topic"
        class="card"
        :class="[`tone-${index % 3}`, { open: open === index }]"
        :style="{ '--n': index }"
      >
        <span class="tab">{{ card.topic }}</span>
        <h3 class="question">
          <button
            :id="`faq-${index}`"
            type="button"
            :aria-expanded="open === index"
            :aria-controls="`faq-answer-${index}`"
            @click="open = index"
          >
            {{ card.question }}
          </button>
        </h3>
        <p
          :id="`faq-answer-${index}`"
          class="answer"
          role="region"
          :aria-labelledby="`faq-${index}`"
          :hidden="open !== index"
        >
          {{ card.answer }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  row-gap: 3rem;
  padding: var(--gap-section) var(--margin) 0;
}

.title {
  grid-column: 3 / 11;
  font-size: var(--step-head);
}

.drawer {
  grid-column: 3 / 11;
  display: grid;
}

.card {
  position: relative;
  margin-top: -1.5rem;
  padding: 3.5rem 2rem 2.25rem;
  clip-path: polygon(
    0 2.5rem,
    calc(var(--n) * 9.375rem) 2.5rem,
    calc(var(--n) * 9.375rem + 0.75rem) 0,
    calc(var(--n) * 9.375rem + 11.75rem) 0,
    calc(var(--n) * 9.375rem + 12.5rem) 2.5rem,
    100% 2.5rem,
    100% 100%,
    0 100%
  );
}

.card:first-child {
  margin-top: 0;
}

.tone-0 {
  background: var(--tint-1);
}

.tone-1 {
  background: var(--tint-2);
}

.tone-2 {
  background: var(--raised);
}

.tab {
  position: absolute;
  top: 0.5rem;
  left: calc(var(--n) * 9.375rem + 1.25rem);
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.question button {
  width: 100%;
  min-height: 2.75rem;
  padding: 0;
  border: 0;
  background: none;
  font-size: var(--step-body);
  font-weight: 500;
  letter-spacing: -0.015em;
  text-align: left;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .card:not(.open) .question button:hover {
    text-decoration: underline;
  }
}

.answer {
  max-width: 54ch;
  padding-top: 0.75rem;
  color: var(--ink);
  animation: open 360ms var(--ease-out);
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .answer {
    animation: none;
  }
}

@media (max-width: 63.99rem) {
  .title,
  .drawer {
    grid-column: 1 / -1;
  }
}

@media (max-width: 63.99rem) {
  .card {
    padding: 3.25rem 1.25rem 1.75rem;
    clip-path: polygon(
      0 2.5rem,
      calc(var(--n) * 3rem) 2.5rem,
      calc(var(--n) * 3rem + 0.5rem) 0,
      calc(var(--n) * 3rem + 7rem) 0,
      calc(var(--n) * 3rem + 7.5rem) 2.5rem,
      100% 2.5rem,
      100% 100%,
      0 100%
    );
  }
  .tab {
    left: calc(var(--n) * 3rem + 0.875rem);
  }
}
</style>
