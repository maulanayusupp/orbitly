// "Marketing Brain" (PRD §5.G) — deterministic rules over internal signals.
// Every insight carries the evidence it was derived from; nothing here takes
// an external action. Approval happens in the UI and only creates a campaign
// in "scheduled" state inside the demo.
import type { DemoSnapshot, Insight, InsightEvidence } from '~/types'
import { revenueByProduct } from '~/services/analytics.service'
import { formatMoney, formatPercent } from '~/utils/format'
import { createId } from '~/utils/id'

const DAY = 86_400_000

export interface BrainStep {
  id: string
  label: string
  source: InsightEvidence['source']
  durationMs: number
}

export const BRAIN_STEPS: BrainStep[] = [
  { id: 'orders', label: 'Reading 60 days of orders', source: 'orders', durationMs: 700 },
  { id: 'products', label: 'Comparing product views and conversion', source: 'products', durationMs: 600 },
  { id: 'community', label: 'Scanning community posts and reactions', source: 'community', durationMs: 700 },
  { id: 'customers', label: 'Segmenting customers by behaviour', source: 'customers', durationMs: 600 },
  { id: 'campaigns', label: 'Scoring past campaign performance', source: 'campaigns', durationMs: 500 },
]

export function analyze(snapshot: DemoSnapshot, now = Date.now()): Insight[] {
  const ws = snapshot.workspace.id
  const insights: Insight[] = []
  const paid = snapshot.orders.filter(o => o.status === 'paid')
  const last7 = paid.filter(o => now - new Date(o.createdAt).getTime() <= 7 * DAY)
  const prev7 = paid.filter(o => {
    const age = now - new Date(o.createdAt).getTime()
    return age > 7 * DAY && age <= 14 * DAY
  })
  const rev = (os: typeof paid) => os.reduce((s, o) => s + o.total, 0)

  // 1. Revenue trend / anomaly
  const r7 = rev(last7), rp = rev(prev7)
  if (rp > 0) {
    const delta = (r7 - rp) / rp
    insights.push({
      id: createId('ins'), workspaceId: ws, type: Math.abs(delta) > 0.25 ? 'anomaly' : 'trend', status: 'new',
      confidence: Math.min(0.95, 0.6 + Math.min(last7.length, 30) / 100),
      title: delta >= 0 ? `Revenue is up ${formatPercent(delta, 0)} week over week` : `Revenue dipped ${formatPercent(-delta, 0)} week over week`,
      evidence: [
        { signal: 'Revenue, last 7 days', value: formatMoney(r7, snapshot.workspace.currency), source: 'orders' },
        { signal: 'Revenue, previous 7 days', value: formatMoney(rp, snapshot.workspace.currency), source: 'orders' },
        { signal: 'Orders, last 7 days', value: String(last7.length), source: 'orders' },
      ],
      recommendation: delta >= 0
        ? 'Momentum is building — feature your best seller on the storefront banner this week.'
        : 'Check whether a campaign ended recently and consider a members-only offer to recover.',
    })
  }

  // 2. Best-converting product with low traffic → promote it
  const ranked = revenueByProduct(paid, snapshot.products.filter(p => p.status === 'published'))
  const conv = ranked
    .filter(r => r.product.views > 200)
    .map(r => ({ ...r, rate: r.units / r.product.views }))
    .sort((a, b) => b.rate - a.rate)
  const star = conv[0]
  if (star) {
    insights.push({
      id: createId('ins'), workspaceId: ws, type: 'opportunity', status: 'new', confidence: 0.78,
      title: `${star.product.title} converts best — send it more traffic`,
      evidence: [
        { signal: 'View → purchase conversion', value: formatPercent(star.rate), source: 'products' },
        { signal: 'Page views (all time)', value: star.product.views.toLocaleString('en-US'), source: 'products' },
        { signal: 'Revenue from this product', value: formatMoney(star.revenue, snapshot.workspace.currency), source: 'orders' },
      ],
      recommendation: `Promote ${star.product.title} to subscribers who have not bought it yet.`,
      message: `${star.product.description}\n\nIt is the most-loved thing in our shop right now — ${star.units} people picked it up already. If it has been on your list, this is a good week to grab it.`,
      proposedCampaign: { channel: 'email', name: `Spotlight: ${star.product.title}`, audience: 'Subscribers without this product', budget: 0 },
    })
  }

  // 3. Community engagement → upsell
  const questions = snapshot.posts.filter(p => p.body.includes('?')).length
  const reactions = snapshot.posts.reduce((s, p) => s + p.reactions.like + p.reactions.fire + p.reactions.idea, 0)
  const critique = snapshot.products.find(p => p.type === 'service')
  if (critique) {
    insights.push({
      id: createId('ins'), workspaceId: ws, type: 'opportunity', status: 'new', confidence: 0.71,
      title: 'Active members are asking for hands-on help',
      evidence: [
        { signal: 'Question posts in the feed', value: String(questions), source: 'community' },
        { signal: 'Reactions on recent posts', value: String(reactions), source: 'community' },
        { signal: `${critique.title} sales`, value: String(critique.sales), source: 'products' },
      ],
      recommendation: `Offer members a limited run of ${critique.title} slots at an early-bird price.`,
      message: `So many great questions in the community lately. I am opening a small batch of ${critique.title} slots for members first — we look at your pieces together and you get a written follow-up. Reply or tap the link to grab one.`,
      proposedCampaign: { channel: 'social', name: 'Members-only critique slots', audience: 'Community members', budget: 40 },
    })
  }

  // 4. Churn risk
  const churned = snapshot.customers.filter(c => c.status === 'churned')
  if (churned.length) {
    const ltv = churned.reduce((s, c) => s + c.lifetimeValue, 0)
    insights.push({
      id: createId('ins'), workspaceId: ws, type: 'risk', status: 'new', confidence: 0.66,
      title: `${churned.length} past customers have gone quiet`,
      evidence: [
        { signal: 'Customers marked churned', value: String(churned.length), source: 'customers' },
        { signal: 'Their combined lifetime value', value: formatMoney(ltv, snapshot.workspace.currency), source: 'customers' },
      ],
      recommendation: 'Send a personal win-back note with what is new since they left.',
      message: 'It has been a while! Since you last visited we have added new glaze recipes, a live cohort and a members-only community. Your seat is still here whenever you want it.',
      proposedCampaign: { channel: 'email', name: 'We saved your seat — win-back', audience: 'Churned customers', budget: 0 },
    })
  }

  // 5. Draft AI-generated products waiting
  const drafts = snapshot.products.filter(p => p.status === 'draft')
  if (drafts.length) {
    insights.push({
      id: createId('ins'), workspaceId: ws, type: 'opportunity', status: 'new', confidence: 0.9,
      title: `${drafts.length} product${drafts.length > 1 ? 's are' : ' is'} ready but unpublished`,
      evidence: drafts.slice(0, 3).map(d => ({ signal: d.aiGenerated ? 'AI-generated draft' : 'Draft', value: d.title, source: 'products' as const })),
      recommendation: 'Review and publish drafts — unpublished products cannot sell.',
    })
  }

  return insights
}

/** Copy the campaign assistant proposes for an approved insight. */
// Evidence is for the owner and is shown beside the draft, never inside it.
export function draftCampaignCopy(insight: Insight, brand: string): { subject: string; body: string } {
  const subject = insight.proposedCampaign?.name ?? insight.title
  const message = insight.message ?? insight.recommendation
  return { subject, body: `Hi {first_name},\n\n${message}\n\n— ${brand}` }
}
