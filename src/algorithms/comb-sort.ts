import type { ArrayEntry, Step } from '../types/index.ts'

// Comb Sort — improves bubble sort by comparing elements separated by a gap
// instead of only adjacent pairs. The gap starts large and shrinks by a factor
// of 1.3 (empirically optimal) each pass until it reaches 1 (plain bubble sort).
// This eliminates "turtles" — small values near the end that make bubble sort slow.
// O(n²) worst case but O(n log n) average; O(1) space.

const SHRINK_FACTOR = 1.3

export function* combSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length
  let gap = n
  let sorted = false

  while (!sorted) {
    gap = Math.max(1, Math.floor(gap / SHRINK_FACTOR))
    // Only consider done when gap reaches 1 AND a full pass produces no swaps
    sorted = true

    for (let i = 0; i + gap < n; i++) {
      yield { type: 'compare', i, j: i + gap }
      if (a[i].value > a[i + gap].value) {
        ;[a[i], a[i + gap]] = [a[i + gap], a[i]]
        yield { type: 'swap', i, j: i + gap }
        sorted = false
      }
    }

    // Keep looping if gap hasn't reached 1 yet
    if (gap > 1) sorted = false
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function combSort(arr: number[]): number[] {
  const a = [...arr]
  const n = a.length
  let gap = n
  let sorted = false

  while (!sorted) {
    gap = Math.max(1, Math.floor(gap / SHRINK_FACTOR))
    sorted = true

    for (let i = 0; i + gap < n; i++) {
      if (a[i] > a[i + gap]) {
        ;[a[i], a[i + gap]] = [a[i + gap], a[i]]
        sorted = false
      }
    }

    if (gap > 1) sorted = false
  }

  return a
}
