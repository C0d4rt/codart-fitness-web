import type { ChatScreen } from '#shared/chat'

/** The screen the fixed half shows; each section in view sets its own. */
export const useStage = () => useState<ChatScreen | undefined>('stage', () => undefined)

/**
 * Points the stage at whichever `[data-stage]` element crosses the middle of the viewport,
 * using the screen that element's id maps to at that moment.
 */
export const useStageObserver = (screenFor: (id: string) => ChatScreen | undefined) => {
  const stage = useStage()
  const active = ref<string>()
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            active.value = (entry.target as HTMLElement).dataset.stage
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll('[data-stage]').forEach((element) => observer?.observe(element))
  })
  onBeforeUnmount(() => observer?.disconnect())

  watchEffect(() => {
    if (active.value !== undefined) {
      stage.value = screenFor(active.value) ?? stage.value
    }
  })

  return active
}
