import type { ArrayEntry, Step } from '../../types/index.ts'

// Generator: yields Step descriptors for each comparison/swap/overwrite
export function* __NAME__Steps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e })) // always work on a copy

  // TODO: implement algorithm, yielding steps
  // yield { type: 'compare', i, j }
  // yield { type: 'swap', i, j }
  // yield { type: 'mark-sorted', indices: [...] }

  yield { type: 'done' }
}

// Pure sort: returns a sorted copy of the input numbers
export function __NAME__Sort(arr: number[]): number[] {
  const a = [...arr]
  // TODO: implement sort
  return a
}
