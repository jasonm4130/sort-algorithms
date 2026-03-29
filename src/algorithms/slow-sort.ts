import type { ArrayEntry, Step } from '../types/index.ts'

// Slowsort: the "Multiply and Surrender" paradigm. Deliberately inefficient.
// T(n) satisfies T(n) ≥ T(n-1) + 2·T(n/2), giving Ω(n^(log n / (2+ε))).
// A safety cap prevents the visualizer from generating millions of steps.
const MAX_STEPS = 100_000

export function* slowSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  let stepCount = 0

  function* helper(i: number, j: number): Generator<Step> {
    if (i >= j || stepCount >= MAX_STEPS) return
    const m = Math.floor((i + j) / 2)
    yield* helper(i, m)
    yield* helper(m + 1, j)
    if (stepCount >= MAX_STEPS) return
    stepCount++
    yield { type: 'compare', i: m, j }
    if (a[m].value > a[j].value) {
      yield { type: 'swap', i: m, j }
      ;[a[m], a[j]] = [a[j], a[m]]
    }
    yield* helper(i, j - 1)
  }

  yield* helper(0, a.length - 1)
  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function slowSort(arr: number[]): number[] {
  const a = [...arr]
  function sort(i: number, j: number): void {
    if (i >= j) return
    const m = Math.floor((i + j) / 2)
    sort(i, m)
    sort(m + 1, j)
    if (a[m] > a[j]) {
      ;[a[m], a[j]] = [a[j], a[m]]
    }
    sort(i, j - 1)
  }
  sort(0, a.length - 1)
  return a
}
