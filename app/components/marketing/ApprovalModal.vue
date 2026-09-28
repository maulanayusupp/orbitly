<script setup lang="ts">
// Human-in-the-loop gate (PRD §5.G / §12): an insight becomes a campaign only
// after the owner reads the evidence, edits the draft and explicitly approves.
import type { Insight } from '~/types'

const props = defineProps<{ insight: Insight | null }>()
const emit = defineEmits<{ close: []; approve: [{ subject: string; body: string }] }>()
const { copyFor } = useAIInsights()

const subject = ref('')
const body = ref('')
const confirmed = ref(false)

watch(() => props.insight, (i) => {
  if (!i) return
  const copy = copyFor(i)
  subject.value = copy.subject
  body.value = copy.body
  confirmed.value = false
}, { immediate: true })
</script>

<template>
  <UiModal :open="!!insight" title="Review AI campaign draft" size="lg" @close="emit('close')">
    <div v-if="insight" class="ap">
      <div class="ap__meta">
        <div><span>Channel</span><strong class="ap__cap">{{ insight.proposedCampaign?.channel }}</strong></div>
        <div><span>Audience</span><strong>{{ insight.proposedCampaign?.audience }}</strong></div>
        <div><span>Budget</span><strong class="num">{{ insight.proposedCampaign?.budget ? `$${insight.proposedCampaign.budget}` : 'None' }}</strong></div>
      </div>

      <UiField label="Subject / campaign name" for="ap-sub">
        <template #badge><UiBadge tone="ai" icon="sparkles">Drafted by Campaign assistant</UiBadge></template>
        <input id="ap-sub" v-model="subject" class="input">
      </UiField>
      <UiField label="Message" for="ap-body" hint="{first_name} is replaced per recipient.">
        <textarea id="ap-body" v-model="body" rows="9" class="input" />
      </UiField>

      <details class="ap__why">
        <summary>Evidence behind this draft ({{ insight.evidence.length }} signals)</summary>
        <ul><li v-for="(e, i) in insight.evidence" :key="i">{{ e.signal }}: <strong>{{ e.value }}</strong> <em>({{ e.source }})</em></li></ul>
      </details>

      <label class="ap__confirm">
        <input v-model="confirmed" type="checkbox">
        <span>I reviewed the audience and message. Schedule this campaign.</span>
      </label>
      <p class="ap__note"><UiIcon name="shield" :size="15" /> Demo: approval schedules the campaign inside Orbitly only. No email or social post is sent.</p>
    </div>
    <template #footer>
      <UiButton variant="ghost" @click="emit('close')">Not now</UiButton>
      <UiButton icon="check" :disabled="!confirmed || !subject.trim()" @click="emit('approve', { subject, body })">Approve &amp; schedule</UiButton>
    </template>
  </UiModal>
</template>

<style lang="scss" scoped>
.ap {
  display: grid;
  gap: 1rem;

  &__meta {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;

    div { display: grid; padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); background: var(--c-surface-2); }
    span { color: var(--c-muted); font-size: 0.72rem; }
    strong { font-size: 0.85rem; overflow-wrap: anywhere; }
    .ap__cap { text-transform: capitalize; }
  }

  &__why {
    font-size: 0.85rem;

    summary { cursor: pointer; color: var(--c-ai-ink); font-weight: 600; }
    ul { margin-top: 0.5rem; padding-left: 1.2rem; list-style: disc; color: var(--c-ink-2); }
    em { color: var(--c-faint); }
  }

  &__confirm {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.8rem 1rem;
    border: 1px solid var(--c-line-strong);
    border-radius: var(--radius-sm);
    font-size: 0.88rem;

    input { width: 1.1rem; height: 1.1rem; margin-top: 0.1rem; accent-color: var(--c-primary); }
  }

  &__note { display: flex; gap: 0.4rem; color: var(--c-muted); font-size: 0.78rem; }
}
</style>
