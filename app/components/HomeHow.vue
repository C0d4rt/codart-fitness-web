<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { goalScreen, logModeScreen, reminderScreen } from '#shared/screens'

const diary = logModeScreen('text').messages
const goal = goalScreen(1800).messages

const STEPS: { tone: string; clause: string; screen: ChatScreen }[] = [
  {
    tone: 'mint',
    clause: 'Você conta o que comeu.',
    screen: {
      id: 'how-tell',
      label: 'A pessoa conta o almoço numa mensagem.',
      messages: diary.slice(0, 1),
    },
  },
  {
    tone: 'sky',
    clause: 'Ele anota e soma na hora.',
    screen: {
      id: 'how-log',
      label: 'O registro do almoço com as calorias.',
      messages: diary.slice(1),
    },
  },
  {
    tone: 'peach',
    clause: 'Pergunte quanto falta.',
    screen: {
      id: 'how-left',
      label: 'A pergunta de quanto falta e a resposta.',
      messages: goal.slice(2),
    },
  },
  {
    tone: 'sand',
    clause: 'Sumiu? Ele te lembra.',
    screen: {
      id: 'how-remind',
      label: 'O lembrete curto do dia seguinte.',
      messages: reminderScreen(true).messages,
    },
  },
]
</script>

<template>
  <section id="como-funciona" class="how" aria-labelledby="how-title">
    <h2 id="how-title" class="title">Como funciona</h2>
    <ol class="steps">
      <li v-for="step in STEPS" :key="step.tone" class="field" :class="step.tone">
        <p class="clause">{{ step.clause }}</p>
        <ChatWindow :screen="step.screen" bare class="chat" />
      </li>
    </ol>
  </section>
</template>

<style scoped>
.how {
  display: grid;
  gap: 2.5rem;
  padding: var(--gap-section) var(--margin) 0;
}

.title {
  font-size: var(--step-head);
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.field {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
  padding: 1.75rem 1.5rem;
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

.clause {
  font-size: var(--step-lead);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.chat {
  align-self: end;
}

@media (max-width: 63.99rem) {
  .steps {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 47.99rem) {
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
