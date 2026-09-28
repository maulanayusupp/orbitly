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
            <thead><tr><th>Campaign</th><th>Status</th><th class="r">Sent</th><th class="r">Open</th><th class="r">Click</th><th class="r">Revenue</th></tr></thead>
            <tbody>
              <tr v-for="c in campaigns" :key="c.id">
                <td>
                  <span class="mk__cname">
                    <UiIcon :name="channelIcon[c.channel]" :size="16" />
                    <span><strong>{{ c.name }}</strong><small>{{ c.audience }}<template v-if="c.insightId"> · from AI insight</template></small></span>
                  </span>
                </td>
                <td><UiBadge :tone="statusTone[c.status]" dot>{{ c.status.replace('_', ' ') }}</UiBadge></td>
                <td class="r num">{{ f.number(c.sent, true) }}</td>
                <td class="r num">{{ c.sent ? f.percent(campaignRates(c).openRate, 0) : '—' }}</td>
                <td class="r num">{{ c.opened ? f.percent(campaignRates(c).clickRate, 0) : '—' }}</td>
                <td class="r num">{{ c.revenue ? f.money(c.revenue) : '—' }}</td>
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

    @include respond-to('xl') { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); }
  }

  &__table {
    overflow-x: auto;

    table { min-width: 40rem; font-size: 0.84rem; }
    th { padding: 0.6rem 1rem; background: var(--c-surface-2); color: var(--c-muted); font-size: 0.72rem; text-align: left; text-transform: uppercase; }
    td { padding: 0.7rem 1rem; border-top: 1px solid var(--c-line); }
    .r { text-align: right; }
    :deep(.badge) { text-transform: capitalize; }
  }

  &__cname {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;

    .ui-icon { margin-top: 0.15rem; color: var(--c-primary); }
    span { display: grid; line-height: 1.35; }
    small { color: var(--c-muted); font-size: 0.74rem; }
  }

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
