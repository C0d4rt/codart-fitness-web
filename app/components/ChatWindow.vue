<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { formatChat } from '#shared/formatChat'
import { clock } from '#shared/locale'

import { brand } from '~/brand'

defineProps<{ screen: ChatScreen; bare?: boolean }>()

const locale = useSiteLocale()
</script>

<template>
  <figure class="chat" :class="{ bare }" data-ui :aria-label="screen.label">
    <div class="screen">
      <div v-if="!bare" class="top" aria-hidden="true">
        <div class="status">
          <span class="clock">9:41</span>
          <span class="island" />
          <span class="signals">
            <svg viewBox="0 0 18 12">
              <path d="M1 11h2V8H1zM5 11h2V6H5zM9 11h2V3.5H9zM13 11h2V1h-2z" />
            </svg>
            <svg viewBox="0 0 16 12">
              <path
                class="line"
                d="M1.5 4.5a9.5 9.5 0 0 1 13 0M3.8 7a6.2 6.2 0 0 1 8.4 0M6.2 9.4a2.8 2.8 0 0 1 3.6 0"
              />
            </svg>
            <svg viewBox="0 0 26 12">
              <rect class="line" x="0.75" y="0.75" width="21.5" height="10.5" rx="3" />
              <rect x="2.5" y="2.5" width="15" height="7" rx="1.5" />
              <path d="M24 4.2v3.6a1.8 1.8 0 0 0 0-3.6z" />
            </svg>
          </span>
        </div>
        <div class="bar">
          <svg class="icon back" viewBox="0 0 12 20"><path class="line" d="M10 2 2 10l8 8" /></svg>
          <span class="avatar">{{ brand.name.charAt(0).toLowerCase() }}</span>
          <span class="who">
            <span class="name">{{ brand.name }}</span>
            <span class="presence">{{ $t('chat.online') }}</span>
          </span>
          <svg class="icon" viewBox="0 0 24 24">
            <rect class="line" x="2" y="6" width="13.5" height="12" rx="2.5" />
            <path class="line" d="m15.5 10.5 6-3.5v10l-6-3.5" />
          </svg>
          <svg class="icon" viewBox="0 0 24 24">
            <path
              class="line"
              d="M5.2 3.5h3.3l1.6 4.2-2.2 1.5a11 11 0 0 0 5 5l1.5-2.2 4.2 1.6v3.3a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.6 5.2a1.6 1.6 0 0 1 1.6-1.7z"
            />
          </svg>
        </div>
      </div>
      <Transition name="screen" mode="out-in">
        <ol :key="screen.id" class="thread" aria-hidden="true">
          <li
            v-for="(message, index) in screen.messages"
            :key="index"
            class="row"
            :class="message.from"
            :style="{ '--n': index }"
          >
            <div class="bubble">
              <div v-if="message.attachment?.kind === 'audio'" class="audio">
                <span class="play">▶</span>
                <span class="wave">
                  <i v-for="bar in 22" :key="bar" :style="{ '--h': ((bar * 37) % 11) + 3 }" />
                </span>
                <span class="length"
                  >0:{{ String(message.attachment.seconds).padStart(2, '0') }}</span
                >
              </div>
              <img
                v-else-if="message.attachment?.kind === 'photo' && message.attachment.src"
                :src="message.attachment.src"
                :alt="message.attachment.label"
                width="640"
                height="426"
                loading="lazy"
                class="photo shot"
              />
              <PlateDrawing v-else-if="message.attachment?.kind === 'photo'" class="photo" />
              <div v-else-if="message.attachment?.kind === 'file'" class="file">
                <span class="file-icon">CSV</span>
                <span>{{ message.attachment.name }}</span>
              </div>
              <!-- eslint-disable-next-line vue/no-v-html -- the text is escaped by formatChat before the marks become tags -->
              <p v-if="message.text" class="text" v-html="formatChat(message.text)" />
              <span class="time">{{ clock(message.time, locale) }}</span>
              <span v-if="message.button" class="reply-button">{{ message.button }}</span>
            </div>
          </li>
        </ol>
      </Transition>
      <div v-if="!bare" class="composer" aria-hidden="true">
        <div class="tools">
          <svg class="icon" viewBox="0 0 24 24"><path class="line" d="M12 5v14M5 12h14" /></svg>
          <span class="field">
            {{ $t('chat.message') }}
            <svg class="icon small" viewBox="0 0 24 24">
              <circle class="line" cx="12" cy="12" r="8.5" />
              <path class="line" d="M8.5 14a4.2 4.2 0 0 0 7 0" />
              <circle cx="9.3" cy="10" r="1.1" />
              <circle cx="14.7" cy="10" r="1.1" />
            </svg>
          </span>
          <svg class="icon" viewBox="0 0 24 24">
            <path
              class="line"
              d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.8l1.4-2h4.6l1.4 2h1.8A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"
            />
            <circle class="line" cx="12" cy="12.5" r="3.4" />
          </svg>
          <span class="mic">
            <svg viewBox="0 0 24 24">
              <rect class="line" x="9" y="3.5" width="6" height="11" rx="3" />
              <path class="line" d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3" />
            </svg>
          </span>
        </div>
        <span class="home" />
      </div>
    </div>
  </figure>
