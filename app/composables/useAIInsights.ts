import type { Insight } from '~/types'
import { analyze, BRAIN_STEPS, draftCampaignCopy } from '~/services/intelligence.service'
import { sleep } from '~/utils/id'

export function useAIInsights() {
  const { store } = useWorkspace()
  const running = useState('brain:running', () => false)
  const stepIndex = useState('brain:step', () => -1)
  const lastRunAt = useState<string | null>('brain:lastRun', () => null)

  const insights = computed(() => store.snapshot?.insights ?? [])
  const open = computed(() => insights.value.filter(i => i.status === 'new'))
  const approved = computed(() => insights.value.filter(i => i.status === 'approved'))

  async function run() {
    if (running.value || !store.snapshot) return
    running.value = true
    try {
      for (const [i, step] of BRAIN_STEPS.entries()) {
        stepIndex.value = i
        await sleep(step.durationMs)
      }
      store.replaceNewInsights(analyze(store.data))
      lastRunAt.value = new Date().toISOString()
    } finally {
      running.value = false
      stepIndex.value = -1
    }
  }

  function copyFor(insight: Insight) {
    return draftCampaignCopy(insight, store.snapshot?.workspace.name ?? 'Your studio')
  }

  return {
    insights,
    open,
    approved,
    running,
    stepIndex,
    lastRunAt,
    steps: BRAIN_STEPS,
    run,
    copyFor,
    approve: store.approveInsight,
    dismiss: store.dismissInsight,
  }
}
