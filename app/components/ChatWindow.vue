<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import { formatChat } from '#shared/formatChat'
import { clock } from '#shared/locale'

import { brand } from '~/brand'

const props = defineProps<{ screen: ChatScreen; bare?: boolean }>()

const locale = useSiteLocale()

/* A voice note's waveform: louder bars, and dots where the speaker paused. */
const WAVE = [
  1, 3, 5, 7, 6, 8, 5, 7, 8, 4, 1, 1, 6, 8, 7, 5, 8, 4, 2, 1, 7, 8, 6, 8, 5, 3, 7, 8, 7, 4, 1,
]

const sender = (index: number) => props.screen.messages[index]?.from
const opensRun = (index: number) => sender(index - 1) !== sender(index)
const closesRun = (index: number) => sender(index + 1) !== sender(index)
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
          <span class="back">
            <svg class="icon" viewBox="0 0 12 20">
              <path class="line" d="M9.5 2.5 2 10l7.5 7.5" />
            </svg>
          </span>
          <span class="avatar">{{ brand.name.charAt(0).toLowerCase() }}</span>
          <span class="who">
            <span class="name">{{ brand.name }}</span>
            <span class="presence">{{ $t('chat.online') }}</span>
          </span>
        </div>
      </div>
      <Transition name="screen" mode="out-in">
        <ol :key="screen.id" class="thread" aria-hidden="true">
          <li v-if="!bare" class="day">{{ $t('chat.today') }}</li>
          <li
            v-for="(message, index) in screen.messages"
            :key="index"
            class="row"
            :class="[message.from, { opens: opensRun(index), closes: closesRun(index) }]"
            :style="{ '--n': index }"
          >
            <div
              class="bubble"
              :class="{ framed: message.attachment?.kind === 'photo' && !message.text }"
            >
              <div class="body">
                <div v-if="message.attachment?.kind === 'audio'" class="audio">
                  <span class="sender">
                    <svg class="person" viewBox="0 0 40 40">
                      <circle cx="20" cy="15.5" r="7" />
                      <path d="M6.5 35.5c1.6-7.4 7-11 13.5-11s11.9 3.6 13.5 11z" />
                    </svg>
                    <svg class="heard" viewBox="0 0 24 24">
                      <rect x="8.75" y="2" width="6.5" height="12.5" rx="3.25" />
                      <path class="line" d="M5.5 10.75a6.5 6.5 0 0 0 13 0M12 17.25V22" />
                    </svg>
                  </span>
                  <svg class="play" viewBox="0 0 12 14"><path d="M1 1.2v11.6L11 7z" /></svg>
                  <span class="track">
                    <span class="wave">
                      <span class="knob" />
                      <i v-for="(height, bar) in WAVE" :key="bar" :style="{ '--h': height }" />
                    </span>
                    <span class="length"
                      >0:{{ String(message.attachment.seconds).padStart(2, '0') }}</span
                    >
                  </span>
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
                <p v-if="message.text" class="text">
                  <!-- eslint-disable-next-line vue/no-v-html -- the text is escaped by formatChat before the marks become tags -->
                  <span v-html="formatChat(message.text)" />
                  <span class="room"
                    >{{ clock(message.time, locale) }}<i v-if="message.from === 'you'"
                  /></span>
                </p>
                <span class="meta">
                  {{ clock(message.time, locale) }}
                  <svg v-if="message.from === 'you'" class="ticks" viewBox="0 0 16 11">
                    <path class="line" d="M1.5 6.2 4.4 9l6.1-7M7.4 8.6l.5.4 6.1-7" />
                  </svg>
                </span>
              </div>
              <span v-if="message.button" class="reply-button">
                <svg viewBox="0 0 24 24">
                  <path
                    class="line"
                    d="M9.5 4.5 3 11l6.5 6.5v-4c4.6 0 8 1.5 11 5.5-.7-6-4.5-10-11-11z"
                  />
                </svg>
                {{ message.button }}
              </span>
              <svg v-if="closesRun(index)" class="tail" viewBox="0 0 10 16">
                <path d="M10 0c0 7-2.4 12.6-10 16h10z" />
              </svg>
            </div>
          </li>
        </ol>
      </Transition>
      <div v-if="!bare" class="composer" aria-hidden="true">
        <div class="tools">
          <svg class="icon plus" viewBox="0 0 24 24">
            <path class="line" d="M12 3.5v17M3.5 12h17" />
          </svg>
          <span class="field">
            <svg class="icon small" viewBox="0 0 24 24">
              <path
                class="line"
                d="M12.5 20.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5h8A4.5 4.5 0 0 1 20.5 8v4.5a8 8 0 0 1-8 8z"
              />
              <path class="line" d="M12.5 20.5c0-4.6 3.4-8 8-8" />
            </svg>
          </span>
          <svg class="icon" viewBox="0 0 24 24">
            <path
              class="line"
              d="M2.75 9A2.75 2.75 0 0 1 5.5 6.25h1.9c.5 0 .95-.28 1.18-.72l.6-1.16c.23-.44.68-.72 1.18-.72h3.28c.5 0 .95.28 1.18.72l.6 1.16c.23.44.68.72 1.18.72h1.9A2.75 2.75 0 0 1 21.25 9v8.25A2.75 2.75 0 0 1 18.5 20h-13a2.75 2.75 0 0 1-2.75-2.75z"
            />
            <circle class="line" cx="12" cy="12.75" r="3.75" />
            <circle cx="18" cy="9.25" r="0.9" fill="currentColor" />
          </svg>
          <span class="mic">
            <svg viewBox="0 0 24 24">
              <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
              <path class="line" d="M6 10.5a6 6 0 0 0 12 0M12 16.5v4.5" />
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
  /* A phone's own proportion (71.6 × 147.6 mm), never stretched by the messages inside. */
  container-type: inline-size;
  width: min(100%, min(38rem, 100svh - 8rem) * 71.6 / 147.6);
  min-width: 0;
  height: auto;
  aspect-ratio: 71.6 / 147.6;
}

