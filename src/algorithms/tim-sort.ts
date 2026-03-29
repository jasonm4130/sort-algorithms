import type { ArrayEntry, Step } from '../types/index.ts'

const MIN_MERGE = 32

function* insertionRunSteps(
  a: ArrayEntry[],
  left: number,
  right: number
): Generator<Step> {
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

function* timMergeSteps(
  a: ArrayEntry[],
  left: number,
  mid: number,
  right: number
): Generator<Step> {
  const leftChunk = a.slice(left, mid + 1).map((e) => ({ ...e }))
  const rightChunk = a.slice(mid + 1, right + 1).map((e) => ({ ...e }))
  let l = 0
  let r = 0
  let k = left

  while (l < leftChunk.length && r < rightChunk.length) {
    yield { type: 'compare', i: left + l, j: mid + 1 + r }
    if (leftChunk[l].value <= rightChunk[r].value) {
      a[k] = leftChunk[l++]
    } else {
      a[k] = rightChunk[r++]
    }
    yield { type: 'overwrite', i: k, value: a[k].value }
    k++
  }
  while (l < leftChunk.length) {
    a[k] = leftChunk[l++]
    yield { type: 'overwrite', i: k, value: a[k].value }
    k++
  }
  while (r < rightChunk.length) {
    a[k] = rightChunk[r++]
    yield { type: 'overwrite', i: k, value: a[k].value }
    k++
  }
}

export function* timSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  // Sort individual runs with insertion sort
  for (let i = 0; i < n; i += MIN_MERGE) {
    yield* insertionRunSteps(a, i, Math.min(i + MIN_MERGE - 1, n - 1))
  }

  // Merge runs bottom-up
  for (let size = MIN_MERGE; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1)
      const right = Math.min(left + 2 * size - 1, n - 1)
      if (mid < right) {
        yield* timMergeSteps(a, left, mid, right)
      }
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function timSort(arr: number[]): number[] {
  const a = [...arr]
  const n = a.length
  for (let i = 0; i < n; i += MIN_MERGE) {
    const end = Math.min(i + MIN_MERGE - 1, n - 1)
    for (let j = i + 1; j <= end; j++) {
      let k = j
      while (k > i && a[k - 1] > a[k]) {
        ;[a[k - 1], a[k]] = [a[k], a[k - 1]]
        k--
      }
    }
  }
  for (let size = MIN_MERGE; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1)
      const right = Math.min(left + 2 * size - 1, n - 1)
      if (mid >= right) continue
      const L = a.slice(left, mid + 1)
      const R = a.slice(mid + 1, right + 1)
      let l = 0, r = 0, k = left
      while (l < L.length && r < R.length) a[k++] = L[l] <= R[r] ? L[l++] : R[r++]
      while (l < L.length) a[k++] = L[l++]
      while (r < R.length) a[k++] = R[r++]
    }
  }
  return a
}
