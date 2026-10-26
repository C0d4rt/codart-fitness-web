<script setup lang="ts">
const props = defineProps<{ trialDays: number }>()

const QUESTIONS = computed(() => [
  {
    question: 'Preciso baixar algum app?',
    answer: 'Não. Tudo acontece numa conversa do WhatsApp, no celular ou no computador.',
  },
  {
    question: 'Como funciona o teste grátis?',
    answer: `São ${props.trialDays} dias com tudo do Premium, contados da primeira mensagem. Não pedimos cartão.`,
  },
  {
    question: 'E quando o teste acaba?',
    answer:
      'O diário para de anotar até você escolher um plano. Tudo o que você registrou fica guardado e volta inteiro ao assinar.',
  },
  {
    question: 'Como eu pago e cancelo?',
    answer:
      'Na própria conversa: responda "assinar", escolha o plano e pague no Pix ou no cartão. Cancele quando quiser; o acesso continua até o fim do período pago.',
  },
  {
    question: 'E se eu me arrepender?',
    answer:
      'Nos 7 dias depois do pagamento, peça o reembolso na conversa e ele sai sozinho, como prevê o Código de Defesa do Consumidor.',
  },
  {
    question: 'De onde vêm as calorias?',
    answer:
      'Da tabela TACO, da Unicamp; dos rótulos, pelo Open Food Facts; e do que você mesmo cadastrar. O que é estimado vem marcado como estimativa.',
  },
  {
    question: 'Ele substitui um nutricionista?',
    answer:
      'Não. O diário registra, soma e informa; não prescreve dieta nem treino. As sugestões são gerais, a partir da sua meta.',
  },
  {
    question: 'E os meus dados?',
    answer:
      'Servem só para o seu diário. Diga "quero apagar minha conta" e tudo é apagado, como prevê a LGPD.',
  },
])
</script>

<template>
  <section id="perguntas" class="faq" aria-labelledby="faq-title">
    <div class="head">
      <h2 id="faq-title" class="title">Perguntas frequentes</h2>
      <p>Não achou a sua? Pergunte na própria conversa.</p>
    </div>
    <div class="list">
      <details
        v-for="(each, index) in QUESTIONS"
        :key="each.question"
        name="faq"
        :open="index === 0"
      >
        <summary>
          <span>{{ each.question }}</span>
          <span class="plus" aria-hidden="true" />
        </summary>
        <p>{{ each.answer }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: 3rem;
  align-items: start;
  padding: var(--gap-section) var(--margin) 0;
}

.head {
  position: sticky;
  top: 6rem;
  display: grid;
  gap: 1rem;
}

.title {
  max-width: 10ch;
  font-size: var(--step-head);
}

.head p {
  color: var(--muted);
}

.list {
  display: grid;
  gap: 0.5rem;
}

details {
  border-radius: 1.125rem;
  background: var(--card);
  transition: background-color 220ms ease;
}

details[open] {
  background: var(--mint);
}

summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  min-height: 4.5rem;
  padding: 0 1.5rem;
  font-size: var(--step-body);
  font-weight: 700;
  letter-spacing: -0.015em;
  list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

.plus {
  position: relative;
  flex: none;
  width: 1rem;
  height: 1rem;
}

.plus::before,
.plus::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 3px;
  margin-top: -1.5px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 220ms var(--ease-out);
}

.plus::after {
  transform: rotate(90deg);
}

details[open] .plus::after {
  transform: rotate(0deg);
}

details p {
  max-width: 56ch;
  padding: 0 1.5rem 1.5rem;
  color: var(--ink);
}

details[open] p {
  animation: open 320ms var(--ease-out);
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}

@media (hover: hover) and (pointer: fine) {
  details:not([open]):hover {
    background: color-mix(in oklab, var(--card) 70%, var(--mint));
  }
}

@media (prefers-reduced-motion: reduce) {
  details[open] p {
    animation: none;
  }
}

@media (max-width: 63.99rem) {
  .faq {
    grid-template-columns: 1fr;
  }
  .head {
    position: static;
  }
  .title {
    max-width: none;
  }
}
</style>
