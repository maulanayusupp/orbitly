import { useWorkspaceStore } from '~/stores/workspace'

/** Loads the workspace on first use and exposes its identity. */
export function useWorkspace() {
  const store = useWorkspaceStore()
  if (import.meta.client) void store.ensureLoaded()

  return {
    store,
    ready: computed(() => store.ready),
    workspace: computed(() => store.snapshot?.workspace),
    team: computed(() => store.snapshot?.team ?? []),
    activity: computed(() => store.snapshot?.activity ?? []),
    ensureLoaded: () => store.ensureLoaded(),
    resetDemo: () => store.resetDemo(),
    updateWorkspace: store.updateWorkspace,
  }
}
