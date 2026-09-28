// Backend boundary. Everything the UI knows about persistence goes through a
// DataAdapter, so the mock below can be swapped for an HTTP adapter (Laravel,
// NestJS, …) without touching components (PRD §10–11).
import type { DemoSnapshot } from '~/types'
import { DEMO_STORAGE_KEY, MOCK_LATENCY } from '~/config/app.config'
import { buildSeed } from '~/mock/seed'
import { randomBetween, sleep } from '~/utils/id'

export interface DataAdapter {
  load(): Promise<DemoSnapshot>
  save(snapshot: DemoSnapshot): void
  reset(): Promise<DemoSnapshot>
}

function readStorage(): DemoSnapshot | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DemoSnapshot) : null
  } catch {
    return null
  }
}

export const mockAdapter: DataAdapter = {
  async load() {
    await sleep(randomBetween(MOCK_LATENCY.min, MOCK_LATENCY.max))
    return readStorage() ?? buildSeed()
  },
  save(snapshot) {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(snapshot))
    } catch {
      // Quota exceeded or storage blocked — the demo keeps working in memory.
    }
  },
  async reset() {
    if (typeof window !== 'undefined') {
      try { window.localStorage.removeItem(DEMO_STORAGE_KEY) } catch { /* ignore */ }
    }
    return buildSeed()
  },
}

export const dataAdapter: DataAdapter = mockAdapter