</template>

<style scoped>
.chat {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, 22.5rem);
  max-height: min(44rem, calc(100svh - 6rem));
  padding: 0.5rem;
  border-radius: 3rem;
  background: #111a16;
  color: var(--chat-ink);
  font-family: var(--font-text);
  font-size: 0.9375rem;
  line-height: 1.42;
  letter-spacing: 0;
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.08),
    0 2px 4px rgb(16 36 26 / 0.08),
    0 28px 60px -24px rgb(16 36 26 / 0.45); /* taste-skill-ignore: the phone has to sit on the page like an object (data-ui) */
}

.chat:not(.bare) {
  min-height: min(32rem, 70svh - 4rem);
}

/* The two side buttons of a phone. */
.chat:not(.bare)::before,
.chat:not(.bare)::after {
  content: '';
  position: absolute;
  width: 3px;
  border-radius: 2px;
  background: #111a16;
}

.chat:not(.bare)::before {
  top: 7rem;
  left: -3px;
  height: 3rem;
}

.chat:not(.bare)::after {
  top: 8.5rem;
  right: -3px;
  height: 4.5rem;
}

.chat.bare {
  width: 100%;
  max-height: none;
  padding: 0;
  border-radius: 0.75rem;
  background: none;
  box-shadow: none;
}

.screen {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border-radius: 2.5rem;
  background-color: var(--chat-wall);
  background-image: radial-gradient(rgb(17 27 33 / 0.05) 1px, transparent 1.2px);
  background-size: 14px 14px;
}

.bare .screen {
  min-height: 0;
  border-radius: 0.75rem;
  background: var(--chat-bg);
}

.top {
  background: var(--chat-chrome);
  border-bottom: 1px solid rgb(17 27 33 / 0.08); /* taste-skill-ignore: the hairline under WhatsApp's header (data-ui) */
}

