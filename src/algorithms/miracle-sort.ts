import type { ArrayEntry, Step } from '../types/index.ts'

// Miracle sort: check if the array is sorted; if not, do nothing and check again.
// Eventually a miracle (cosmic ray bit-flip) puts it in order.
// Simulated here: sweep arr.length * 2 times showing nothing happens, then a
// miracle occurs and all values snap into sorted order via overwrite steps.
export function* miracleSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const rounds = arr.length * 2

  // Check repeatedly — hoping for a miracle
  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i + 1 < a.length; i++) {
      yield { type: 'compare', i, j: i + 1 }
    }
  }

  // The miracle occurs: overwrite each position with the sorted value
  const sorted = [...a].sort((x, y) => x.value - y.value)
  for (let i = 0; i < a.length; i++) {
    if (a[i].value !== sorted[i].value) {
      yield { type: 'overwrite', i, value: sorted[i].value }
      a[i] = { ...a[i], value: sorted[i].value }
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function miracleSort(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b)
}
