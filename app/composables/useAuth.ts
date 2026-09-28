// Demo identity. There is no sign-in in the frontend-only demo: the viewer acts
// as the workspace owner. A real adapter would resolve the session here.
export function useAuth() {
  const { team, workspace } = useWorkspace()
  const user = computed(() => team.value.find(u => u.id === workspace.value?.ownerId))
  return { user, isDemo: true }
}