.chat:not(.bare) .screen {
  font-size: clamp(0.75rem, 4.75cqw, 0.875rem);
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
  background: var(--chat-wall);
}

.status {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.5rem;
  padding: 0 1.25rem 0 1.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.island {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  width: 4.75rem;
  height: 1.375rem;
  border-radius: 999px;
  background: #111a16;
  translate: -50% 0;
}

.signals {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.signals svg {
  height: 0.625rem;
  fill: currentColor;
}

.signals svg:first-child {
  width: 0.875rem;
}

.signals svg:nth-child(2) {
  width: 0.875rem;
}

.signals svg:last-child {
  width: 1.375rem;
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
  padding: 0.25rem 1rem 0.5rem 0.625rem;
}

.icon {
  width: 1.375rem;
  height: 1.375rem;
  flex: none;
  color: var(--green);
}

.back {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
  border-radius: 50%;
  background: #fbfaf7;
}

.back .icon {
  width: 0.6875rem;
  height: 1.125rem;
  color: var(--chat-ink);
}

.back .line {
  stroke-width: 2.6;
}

.icon.small {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--chat-ink);
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
  min-width: 0;
  line-height: 1.2;
}

.name {
  overflow: hidden;
  font-size: 1rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  gap: 0.125rem;
  min-height: 0;
  margin: 0;
  padding: 0.875rem 0.875rem 1rem;
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

.row + .row.opens {
  margin-top: 0.375rem;
}

.day {
  align-self: center;
  margin-bottom: 0.375rem;
  padding: 0.1875rem 0.625rem;
  border-radius: 0.5rem;
  background: var(--chat-bot);
  color: var(--chat-ink);
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 1px 0.5px rgb(11 20 26 / 0.13); /* taste-skill-ignore: the hairline shadow WhatsApp gives its date chip (data-ui) */
}

.bubble {
  --fill: var(--chat-bot);

  position: relative;
  max-width: 84%;
  border-radius: 1rem;
  background: var(--fill);
  /* A drop shadow, not a box shadow, so the tail shares it. */
  filter: drop-shadow(0 1px 0.5px rgb(11 20 26 / 0.16));
}

.you .bubble {
  --fill: var(--chat-you);
}

.closes .bubble {
  border-bottom-left-radius: 0.25rem;
}

.you.closes .bubble {
  border-bottom-right-radius: 0.25rem;
  border-bottom-left-radius: 1rem;
}

.tail {
  position: absolute;
  bottom: 0;
  left: calc(-0.5rem + 1px);
  width: 0.5rem;
  height: 0.8rem;
  fill: var(--fill);
}

.you .tail {
  right: calc(-0.5rem + 1px);
  left: auto;
  scale: -1 1;
}

.body {
  position: relative;
  padding: 0.375rem 0.5rem 0.375rem 0.625rem;
}

.body:not(:has(.text)) {
  padding-bottom: 1.25rem;
}

.body:has(.audio) {
  padding-bottom: 0.375rem;
}

.framed .body {
  padding: 0.1875rem;
}

.composer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.5rem;
  padding: 0.5rem 0.75rem 0.375rem;
  background: var(--chat-wall);
}

.tools {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.field {
  display: flex;
  flex: 1;
  gap: 0.375rem;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  height: 1.875rem;
  padding: 0 0.5rem 0 0.875rem;
  border-radius: 999px;
  background: #ffffff;
  color: var(--chat-meta);
  font-size: 0.875rem;
  box-shadow: inset 0 0 0 1px rgb(17 27 33 / 0.2); /* taste-skill-ignore: the outline of WhatsApp's text field (data-ui) */
}

.field .icon {
  flex: none;
}

.tools > .icon {
  width: 1.375rem;
  height: 1.375rem;
  color: var(--chat-ink);
}

.tools .line {
  stroke-width: 1.7;
}

.tools > .plus {
  width: 1.25rem;
  height: 1.25rem;
}

.tools > .plus .line {
  stroke-width: 2;
}

.mic {
  display: grid;
  place-items: center;
  width: 1.875rem;
  height: 1.875rem;
  flex: none;
  border-radius: 50%;
  background: var(--chat-send);
  color: #ffffff;
}

.mic svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
}

.mic .line {
  fill: none;
  stroke-width: 1.6;
}

@container (width < 14.5rem) {
  .tools {
    gap: 0.5rem;
  }

  .field {
    padding: 0 0.5rem 0 0.75rem;
  }
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

/* An invisible copy of the time, so the last line leaves room for it as WhatsApp's does. */
.room {
  display: inline-flex;
  padding-left: 0.75rem;
  font-size: 0.6875rem;
  visibility: hidden;
}

.room i {
  width: 1.25rem;
}

.meta {
  position: absolute;
  right: 0.5rem;
  bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.1875rem;
  color: var(--chat-meta);
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.framed .meta {
  right: 0.625rem;
  bottom: 0.5rem;
  color: #ffffff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.5);
}

.ticks {
  width: 1rem;
  height: 0.6875rem;
  color: var(--chat-tick);
}

.ticks .line {
  stroke-width: 1.5;
}

.reply-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem;
  border-top: 1px solid color-mix(in oklab, var(--chat-ink) 14%, transparent); /* taste-skill-ignore: WhatsApp draws this divider above a reply button (data-ui fragment) */
  color: #0b7a5a;
  font-weight: 500;
  text-align: center;
}

.reply-button svg {
  width: 1.125rem;
  height: 1.125rem;
}

.audio {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 13.5rem;
  max-width: 100%;
  padding: 0.125rem 0.125rem 0;
}

.sender {
  position: relative;
  flex: none;
  width: 2.375rem;
  height: 2.375rem;
}

.person {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #c8ced3;
  fill: #ffffff;
}

.heard {
  position: absolute;
  right: -0.3rem;
  bottom: -0.125rem;
  width: 1rem;
  height: 1rem;
  color: var(--chat-voice);
  fill: currentColor;
}

.heard .line {
  fill: none;
  stroke-width: 2;
}

.play {
  width: 0.8125rem;
  height: 0.9375rem;
  flex: none;
  fill: color-mix(in oklab, var(--chat-ink) 70%, transparent);
}

.track {
  display: grid;
  flex: 1;
  gap: 0.125rem;
  min-width: 0;
}

.wave {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1px;
  height: 1.5rem;
  overflow: hidden;
}

.knob {
  position: absolute;
  top: 50%;
  left: 0;
  width: 0.6875rem;
  height: 0.6875rem;
  border-radius: 50%;
  background: var(--chat-voice);
  translate: 0 -50%;
}

.wave i {
  flex: none;
  width: 2px;
  height: max(2px, calc(var(--h) * 0.125rem));
  border-radius: 1px;
  background: color-mix(in oklab, var(--chat-ink) 30%, transparent);
}

.length {
  color: var(--chat-meta);
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.photo {
  width: 13rem;
  border-radius: 0.5rem;
}

.framed .photo {
  border-radius: 0.8125rem;
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
