<script setup lang="ts">
const WEIGHT = [72.4, 72.3, 72.3, 72.1, 72.2, 72.0, 71.8]
const WEEK = [1820, 1690, 1760, 0, 1710, 1880, 1700]
const GOAL = 1800
const FLOOR = 1200
const CEILING = 2000

const weightPath = computed(() => {
  const max = 72.5
  const min = 71.7
  return WEIGHT.map((value, index) => {
    const x = (index / (WEIGHT.length - 1)) * 300
    const y = ((max - value) / (max - min)) * 100
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
})
</script>

<template>
  <section id="do-seu-jeito" class="bento" aria-labelledby="bento-title">
    <div class="intro" data-reveal>
      <h2 id="bento-title" class="title">Tudo o que importa, numa conversa</h2>
      <p>
        Comida, treino, peso e jejum ficam no mesmo diário. Você pergunta, ele responde com os seus
        números.
      </p>
    </div>

    <div class="grid">
      <article class="tile day" data-ui>
        <p class="tile-title">Meta do dia</p>
        <CalorieRing :eaten="1240" :goal="1800" :size="208" />
        <p class="tile-text">Cada registro mostra o total do dia e quanto ainda cabe.</p>
      </article>

      <article class="tile week" data-ui>
        <p class="tile-title">Resumo da semana</p>
        <div
          class="bars"
          role="img"
          aria-label="Calorias de cada dia da semana, perto da meta de 1.800"
        >
          <span
            v-for="(value, index) in WEEK"
            :key="index"
            class="bar"
            :class="{ over: value > GOAL, missing: value === 0 }"
            :style="{
              '--h': value === 0 ? '4%' : `${((value - FLOOR) / (CEILING - FLOOR)) * 100}%`,
            }"
          />
          <span
            class="goal-line"
            :style="{ '--g': `${((GOAL - FLOOR) / (CEILING - FLOOR)) * 100}%` }"
          />
        </div>
        <p class="tile-text">Média de 1.760 kcal, 6 de 7 dias registrados. Chega toda segunda.</p>
      </article>

      <article class="tile weight" data-ui>
        <p class="tile-title">Peso</p>
        <p class="big">71,8 kg <span class="delta">-0,6 kg</span></p>
        <svg viewBox="0 0 300 100" class="line" aria-hidden="true" preserveAspectRatio="none">
          <path :d="weightPath" />
        </svg>
        <p class="tile-text">A evolução desde o primeiro registro, ou dos últimos 30 ou 90 dias.</p>
      </article>

      <article class="tile photo">
        <img
          src="/images/lanche.jpg"
          alt="Mãos cortando uma maçã ao lado de frutas e salada numa mesa clara"
          width="1024"
          height="684"
          loading="lazy"
        />
        <p class="photo-caption">Foto do prato: você confere e ele registra. No Premium.</p>
      </article>

      <article class="tile workout" data-ui>
        <p class="tile-title">Treino</p>
        <ul class="sets">
          <li><span>Supino reto</span><span>3 × 8 · 60 kg</span></li>
          <li><span>Corrida</span><span>30 min</span></li>
        </ul>
        <p class="burn">Cerca de 410 kcal gastas</p>
        <p class="tile-text">Estimativa pelo Compendium of Physical Activities.</p>
      </article>

      <article class="tile fasting" data-ui>
        <p class="tile-title">Jejum 16:8</p>
        <p class="big">12:00</p>
        <p class="tile-text">Começou às 20:00. O aviso chega quando a janela terminar.</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.bento {
  display: grid;
  gap: 3rem;
  padding: var(--gap-section) var(--margin) 0;
}

.intro {
  display: grid;
  gap: 1rem;
  max-width: 44rem;
}

.title {
  font-size: var(--step-head);
}

.intro p {
  max-width: 46ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(15rem, auto);
  gap: 0.75rem;
}

.tile {
  display: grid;
  align-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: var(--radius);
  background: var(--card);
  overflow: hidden;
}

.tile-title {
  font-weight: 700;
}

.tile-text {
  max-width: 34ch;
  color: var(--muted);
  font-size: var(--step-small);
}

.day {
  grid-column: 1 / 5;
  grid-row: span 2;
  justify-items: center;
  background: var(--mint);
}

.day .tile-title,
.day .tile-text {
  justify-self: start;
}

.week {
  grid-column: 5 / 10;
}

.weight {
  grid-column: 10 / 13;
  background: var(--sky);
}

.photo {
  grid-column: 5 / 8;
  position: relative;
  padding: 0;
  align-content: end;
}

.photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-caption {
  position: relative;
  margin: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.875rem;
  background: var(--card);
  font-size: var(--step-small);
  font-weight: 500;
}

.workout {
  grid-column: 8 / 11;
  background: var(--peach);
}

.fasting {
  grid-column: 11 / 13;
  background: var(--sand);
}

.bars {
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  gap: 0.5rem;
  height: 7.5rem;
}

.bar {
  height: var(--h);
  border-radius: 0.375rem;
  background: var(--green);
  transform-origin: bottom;
}

.bar.over {
  background: var(--carbs);
}

.bar.missing {
  background: var(--tone);
}

@media (prefers-reduced-motion: no-preference) {
  .js .bento .bar {
    animation: grow 900ms var(--ease-out) both;
  }
  .bar:nth-child(2) {
    animation-delay: 60ms;
  }
  .bar:nth-child(3) {
    animation-delay: 120ms;
  }
  .bar:nth-child(4) {
    animation-delay: 180ms;
  }
  .bar:nth-child(5) {
    animation-delay: 240ms;
  }
  .bar:nth-child(6) {
    animation-delay: 300ms;
  }
  .bar:nth-child(7) {
    animation-delay: 360ms;
  }
}

@keyframes grow {
  from {
    transform: scaleY(0.1);
  }
}

.goal-line {
  position: absolute;
  inset: auto 0 var(--g);
  height: 2px;
  background: var(--ink);
  opacity: 0.35;
}

.big {
  font-size: var(--step-head);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.delta {
  color: #0f5c3c;
  font-size: var(--step-body);
  font-weight: 500;
  letter-spacing: 0;
}

.line {
  width: 100%;
  height: 4.5rem;
  overflow: visible;
}

.line path {
  fill: none;
  stroke: var(--fat);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.sets {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step-small);
}

.sets li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.fasting .big {
  font-size: clamp(2rem, 1rem + 2vw, 3rem);
}

.burn {
  font-size: var(--step-lead);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

@media (max-width: 63.99rem) {
  .grid {
    grid-template-columns: repeat(6, 1fr);
  }
  .day {
    grid-column: 1 / 4;
  }
  .week {
    grid-column: 4 / 7;
  }
  .weight {
    grid-column: 4 / 7;
  }
  .photo {
    grid-column: 1 / 4;
    min-height: 15rem;
  }
  .workout {
    grid-column: 4 / 7;
  }
  .fasting {
    grid-column: 1 / 7;
  }
}

@media (max-width: 47.99rem) {
  .grid {
    grid-template-columns: 1fr;
  }
  .day,
  .week,
  .weight,
  .photo,
  .workout,
  .fasting {
    grid-column: 1;
    grid-row: auto;
  }
}
</style>
