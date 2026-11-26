/** The build time while the page hydrates, so it matches the prerendered HTML, then the visitor's clock. */
export const useNow = () => {
  const now = useState('now', () => Date.now())
  onMounted(() => {
    now.value = Date.now()
  })
  return computed(() => new Date(now.value))
}
