<script setup lang="ts">
// Composition root of the AI-first landing demo (PRD §15): upload → analysis →
// auto-filled, editable form → confidence → preview → workspace handoff.
import type { DraftField } from '~/types'
import { PRODUCT_TYPES } from '~/config/products.config'
import { SEO_LIMITS } from '~/config/generation.config'
import { DEFAULT_CURRENCY } from '~/config/app.config'

const gen = useProductGenerator()
const { push } = useToast()
const { store } = useWorkspace()
const { create } = useProducts()
const drop = ref<{ open: () => void } | null>(null)
const previewOpen = ref(false)
const handingOff = ref(false)

const busy = computed(() => gen.phase.value === 'analyzing')
const hasImage = computed(() => !!gen.image.value)
const listing = ref<HTMLElement | null>(null)

// Wizard: step 2 only appears once there is an image to work from.
const wizard = computed(() => [
  { id: 'upload', label: 'Upload photo', state: hasImage.value ? 'done' : 'current' },
  { id: 'review', label: 'Review listing', state: gen.phase.value === 'ready' ? 'done' : hasImage.value ? 'current' : 'todo' },
  { id: 'publish', label: 'Add to workspace', state: gen.phase.value === 'ready' ? 'current' : 'todo' },
] as const)

// On stacked (narrow) layouts, bring the finished listing into view.
watch(() => gen.phase.value, async (phase) => {
  if (phase !== 'ready' || window.matchMedia('(min-width: 64rem)').matches) return
  await nextTick()
  listing.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})
const filledOrWaiting = (f: DraftField) => gen.isGenerated(f) || gen.phase.value === 'ready'

const status = computed(() => {
  switch (gen.phase.value) {
    case 'analyzing': return { tone: 'ai', icon: 'sparkles', text: gen.currentStage.value?.label ?? 'Analysing' } as const
    case 'ready': return gen.ready.value
      ? { tone: 'success', icon: 'checkCircle', text: 'Ready to publish' } as const
      : { tone: 'warn', icon: 'alert', text: 'Review suggested' } as const
    case 'error': return { tone: 'danger', icon: 'alert', text: 'Could not read image' } as const
    default: return { tone: 'neutral', icon: 'image', text: 'Waiting for an image' } as const
  }
})

function field(f: DraftField) {
  return { generated: gen.isGenerated(f), edited: gen.isEdited(f), evidence: gen.evidenceFor(f) }
}

async function toWorkspace() {
  if (gen.phase.value !== 'ready' || !gen.image.value) return
  handingOff.value = true
  await store.ensureLoaded()
  const product = create({ ...gen.draft, tags: [...gen.draft.tags] }, { coverUrl: gen.image.value.dataUrl, aiGenerated: true })
  push('Draft saved to your Orbitly workspace', 'ai')
  await navigateTo(`/products/${product.id}?from=generator`)
}

function openPicker() { drop.value?.open() }
function runSample() { void gen.run(gen.samples[0]!) }

defineExpose({ openPicker, runSample })
</script>

