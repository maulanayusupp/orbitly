<script setup lang="ts">
definePageMeta({ layout: 'app', title: 'Analytics' })
useHead({ title: 'Analytics' })

const period = ref(30)
const { kpis, revenue, byProduct, communityGrowth, campaignRates } = useAnalytics(period)
const { store } = useWorkspace()
const { conversion, typeMeta } = useProducts()
const f = useFormat()

const conversionRows = computed(() => byProduct.value
  .filter(r => r.product.views > 0)
  .map(r => ({ id: r.product.id, label: r.product.title, value: conversion(r.product), display: f.percent(conversion(r.product)), meta: `${f.number(r.product.views)} views · ${typeMeta(r.product.type).label}` }))
  .sort((a, b) => b.value - a.value))

const campaignRows = computed(() => (store.snapshot?.campaigns ?? [])
  .filter(c => c.sent > 0)
  .map(c => ({ id: c.id, label: c.name, value: c.revenue, display: f.money(c.revenue), meta: `${f.percent(campaignRates(c).openRate, 0)} open · ${f.percent(campaignRates(c).clickRate, 0)} click` })))

const revenueRows = computed(() => byProduct.value.slice(0, 6).map(r => ({ id: r.product.id, label: r.product.title, value: r.revenue, display: f.money(r.revenue), meta: `${r.units} units` })))
</script>

<template>
  <div class="an">
    <PageIntro lead="Revenue, orders, conversion, campaigns and community in one view. Every figure is computed from the orders and events in this workspace.">
      <UiSegmented v-model="period" label="Period" :options="[{ value: 7, label: '7 days' }, { value: 30, label: '30 days' }]" />
    </PageIntro>

    <div class="an__kpis"><UiStat v-for="k in kpis" :key="k.id" :metric="k" /></div>

    <UiCard title="Revenue" :subtitle="`Paid orders, last ${period} days`">
      <AreaChart :points="revenue" :format-value="v => f.money(v)" :label="`Daily revenue, last ${period} days`" />
    </UiCard>

    <div class="an__grid">
      <UiCard title="Revenue by product" subtitle="All time"><BarList :items="revenueRows" /></UiCard>
      <UiCard title="Product conversion" subtitle="Units sold ÷ page views"><BarList :items="conversionRows" tone="ai" /></UiCard>
      <UiCard title="Campaign performance" subtitle="Attributed revenue"><BarList :items="campaignRows" tone="flare" /></UiCard>
      <UiCard title="Community growth" subtitle="Members per week">
        <MiniColumns :points="communityGrowth" label="Community members per week" tone="primary" />
      </UiCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.an {
  display: grid;
  gap: 1.25rem;

  &__kpis {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @include respond-to('md') { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    @include respond-to('xl') { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  }

  &__grid {
    display: grid;
    gap: 1.25rem;

    @include respond-to('lg') { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
}
</style>