.status {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.75rem;
  padding: 0 1.75rem 0 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.island {
  position: absolute;
  top: 0.625rem;
  left: 50%;
  width: 6.25rem;
  height: 1.625rem;
  border-radius: 999px;
  background: #111a16;
  translate: -50% 0;
}

.signals {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.signals svg {
  height: 0.75rem;
  fill: currentColor;
}

.signals svg:nth-child(2) {
  width: 1rem;
}

.signals svg:last-child {
  width: 1.6rem;
}

.line {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.bar {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.25rem 1rem 0.625rem 0.75rem;
}

.icon {
  width: 1.375rem;
  height: 1.375rem;
  flex: none;
  color: var(--green);
}

.icon.back {
  width: 0.75rem;
  height: 1.125rem;
}

.icon.small {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--chat-meta);
}

.avatar {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
  border-radius: 50%;
  background: var(--mint);
  color: var(--green);
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
}

.who {
  display: grid;
  flex: 1;
  line-height: 1.2;
}

.name {
  font-weight: 600;
}

.presence {
  color: var(--chat-meta);
  font-size: 0.75rem;
}

.thread {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
  min-height: 0;
  margin: 0;
  padding: 0.875rem 0.75rem 1rem;
  overflow: hidden;
  list-style: none;
}

.bare .thread {
  padding: 1rem 0.75rem 1.25rem;
}

.row {
  display: flex;
  animation: arrive 360ms var(--ease-out) both;
  animation-delay: calc(var(--n) * 140ms);
}

.row.you {
  justify-content: flex-end;
}

.bubble {
  position: relative;
  max-width: 86%;
  padding: 0.5rem 0.75rem 1.25rem;
  border-radius: 1rem 1rem 1rem 0.375rem;
  background: var(--chat-bot);
  box-shadow: 0 1px 0.5px rgb(11 20 26 / 0.13); /* taste-skill-ignore: the hairline shadow WhatsApp gives a bubble (data-ui) */
}

.you .bubble {
  border-radius: 1rem 1rem 0.375rem 1rem;
  background: var(--chat-you);
}

.composer {
  display: grid;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem 0.375rem;
  background: var(--chat-chrome);
}

.tools {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.field {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  height: 2.25rem;
  padding: 0 0.625rem 0 0.875rem;
  border-radius: 999px;
  background: #ffffff;
  color: var(--chat-meta);
  font-size: 0.875rem;
  box-shadow: inset 0 0 0 1px rgb(17 27 33 / 0.08); /* taste-skill-ignore: the outline of WhatsApp's text field (data-ui) */
}

.mic {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
  border-radius: 50%;
  background: var(--green);
  color: #ffffff;
}

.mic svg {
  width: 1.125rem;
  height: 1.125rem;
}

.home {
  justify-self: center;
  width: 7.5rem;
  height: 0.3rem;
  border-radius: 999px;
  background: var(--chat-ink);
  opacity: 0.85;
}

.text {
  overflow-wrap: anywhere;
}

.time {
  position: absolute;
  right: 0.625rem;
  bottom: 0.3rem;
  color: var(--chat-meta);
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
}

.reply-button {
  display: block;
  margin: 0.625rem -0.75rem -1.25rem;
  padding: 0.625rem;
  border-top: 1px solid color-mix(in oklab, var(--chat-ink) 14%, transparent); /* taste-skill-ignore: WhatsApp draws this divider above a reply button (data-ui fragment) */
  color: #0b7a5a;
  font-weight: 500;
  text-align: center;
}

.audio {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 13rem;
}

.play {
  font-size: 0.875rem;
}

.wave {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  height: 1.75rem;
}

.wave i {
  width: 3px;
  height: calc(var(--h) * 2px);
  border-radius: 2px;
  background: var(--chat-meta);
}

.length {
  color: var(--chat-meta);
  font-size: 0.75rem;
}

.photo {
  width: 13rem;
  border-radius: 0.5rem;
}

.shot {
  display: block;
  width: 16rem;
  max-width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.file {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.5rem;
  padding: 0.625rem;
  border-radius: 0.5rem;
  background: color-mix(in oklab, var(--chat-ink) 8%, transparent);
}

.file-icon {
  padding: 0.25rem 0.375rem;
  border-radius: 0.25rem;
  background: var(--chat-bar);
  color: var(--chat-bar-ink);
  font-size: 0.6875rem;
  font-weight: 500;
}

.screen-enter-active {
  transition: opacity 200ms var(--ease-out);
}

.screen-leave-active {
  transition: opacity 120ms ease;
}

.screen-enter-from,
.screen-leave-to {
  opacity: 0;
}

@keyframes arrive {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .row {
    animation-name: fade;
    animation-duration: 200ms;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
  }
}
</style>
