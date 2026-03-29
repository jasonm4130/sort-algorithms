import type { ArrayEntry, Step } from '../types/index.ts'

function* partitionSteps(
  a: ArrayEntry[],
  low: number,
  high: number
): Generator<Step, number> {
  const pivotIdx = high
  yield { type: 'pivot', i: pivotIdx }
  const pivotVal = a[high].value
  let i = low - 1

  for (let j = low; j < high; j++) {
    yield { type: 'compare', i: j, j: high }
    if (a[j].value <= pivotVal) {
      i++
      if (i !== j) {
        ;[a[i], a[j]] = [a[j], a[i]]
        yield { type: 'swap', i, j }
      }
    }
  }
  if (i + 1 !== high) {
    ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
    yield { type: 'swap', i: i + 1, j: high }
  }
  yield { type: 'mark-sorted', indices: [i + 1] }
  return i + 1
}

function* quickSortHelper(a: ArrayEntry[], low: number, high: number): Generator<Step> {
  if (low >= high) {
    if (low === high) yield { type: 'mark-sorted', indices: [low] }
    return
  }
  const pivotPos: number = yield* partitionSteps(a, low, high)
  yield* quickSortHelper(a, low, pivotPos - 1)
  yield* quickSortHelper(a, pivotPos + 1, high)
}

export function* quickSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  if (a.length > 1) yield* quickSortHelper(a, 0, a.length - 1)
  else if (a.length === 1) yield { type: 'mark-sorted', indices: [0] }
  yield { type: 'done' }
}

export function quickSort(arr: number[]): number[] {
  const a = [...arr]
  function qs(lo: number, hi: number) {
    if (lo >= hi) return
    const pivot = a[hi]
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]
      }
    }
    ;[a[i + 1], a[hi]] = [a[hi], a[i + 1]]
    qs(lo, i)
    qs(i + 2, hi)
  }
  qs(0, a.length - 1)
  return a
}
