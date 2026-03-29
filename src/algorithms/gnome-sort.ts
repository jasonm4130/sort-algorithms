import type { ArrayEntry, Step } from '../types/index.ts'

export function* gnomeSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  let i = 0

  while (i < a.length) {
    if (i === 0 || a[i].value >= a[i - 1].value) {
      if (i > 0) {
        yield { type: 'compare', i: i - 1, j: i }
      }
      i++
    } else {
      yield { type: 'compare', i: i - 1, j: i }
      yield { type: 'swap', i: i - 1, j: i }
      ;[a[i], a[i - 1]] = [a[i - 1], a[i]]
      i--
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, idx) => idx) }
  yield { type: 'done' }
}

export function gnomeSort(arr: number[]): number[] {
  const a = [...arr]
  let i = 0
  while (i < a.length) {
    if (i === 0 || a[i] >= a[i - 1]) {
      i++
    } else {
      ;[a[i], a[i - 1]] = [a[i - 1], a[i]]
      i--
    }
  }
  return a
}
