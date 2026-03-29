import type { ArrayEntry, Step } from '../types/index.ts'

// Ciura gap sequence — empirically optimal for Shell Sort
const GAPS = [701, 301, 132, 57, 23, 10, 4, 1]

export function* shellSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  for (const gap of GAPS) {
    if (gap >= n) continue
    for (let i = gap; i < n; i++) {
      let j = i
      while (j >= gap) {
        yield { type: 'compare', i: j - gap, j }
        if (a[j - gap].value > a[j].value) {
          ;[a[j - gap], a[j]] = [a[j], a[j - gap]]
          yield { type: 'swap', i: j - gap, j }
          j -= gap
        } else {
          break
        }
      }
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function shellSort(arr: number[]): number[] {
  const a = [...arr]
  const n = a.length
  for (const gap of GAPS) {
    if (gap >= n) continue
    for (let i = gap; i < n; i++) {
      let j = i
      while (j >= gap && a[j - gap] > a[j]) {
        ;[a[j - gap], a[j]] = [a[j], a[j - gap]]
        j -= gap
      }
    }
  }
  return a
}
