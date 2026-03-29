import type { ArrayEntry, Step } from '../types/index.ts'

export function* bubbleSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', i: j, j: j + 1 }
      if (a[j].value > a[j + 1].value) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        yield { type: 'swap', i: j, j: j + 1 }
      }
    }
    yield { type: 'mark-sorted', indices: [n - 1 - i] }
  }
  if (n > 0) yield { type: 'mark-sorted', indices: [0] }
  yield { type: 'done' }
}

export function bubbleSort(arr: number[]): number[] {
  const a = [...arr]
  const n = a.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
      }
    }
  }
  return a
}
