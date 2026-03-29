import type { ArrayEntry, Step } from '../types/index.ts'

function* stoogeSortHelper(a: ArrayEntry[], l: number, r: number): Generator<Step> {
  if (l >= r) return

  yield { type: 'compare', i: l, j: r }
  if (a[l].value > a[r].value) {
    yield { type: 'swap', i: l, j: r }
    ;[a[l], a[r]] = [a[r], a[l]]
  }

  if (r - l + 1 > 2) {
    const t = Math.floor((r - l + 1) / 3)
    yield* stoogeSortHelper(a, l, r - t)
    yield* stoogeSortHelper(a, l + t, r)
    yield* stoogeSortHelper(a, l, r - t)
  }
}

export function* stoogeSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  yield* stoogeSortHelper(a, 0, a.length - 1)
  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function stoogeSort(arr: number[]): number[] {
  const a = [...arr]
  function sort(l: number, r: number): void {
    if (l >= r) return
    if (a[l] > a[r]) {
      ;[a[l], a[r]] = [a[r], a[l]]
    }
    if (r - l + 1 > 2) {
      const t = Math.floor((r - l + 1) / 3)
      sort(l, r - t)
      sort(l + t, r)
      sort(l, r - t)
    }
  }
  sort(0, a.length - 1)
  return a
}
