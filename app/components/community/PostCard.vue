<script setup lang="ts">
import type { Post, ReactionKind } from '~/types'
import type { IconName } from '~/utils/iconPaths'

const props = defineProps<{ post: Post; authorName: (id: string) => string; ownerId?: string }>()
const emit = defineEmits<{ react: [ReactionKind]; comment: [string]; pin: [] }>()
const { relative } = useFormat()

const reactions: Array<{ kind: ReactionKind; icon: IconName; label: string }> = [
  { kind: 'like', icon: 'heart', label: 'Like' },
  { kind: 'fire', icon: 'flame', label: 'Fire' },
  { kind: 'idea', icon: 'bulb', label: 'Helpful' },
]
const showComments = ref(props.post.comments.length > 0 && props.post.comments.length <= 2)
const draft = ref('')

function send() {
  if (!draft.value.trim()) return
  emit('comment', draft.value)
  draft.value = ''
  showComments.value = true
}
</script>

<template>
  <article class="post" :class="{ 'post--pinned': post.pinned }">
    <header class="post__head">
      <UiAvatar :name="authorName(post.authorId)" />
      <div class="post__who">
        <strong>{{ authorName(post.authorId) }}</strong>
        <span>
          <UiBadge v-if="post.authorId === ownerId" tone="primary">Owner</UiBadge>
          <time :datetime="post.createdAt">{{ relative(post.createdAt) }}</time>
        </span>
      </div>
      <button type="button" class="post__pin" :class="{ 'is-on': post.pinned }" :aria-pressed="!!post.pinned" :aria-label="post.pinned ? 'Unpin post' : 'Pin post'" @click="emit('pin')">
        <UiIcon name="pin" :size="16" />
      </button>
    </header>

    <p class="post__body">{{ post.body }}</p>

    <footer class="post__foot">
      <button
        v-for="r in reactions"
        :key="r.kind"
        type="button"
        class="post__react"
        :class="{ 'is-on': post.myReactions.includes(r.kind), [`post__react--${r.kind}`]: true }"
        :aria-pressed="post.myReactions.includes(r.kind)"
        :aria-label="`${r.label} (${post.reactions[r.kind]})`"
        @click="emit('react', r.kind)"
      >
        <UiIcon :name="r.icon" :size="16" />
        <span class="num">{{ post.reactions[r.kind] }}</span>
      </button>
      <button type="button" class="post__react post__react--comments" :aria-expanded="showComments" @click="showComments = !showComments">
        <UiIcon name="message" :size="16" />
        <span class="num">{{ post.comments.length }}</span>
      </button>
    </footer>

    <div v-if="showComments" class="post__comments">
      <div v-for="c in post.comments" :key="c.id" class="post__comment">
        <UiAvatar :name="authorName(c.authorId)" size="sm" />
        <div>
          <p><strong>{{ authorName(c.authorId) }}</strong> <time :datetime="c.createdAt">{{ relative(c.createdAt) }}</time></p>
          <p>{{ c.body }}</p>
        </div>
      </div>
      <form class="post__reply" @submit.prevent="send">
        <label :for="`reply-${post.id}`" class="visually-hidden">Write a comment</label>
        <input :id="`reply-${post.id}`" v-model="draft" placeholder="Write a comment…">
        <UiButton type="submit" size="sm" icon="send" :disabled="!draft.trim()">Reply</UiButton>
      </form>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.post {
  @include surface;
  display: grid;
  gap: 0.9rem;
  padding: 1.1rem 1.2rem;

  &--pinned { border-color: var(--c-primary-soft); box-shadow: inset 3px 0 0 var(--c-primary); }

  &__head { display: flex; align-items: center; gap: 0.7rem; }

  &__who {
    display: grid;
    flex: 1;
    line-height: 1.3;

    strong { font-size: 0.9rem; }
    span { display: flex; align-items: center; gap: 0.4rem; color: var(--c-faint); font-size: 0.75rem; }
  }

  &__pin {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: var(--c-faint);

    &:hover { background: var(--c-surface-2); }
    &.is-on { color: var(--c-primary); }
  }

  &__body { white-space: pre-line; }

  &__foot { display: flex; flex-wrap: wrap; gap: 0.4rem; }

  &__react {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    height: 2rem;
    padding-inline: 0.7rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-pill);
    color: var(--c-muted);
    font-size: 0.8rem;
    font-weight: 600;
    transition: all var(--dur-fast);

    &:hover { border-color: var(--c-line-strong); color: var(--c-ink); }

    &.is-on { border-color: transparent; }
    &--like.is-on { background: var(--c-danger-soft); color: var(--c-danger); }
    &--fire.is-on { background: var(--c-flare-soft); color: var(--c-flare); }
    &--idea.is-on { background: var(--c-warn-soft); color: var(--c-warn); }
    &--comments { margin-left: auto; }
  }

  &__comments {
    display: grid;
    gap: 0.8rem;
    padding-top: 0.9rem;
    border-top: 1px solid var(--c-line);
  }

  &__comment {
    display: flex;
    gap: 0.6rem;
    font-size: 0.86rem;

    time { color: var(--c-faint); font-size: 0.72rem; }
  }

  &__reply {
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
      min-width: 0;
      height: 2rem;
      padding-inline: 0.8rem;
      border: 1px solid var(--c-line);
      border-radius: var(--radius-pill);
      font-size: 0.85rem;

      &:focus { outline: none; border-color: var(--c-primary); }
    }
  }
}
</style>
