import { type Catalog, money, priceChanges, pricesAt } from '#shared/plans'

/** Judged at build time and again in the browser, so a page built before `next.from` charges the next prices after it. */
export const usePrices = (catalog: MaybeRefOrGetter<Catalog>) => {
  const now = useNow(() => priceChanges(toValue(catalog)))
  return computed(() => pricesAt(toValue(catalog), now.value))
}

export const useInstallmentWords = () => {
  const { t } = useI18n()
  const locale = useSiteLocale()
  const inInstallments = (count: number, cents: number) =>
    t('pricing.inInstallments', { count, price: money(cents, locale.value) })
  return { inInstallments }
}
