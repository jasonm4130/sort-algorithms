import type { ArrayEntry, Step } from '../types/index.ts'

export function* bucketSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length
  if (n === 0) {
    yield { type: 'done' }
    return
  }

  const min = Math.min(...a.map((e) => e.value))
  const max = Math.max(...a.map((e) => e.value))
  const range = max - min || 1
  const bucketCount = Math.ceil(Math.sqrt(n))
  const buckets: ArrayEntry[][] = Array.from({ length: bucketCount }, () => [])

  // Distribute into buckets
  for (const entry of a) {
    const idx = Math.min(
      Math.floor(((entry.value - min) / range) * bucketCount),
      bucketCount - 1
    )
    buckets[idx].push({ ...entry })
  }

  // Sort each bucket with insertion sort and write back
  let k = 0
  for (const bucket of buckets) {
    // Sort bucket
    for (let i = 1; i < bucket.length; i++) {
      let j = i
      while (j > 0 && bucket[j - 1].value > bucket[j].value) {
        ;[bucket[j - 1], bucket[j]] = [bucket[j], bucket[j - 1]]
        j--
      }
    }
    // Write back
    for (const entry of bucket) {
      a[k] = entry
      yield { type: 'overwrite', i: k, value: entry.value }
      k++
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function bucketSort(arr: number[]): number[] {
  if (arr.length === 0) return []
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const range = max - min || 1
  const n = arr.length
  const bucketCount = Math.ceil(Math.sqrt(n))
  const buckets: number[][] = Array.from({ length: bucketCount }, () => [])
  for (const v of arr) {
    const idx = Math.min(Math.floor(((v - min) / range) * bucketCount), bucketCount - 1)
    buckets[idx].push(v)
  }
  return buckets.flatMap((b) => b.sort((a, c) => a - c))
}
