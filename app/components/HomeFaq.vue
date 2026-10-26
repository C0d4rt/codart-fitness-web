<script setup lang="ts">
import { brand } from '~/brand'

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
  <section id="perguntas" class="faq" aria-labelledby="faq-title">
    <div class="column">
      <h2 id="faq-title" class="title">Perguntas</h2>
      <ul class="facts">
        <li>Sem app novo: tudo no WhatsApp.</li>
        <li>{{ trialDays }} dias grátis, sem cartão.</li>
        <li>Pix ou cartão, na própria conversa.</li>
      </ul>
      <div class="questions">
        <details v-for="each in QUESTIONS" :key="each.question">
          <summary>
            <span>{{ each.question }}</span>
            <span class="chevron" aria-hidden="true" />
          </summary>
          <p>{{ each.answer }}</p>
        </details>
      </div>
      <div class="actions">
        <WhatsAppButton location="faq" />
        <a :href="`mailto:${brand.company.email}`" class="link">Escrever para nós</a>
      </div>
    </div>
    <div class="pictures">
      <figure class="tall">
        <img
          src="/images/refeicao.jpg"
          alt="Uma pessoa comendo uma salada de beterraba numa mesa de madeira"
          width="1400"
          height="934"
          loading="lazy"
        />
      </figure>
      <figure class="square">
        <img
          src="/images/iogurte.jpg"
          alt="Uma tigela de iogurte com frutas"
          width="1100"
          height="1650"
          loading="lazy"
        />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  padding: 0 var(--margin) 5rem;
  background: var(--surface);
}

.column {
  grid-column: 1 / 6;
  display: grid;
  align-content: start;
  gap: 2rem;
  padding-top: 6rem;
}

.title {
  font-size: var(--step-head);
}

.facts {
  display: grid;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-body);
}

.questions {
  display: grid;
  gap: 1.75rem;
}

summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 2.75rem;
  font-size: var(--step-body);
  font-weight: 500;
  letter-spacing: -0.02em;
  list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

.chevron {
  position: relative;
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
  transition: transform 260ms var(--ease-out);
}

.chevron::before,
.chevron::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 0.5rem;
  height: 2px;
  background: currentColor;
}

.chevron::before {
  left: 0;
  transform: rotate(40deg);
}

.chevron::after {
  right: 0;
  transform: rotate(-40deg);
}

details[open] .chevron {
  transform: rotate(180deg);
}

details p {
  max-width: 44ch;
  padding-top: 0.5rem;
  color: var(--muted);
  font-size: var(--step-body);
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
  summary:hover span:first-child {
    text-decoration: underline;
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.link {
  font-weight: 500;
}

.pictures {
  grid-column: 7 / 13;
  position: relative;
  align-self: start;
  margin-top: -4rem;
}

.tall {
  overflow: hidden;
}

.tall img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}

.square {
  position: absolute;
  bottom: 2.5rem;
  left: -2.5rem;
  width: 33%;
  overflow: hidden;
}

.square img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

@media (prefers-reduced-motion: reduce) {
  details[open] p {
    animation: none;
  }
}

@media (max-width: 47.99rem) {
  .faq {
    display: flex;
    flex-direction: column-reverse;
    gap: 2rem;
  }
  .pictures {
    margin-top: 0;
    padding-top: 3rem;
  }
  .tall img {
    aspect-ratio: 4 / 5;
  }
  .square {
    left: auto;
    right: -0.5rem;
    bottom: -1.5rem;
    width: 38%;
  }
  .column {
    padding-top: 2rem;
  }
  .actions :deep(.button) {
    width: 100%;
  }
}
</style>
