<script setup lang="ts">
import type { ChatMessage, ChatScreen } from '#shared/chat'
import { formatChat } from '#shared/formatChat'
import { clock } from '#shared/locale'

import { brand } from '~/brand'

const props = defineProps<{
  screen: ChatScreen
  bare?: boolean
  flat?: boolean
  typing?: boolean
  typingMs?: number
  grow?: boolean
}>()
const emit = defineEmits<{ replied: [id: string]; live: [] }>()

const locale = useSiteLocale()
const { t } = useI18n()
const phone = computed(() => !props.bare && !props.flat)

/* A voice note's waveform: louder bars, and dots where the speaker paused. */
const WAVE = [
  1, 3, 5, 7, 6, 8, 5, 7, 8, 4, 1, 1, 6, 8, 7, 5, 8, 4, 2, 1, 7, 8, 6, 8, 5, 3, 7, 8, 7, 4, 1,
]

const sender = (index: number) => props.screen.messages[index]?.from
const opensRun = (index: number) => sender(index - 1) !== sender(index)
const closesRun = (index: number) => sender(index + 1) !== sender(index)

/* The finished conversation fades in once the phone is on screen, or as soon as a visitor picks another one. */
const figure = ref<HTMLElement>()
const live = ref(false)
let observer: IntersectionObserver | undefined

/* With typing on, the first answer waits behind three dots for a moment: long enough to read as a reply, short enough not to make anyone wait. */
const TYPING_MS = 650
/* A growing conversation keeps what was already on screen and only plays what is new. */
const newFrom = ref(0)
let lastLength = 0
const firstReply = computed(() =>
  props.screen.messages.findIndex((each, index) => index >= newFrom.value && each.from === 'bot'),
)
const heldFrom = ref<number>()
const shown = computed(() =>
  heldFrom.value === undefined
    ? props.screen.messages
    : props.screen.messages.slice(0, heldFrom.value),
)
let timer: ReturnType<typeof setTimeout> | undefined

/* One flat, keyed list: TransitionGroup cannot hydrate v-if or fragment children. */
type Item =
  | { key: string; kind: 'day'; text: string }
  | { key: string; kind: 'typing' }
  | { key: string; kind: 'message'; message: ChatMessage; index: number }
const items = computed<Item[]>(() => [
  ...(props.bare ? [] : [{ key: 'today', kind: 'day' as const, text: t('chat.today') }]),
  ...shown.value.flatMap((message, index) => [
    ...(message.day ? [{ key: `day-${index}`, kind: 'day' as const, text: message.day }] : []),
    { key: `message-${index}`, kind: 'message' as const, message, index },
  ]),
  ...(heldFrom.value === undefined ? [] : [{ key: 'typing', kind: 'typing' as const }]),
])

const play = () => {
  clearTimeout(timer)
  const id = props.screen.id
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!props.typing || still || firstReply.value < 0) {
    heldFrom.value = undefined
    emit('replied', id)
    return
  }
  heldFrom.value = firstReply.value
  timer = setTimeout(() => {
    heldFrom.value = undefined
    emit('replied', id)
  }, props.typingMs ?? TYPING_MS)
}

const goLive = () => {
  if (live.value) return
  play()
  live.value = true
  observer?.disconnect()
  emit('live')
}

watch(
  () => props.screen.id,
  () => {
    const length = props.screen.messages.length
    newFrom.value = props.grow ? Math.min(lastLength, length) : 0
    lastLength = length
    if (live.value) play()
    else if (!props.grow) goLive()
  },
)

onMounted(() => {
  lastLength = props.screen.messages.length
  if (!figure.value) return
  observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && goLive(), {
    threshold: 0.15,
  })
  observer.observe(figure.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(timer)
})
</script>

<template>
  <figure
    ref="figure"
    class="chat"
    :class="{ bare, flat, handset: phone, live }"
    data-ui
    :aria-label="screen.label"
  >
    <div class="screen">
      <div v-if="!bare" class="top" aria-hidden="true">
        <div v-if="phone" class="status">
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
          <span v-if="phone" class="back">
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
        <TransitionGroup
          :key="grow ? 'grow' : screen.id"
          tag="ol"
          name="row"
          class="thread"
          aria-hidden="true"
        >
          <li
            v-for="item in items"
            :key="item.key"
            :class="
              item.kind === 'day'
                ? 'day'
                : item.kind === 'typing'
                  ? 'row bot opens closes typing'
                  : [
                      'row',
                      item.message.from,
                      { opens: opensRun(item.index), closes: closesRun(item.index) },
                    ]
            "
            :style="item.kind === 'message' ? { '--n': item.index } : undefined"
          >
            <template v-if="item.kind === 'day'">{{ item.text }}</template>
            <div v-else-if="item.kind === 'typing'" class="bubble">
              <span class="dots"><i /><i /><i /></span>
              <svg class="tail" viewBox="0 0 10 16">
                <path d="M10 0c0 7-2.4 12.6-10 16h10z" />
              </svg>
            </div>
            <div
              v-else
              class="bubble"
              :class="{ framed: item.message.attachment?.kind === 'photo' && !item.message.text }"
            >
              <div class="body">
                <div v-if="item.message.attachment?.kind === 'audio'" class="audio">
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
                      >0:{{ String(item.message.attachment.seconds).padStart(2, '0') }}</span
                    >
                  </span>
                </div>
                <img
                  v-else-if="
                    item.message.attachment?.kind === 'photo' && item.message.attachment.src
                  "
                  :src="item.message.attachment.src"
                  :alt="item.message.attachment.label"
                  width="640"
                  height="426"
                  loading="lazy"
                  class="photo shot"
                />
                <PlateDrawing v-else-if="item.message.attachment?.kind === 'photo'" class="photo" />
                <div v-else-if="item.message.attachment?.kind === 'file'" class="file">
                  <span class="file-icon">CSV</span>
                  <span>{{ item.message.attachment.name }}</span>
                </div>
                <p v-if="item.message.text" class="text">
                  <!-- eslint-disable-next-line vue/no-v-html -- the text is escaped by formatChat before the marks become tags -->
                  <span v-html="formatChat(item.message.text)" />
                  <span class="room"
                    >{{ clock(item.message.time, locale) }}<i v-if="item.message.from === 'you'"
                  /></span>
                </p>
                <span class="meta">
                  {{ clock(item.message.time, locale) }}
                  <svg v-if="item.message.from === 'you'" class="ticks" viewBox="0 0 16 11">
                    <path class="line" d="M1.5 6.2 4.4 9l6.1-7M7.4 8.6l.5.4 6.1-7" />
                  </svg>
                </span>
              </div>
              <span v-if="item.message.button" class="reply-button">
                <svg viewBox="0 0 24 24">
                  <path
                    class="line"
                    d="M9.5 4.5 3 11l6.5 6.5v-4c4.6 0 8 1.5 11 5.5-.7-6-4.5-10-11-11z"
                  />
                </svg>
                {{ item.message.button }}
              </span>
              <svg v-if="closesRun(item.index)" class="tail" viewBox="0 0 10 16">
                <path d="M10 0c0 7-2.4 12.6-10 16h10z" />
              </svg>
            </div>
          </li>
        </TransitionGroup>
      </Transition>
      <div v-if="phone" class="composer" aria-hidden="true">
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

