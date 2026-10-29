import type { Catalog } from '#shared/plans'

/** Undefined on pages that never load the plans, so their copy must read well without a number. */
export const useTrialDays = () => {
  const { data } = useNuxtData<Catalog>(plansKey(useSiteLocale().value))
  return computed(() => data.value?.trialDays)
}
