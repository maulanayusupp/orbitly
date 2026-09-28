import type { ReactionKind } from '~/types'

export function useCommunity() {
  const { store } = useWorkspace()
  const { user } = useAuth()

  const posts = computed(() => {
    const list = store.snapshot?.posts ?? []
    return [...list].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.createdAt.localeCompare(a.createdAt))
  })

  return {
    community: computed(() => store.snapshot?.community),
    posts,
    members: computed(() => store.snapshot?.members ?? []),
    events: computed(() => store.snapshot?.events ?? []),
    publish: (body: string) => store.addPost(body.trim(), user.value?.id ?? 'u_rina'),
    react: (postId: string, kind: ReactionKind) => store.toggleReaction(postId, kind),
    comment: (postId: string, body: string) => store.addComment(postId, body.trim(), user.value?.id ?? 'u_rina'),
    togglePin: store.togglePin,
  }
}
