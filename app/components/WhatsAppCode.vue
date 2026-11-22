<script setup lang="ts">
const props = defineProps<{ link: string; message: string }>()

const { t } = useI18n()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.message)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 2000)
  } catch {
    copied.value = false
  }
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="handoff">
    <figure class="scan">
      <QrImage :value="link" :label="t('whatsappCode.qrLabel')" />
      <figcaption>{{ t('whatsappCode.scan') }}</figcaption>
    </figure>
    <div class="side">
      <a class="button open" :href="link" target="_blank" rel="noopener">
        <span class="only-touch">{{ t('whatsappCode.open') }}</span>
        <span class="only-pointer">{{ t('whatsappCode.openHere') }}</span>
      </a>
      <p class="or">{{ t('whatsappCode.orSend') }}</p>
      <div class="message">
        <code>{{ message }}</code>
        <button type="button" class="copy" @click="copy">
          {{ copied ? t('whatsappCode.copied') : t('whatsappCode.copy') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.handoff {
  display: grid;
  gap: 1.5rem;
}

.scan {
  display: none;
  justify-items: center;
  gap: 0.75rem;
  margin: 0;
  color: var(--muted);
  font-size: var(--step-small);
}

.side {
  display: grid;
  align-content: center;
  gap: 0.75rem;
}

.open {
  width: 100%;
  padding-block: 0.75rem;
  line-height: 1.25;
  text-align: center;
}

.or {
  color: var(--muted);
  font-size: var(--step-small);
}

.message {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
  border-radius: var(--radius-small);
  background: var(--tone);
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: var(--step-small);
  font-weight: 500;
  overflow-wrap: anywhere;
}

.copy {
  min-height: 2.5rem;
  padding: 0 1rem;
  border: 0;
  border-radius: 999px;
  background: var(--card);
  font-size: var(--step-small);
  font-weight: 500;
  cursor: pointer;
  transition: transform 160ms var(--ease-out);
}

.copy:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) and (min-width: 48rem) {
  .handoff {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 2rem;
  }
  .scan {
    display: grid;
  }
  .open {
    background: var(--tone);
    color: var(--ink);
  }
  .open:hover {
    background: color-mix(in oklab, var(--tone) 88%, var(--ink));
  }
}
</style>
