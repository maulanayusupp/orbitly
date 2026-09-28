<script setup lang="ts">
// Manual create flow (PRD §5.B): type → details → pricing → access → publish.
import type { ProductDraft, ProductType } from '~/types'
import { CREATE_STEPS, type CreateStepId } from '~/config/products.config'
import { emptyDraft } from '~/services/commerce.service'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; created: [id: string] }>()
const { create, setStatus, types, typeMeta, blockers } = useProducts()
const { community } = useCommunity()
const { push } = useToast()
const f = useFormat()

const step = ref<CreateStepId>('type')
const draft = reactive<ProductDraft>(emptyDraft())
const assetName = ref('')
const communityAccess = ref(true)
const index = computed(() => CREATE_STEPS.findIndex(s => s.id === step.value))

watch(() => props.open, (o) => {
  if (!o) return
  Object.assign(draft, emptyDraft())
  step.value = 'type'
  assetName.value = ''
  communityAccess.value = true
})

const issues = computed(() => blockers({ title: draft.title, description: draft.description, price: draft.price ?? Number.NaN }))
const canNext = computed(() => {
  if (step.value === 'details') return draft.title.trim().length > 0
  if (step.value === 'pricing') return draft.price !== null && draft.price >= 0
  return true
})

function choose(type: ProductType) {
  draft.type = type
  step.value = 'details'
}

function next() { step.value = CREATE_STEPS[Math.min(index.value + 1, CREATE_STEPS.length - 1)]!.id }
function back() { step.value = CREATE_STEPS[Math.max(index.value - 1, 0)]!.id }

function onAsset(e: Event) {
  assetName.value = (e.target as HTMLInputElement).files?.[0]?.name ?? ''
}

function finish(publish: boolean) {
  const product = create({ ...draft, tags: [...draft.tags] })
  if (publish) setStatus(product.id, 'published')
  push(publish ? `Published “${product.title}”` : `Saved “${product.title}” as a draft`)
  emit('created', product.id)
}
</script>

<template>
  <UiModal :open="open" title="New product" size="lg" @close="emit('close')">
    <ol class="wiz__steps" aria-label="Progress">
      <li v-for="(s, i) in CREATE_STEPS" :key="s.id" :class="{ 'is-done': i < index, 'is-current': i === index }" :aria-current="i === index ? 'step' : undefined">
        <span class="num">{{ i + 1 }}</span>{{ s.label }}
      </li>
    </ol>

    <div v-if="step === 'type'" class="wiz__types">
      <button v-for="t in types" :key="t.id" type="button" class="wiz__type" :class="{ 'is-on': draft.type === t.id }" @click="choose(t.id)">
        <UiIcon :name="t.icon" :size="22" />
        <strong>{{ t.label }}</strong>
        <span>{{ t.description }}</span>
      </button>
    </div>

    <div v-else-if="step === 'details'" class="wiz__form">
      <UiField label="Title" for="w-title">
        <input id="w-title" v-model="draft.title" class="input" placeholder="e.g. Glaze Recipe Pack Vol. 3">
      </UiField>
      <UiField label="Description" for="w-desc" :hint="`${draft.description.length} characters — at least 20 to publish.`">
        <textarea id="w-desc" v-model="draft.description" rows="5" class="input" placeholder="What does the buyer get, and why will they love it?" />
      </UiField>
      <UiField label="Tags" for="w-tags">
        <UiTagInput id="w-tags" v-model="draft.tags" placeholder="Add tags" />
      </UiField>
    </div>

    <div v-else-if="step === 'pricing'" class="wiz__form">
      <UiField label="Price (USD)" for="w-price" hint="Set 0 for a free lead magnet.">
        <input id="w-price" v-model.number="draft.price" type="number" min="0" step="1" class="input num" placeholder="0">
      </UiField>
      <p v-if="draft.type === 'membership'" class="wiz__note"><UiIcon name="refresh" :size="16" /> Billed monthly. Members can cancel anytime.</p>
    </div>

    <div v-else-if="step === 'access'" class="wiz__form">
      <p class="wiz__note"><UiIcon name="zap" :size="16" /> After checkout the buyer gets: <strong>{{ typeMeta(draft.type).fulfillment }}</strong></p>
      <UiField v-if="draft.type === 'digital' || draft.type === 'course'" label="Upload the file buyers receive" for="w-asset" hint="Stays in your browser in this demo — only the name is kept.">
        <input id="w-asset" type="file" class="input" @change="onAsset">
      </UiField>
      <p v-if="assetName" class="wiz__asset"><UiIcon name="file" :size="16" /> {{ assetName }}</p>
      <label class="wiz__check">
        <input v-model="communityAccess" type="checkbox">
        <span>Also grant access to <strong>{{ community?.name }}</strong> community</span>
      </label>
    </div>

    <div v-else class="wiz__review">
      <dl>
        <div><dt>Type</dt><dd>{{ typeMeta(draft.type).label }}</dd></div>
        <div><dt>Title</dt><dd>{{ draft.title || '—' }}</dd></div>
        <div><dt>Price</dt><dd class="num">{{ draft.price === null ? '—' : f.money(draft.price) }}</dd></div>
        <div><dt>Fulfilment</dt><dd>{{ typeMeta(draft.type).fulfillment }}{{ communityAccess ? ' + community access' : '' }}</dd></div>
      </dl>
      <div v-if="issues.length" class="wiz__issues">
        <p><UiIcon name="alert" :size="16" /> Before publishing:</p>
        <ul><li v-for="i in issues" :key="i">{{ i }}</li></ul>
      </div>
    </div>

    <template #footer>
      <UiButton v-if="index > 0" variant="ghost" icon="arrowLeft" @click="back">Back</UiButton>
      <template v-if="step === 'publish'">
        <UiButton variant="secondary" @click="finish(false)">Save draft</UiButton>
        <UiButton icon="globe" :disabled="issues.length > 0" @click="finish(true)">Publish</UiButton>
      </template>
      <UiButton v-else-if="step !== 'type'" icon-right="arrowRight" :disabled="!canNext" @click="next">Continue</UiButton>
    </template>
  </UiModal>
