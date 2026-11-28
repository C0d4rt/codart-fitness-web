<script setup lang="ts">
import type { ChatScreen } from '#shared/chat'
import type { PlanId } from '#shared/plans'

import { brand } from '~/brand'

const catalog = await usePlans()
const { t } = useI18n()
const route = useRoute()

useSeoMeta({
  title: t('features.title'),
  description: t('features.description', { name: brand.name }),
})

const planLine = (plan: PlanId) => t(`features.${plan}`)

/* One picked feature per group; a link to /recursos#<feature> picks that one. */
const picked = ref<Record<string, string>>(
  Object.fromEntries(catalog.groups.map((group) => [group.id, group.features[0]?.id ?? ''])),
)
const pick = (groupId: string, featureId: string) => {
  picked.value = { ...picked.value, [groupId]: featureId }
}
/* Opened from a link, the swap is instant and the page lands on it again: the item that closes above would push it away. */
const instant = ref(false)
const pickFromHash = async (hash: string) => {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const group = catalog.groups.find((each) => each.features.some((feature) => feature.id === id))
  if (!group) return
  instant.value = true
  pick(group.id, id)
  await nextTick()
  const land = () => {
    const element = document.getElementById(id)
    if (!element) return
    const clear = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - clear })
  }
  land()
  // The router's own hash scroll lands after this one, on the layout from before the swap.
  setTimeout(land, 350)
  requestAnimationFrame(() => (instant.value = false))
}
onMounted(() => pickFromHash(route.hash))
watch(() => route.hash, pickFromHash)

/*
 * The prerendered page holds the conversation in both places and CSS shows the one that fits;
 * once the width is known, only that one stays mounted, so one conversation plays per group.
 */
const narrow = ref<boolean>()
let narrowQuery: MediaQueryList | undefined
const measure = () => (narrow.value = narrowQuery?.matches)
onMounted(() => {
  narrowQuery = window.matchMedia('(max-width: 63.99rem)')
  measure()
  narrowQuery.addEventListener('change', measure)
})
onBeforeUnmount(() => narrowQuery?.removeEventListener('change', measure))

const screenOf = (groupId: string): ChatScreen => {
  const group = catalog.groups.find((each) => each.id === groupId)!
  const feature = group.features.find((each) => each.id === picked.value[groupId])!
  return { id: feature.id, label: feature.headline, messages: feature.exchange }
}
</script>

<template>
  <div class="page">
    <SiteNav />
    <main id="conteudo">
      <header class="intro">
        <h1 class="title">{{ t('features.title') }}</h1>
        <p class="lead">{{ t('features.lead') }}</p>
      </header>

      <div class="catalog" :class="{ instant }">
        <nav class="group-index" :aria-label="t('features.groups')">
          <ul>
            <li v-for="group in catalog.groups" :key="group.id">
              <NuxtLink :to="{ hash: `#group-${group.id}` }">{{ group.name }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <section
          v-for="group in catalog.groups"
          :id="`group-${group.id}`"
          :key="group.id"
          class="group"
          :aria-labelledby="`group-${group.id}-name`"
        >
          <h2 :id="`group-${group.id}-name`" class="group-name">{{ group.name }}</h2>
          <div class="body">
            <div class="list">
              <article
                v-for="feature in group.features"
                :id="feature.id"
                :key="feature.id"
                class="feature"
                :class="{ now: picked[group.id] === feature.id }"
              >
                <h3 class="heading">
                  <button
                    type="button"
                    class="pick"
                    :aria-expanded="picked[group.id] === feature.id"
                    :aria-controls="`${feature.id}-more`"
                    @click="pick(group.id, feature.id)"
                  >
                    <span class="headline">{{ feature.headline }}</span>
                  </button>
                </h3>
                <div :id="`${feature.id}-more`" class="more">
                  <div class="more-inner">
                    <p class="plan" :class="feature.plan">
                      {{ feature.name }} · {{ planLine(feature.plan) }}
                    </p>
                    <p class="how-to">{{ feature.howTo }}</p>
                    <div
                      v-if="picked[group.id] === feature.id && narrow !== false"
                      class="inline-chat"
                    >
                      <ChatWindow :screen="screenOf(group.id)" flat typing />
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div class="answer">
              <ChatWindow
                v-if="narrow !== true"
                :screen="screenOf(group.id)"
                flat
                typing
                class="chat"
              />
            </div>
          </div>
        </section>
      </div>
      <SiteClosing />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1.75rem;
  padding: clamp(3rem, 1.5rem + 5vw, 6.5rem) var(--margin) 0;
}

