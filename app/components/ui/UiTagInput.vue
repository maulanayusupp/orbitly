<script setup lang="ts">
const props = defineProps<{ id: string; placeholder?: string; ai?: boolean }>()
const model = defineModel<string[]>({ required: true })
const text = ref('')

function add() {
  const values = text.value.split(',').map(v => v.trim().toLowerCase()).filter(Boolean)
  const next = [...model.value]
  for (const v of values) if (!next.includes(v)) next.push(v)
  model.value = next
  text.value = ''
}

function remove(tag: string) {
  model.value = model.value.filter(t => t !== tag)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
  else if (e.key === 'Backspace' && !text.value && model.value.length) remove(model.value[model.value.length - 1]!)
}
</script>

<template>
  <div class="tags input" :class="{ 'tags--ai': props.ai }">
    <span v-for="tag in model" :key="tag" class="tags__chip">
      {{ tag }}
      <button type="button" :aria-label="`Remove tag ${tag}`" @click="remove(tag)"><UiIcon name="x" :size="12" :stroke-width="2.2" /></button>
    </span>
    <input
      :id="id"
      v-model="text"
      class="tags__input"
      :placeholder="model.length ? '' : placeholder"
      @keydown="onKey"
      @blur="add"
    >
  </div>
</template>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  cursor: text;

  &:focus-within {
    border-color: var(--c-primary);
    box-shadow: 0 0 0 3px var(--c-primary-soft);
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.3rem 0.2rem 0.6rem;
    border-radius: var(--radius-pill);
    background: var(--c-primary-soft);
    color: var(--c-primary);
    font-size: 0.78rem;
    font-weight: 500;

    button {
      display: grid;
      place-items: center;
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;

      &:hover { background: color-mix(in srgb, var(--c-primary) 16%, transparent); }
    }
  }

  &--ai &__chip {
    background: var(--c-surface);
    color: var(--c-ai-ink);
    box-shadow: inset 0 0 0 1px var(--c-ai-line);
  }

  &__input {
    flex: 1 1 6rem;
    min-width: 6rem;
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9rem;
  }
}
</style>
