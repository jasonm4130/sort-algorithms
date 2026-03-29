import type { ArrayEntry, Step } from '../types/index.ts'

function* heapifySteps(a: ArrayEntry[], n: number, i: number): Generator<Step> {
  let largest = i
  const left = 2 * i + 1
  const right = 2 * i + 2

  if (left < n) {
    yield { type: 'compare', i: largest, j: left }
    if (a[left].value > a[largest].value) largest = left
  }
  if (right < n) {
    yield { type: 'compare', i: largest, j: right }
    if (a[right].value > a[largest].value) largest = right
  }
  if (largest !== i) {
    ;[a[i], a[largest]] = [a[largest], a[i]]
    yield { type: 'swap', i, j: largest }
    yield* heapifySteps(a, n, largest)
  }
}

export function* heapSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapifySteps(a, n, i)
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]
    yield { type: 'swap', i: 0, j: i }
    yield { type: 'mark-sorted', indices: [i] }
    yield* heapifySteps(a, i, 0)
  }
  if (n > 0) yield { type: 'mark-sorted', indices: [0] }
  yield { type: 'done' }
}

export function heapSort(arr: number[]): number[] {
  const a = [...arr]
  const n = a.length
  function heapify(size: number, i: number) {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2
    if (l < size && a[l] > a[largest]) largest = l
    if (r < size && a[r] > a[largest]) largest = r
    if (largest !== i) {
      ;[a[i], a[largest]] = [a[largest], a[i]]
      heapify(size, largest)
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i)
  for (let i = n - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]
    heapify(i, 0)
  }
  return a
}
