<script setup lang="ts">
import type { Insight } from '~/types'

definePageMeta({ layout: 'app', title: 'Marketing & AI' })
useHead({ title: 'Marketing & AI' })

const route = useRoute()
const { store } = useWorkspace()
const ai = useAIInsights()
const { campaignRates } = useAnalytics()
const { push } = useToast()
const f = useFormat()

const reviewing = ref<Insight | null>(null)
const view = ref<'open' | 'approved'>('open')
const campaigns = computed(() => store.snapshot?.campaigns ?? [])
const shown = computed(() => (view.value === 'open' ? ai.open.value : ai.approved.value))

const statusTone = { draft: 'neutral', awaiting_approval: 'warn', scheduled: 'info', running: 'ai', completed: 'success' } as const
const channelIcon = { email: 'mail', social: 'megaphone', whatsapp: 'message' } as const

async function run() {
  await ai.run()
  view.value = 'open'
  push(`Marketing Brain found ${ai.open.value.length} insights`, 'ai')
}

function approve(copy: { subject: string; body: string }) {
  if (!reviewing.value) return
  const campaign = ai.approve(reviewing.value.id, copy)
  reviewing.value = null
  push(campaign ? `Scheduled “${campaign.name}” for tomorrow` : 'Insight approved', 'success')
}

function dismiss(id: string) {
  ai.dismiss(id)
  push('Insight dismissed', 'info')
}

// Social content planner — local ideas for the next 7 days.
const planner = ref(Array.from({ length: 7 }, (_, i) => {
  const d = new Date(Date.now() + i * 86_400_000)
  const seeded: Record<number, string[]> = { 0: ['Reel: trimming a foot ring'], 2: ['Carousel: Celadon #14 test tiles'], 4: ['Story: Glaze Lab Q&A'], 5: ['Reel: studio tour'] }
  return { date: d.toISOString(), items: seeded[i] ?? [] }
}))
const idea = ref('')
const ideaDay = ref(0)

function addIdea() {
  if (!idea.value.trim()) return
  planner.value[ideaDay.value]!.items.push(idea.value.trim())
  idea.value = ''
}

onMounted(() => { if (route.query.run === '1') void run() })
</script>

<template>
  <div class="mk">
    <BrainPanel :steps="ai.steps" :running="ai.running.value" :step-index="ai.stepIndex.value" :last-run-at="ai.lastRunAt.value" @run="run" />

    <section class="mk__section">
      <div class="mk__head">
        <h2>Opportunity feed</h2>
        <UiSegmented v-model="view" label="Insights" :options="[{ value: 'open', label: `Open (${ai.open.value.length})` }, { value: 'approved', label: `Approved (${ai.approved.value.length})` }]" />
      </div>
      <div v-if="shown.length" class="mk__insights">
        <InsightCard v-for="i in shown" :key="i.id" :insight="i" @review="reviewing = i" @dismiss="dismiss(i.id)" />
      </div>
      <UiEmpty v-else icon="sparkles" :title="view === 'open' ? 'No open insights' : 'Nothing approved yet'" text="Run an analysis to generate evidence-backed recommendations.">
        <UiButton v-if="view === 'open'" size="sm" variant="ai" icon="sparkles" :loading="ai.running.value" @click="run">Run AI analysis</UiButton>
      </UiEmpty>
    </section>

    <div class="mk__grid">
      <UiCard title="Campaigns" subtitle="Email, social and — later — WhatsApp" :padded="false">
        <div class="mk__table">
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th class="r">Sent</th>
                <th class="rate">Open rate</th>
                <th class="rate">Click rate</th>
                <th class="r">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in campaigns" :key="c.id">
                <td>
                  <span class="mk__cname">
                    <span class="mk__channel" :class="`mk__channel--${c.channel}`" :title="c.channel">
                      <UiIcon :name="channelIcon[c.channel]" :size="16" />
                    </span>
                    <span>
                      <strong>{{ c.name }}</strong>
                      <small>
                        {{ c.audience }}
                        <UiBadge v-if="c.insightId" tone="ai" icon="sparkles">AI insight</UiBadge>
                      </small>
                    </span>
                  </span>
                </td>
                <td><UiBadge :tone="statusTone[c.status]" dot>{{ c.status.replace('_', ' ') }}</UiBadge></td>
                <td class="r num">{{ c.sent ? f.number(c.sent, true) : '—' }}</td>
                <td class="rate">
                  <span v-if="c.sent" class="mk__rate">
                    <span class="num">{{ f.percent(campaignRates(c).openRate, 0) }}</span>
                    <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                      <rect width="100" height="4" rx="2" class="mk__rate-bg" />
                      <rect :width="campaignRates(c).openRate * 100" height="4" rx="2" class="mk__rate-open" />
                    </svg>
                  </span>
                  <span v-else class="mk__none">—</span>
                </td>
                <td class="rate">
                  <span v-if="c.opened" class="mk__rate">
                    <span class="num">{{ f.percent(campaignRates(c).clickRate, 0) }}</span>
                    <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                      <rect width="100" height="4" rx="2" class="mk__rate-bg" />
                      <rect :width="campaignRates(c).clickRate * 100" height="4" rx="2" class="mk__rate-click" />
                    </svg>
                  </span>
                  <span v-else class="mk__none">—</span>
                </td>
                <td class="r num"><strong v-if="c.revenue">{{ f.money(c.revenue) }}</strong><span v-else class="mk__none">—</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiCard>

      <UiCard title="Social content planner" subtitle="Next 7 days">
        <ol class="mk__plan">
          <li v-for="(d, i) in planner" :key="d.date">
            <span class="mk__day"><strong>{{ f.date(d.date, { weekday: 'short' }) }}</strong><small class="num">{{ f.date(d.date, { day: 'numeric' }) }}</small></span>
            <div>
              <p v-for="(it, j) in d.items" :key="j" class="mk__idea">{{ it }}</p>
              <p v-if="!d.items.length" class="mk__free">Open slot</p>
            </div>
            <span class="visually-hidden">Day {{ i + 1 }}</span>
          </li>
        </ol>
        <form class="mk__add" @submit.prevent="addIdea">
          <label for="mk-day" class="visually-hidden">Day</label>
          <select id="mk-day" v-model.number="ideaDay">
            <option v-for="(d, i) in planner" :key="d.date" :value="i">{{ f.date(d.date, { weekday: 'short' }) }}</option>
          </select>
          <label for="mk-idea" class="visually-hidden">Post idea</label>
          <input id="mk-idea" v-model="idea" placeholder="Add a post idea">
          <UiButton type="submit" size="sm" icon="plus" :disabled="!idea.trim()">Add</UiButton>
        </form>
      </UiCard>
    </div>

    <ApprovalModal :insight="reviewing" @close="reviewing = null" @approve="approve" />
  </div>
