import { type Catalog, money, pricesAt } from '#shared/plans'
import { changeDay } from '#shared/siteDates'

/** Judged at build time and again in the browser, so a page built before `next.from` charges the next prices after it. */
export const usePrices = (catalog: MaybeRefOrGetter<Catalog>) => {
  const now = useNow()
  return computed(() => pricesAt(toValue(catalog), now.value))
}

/** "12x de R$ 19,90", and the same with the price from `next.from` in parentheses when it goes up. */
export const useInstallmentWords = () => {
  const { t } = useI18n()
  const locale = useSiteLocale()
  const inInstallments = (count: number, cents: number) =>
    t('pricing.inInstallments', { count, price: money(cents, locale.value) })
  const withLater = (
    count: number,
    nowCents: number,
    next: { from: string; cents: number } | undefined,
  ) => {
    const now = inInstallments(count, nowCents)
    return next && next.cents > nowCents
      ? t('pricing.priceLater', {
          now,
          date: changeDay(next.from, locale.value),
          later: inInstallments(count, next.cents),
        })
      : now
  }
  return { inInstallments, withLater }
}
