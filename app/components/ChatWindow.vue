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
    <div v-if="!bare" class="bar" aria-hidden="true">
      <span class="avatar">{{ brand.name.charAt(0).toLowerCase() }}</span>
      <span class="who">
        <span class="name">{{ brand.name }}</span>
        <span class="status">{{ $t('chat.online') }}</span>
      </span>
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
  </figure>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  width: min(100%, 25rem);
  max-height: min(42rem, calc(100svh - 6rem));
  overflow: hidden;
  border-radius: 1.25rem;
  background: var(--chat-bg);
  color: var(--chat-ink);
  font-family: var(--font-text);
  font-size: 0.9375rem;
  line-height: 1.42;
  letter-spacing: 0;
}

.chat.bare {
  width: 100%;
  max-height: none;
  border-radius: 0.75rem;
}

.bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--chat-bar);
  color: var(--chat-bar-ink);
}

.avatar {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--chat-bar-ink);
  color: var(--chat-bar);
  font-family: var(--font-display);
  font-size: 1.25rem;
}

.who {
  display: grid;
}

.name {
  font-weight: 500;
}

.status {
  font-size: 0.8125rem;
  opacity: 0.8;
}

.thread {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
  min-height: 0;
  margin: 0;
  padding: 1rem 0.75rem 1.25rem;
  overflow: hidden;
  list-style: none;
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
  border-radius: 0.75rem;
  background: var(--chat-bot);
}

.you .bubble {
  background: var(--chat-you);
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
