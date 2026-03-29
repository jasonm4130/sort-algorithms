import type { ArrayEntry, Step } from '../types/index.ts'

// Switch to insertion sort below this threshold — same tuning as production introsort
const INSERTION_THRESHOLD = 16

// Insertion sort for subarray [left, right]
function* insertionRangeSteps(a: ArrayEntry[], left: number, right: number): Generator<Step> {
  for (let i = left + 1; i <= right; i++) {
    let j = i
    while (j > left) {
      yield { type: 'compare', i: j - 1, j }
      if (a[j - 1].value > a[j].value) {
        ;[a[j - 1], a[j]] = [a[j], a[j - 1]]
        yield { type: 'swap', i: j - 1, j }
        j--
      } else {
        break
      }
    }
  }
}

// Heapify for a subarray where `left` is the heap root (absolute index).
// Children of node at absolute index i: (2i - left + 1) and (2i - left + 2)
// n is the exclusive upper bound (absolute index)
function* heapifyRangeSteps(
  a: ArrayEntry[],
  left: number,
  n: number,
  i: number,
): Generator<Step> {
  let largest = i
  const l = 2 * i - left + 1
  const r = 2 * i - left + 2
  if (l < n) {
    yield { type: 'compare', i: largest, j: l }
    if (a[l].value > a[largest].value) largest = l
  }
  if (r < n) {
    yield { type: 'compare', i: largest, j: r }
    if (a[r].value > a[largest].value) largest = r
  }
  if (largest !== i) {
    ;[a[i], a[largest]] = [a[largest], a[i]]
    yield { type: 'swap', i, j: largest }
    yield* heapifyRangeSteps(a, left, n, largest)
  }
}

// Heapsort for subarray [left, right] — triggered when recursion depth limit is hit
function* heapSortRangeSteps(a: ArrayEntry[], left: number, right: number): Generator<Step> {
  const n = right + 1
  // Build max-heap; last non-leaf is at left + floor((right-left+1)/2) - 1
  for (let i = left + Math.floor((right - left + 1) / 2) - 1; i >= left; i--) {
    yield* heapifyRangeSteps(a, left, n, i)
  }
  for (let i = right; i > left; i--) {
    ;[a[left], a[i]] = [a[i], a[left]]
    yield { type: 'swap', i: left, j: i }
    yield* heapifyRangeSteps(a, left, i, left)
  }
}

// Lomuto partition — mirrors quick-sort.ts for visual consistency
function* partitionRangeSteps(
  a: ArrayEntry[],
  low: number,
  high: number,
): Generator<Step, number> {
  yield { type: 'pivot', i: high }
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
  return i + 1
}

function* introImpl(
  a: ArrayEntry[],
  left: number,
  right: number,
  depthLimit: number,
): Generator<Step> {
  if (left >= right) return
  if (right - left + 1 <= INSERTION_THRESHOLD) {
    yield* insertionRangeSteps(a, left, right)
    return
  }
  if (depthLimit === 0) {
    // Depth exceeded — fall back to heapsort to guarantee O(n log n) worst case
    yield* heapSortRangeSteps(a, left, right)
    return
  }
  const pivotPos: number = yield* partitionRangeSteps(a, left, right)
  yield* introImpl(a, left, pivotPos - 1, depthLimit - 1)
  yield* introImpl(a, pivotPos + 1, right, depthLimit - 1)
}

export function* introSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length
  if (n <= 1) {
    if (n === 1) yield { type: 'mark-sorted', indices: [0] }
    yield { type: 'done' }
    return
  }
  const depthLimit = 2 * Math.floor(Math.log2(n))
  yield* introImpl(a, 0, n - 1, depthLimit)
  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function introSort(arr: number[]): number[] {
  const a = [...arr]
  if (a.length <= 1) return a

  function insertionSort(left: number, right: number): void {
    for (let i = left + 1; i <= right; i++) {
      const key = a[i]
      let j = i - 1
      while (j >= left && a[j] > key) a[j + 1] = a[j--]
      a[j + 1] = key
    }
  }

  function heapify(n: number, i: number, offset: number): void {
    let largest = i
    const l = 2 * i - offset + 1
    const r = 2 * i - offset + 2
    if (l < n && a[l] > a[largest]) largest = l
    if (r < n && a[r] > a[largest]) largest = r
    if (largest !== i) {
      ;[a[i], a[largest]] = [a[largest], a[i]]
      heapify(n, largest, offset)
    }
  }

  function heapSortRange(left: number, right: number): void {
    const n = right + 1
    for (let i = left + Math.floor((right - left + 1) / 2) - 1; i >= left; i--) heapify(n, i, left)
    for (let i = right; i > left; i--) {
      ;[a[left], a[i]] = [a[i], a[left]]
      heapify(i, left, left)
    }
  }

  function sort(left: number, right: number, depth: number): void {
    if (left >= right) return
    if (right - left + 1 <= INSERTION_THRESHOLD) {
      insertionSort(left, right)
      return
    }
    if (depth === 0) {
      heapSortRange(left, right)
      return
    }
    const pivot = a[right]
    let i = left - 1
    for (let j = left; j < right; j++) {
      if (a[j] <= pivot) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]
      }
    }
    ;[a[i + 1], a[right]] = [a[right], a[i + 1]]
    sort(left, i, depth - 1)
    sort(i + 2, right, depth - 1)
  }

  sort(0, a.length - 1, 2 * Math.floor(Math.log2(a.length)))
  return a
}
