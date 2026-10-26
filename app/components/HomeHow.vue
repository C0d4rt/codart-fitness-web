<script setup lang="ts">
const ITEMS = [
  { name: 'Arroz branco cozido', amount: '150 g', kcal: 192 },
  { name: 'Feijão carioca', amount: '1 concha, ~86 g', kcal: 65 },
  { name: 'Filé de frango grelhado', amount: '1 filé, ~100 g', kcal: 159 },
] as const

const STEPS = [
  { tone: 'mint', clause: 'Primeiro, você conta.' },
  { tone: 'sky', clause: 'Ele entende cada alimento.' },
  { tone: 'peach', clause: 'Ele soma pela tabela TACO.' },
  { tone: 'sand', clause: 'E diz quanto falta.' },
] as const
</script>

<template>
  <section id="como-funciona" class="how" aria-labelledby="how-title">
    <div v-for="(step, index) in STEPS" :key="step.tone" class="field" :class="step.tone">
      <h2 v-if="index === 0" id="how-title" class="title">Como funciona</h2>
      <div class="card" data-ui>
        <p class="card-head">Almoço · 12:41</p>
        <p v-if="index === 0" class="said">
          "almocei 150 g de arroz, uma concha de feijão e um filé de frango"
        </p>
        <ul v-else class="items">
          <li v-for="item in ITEMS" :key="item.name">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-amount">{{ item.amount }}</span>
            <span v-if="index >= 2" class="item-kcal">{{ item.kcal }} kcal</span>
          </li>
        </ul>
        <p v-if="index >= 2" class="sum"><span>Refeição</span><strong>416 kcal</strong></p>
        <p v-if="index === 3" class="left">Faltam 1.384 kcal da meta de 1.800</p>
      </div>
      <p class="clause">{{ step.clause }}</p>
    </div>
  </section>
</template>

<style scoped>
.how {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: var(--gap-section);
  padding: 0 var(--margin);
}

.field {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1.5rem;
  min-height: 34rem;
  padding: 1.75rem;
  border-radius: var(--radius);
}

.mint {
  background: var(--mint);
}

.sky {
  background: var(--sky);
}

.peach {
  background: var(--peach);
}

.sand {
  background: var(--sand);
}

.title {
  grid-row: 1;
  font-size: var(--step-lead);
}

.card {
  grid-row: 2;
  align-self: center;
  display: grid;
  gap: 0.75rem;
  padding: 1.125rem 1.25rem;
  border-radius: 1.125rem;
  background: var(--card);
  font-size: var(--step-small);
  transition: transform 150ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .field:hover .card {
    transform: translateY(-6px);
  }
}

.card-head {
  color: var(--muted);
  font-weight: 500;
}

.said {
  font-size: var(--step-body);
  line-height: 1.4;
}

.items {
  display: grid;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.items li {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 0.75rem;
}

.item-name {
  font-weight: 500;
}

.item-amount {
  grid-column: 1;
  color: var(--muted);
}

.item-kcal {
  grid-column: 2;
  grid-row: 1 / 3;
  align-self: center;
  font-variant-numeric: tabular-nums;
}

.sum {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--tone); /* taste-skill-ignore: the meal card draws its own total rule (data-ui fragment) */
}

.sum strong {
  font-variant-numeric: tabular-nums;
}

.left {
  padding: 0.5rem 0.75rem;
  border-radius: 0.625rem;
  background: var(--mint);
  color: var(--green);
  font-weight: 700;
}

.clause {
  grid-row: 3;
  font-size: var(--step-lead);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

@media (max-width: 63.99rem) {
  .how {
    grid-template-columns: 1fr 1fr;
  }
  .field {
    min-height: 28rem;
  }
}

@media (max-width: 47.99rem) {
  .how {
    grid-template-columns: 1fr;
  }
  .field {
    grid-template-rows: auto auto auto;
    min-height: 0;
  }
  .clause {
    grid-row: 2;
  }
  .card {
    grid-row: 3;
  }
  .title {
    grid-row: 1;
  }
}
</style>
