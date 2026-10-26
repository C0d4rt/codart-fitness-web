export type Tone = 'paper' | 'surface' | 'green' | 'lime' | 'ink'

/** The colour of the `[data-chapter]` field under the fixed header, so the header can take it. */
export const useChapterTone = () => {
  const tone = ref<Tone>('paper')
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const header = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 4
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tone.value = ((entry.target as HTMLElement).dataset.chapter as Tone) ?? 'paper'
          }
        }
      },
      { rootMargin: `-${header / 2}px 0px -${window.innerHeight - header / 2 - 1}px 0px` },
    )
    document.querySelectorAll('[data-chapter]').forEach((element) => observer?.observe(element))
  })
  onBeforeUnmount(() => observer?.disconnect())

  return tone
}
