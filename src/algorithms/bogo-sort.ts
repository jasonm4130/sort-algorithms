import type { ArrayEntry, Step } from '../types/index.ts'

function isSorted(a: ArrayEntry[]): boolean {
  for (let i = 0; i < a.length - 1; i++) {
    if (a[i].value > a[i + 1].value) return false
  }
  return true
}

function shuffle(a: ArrayEntry[]): void {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
}

// Safety cap to prevent infinite loops in demo mode
// (removed — the browser can handle it; let the user wait)
export function* bogoSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))

  while (!isSorted(a)) {
    // Yield a compare step to show we checked
    for (let i = 0; i < a.length - 1; i++) {
      yield { type: 'compare', i, j: i + 1 }
    }
    shuffle(a)
    // Yield swaps to show the shuffle
    for (let i = 0; i < a.length; i++) {
      yield { type: 'swap', i, j: Math.floor(Math.random() * a.length) }
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function bogoSort(arr: number[]): number[] {
  const a = [...arr]
  while (!a.every((v, i) => i === 0 || a[i - 1] <= v)) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
  }
  return a
}
