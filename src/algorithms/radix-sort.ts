import type { ArrayEntry, Step } from '../types/index.ts'

function* radixPassSteps(a: ArrayEntry[], exp: number): Generator<Step> {
  const n = a.length
  const output: ArrayEntry[] = new Array(n)
  const count = new Array<number>(10).fill(0)

  // Count occurrences at this digit position
  for (const entry of a) {
    const digit = Math.floor(entry.value / exp) % 10
    count[digit]++
  }

  // Cumulative count for stable placement
  for (let i = 1; i < 10; i++) count[i] += count[i - 1]

  // Build output (right-to-left for stability)
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(a[i].value / exp) % 10
    output[--count[digit]] = { ...a[i] }
  }

  // Write output back and yield overwrites
  for (let i = 0; i < n; i++) {
    a[i] = output[i]
    yield { type: 'overwrite', i, value: a[i].value }
  }
}

export function* radixSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  if (a.length === 0) {
    yield { type: 'done' }
    return
  }

  const max = Math.max(...a.map((e) => e.value))
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield* radixPassSteps(a, exp)
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function radixSort(arr: number[]): number[] {
  if (arr.length === 0) return []
  const a = [...arr]
  const max = Math.max(...a)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array<number>(a.length)
    const count = new Array<number>(10).fill(0)
    for (const v of a) count[Math.floor(v / exp) % 10]++
    for (let i = 1; i < 10; i++) count[i] += count[i - 1]
    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10
      output[--count[digit]] = a[i]
    }
    for (let i = 0; i < a.length; i++) a[i] = output[i]
  }
  return a
}