<template>
  <div class="studio" :class="[`studio--${gen.phase.value}`, { 'studio--open': hasImage }]">
    <ol class="studio__wizard" aria-label="Steps">
      <li v-for="(w, i) in wizard" :key="w.id" :class="`is-${w.state}`" :aria-current="w.state === 'current' ? 'step' : undefined">
        <span class="studio__wizard-n">
          <UiIcon v-if="w.state === 'done'" name="check" :size="12" :stroke-width="2.6" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        {{ w.label }}
      </li>
    </ol>

    <!-- Left: image + analysis -->
    <section class="studio__col studio__visual" aria-label="Product image">
      <header class="studio__head">
        <span class="studio__step">1</span>
        <h2>Your product photo</h2>
      </header>

      <div v-if="hasImage" class="studio__image">
        <img :src="gen.image.value!.dataUrl" :alt="gen.draft.title || 'Uploaded product'">
        <div v-if="busy" class="studio__scan" aria-hidden="true" />
        <div v-if="gen.phase.value === 'ready'" class="studio__signals">
          <span class="studio__swatch" :style="{ '--swatch': gen.image.value!.signals.hex }" />
          <span>{{ gen.image.value!.signals.colorName }} · {{ gen.image.value!.signals.hex }}</span>
          <span class="studio__dim num">{{ gen.image.value!.signals.width }}×{{ gen.image.value!.signals.height }}</span>
        </div>
      </div>

      <ImageDrop
        ref="drop"
        :samples="gen.samples"
        :disabled="busy"
        :compact="hasImage"
        @file="gen.run"
        @sample="gen.run"
      />

      <p v-if="gen.error.value" class="studio__error" role="alert"><UiIcon name="alert" :size="16" /> {{ gen.error.value }}</p>

      <StageList
        v-if="gen.phase.value !== 'idle'"
        :stages="gen.stages"
        :state-of="gen.stageState"
        :progress="gen.progress.value"
      />
    </section>

    <!-- Right: generated listing — revealed once an image exists -->
    <Transition name="reveal">
    <section v-if="hasImage" ref="listing" class="studio__col studio__form" aria-label="Generated product listing">
      <header class="studio__head studio__head--split">
        <div class="studio__head-l">
          <span class="studio__step">2</span>
          <h2>Publish-ready listing</h2>
        </div>
        <UiBadge :tone="status.tone" :icon="status.icon">{{ status.text }}</UiBadge>
      </header>

      <div class="studio__summary" :class="{ 'is-on': gen.phase.value === 'ready' }" aria-live="polite">
        <UiConfidence :value="gen.confidence.value" :threshold="gen.readyThreshold" :size="64" />
        <div>
          <p class="studio__summary-title">
            <template v-if="gen.phase.value === 'ready'">AI confidence {{ Math.round(gen.confidence.value * 100) }}%</template>
            <template v-else>AI confidence</template>
          </p>
          <p class="studio__summary-text">
            <template v-if="gen.phase.value === 'ready'">
              {{ gen.aiFieldCount.value }} fields generated<template v-if="gen.editedCount.value">, {{ gen.editedCount.value }} edited by you</template>.
              <template v-if="gen.needsReview.value"> Check the category before publishing.</template>
              <template v-else> Everything stays editable.</template>
            </template>
            <template v-else>Appears once analysis finishes. Below {{ Math.round(gen.readyThreshold * 100) }}% we ask you to review.</template>
          </p>
        </div>
      </div>

      <form class="studio__fields" @submit.prevent>
        <UiField label="Product title" for="g-title" class="studio__f studio__f--wide" :class="{ 'is-ai': field('title').generated && !field('title').edited }">
          <template #badge><AiFlag v-bind="field('title')" @restore="gen.restoreField('title')" /></template>
          <input id="g-title" v-model="gen.draft.title" class="input" :disabled="!filledOrWaiting('title')" placeholder="AI will name your product">
        </UiField>

        <UiField label="Description" for="g-desc" class="studio__f studio__f--wide" :class="{ 'is-ai': field('description').generated && !field('description').edited }">
          <template #badge><AiFlag v-bind="field('description')" @restore="gen.restoreField('description')" /></template>
          <textarea id="g-desc" v-model="gen.draft.description" class="input" rows="5" :disabled="!filledOrWaiting('description')" placeholder="Benefit-led copy appears here" />
        </UiField>

        <UiField label="Category" for="g-cat" class="studio__f" :class="{ 'is-ai': field('category').generated && !field('category').edited }">
          <template #badge><AiFlag v-bind="field('category')" @restore="gen.restoreField('category')" /></template>
          <input id="g-cat" v-model="gen.draft.category" class="input" :disabled="!filledOrWaiting('category')" placeholder="Detected category">
        </UiField>

        <UiField label="Suggested price (USD)" for="g-price" class="studio__f" :class="{ 'is-ai': field('price').generated && !field('price').edited }">
          <template #badge><AiFlag v-bind="field('price')" @restore="gen.restoreField('price')" /></template>
          <input id="g-price" v-model.number="gen.draft.price" type="number" min="0" step="1" class="input num" :disabled="!filledOrWaiting('price')" placeholder="0">
        </UiField>

        <UiField label="SKU" for="g-sku" class="studio__f" :class="{ 'is-ai': field('sku').generated && !field('sku').edited }">
          <template #badge><AiFlag v-bind="field('sku')" @restore="gen.restoreField('sku')" /></template>
          <input id="g-sku" v-model="gen.draft.sku" class="input num" :disabled="!filledOrWaiting('sku')" placeholder="Auto-generated">
        </UiField>

        <UiField label="Product type" for="g-type" class="studio__f">
          <select id="g-type" v-model="gen.draft.type" class="input" :disabled="gen.phase.value !== 'ready'">
            <option v-for="t in PRODUCT_TYPES" :key="t.id" :value="t.id">{{ t.label }}</option>
          </select>
        </UiField>

        <UiField label="Tags" for="g-tags" class="studio__f studio__f--wide" :class="{ 'is-ai': field('tags').generated && !field('tags').edited }" hint="Press Enter or comma to add a tag.">
          <template #badge><AiFlag v-bind="field('tags')" @restore="gen.restoreField('tags')" /></template>
          <UiTagInput id="g-tags" v-model="gen.draft.tags" :ai="field('tags').generated && !field('tags').edited" placeholder="Discovery keywords" />
        </UiField>

        <UiField label="SEO title" for="g-seot" class="studio__f studio__f--wide" :counter="`${gen.draft.seoTitle.length}/${SEO_LIMITS.title}`" :class="{ 'is-ai': field('seoTitle').generated && !field('seoTitle').edited }">
          <template #badge><AiFlag v-bind="field('seoTitle')" @restore="gen.restoreField('seoTitle')" /></template>
          <input id="g-seot" v-model="gen.draft.seoTitle" class="input" :maxlength="SEO_LIMITS.title" :disabled="!filledOrWaiting('seoTitle')" placeholder="Search engine title">
        </UiField>

        <UiField label="SEO meta description" for="g-seod" class="studio__f studio__f--wide" :counter="`${gen.draft.seoDescription.length}/${SEO_LIMITS.description}`" :class="{ 'is-ai': field('seoDescription').generated && !field('seoDescription').edited }">
          <template #badge><AiFlag v-bind="field('seoDescription')" @restore="gen.restoreField('seoDescription')" /></template>
          <textarea id="g-seod" v-model="gen.draft.seoDescription" class="input" rows="2" :maxlength="SEO_LIMITS.description" :disabled="!filledOrWaiting('seoDescription')" placeholder="Search snippet" />
        </UiField>
      </form>

      <footer class="studio__actions">
        <UiButton variant="ghost" icon="refresh" :disabled="gen.phase.value === 'idle'" @click="gen.reset">Reset</UiButton>
        <div class="studio__actions-r">
          <UiButton variant="secondary" icon="eye" :disabled="gen.phase.value !== 'ready'" @click="previewOpen = true">Preview</UiButton>
          <UiButton icon-right="arrowRight" :disabled="gen.phase.value !== 'ready'" :loading="handingOff" @click="toWorkspace">
            Add to workspace
          </UiButton>
        </div>
      </footer>
    </section>
    </Transition>

    <UiModal :open="previewOpen" title="Storefront preview" size="xl" @close="previewOpen = false">
      <ProductPreview
        :title="gen.draft.title"
        :description="gen.draft.description"
        :price="gen.draft.price"
        :currency="DEFAULT_CURRENCY"
        :type="gen.draft.type"
        :cover-url="gen.image.value?.dataUrl"
        :category="gen.draft.category"
        :tags="gen.draft.tags"
        :sku="gen.draft.sku"
        :seo-title="gen.draft.seoTitle"
        :seo-description="gen.draft.seoDescription"
        slug="preview"
        show-seo
        framed
        :store-slug="store.snapshot?.workspace.slug"
        :store-name="store.snapshot?.workspace.name"
        @buy="push('Checkout is live once the product is published from your workspace.', 'info')"
      />
      <template #footer>
        <UiButton variant="ghost" @click="previewOpen = false">Keep editing</UiButton>
        <UiButton icon-right="arrowRight" :loading="handingOff" @click="toWorkspace">Add to workspace</UiButton>
      </template>
    </UiModal>
  </div>
