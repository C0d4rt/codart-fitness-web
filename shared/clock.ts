/** The longest wait `setTimeout` keeps (about 24.8 days): a boundary further off is reached in steps. */
const LONGEST_WAIT_MS = 2 ** 31 - 1

/** How long from `now` until the first of `boundaries` still ahead, or undefined when none is. */
export const msUntilBoundary = (boundaries: readonly string[], now: number): number | undefined => {
  const ahead = boundaries.map((each) => Date.parse(each)).filter((at) => at > now)
  return ahead.length === 0 ? undefined : Math.min(Math.min(...ahead) - now, LONGEST_WAIT_MS)
}
