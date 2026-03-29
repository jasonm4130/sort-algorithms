import type { ArrayEntry, Step } from '../types/index.ts'

export function* insertionSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  yield { type: 'mark-sorted', indices: [0] }

  for (let i = 1; i < n; i++) {
    let j = i
    while (j > 0) {
      yield { type: 'compare', i: j - 1, j }
      if (a[j - 1].value > a[j].value) {
        ;[a[j - 1], a[j]] = [a[j], a[j - 1]]
        yield { type: 'swap', i: j - 1, j }
        j--
      } else {
        break
      }
    }
    yield { type: 'mark-sorted', indices: [j] }
  }
  yield { type: 'done' }
}

export function insertionSort(arr: number[]): number[] {
  const a = [...arr]
  for (let i = 1; i < a.length; i++) {
    let j = i
    while (j > 0 && a[j - 1] > a[j]) {
      ;[a[j - 1], a[j]] = [a[j], a[j - 1]]
      j--
    }
  }
  return a
}