.title {
  font-size: var(--step-display);
  line-height: 0.98;
}

.lead {
  max-width: 40ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.catalog {
  --below-header: var(--header);
  --index: 3.5rem;
}

/* The index sticks under the header on the page's own ground, so nothing shows through it. */
.group-index {
  position: sticky;
  top: var(--below-header);
  z-index: 20;
  margin-top: 3rem;
  background: var(--ground);
}

.group-index ul {
  display: flex;
  gap: 0.5rem;
  min-height: var(--index);
  margin: 0;
  padding: 0.5rem var(--margin);
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.group-index ul::-webkit-scrollbar {
  display: none;
}

.group-index a {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 1.125rem;
  border-radius: 999px;
  background: var(--card);
  font-size: var(--step-small);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: var(--shadow-chip);
  transition:
    box-shadow 200ms var(--ease-out),
    transform 160ms var(--ease-out);
}

.group-index a:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .group-index a:hover {
    box-shadow: var(--shadow-lift);
  }
}

.group {
  display: grid;
  gap: 2rem;
  margin-top: clamp(3.5rem, 2rem + 4vw, 6rem);
  padding: 0 var(--margin);
}

.group-name {
  font-size: var(--step-head);
}

.body {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  align-items: start;
  gap: clamp(1rem, 0.5rem + 1.5vw, 1.75rem);
  padding: clamp(1rem, 0.5rem + 1.5vw, 1.75rem);
  border-radius: var(--radius-panel);
  background: var(--tone);
}

.list {
  display: grid;
  gap: 0.25rem;
}

.feature {
  border-radius: var(--radius);
  scroll-margin-top: 1.5rem;
  transition:
    background-color 200ms ease,
    box-shadow 200ms ease;
}

.feature.now {
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.pick {
  display: grid;
  gap: 0.25rem;
  width: 100%;
  padding: 1rem 1.25rem;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: var(--muted);
  text-align: left;
  cursor: pointer;
  transition:
    color 200ms ease,
    background-color 200ms ease,
    transform 160ms var(--ease-out);
}

.now .pick {
  color: var(--ink);
  cursor: default;
}

.pick:active {
  transform: scale(0.985);
}

@media (hover: hover) and (pointer: fine) {
  .feature:not(.now) .pick:hover {
    background: color-mix(in oklab, var(--card) 55%, transparent);
    color: var(--ink);
  }
}

.heading {
  font: inherit;
  letter-spacing: normal;
}

.headline {
  font-size: clamp(1.0625rem, 0.95rem + 0.4vw, 1.3125rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.plan {
  padding: 0 1.25rem 0.5rem;
  color: var(--muted);
  font-size: var(--step-small);
  font-weight: 500;
}

.plan.coaching {
  color: var(--green);
}

/* The explanation is always in the page; only the picked one opens. */
.more {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 280ms var(--ease-out);
}

.now .more {
  grid-template-rows: 1fr;
}

.more-inner {
  min-height: 0;
  overflow: hidden;
}

.how-to {
  max-width: 46ch;
  padding: 0 1.25rem 1.25rem;
  font-size: var(--step-small);
  line-height: 1.5;
}

.inline-chat {
  display: none;
}

.answer {
  position: sticky;
  top: calc(var(--below-header) + var(--index) + 1rem);
  height: min(36rem, 100svh - var(--below-header) - var(--index) - 3rem);
}

.instant .more {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .more {
    transition: none;
  }
}

/* On a phone the picked feature opens in place, with its conversation right under it. */
@media (max-width: 63.99rem) {
  .body {
    grid-template-columns: minmax(0, 1fr);
    margin-inline: calc(var(--margin) * -0.5);
    border-radius: var(--radius);
  }
  .answer {
    display: none;
  }
  .inline-chat {
    display: block;
    height: 30rem;
    padding: 0 0.75rem 0.75rem;
  }
  .inline-chat :deep(.chat) {
    font-size: 0.9375rem;
  }
  .inline-chat :deep(.thread) {
    padding-inline: 0.875rem;
  }
}

@media (forced-colors: active) {
  .feature.now {
    outline: 2px solid Highlight;
  }
}
</style>

<style>
/* The router offsets anchors by this, and here they must clear the group index too. */
html:has(.group-index) {
  scroll-padding-top: 10rem;
}
</style>
