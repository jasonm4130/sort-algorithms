import type { ArrayEntry, Step } from '../types/index.ts'

export function* countingSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length
  if (n === 0) {
    yield { type: 'done' }
    return
  }

  const max = Math.max(...a.map((e) => e.value))
  const min = Math.min(...a.map((e) => e.value))
  const range = max - min + 1

  // Build frequency array
  const count = new Array<number>(range).fill(0)
  for (const entry of a) count[entry.value - min]++

  // Reconstruct sorted array
  let k = 0
  for (let v = 0; v < range; v++) {
    while (count[v]-- > 0) {
      a[k] = { ...a[k], value: v + min }
      yield { type: 'overwrite', i: k, value: v + min }
      k++
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return []
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const count = new Array<number>(max - min + 1).fill(0)
  for (const v of arr) count[v - min]++
  const result: number[] = []
  for (let v = 0; v < count.length; v++) {
    for (let c = 0; c < count[v]; c++) result.push(v + min)
  }
  return result
}
