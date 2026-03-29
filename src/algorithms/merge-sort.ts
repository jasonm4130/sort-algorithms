import type { ArrayEntry, Step } from '../types/index.ts'

function* mergeSortHelper(
  a: ArrayEntry[],
  left: number,
  right: number
): Generator<Step> {
  if (right - left <= 1) return

  const mid = Math.floor((left + right) / 2)
  yield* mergeSortHelper(a, left, mid)
  yield* mergeSortHelper(a, mid, right)

  // Merge
  const leftChunk = a.slice(left, mid).map((e) => ({ ...e }))
  const rightChunk = a.slice(mid, right).map((e) => ({ ...e }))
  let l = 0
  let r = 0
  let k = left

  while (l < leftChunk.length && r < rightChunk.length) {
    yield { type: 'compare', i: left + l, j: mid + r }
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

export function* mergeSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  yield* mergeSortHelper(a, 0, a.length)
  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr]
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  const result: number[] = []
  let l = 0
  let r = 0
  while (l < left.length && r < right.length) {
    result.push(left[l] <= right[r] ? left[l++] : right[r++])
  }
  return result.concat(left.slice(l), right.slice(r))
}