</template>

<style lang="scss" scoped>
.mk {
  display: grid;
  gap: 1.75rem;

  &__section { display: grid; gap: 1rem; }

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;

    h2 { font-size: 1.2rem; }
  }

  &__insights {
    display: grid;
    gap: 1rem;

    @include respond-to('md') { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    @include respond-to('xl') { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  &__grid {
    display: grid;
    gap: 1.25rem;
    align-items: start;

    @include respond-to('xxl') { grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); }
  }

  &__table {
    overflow-x: auto;
    border-top: 1px solid var(--c-line);

    table { min-width: 46rem; font-size: 0.86rem; }

    th {
      padding: 0.7rem 1rem;
      background: var(--c-surface-2);
      color: var(--c-muted);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-align: left;
      text-transform: uppercase;
      white-space: nowrap;
    }

    td {
      padding: 0.85rem 1rem;
      border-top: 1px solid var(--c-line);
      vertical-align: middle;
    }

    th:first-child, td:first-child { padding-left: clamp(1rem, 2.4vw, 1.4rem); }
    th:last-child, td:last-child { padding-right: clamp(1rem, 2.4vw, 1.4rem); }

    tbody tr { transition: background var(--dur-fast); }
    tbody tr:hover { background: var(--c-surface-2); }

    .r { text-align: right; white-space: nowrap; }
    .rate { width: 8rem; min-width: 7rem; }
    td:first-child { min-width: 17rem; }
    :deep(.badge) { text-transform: capitalize; }
  }

  &__cname {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    > span:last-child { display: grid; gap: 0.15rem; min-width: 0; line-height: 1.35; }
    strong { font-weight: 600; }

    small {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.4rem;
      color: var(--c-muted);
      font-size: 0.76rem;
    }
  }

  &__channel {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-sm);
    flex-shrink: 0;

    &--email { background: var(--c-primary-soft); color: var(--c-primary); }
    &--social { background: var(--c-flare-soft); color: var(--c-flare); }
    &--whatsapp { background: var(--c-success-soft); color: var(--c-success); }
  }

  &__rate {
    display: grid;
    gap: 0.35rem;

    svg { width: 100%; height: 4px; }
  }

  &__rate-bg { fill: var(--c-line); }
  &__rate-open { fill: var(--c-series-1); }
  &__rate-click { fill: var(--c-series-3); }
  &__none { color: var(--c-faint); }

  &__plan {
    display: grid;
    gap: 0.4rem;

    li { display: flex; gap: 0.75rem; padding-block: 0.35rem; border-bottom: 1px solid var(--c-line); }
    div { display: grid; gap: 0.3rem; flex: 1; }
  }

  &__day { display: grid; width: 2.5rem; line-height: 1.2; font-size: 0.78rem; small { color: var(--c-muted); } }
  &__idea { padding: 0.3rem 0.6rem; border-radius: var(--radius-xs); background: var(--c-flare-soft); color: var(--c-ink-2); font-size: 0.8rem; }
  &__free { color: var(--c-faint); font-size: 0.8rem; font-style: italic; }

  &__add {
    display: flex;
    gap: 0.4rem;
    margin-top: 1rem;

    select, input { height: 2rem; padding-inline: 0.6rem; border: 1px solid var(--c-line); border-radius: var(--radius-sm); font-size: 0.82rem; }
    input { flex: 1; min-width: 0; }
  }
}
</style>
