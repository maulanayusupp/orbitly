import { TOAST_DURATION_MS } from '~/config/app.config'
import { createId } from '~/utils/id'

export interface Toast {
  id: string
  message: string
  tone: 'success' | 'info' | 'ai' | 'danger'
}

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function dismiss(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function push(message: string, tone: Toast['tone'] = 'success') {
    const id = createId('t')
    toasts.value = [...toasts.value, { id, message, tone }]
    if (import.meta.client) setTimeout(() => dismiss(id), TOAST_DURATION_MS)
  }

  return { toasts, push, dismiss }
}