.chat.handset {
  /* A phone's own proportion (71.6 × 147.6 mm), never stretched by the messages inside. */
  container-type: inline-size;
  width: min(100%, min(38rem, 100svh - 8rem) * 71.6 / 147.6);
  min-width: 0;
  height: auto;
  aspect-ratio: 71.6 / 147.6;
}

.chat.handset .screen {
  font-size: clamp(0.75rem, 4.75cqw, 0.875rem);
}

/* The two side buttons of a phone. */
.chat.handset::before,
.chat.handset::after {
  content: '';
  position: absolute;
  width: 3px;
  border-radius: 2px;
  background: #111a16;
}

.chat.handset::before {
  top: 7rem;
  left: -3px;
  height: 3rem;
}

.chat.handset::after {
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
  background-image: radial-gradient(var(--chat-dots) 1px, transparent 1.2px);
  background-size: 14px 14px;
}

.bare .screen {
  min-height: 0;
  border-radius: 0.75rem;
}

/* A wide window, no phone around it: the conversation at reading size. */
.chat.flat {
  width: 100%;
  height: 100%;
  padding: 0;
  border-radius: var(--radius);
  background: none;
  font-size: 1rem;
  line-height: 1.45;
  box-shadow: var(--shadow-card);
}

.flat .screen {
  border-radius: inherit;
}

.flat .top {
  background: var(--chat-chrome);
  box-shadow: 0 1px 0 color-mix(in oklab, var(--chat-ink) 8%, transparent); /* taste-skill-ignore: the hairline under WhatsApp's header (data-ui) */
}

.flat .bar {
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
}

.flat .avatar {
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1.375rem;
}

.flat .name {
  font-size: 1.0625rem;
}

.flat .presence {
  font-size: 0.8125rem;
}

/* A long conversation fades out under the header instead of cutting a bubble in half. */
.flat .thread {
  padding: 1.25rem 1.5rem 1.5rem;
  mask-image: linear-gradient(to bottom, transparent, #000 2.5rem);
}

.flat .bubble {
  max-width: min(84%, 32rem);
}

.flat .body {
  padding: 0.5rem 0.75rem 0.5rem 0.875rem;
}

.flat .meta,
.flat .room {
  font-size: 0.75rem;
}

.typing {
  animation-duration: 120ms;
}

.dots {
  display: flex;
  gap: 0.3125rem;
  padding: 0.875rem 1rem;
}

.dots i {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background: var(--chat-meta);
  opacity: 0.35;
  animation: blink 1s ease-in-out infinite;
}

.dots i:nth-child(2) {
  animation-delay: 160ms;
}

.dots i:nth-child(3) {
  animation-delay: 320ms;
}

@keyframes blink {
  30% {
    opacity: 0.9;
    transform: translateY(-2px);
  }
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
  background: var(--chat-bot);
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
  animation: arrive 450ms var(--ease-out) both;
  animation-delay: calc(var(--n) * 50ms);
}

/* Hidden from the first paint until the phone is on screen, so the fade is what the visitor sees. */
:global(html.js .chat:not(.live) .row) {
  opacity: 0;
  animation: none;
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
  background: var(--chat-bot);
  color: var(--chat-meta);
  font-size: 0.875rem;
  box-shadow: inset 0 0 0 1px var(--chat-field-ring); /* taste-skill-ignore: the outline of WhatsApp's text field (data-ui) */
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
  color: var(--chat-link);
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
  background: var(--chat-avatar);
  fill: var(--chat-avatar-ink);
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

/* When a message arrives, the ones above slide up to make room instead of jumping. */
.row-move {
  transition: transform 380ms var(--ease-out);
}

/* A message taken back leaves at once; without this, TransitionGroup waits on the arrival animation. */
.row-leave-active {
  display: none;
  animation: none;
  transition: none;
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
    transform: translateY(4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .row-move {
    transition: none;
  }
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
