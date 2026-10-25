<script setup lang="ts">
defineProps<{ trialDays: number }>()
</script>

<template>
  <section id="perguntas" class="faq">
    <h2 class="heading">Perguntas</h2>
    <div class="text">
      <p>
        <strong>Preciso baixar algum app?</strong> Não. Tudo acontece numa conversa do WhatsApp, no
        celular ou no computador.
      </p>
      <p>
        <strong>Como funciona o teste grátis?</strong> São {{ trialDays }} dias com tudo do Premium,
        contados da primeira mensagem. Não pedimos cartão.
      </p>
      <p>
        <strong>E quando o teste acaba?</strong> O diário para de anotar até você escolher um plano.
        Tudo o que você registrou fica guardado e volta inteiro ao assinar.
      </p>
      <p>
        <strong>Como eu pago?</strong> Na própria conversa: responda "assinar", escolha o plano e
        pague no Pix ou no cartão.
      </p>
      <p>
        <strong>Posso cancelar?</strong> Quando quiser, pela conversa. O acesso continua até o fim
        do período pago.
      </p>
      <p>
        <strong>E se eu me arrepender?</strong> Nos 7 dias depois do pagamento, peça o reembolso na
        conversa e ele sai sozinho, como prevê o Código de Defesa do Consumidor.
      </p>
      <p>
        <strong>De onde vêm as calorias?</strong> Da tabela TACO, da Unicamp; dos rótulos, pelo Open
        Food Facts; e do que você mesmo cadastrar. O que é estimado vem marcado como estimativa.
      </p>
      <p>
        <strong>Ele substitui um nutricionista?</strong> Não. O diário registra, soma e informa; não
        prescreve dieta nem treino. As sugestões são gerais, a partir da sua meta.
      </p>
      <p>
        <strong>E os meus dados?</strong> Servem só para o seu diário. Diga "quero apagar minha
        conta" e tudo é apagado, como prevê a LGPD.
      </p>
      <p>
        <strong>Ele entende áudio e foto?</strong> Áudio, em todos os planos. Foto do prato, do
        rótulo e do código de barras, no Premium e no teste.
      </p>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1.5rem;
  padding: var(--gap-section) var(--margin) 0;
}

.heading {
  grid-column: 1 / 4;
  font-size: var(--step-head);
}

.text {
  grid-column: 5 / 13;
  columns: 2;
  column-gap: 3.5rem;
  line-height: 1.55;
}

.text p {
  margin-bottom: 1.25rem;
  break-inside: avoid;
}

.text strong {
  font-weight: 500;
}

@media (max-width: 63.99rem) {
  .faq {
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  .heading,
  .text {
    grid-column: 1;
  }
  .text {
    columns: 1;
    font-size: 1rem;
  }
}
</style>
