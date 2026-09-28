import type { CurrencyCode } from '~/types'
import { DEFAULT_CURRENCY } from '~/config/app.config'
import { formatDate, formatDelta, formatMoney, formatNumber, formatPercent, formatRelative } from '~/utils/format'

/** Formatting bound to the workspace currency. */
export function useFormat() {
  const { workspace } = useWorkspace()
  const currency = computed<CurrencyCode>(() => workspace.value?.currency ?? DEFAULT_CURRENCY)
  return {
    currency,
    money: (v: number, compact = false, c?: CurrencyCode) => formatMoney(v, c ?? currency.value, compact),
    number: formatNumber,
    percent: formatPercent,
    delta: formatDelta,
    date: formatDate,
    relative: formatRelative,
  }
}
