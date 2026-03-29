import type { ArrayEntry, Step } from '../types/index.ts'

export function* selectionSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', i: minIdx, j }
      if (a[j].value < a[minIdx].value) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      yield { type: 'swap', i, j: minIdx }
    }
    yield { type: 'mark-sorted', indices: [i] }
  }
  if (n > 0) yield { type: 'mark-sorted', indices: [n - 1] }
  yield { type: 'done' }
}

export function selectionSort(arr: number[]): number[] {
  const a = [...arr]
  const n = a.length
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) minIdx = j
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]]
  }
  return a
}