</template>

<style lang="scss" scoped>
.studio {
  display: grid;
  gap: 1rem;
  padding: 0.5rem;
  border: 1px solid var(--c-line);
  border-radius: calc(var(--radius-xl) + 0.5rem);
  background: color-mix(in srgb, var(--c-surface) 60%, transparent);
  box-shadow: var(--shadow-lg);

  // Step 1 alone: a single, centred upload panel.
  max-width: 46rem;
  margin-inline: auto;
  transition: max-width 500ms var(--ease-out);

  &--open {
    max-width: none;

    @include respond-to('lg') {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    }
  }

  &__wizard {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.4rem 1.5rem;
    padding: 0.6rem 0.75rem 0.2rem;
    color: var(--c-faint);
    font-size: 0.8rem;
    font-weight: 600;

    @include respond-to('lg') { grid-column: 1 / -1; }

    li {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      transition: color var(--dur);
    }

    .is-current { color: var(--c-ink); }
    .is-done { color: var(--c-ai-ink); }
  }

  &__wizard-n {
    display: grid;
    place-items: center;
    width: 1.35rem;
    height: 1.35rem;
    border: 1.5px solid currentColor;
    border-radius: 50%;
    font-size: 0.68rem;

    .is-current & { border-color: var(--c-primary); background: var(--c-primary); color: var(--c-primary-ink); }
    .is-done & { border-color: var(--c-ai); background: var(--c-ai); color: var(--c-primary-ink); }
  }

  &__col {
    @include surface(var(--radius-xl));
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: clamp(1rem, 3vw, 1.6rem);
    min-width: 0;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 0.6rem;

    h2 { font-size: 1.05rem; }

    &--split { justify-content: space-between; flex-wrap: wrap; }
  }

  &__head-l { display: flex; align-items: center; gap: 0.6rem; }

  &__step {
    display: grid;
    place-items: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: var(--c-ink);
    color: var(--c-surface);
    font-size: 0.75rem;
    font-weight: 700;
  }

  &__image {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--c-surface-2);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__scan {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--c-ai) 26%, transparent) 48%, transparent 52%),
      repeating-linear-gradient(0deg, transparent 0 14px, color-mix(in srgb, var(--c-ai) 9%, transparent) 14px 15px),
      repeating-linear-gradient(90deg, transparent 0 14px, color-mix(in srgb, var(--c-ai) 9%, transparent) 14px 15px);
    background-size: 100% 220%, auto, auto;

    @include motion-safe { animation: scan 1.6s linear infinite; }
  }

  &__signals {
    position: absolute;
    bottom: 0.75rem;
    left: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.7rem 0.35rem 0.4rem;
    border-radius: var(--radius-pill);
    @include glass;
    font-size: 0.75rem;
    font-weight: 600;
  }

  &__swatch {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    background: var(--swatch);
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.1);
  }

  &__dim { color: var(--c-muted); font-weight: 500; }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.8rem;
    border-radius: var(--radius-sm);
    background: var(--c-danger-soft);
    color: var(--c-danger);
    font-size: 0.85rem;
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1rem;
    border: 1px dashed var(--c-line-strong);
    border-radius: var(--radius-md);
    opacity: 0.7;
    transition: all var(--dur);

    &.is-on {
      border-style: solid;
      @include ai-mark;
      opacity: 1;
    }
  }

  &__summary-title { font-weight: 600; font-size: 0.92rem; }
  &__summary-text { color: var(--c-muted); font-size: 0.8rem; }

  &__fields {
    display: grid;
    gap: 1rem;

    @include respond-to('sm') { grid-template-columns: 1fr 1fr; }
  }

  &__f--wide { grid-column: 1 / -1; }

  // AI-authored fields share one look: mint wash + mint border.
  &__f.is-ai :deep(.input) {
    @include ai-mark;
  }

  &__f :deep(.input:disabled) {
    background: var(--c-surface-2);
    border-style: dashed;
    cursor: not-allowed;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--c-line);
  }

  &__actions-r { display: flex; flex-wrap: wrap; gap: 0.6rem; }
}

.reveal-enter-active {
  transition: opacity 450ms var(--ease-out), transform 450ms var(--ease-out);
}

.reveal-enter-from {
  opacity: 0;
  transform: translateX(24px);

  @include respond-below('lg') { transform: translateY(16px); }
}

.reveal-leave-active { display: none; }

@keyframes scan {
  from { background-position: 0 100%, 0 0, 0 0; }
  to { background-position: 0 -100%, 0 0, 0 0; }
}
</style>
