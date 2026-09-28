<script setup lang="ts">
definePageMeta({ layout: 'app', title: 'Overview' })
useHead({ title: 'Overview' })

const { workspace, activity } = useWorkspace()
const { user } = useAuth()
const { kpis, revenue, byProduct } = useAnalytics()
const { open: openInsights } = useAIInsights()
const { products } = useProducts()
const f = useFormat()

const drafts = computed(() => products.value.filter(p => p.status === 'draft'))
const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
})
const topProducts = computed(() => byProduct.value.slice(0, 5).map(r => ({
  id: r.product.id, label: r.product.title, value: r.revenue, display: f.money(r.revenue), meta: `${r.units} sold`,
})))
</script>

<template>
  <div class="dash">
    <PageIntro :lead="`${greeting}, ${user?.name.split(' ')[0] ?? 'there'}. Here is how ${workspace?.name} is doing over the last 30 days.`">
      <UiButton variant="secondary" icon="plus" to="/products?new=1">New product</UiButton>
      <UiButton icon="wand" to="/">Photo → product</UiButton>
    </PageIntro>

    <div v-if="drafts.length" class="dash__drafts">
      <UiIcon name="box" :size="18" />
      <p><strong>{{ drafts.length }} draft{{ drafts.length > 1 ? 's' : '' }}</strong> waiting to be published — {{ drafts.map(d => d.title).slice(0, 2).join(', ') }}{{ drafts.length > 2 ? '…' : '' }}</p>
      <UiButton size="sm" variant="dark" :to="`/products/${drafts[0]!.id}`">Review</UiButton>
    </div>

    <div class="dash__kpis">
      <UiStat v-for="k in kpis" :key="k.id" :metric="k" />
    </div>

    <div class="dash__grid">
      <UiCard title="Revenue" subtitle="Paid orders per day" class="dash__rev">
        <template #actions><UiButton size="sm" variant="ghost" to="/analytics" icon-right="arrowRight">Analytics</UiButton></template>
        <AreaChart :points="revenue" :format-value="v => f.money(v)" label="Daily revenue, last 30 days" />
      </UiCard>

      <UiCard title="Marketing Brain" subtitle="Evidence-backed next actions" class="dash__ai">
        <template #actions><UiBadge tone="ai" icon="sparkles">{{ openInsights.length }} open</UiBadge></template>
        <ul v-if="openInsights.length" class="dash__insights">
          <li v-for="i in openInsights.slice(0, 3)" :key="i.id">
            <NuxtLink to="/marketing" class="dash__insight">
              <span class="dash__insight-type">{{ i.type }}</span>
              <strong>{{ i.title }}</strong>
              <span class="dash__insight-ev">{{ i.evidence.length }} signals · {{ Math.round(i.confidence * 100) }}% confidence</span>
            </NuxtLink>
          </li>
        </ul>
        <UiEmpty v-else icon="sparkles" title="No open insights" text="Run an analysis to look for opportunities in your data." />
        <UiButton variant="ai" block icon="sparkles" to="/marketing?run=1">Run AI analysis</UiButton>
      </UiCard>

      <UiCard title="Top products" subtitle="By revenue">
        <BarList :items="topProducts" />
      </UiCard>

      <UiCard title="Recent activity">
        <template #actions><UiButton size="sm" variant="ghost" to="/customers" icon-right="arrowRight">CRM</UiButton></template>
        <ActivityFeed :events="activity.slice(0, 7)" />
      </UiCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dash {
  &__drafts {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding: 0.8rem 1rem;
    border: 1px solid var(--c-warn-soft);
    border-radius: var(--radius-md);
    background: var(--c-warn-soft);
    color: var(--c-warn);

    p { flex: 1; color: var(--c-ink-2); font-size: 0.88rem; }
  }

  &__kpis {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.25rem;

    @include respond-to('md') { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    @include respond-to('xl') { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  }

  &__grid {
    display: grid;
    gap: 1.25rem;

    @include respond-to('lg') { grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); }
  }

  &__ai {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    @include ai-mark;
  }

  &__insights { display: grid; gap: 0.6rem; flex: 1; }

  &__insight {
    display: grid;
    gap: 0.2rem;
    padding: 0.75rem 0.85rem;
    border-radius: var(--radius-md);
    background: var(--c-surface);
    border: 1px solid var(--c-ai-line);
    transition: transform var(--dur-fast);

    strong { font-size: 0.88rem; line-height: 1.35; }
    &:hover { transform: translateX(2px); }
  }

  &__insight-type {
    @include eyebrow;
    color: var(--c-ai-ink);
    font-size: 0.62rem;
  }

  &__insight-ev { color: var(--c-muted); font-size: 0.74rem; }
}
</style>
