import { campaignRates, communityGrowth, computeKpis, revenueByProduct, revenueSeries } from '~/services/analytics.service'

export function useAnalytics(periodDays: Ref<number> = ref(30)) {
  const { store } = useWorkspace()
  const snap = computed(() => store.snapshot)

  return {
    kpis: computed(() => snap.value
      ? computeKpis({ orders: snap.value.orders, customers: snap.value.customers, memberships: snap.value.memberships, periodDays: periodDays.value })
      : []),
    revenue: computed(() => snap.value ? revenueSeries(snap.value.orders, periodDays.value) : []),
    byProduct: computed(() => snap.value ? revenueByProduct(snap.value.orders, snap.value.products) : []),
    communityGrowth: computed(() => snap.value ? communityGrowth(snap.value.community.memberCount) : []),
    campaignRates,
  }
}
