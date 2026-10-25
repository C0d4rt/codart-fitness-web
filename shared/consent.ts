export type ConsentChoice = 'granted' | 'denied'

export const CONSENT_KEY = 'consent:v1'

/** Storage can be missing or throw (private windows, blocked site data): no choice is then the answer. */
export const readConsent = (
  storage: Pick<Storage, 'getItem'> | undefined,
): ConsentChoice | undefined => {
  try {
    const value = storage?.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : undefined
  } catch {
    return undefined
  }
}

export const writeConsent = (
  storage: Pick<Storage, 'setItem'> | undefined,
  choice: ConsentChoice,
): void => {
  try {
    storage?.setItem(CONSENT_KEY, choice)
  } catch {
    // The choice still holds for this visit; it is only not remembered.
  }
}
