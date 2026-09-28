<script setup lang="ts">
import type { BrainStep } from '~/services/intelligence.service'

defineProps<{ steps: BrainStep[]; running: boolean; stepIndex: number; lastRunAt: string | null }>()
const emit = defineEmits<{ run: [] }>()
const { relative } = useFormat()

const sources = [
  { id: 'internal', label: 'Orders, products, community, customers, campaigns', state: 'Connected' },
  { id: 'social', label: 'Social Monitor', state: 'Connector — phase 2' },
  { id: 'reputation', label: 'Reputation Monitor', state: 'Connector — phase 2' },
]
</script>

<template>
  <section class="brain" aria-labelledby="brain-title">
    <div class="brain__intro">
      <span class="brain__orb" :class="{ 'is-running': running }" aria-hidden="true"><UiIcon name="sparkles" :size="26" /></span>
      <div>
        <h2 id="brain-title">Marketing Brain</h2>
        <p>Reads your internal signals, spots trends and anomalies, and proposes campaigns with the evidence attached. You approve every external action.</p>
      </div>
      <UiButton variant="ai" icon="sparkles" :loading="running" @click="emit('run')">{{ running ? 'Analysing…' : 'Run AI analysis' }}</UiButton>
    </div>

    <ol v-if="running" class="brain__steps" aria-live="polite">
      <li v-for="(s, i) in steps" :key="s.id" :class="{ 'is-done': i < stepIndex, 'is-active': i === stepIndex }">
        <UiIcon :name="i < stepIndex ? 'checkCircle' : 'clock'" :size="16" />{{ s.label }}
      </li>
    </ol>

    <ul v-else class="brain__sources">
      <li v-for="s in sources" :key="s.id" :class="{ 'is-off': s.id !== 'internal' }">
        <span class="brain__dot" />{{ s.label }} <em>{{ s.state }}</em>
      </li>
      <li v-if="lastRunAt" class="brain__last">Last run {{ relative(lastRunAt) }}</li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.brain {
  display: grid;
  gap: 1.1rem;
  padding: clamp(1.1rem, 3vw, 1.6rem);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--c-ai) 35%, transparent), transparent 55%),
    radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--c-primary) 45%, transparent), transparent 60%),
    var(--c-ink);
  color: var(--c-faint);

  &__intro {
    display: grid;
    gap: 1rem;
    align-items: center;

    @include respond-to('md') { grid-template-columns: auto 1fr auto; }

    h2 { color: var(--c-surface); font-size: 1.3rem; }
    p { max-width: 40rem; font-size: 0.9rem; }
  }

  &__orb {
    display: grid;
    place-items: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: var(--grad-ai);
    color: var(--c-surface);

    &.is-running { @include motion-safe { animation: breathe 1.2s ease-in-out infinite; } }
  }

  &__steps, &__sources {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    font-size: 0.8rem;

    li { display: flex; align-items: center; gap: 0.4rem; }
  }

  &__steps {
    li { opacity: 0.5; transition: opacity var(--dur); }
    .is-active { opacity: 1; color: var(--c-surface); }
    .is-done { opacity: 0.9; color: var(--c-ai-line); }
  }

  &__sources {
    em { color: var(--c-ai-line); font-style: normal; font-weight: 600; }
    .is-off em { color: var(--c-faint); font-weight: 400; }
    .is-off { opacity: 0.7; }
  }

  &__dot { width: 0.45rem; height: 0.45rem; border-radius: 50%; background: var(--c-ai-line); .is-off & { background: var(--c-faint); } }

  &__last { margin-left: auto; }
}

@keyframes breathe {
  50% { transform: scale(1.08); box-shadow: 0 0 0 10px color-mix(in srgb, var(--c-ai) 25%, transparent); }
}
</style>