</template>

<style lang="scss" scoped>
.wiz {
  &__steps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1rem;
    margin-bottom: 1.5rem;
    color: var(--c-faint);
    font-size: 0.8rem;
    font-weight: 600;

    li { display: flex; align-items: center; gap: 0.4rem; }

    span {
      display: grid;
      place-items: center;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
      background: var(--c-surface-2);
      font-size: 0.7rem;
    }

    .is-current { color: var(--c-ink); span { background: var(--c-primary); color: var(--c-primary-ink); } }
    .is-done { color: var(--c-ink-2); span { background: var(--c-primary-soft); color: var(--c-primary); } }
  }

  &__types {
    display: grid;
    gap: 0.75rem;

    @include respond-to('sm') { grid-template-columns: 1fr 1fr; }
    @include respond-to('md') { grid-template-columns: repeat(3, 1fr); }
  }

  &__type {
    display: grid;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-md);
    text-align: left;
    transition: border-color var(--dur-fast), background var(--dur-fast);

    .ui-icon { color: var(--c-primary); }
    strong { font-size: 0.92rem; }
    span { color: var(--c-muted); font-size: 0.8rem; }

    &:hover, &.is-on { border-color: var(--c-primary); background: var(--c-primary-soft); }
  }

  &__form { display: grid; gap: 1rem; }

  &__note, &__asset {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 0.9rem;
    border-radius: var(--radius-sm);
    background: var(--c-surface-2);
    font-size: 0.88rem;
  }

  &__check {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.9rem;

    input { width: 1.1rem; height: 1.1rem; accent-color: var(--c-primary); }
  }

  &__review {
    display: grid;
    gap: 1rem;

    dl { display: grid; gap: 0.6rem; }
    dl div { display: grid; grid-template-columns: 7rem 1fr; gap: 1rem; font-size: 0.9rem; }
    dt { color: var(--c-muted); }
    dd { margin: 0; font-weight: 500; }
  }

  &__issues {
    padding: 0.8rem 1rem;
    border-radius: var(--radius-sm);
    background: var(--c-warn-soft);
    color: var(--c-warn);
    font-size: 0.85rem;

    p { display: flex; align-items: center; gap: 0.4rem; font-weight: 600; }
    ul { margin-top: 0.3rem; padding-left: 1.5rem; list-style: disc; color: var(--c-ink-2); }
  }
}
</style>
