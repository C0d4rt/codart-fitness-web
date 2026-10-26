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
    question: 'Como eu pago?',
    answer: 'Na própria conversa: responda "assinar", escolha o plano e pague no Pix ou no cartão.',
  },
  {
    question: 'Posso cancelar?',
    answer: 'Quando quiser, pela conversa. O acesso continua até o fim do período pago.',
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
  {
    question: 'Ele entende áudio e foto?',
    answer:
      'Áudio, em todos os planos. Foto do prato, do rótulo e do código de barras, no Premium e no teste.',
  },
])
</script>

<template>
  <section id="perguntas" class="faq" data-chapter="paper">
    <h2 class="heading">Perguntas</h2>
    <dl class="rows">
      <div v-for="each in QUESTIONS" :key="each.question" class="row" data-reveal>
        <dt class="question">{{ each.question }}</dt>
        <dd class="answer">{{ each.answer }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  gap: 3rem;
  padding: var(--gap-section) var(--margin) 0;
}

.heading,
.question {
  font-size: var(--step-lead);
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.heading {
  color: var(--green-ink);
}

.rows {
  display: grid;
  gap: 4rem;
  margin: 0;
}

.row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1.5rem;
  align-items: baseline;
}

.question {
  grid-column: 1 / 7;
  font-weight: 500;
}

.answer {
  grid-column: 8 / 13;
  max-width: 42ch;
  margin: 0;
  line-height: 1.55;
}

@media (max-width: 63.99rem) {
  .rows {
    gap: 3rem;
  }
  .row {
    grid-template-columns: 1fr;
    row-gap: 0.75rem;
  }
  .question,
  .answer {
    grid-column: 1;
  }
  .heading,
  .question {
    font-size: 1.5rem;
  }
}
</style>
