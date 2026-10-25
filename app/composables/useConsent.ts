import { type ConsentChoice, readConsent, writeConsent } from '#shared/consent'

const storage = (): Storage | undefined => {
  try {
    return import.meta.client ? window.localStorage : undefined
  } catch {
    return undefined
  }
}

export const useConsent = () => {
  const choice = useState<ConsentChoice | undefined>('consent', () => undefined)
  const asked = useState('consent-asked', () => false)
  const { gaId, metaPixelId } = useRuntimeConfig().public
  const needed = Boolean(gaId || metaPixelId)

  onMounted(() => {
    choice.value = readConsent(storage())
  })

  const choose = (value: ConsentChoice) => {
    choice.value = value
    asked.value = false
    writeConsent(storage(), value)
  }

  return {
    choice: readonly(choice),
    needed,
    /** The banner shows until a choice exists, or again when the visitor asks for it. */
    showBanner: computed(() => needed && (choice.value === undefined || asked.value)),
    choose,
    reopen: () => {
      asked.value = true
    },
  }
}
