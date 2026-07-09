import type { ArrayEntry, Step } from '../types/index.ts'

// Communist sort: all items are made equal. One redistribution pass spreads
// the total value evenly across every index — some are more equal than
// others, so the remainder goes to the last indices, keeping the result
// nondecreasing. The output is not a permutation of the input by design.
export function* communistSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length
  if (n === 0) {
    yield { type: 'done' }
    return
  }

  const total = a.reduce((sum, e) => sum + e.value, 0)
  const base = Math.floor(total / n)
  const r = total - base * n

  for (let i = 0; i < n; i++) {
    const newVal = i >= n - r ? base + 1 : base
    a[i] = { ...a[i], value: newVal }
    yield { type: 'overwrite', i, value: newVal }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function communistSort(values: number[]): number[] {
  const n = values.length
  if (n === 0) return []

  const total = values.reduce((sum, v) => sum + v, 0)
  const base = Math.floor(total / n)
  const r = total - base * n

  return values.map((_, i) => (i >= n - r ? base + 1 : base))
}
