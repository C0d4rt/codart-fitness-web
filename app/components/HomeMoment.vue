<script setup lang="ts">
import { logModeScreen } from '#shared/screens'

const photoScreen = logModeScreen('photo')
</script>

<template>
  <section class="moment" aria-labelledby="moment-title">
    <figure class="photo">
      <img
        src="/images/prato.jpg"
        alt="Uma mão segurando um prato com bife, ovo e tomate"
        width="1800"
        height="1172"
        loading="lazy"
      />
    </figure>
    <div class="copy" data-reveal>
      <h2 id="moment-title" class="title">Do prato à conversa</h2>
      <p>
        Tire uma foto do prato e mande. É fácil porque é no WhatsApp, que você já usa o dia todo
      </p>
      <ChatWindow :screen="photoScreen" class="chat" />
    </div>
  </section>
</template>

<style scoped>
.moment {
  display: grid;
  grid-template-columns: 7fr 5fr;
  margin: var(--gap-section) var(--margin) 0;
  overflow: hidden;
  border-radius: 2rem;
  background: var(--ink);
  color: #ffffff;
}

.photo {
  overflow: hidden;
}

.photo img {
  width: 100%;
  height: 100%;
  min-height: 26rem;
  object-fit: cover;
}

@media (prefers-reduced-motion: no-preference) {
  .photo img {
    animation: drift linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }
}

@keyframes drift {
  from {
    transform: scale(1.12);
  }
  to {
    transform: scale(1);
  }
}

.copy {
  display: grid;
  align-content: center;
  gap: 1.5rem;
  padding: clamp(2rem, 1rem + 3vw, 4rem);
}

.title {
  max-width: 12ch;
  font-size: var(--step-head);
}

.copy > p {
  max-width: 34ch;
  color: #dbe7e0;
  font-size: var(--step-body);
}

.chat {
  width: 100%;
  max-width: 24rem;
}

@media (max-width: 63.99rem) {
  .moment {
    grid-template-columns: 1fr;
  }
  .photo img {
    min-height: 0;
    aspect-ratio: 16 / 10;
  }
}
</style>
