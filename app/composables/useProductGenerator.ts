// Reactive wrapper around the framework-free generation service.
import type { DraftField, GenerationPhase, GenerationStageId, ProductDraft, ProductGenerationEvidence } from '~/types'
import {
  ACCEPTED_IMAGE_TYPES, DRAFT_FIELD_LABELS, GENERATION_STAGES, MAX_IMAGE_BYTES, READY_CONFIDENCE, SAMPLE_IMAGES,
  type SampleImage,
} from '~/config/generation.config'
import { generateProduct, prepareImage, totalGenerationMs, type PreparedImage } from '~/services/generation.service'
import { emptyDraft } from '~/services/commerce.service'
import { DEFAULT_CURRENCY, DEFAULT_WORKSPACE_ID } from '~/config/app.config'

const FIELDS = Object.keys(DRAFT_FIELD_LABELS) as DraftField[]

export function useProductGenerator() {
  const phase = ref<GenerationPhase>('idle')
  const image = ref<PreparedImage | null>(null)
  const stageIndex = ref(-1)
  const draft = reactive<ProductDraft>(emptyDraft())
  /** What the AI wrote, per field — used to tell AI text from human edits. */
  const generated = reactive<Partial<Record<DraftField, unknown>>>({})
  const confidence = ref(0)
  const evidence = ref<ProductGenerationEvidence[]>([])
  const error = ref<string | null>(null)
  let controller: AbortController | null = null

  const stages = GENERATION_STAGES
  const currentStage = computed(() => stages[stageIndex.value] ?? null)
  const progress = computed(() => {
    if (phase.value === 'ready') return 1
    if (stageIndex.value < 0) return 0
    return stageIndex.value / stages.length
  })

  function stageState(id: GenerationStageId): 'pending' | 'active' | 'done' {
    const i = stages.findIndex(s => s.id === id)
    if (phase.value === 'ready' || i < stageIndex.value) return 'done'
    return i === stageIndex.value && phase.value === 'analyzing' ? 'active' : 'pending'
  }

  function isGenerated(field: DraftField) {
    return field in generated
  }

  function isEdited(field: DraftField) {
    if (!isGenerated(field)) return false
    return JSON.stringify(draft[field]) !== JSON.stringify(generated[field])
  }

  const aiFieldCount = computed(() => FIELDS.filter(f => isGenerated(f)).length)
  const editedCount = computed(() => FIELDS.filter(f => isEdited(f)).length)
  const ready = computed(() => phase.value === 'ready' && confidence.value >= READY_CONFIDENCE && draft.title.trim().length > 0)
  const needsReview = computed(() => phase.value === 'ready' && confidence.value < READY_CONFIDENCE)

  function evidenceFor(field: DraftField | 'seo' | 'vision') {
    const key = field === 'seoTitle' || field === 'seoDescription' ? 'seo' : field
    return evidence.value.find(e => e.field === key)?.reason
  }

  function validate(file: File): string | null {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Please choose a PNG, JPG, WebP, GIF, AVIF or SVG image.'
    if (file.size > MAX_IMAGE_BYTES) return 'That image is larger than 12 MB — try a smaller one.'
    return null
  }

  function clearDraft() {
    Object.assign(draft, emptyDraft())
    for (const k of Object.keys(generated)) delete generated[k as DraftField]
    confidence.value = 0
    evidence.value = []
  }

  async function run(source: File | SampleImage) {
    controller?.abort()
    controller = new AbortController()
    error.value = null
    clearDraft()

    if (source instanceof File) {
      const invalid = validate(source)
      if (invalid) { error.value = invalid; phase.value = image.value ? 'uploaded' : 'idle'; return }
    }

    try {
      image.value = await prepareImage(source instanceof File ? source : { src: source.src, fileName: source.fileName })
      phase.value = 'analyzing'
      stageIndex.value = 0
      const result = await generateProduct(
        { imageAssetId: image.value.fileName, workspaceId: DEFAULT_WORKSPACE_ID, currency: DEFAULT_CURRENCY, locale: 'en' },
        image.value,
        {
          signal: controller.signal,
          onStage: (_, i) => { stageIndex.value = i },
          onPartial: (partial) => {
            const map: Partial<ProductDraft> = {
              ...(partial.title !== undefined && { title: partial.title }),
              ...(partial.description !== undefined && { description: partial.description }),
              ...(partial.category !== undefined && { category: partial.category }),
              ...(partial.suggestedPrice !== undefined && { price: partial.suggestedPrice }),
              ...(partial.sku !== undefined && { sku: partial.sku }),
              ...(partial.tags !== undefined && { tags: [...partial.tags] }),
              ...(partial.seoTitle !== undefined && { seoTitle: partial.seoTitle }),
              ...(partial.seoDescription !== undefined && { seoDescription: partial.seoDescription }),
            }
            Object.assign(draft, map)
            for (const [k, v] of Object.entries(map)) generated[k as DraftField] = Array.isArray(v) ? [...v] : v
          },
        },
      )
      draft.type = result.productType
      confidence.value = result.confidence
      evidence.value = result.evidence ?? []
      stageIndex.value = stages.length
      phase.value = 'ready'
    } catch (e) {
      if ((e as DOMException).name === 'AbortError') return
      error.value = (e as Error).message || 'Something went wrong while reading the image.'
      phase.value = 'error'
    }
  }

  function reset() {
    controller?.abort()
    controller = null
    phase.value = 'idle'
    image.value = null
    stageIndex.value = -1
    error.value = null
    clearDraft()
  }

  function restoreField(field: DraftField) {
    if (!isGenerated(field)) return
    const v = generated[field]
    ;(draft as Record<DraftField, unknown>)[field] = Array.isArray(v) ? [...v] : v
  }

  onBeforeUnmount(() => controller?.abort())

  return {
    phase, image, stageIndex, stages, currentStage, progress, draft, confidence, evidence, error,
    aiFieldCount, editedCount, ready, needsReview,
    samples: SAMPLE_IMAGES,
    fieldLabels: DRAFT_FIELD_LABELS,
    readyThreshold: READY_CONFIDENCE,
    totalMs: totalGenerationMs(),
    stageState, isGenerated, isEdited, evidenceFor, run, reset, restoreField,
  }
}
