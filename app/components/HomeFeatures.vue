<script setup lang="ts">
import { goalScreen, LOG_MODES, type LogMode, logModeScreen, reminderScreen } from '#shared/screens'

const mode = useState<LogMode>('mode', () => 'text')
const goal = useState('goal', () => 1800)
const reminders = useState('reminders', () => true)
const stage = useStage()

watch(mode, (value) => (stage.value = logModeScreen(value)))
watch(goal, (value) => (stage.value = goalScreen(value)))
watch(reminders, (value) => (stage.value = reminderScreen(value)))

const thousands = (value: number) => value.toLocaleString('pt-BR')
</script>

<template>
  <section id="do-seu-jeito" class="features">
    <h2 class="heading">Do jeito mais fácil</h2>

    <div class="block" data-stage="mode">
      <p class="sentence">Texto, áudio ou foto.</p>
      <p>
        Escreva como falaria, grave um áudio no caminho ou fotografe o prato. A foto do prato é do
        Premium, e o teste tem tudo.
      </p>
      <div class="segmented" role="group" aria-label="Como registrar">
        <button
          v-for="each in LOG_MODES"
          :key="each.id"
          type="button"
          :aria-pressed="mode === each.id"
          @click="mode = each.id"
        >
          {{ each.name }}
        </button>
      </div>
      <div class="inline-stage"><ChatWindow :screen="logModeScreen(mode)" /></div>
    </div>

    <div class="block" data-stage="goal">
      <p class="sentence">A meta é sua.</p>
      <p>
        Ela sai de uma conta com o seu peso, a altura, a idade e a atividade, e muda pela conversa
        quando você quiser. Arraste e veja a resposta.
      </p>
      <label class="slider">
        <span>Meta do dia: {{ thousands(goal) }} kcal</span>
        <input v-model.number="goal" type="range" min="1200" max="3000" step="50" />
      </label>
      <div class="inline-stage"><ChatWindow :screen="goalScreen(goal)" /></div>
    </div>

    <div class="block" data-stage="reminder">
      <p class="sentence">Um lembrete, e só um.</p>
      <p>
        Se você some por um dia, chega uma mensagem curta para retomar. Não quer? Responda "parar".
      </p>
      <label class="toggle">
        <input v-model="reminders" type="checkbox" role="switch" />
        <span>Lembretes {{ reminders ? 'ligados' : 'desligados' }}</span>
      </label>
      <div class="inline-stage"><ChatWindow :screen="reminderScreen(reminders)" /></div>
    </div>
  </section>
</template>

<style scoped>
.features {
  display: grid;
  gap: 4.5rem;
}

.heading {
  font-size: var(--step-head);
}

.block {
  display: grid;
  gap: 1.25rem;
  min-height: 50vh;
  align-content: start;
}

.sentence {
  font-family: var(--font-display);
  font-size: var(--step-lead);
  line-height: 1.15;
}

.segmented {
  display: inline-grid;
  grid-auto-flow: column;
  justify-self: start;
  background: var(--surface);
}

.segmented button {
  min-width: 6.5rem;
  min-height: 2.75rem;
  padding: 0 1rem;
  border: 0;
  background: none;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 140ms var(--ease-out);
}

.segmented button[aria-pressed='true'] {
  background: var(--accent);
  color: var(--accent-ink);
}

.segmented button:active {
  transform: scale(0.97);
}

.slider {
  display: grid;
  gap: 0.5rem;
  max-width: 26rem;
}

.slider input {
  width: 100%;
  accent-color: var(--accent);
  min-height: 2.75rem;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  justify-self: start;
  min-height: 2.75rem;
  cursor: pointer;
}

.toggle input {
  width: 1.375rem;
  height: 1.375rem;
  accent-color: var(--accent);
}
</style>
