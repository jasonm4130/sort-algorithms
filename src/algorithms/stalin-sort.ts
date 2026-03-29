import type { ArrayEntry, Step } from '../types/index.ts'

// Stalin sort: iterate once through the array. Any element that is not in
// non-decreasing order relative to the last kept element is "purged" (removed).
// The result is a sorted — but potentially shorter — sequence.
export function* stalinSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))

  if (a.length <= 1) {
    yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
    yield { type: 'done' }
    return
  }

  let runningMax = a[0].value
  const kept: number[] = [0]

  for (let i = 1; i < a.length; i++) {
    yield { type: 'compare', i: kept[kept.length - 1], j: i }
    if (a[i].value >= runningMax) {
      runningMax = a[i].value
      kept.push(i)
    } else {
      // Purge: overwrite the element to 0 (the bar collapses — it was removed)
      yield { type: 'overwrite', i, value: 0 }
    }
  }

  yield { type: 'mark-sorted', indices: kept }
  yield { type: 'done' }
}

// Pure stalin sort: returns only the elements that survive the single pass.
// Note: the returned array may be shorter than the input.
export function stalinSort(arr: number[]): number[] {
  if (arr.length === 0) return []
  const result = [arr[0]]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] >= result[result.length - 1]) {
      result.push(arr[i])
    }
  }
  return result
}
