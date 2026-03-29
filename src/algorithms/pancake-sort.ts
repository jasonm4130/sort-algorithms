import type { ArrayEntry, Step } from '../types/index.ts'

function* flipSubarray(a: ArrayEntry[], k: number): Generator<Step> {
  let l = 0
  let r = k
  while (l < r) {
    yield { type: 'swap', i: l, j: r }
    ;[a[l], a[r]] = [a[r], a[l]]
    l++
    r--
  }
}

function maxIndex(a: ArrayEntry[], to: number): number {
  let mi = 0
  for (let i = 1; i <= to; i++) {
    if (a[i].value > a[mi].value) mi = i
  }
  return mi
}

export function* pancakeSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))

  if (a.length <= 1) {
    yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
    yield { type: 'done' }
    return
  }

  for (let size = a.length - 1; size > 0; size--) {
    const mi = maxIndex(a, size)

    if (mi === size) {
      yield { type: 'mark-sorted', indices: [size] }
      continue
    }

    // Show which element we identified as the max
    yield { type: 'compare', i: mi, j: size }

    // Flip max to front (if not already there)
    if (mi !== 0) {
      yield* flipSubarray(a, mi)
    }

    // Flip the whole unsorted region to place max at end
    yield* flipSubarray(a, size)
    yield { type: 'mark-sorted', indices: [size] }
  }

  yield { type: 'mark-sorted', indices: [0] }
  yield { type: 'done' }
}

export function pancakeSort(arr: number[]): number[] {
  const a = [...arr]

  function flip(k: number): void {
    let l = 0
    let r = k
    while (l < r) {
      ;[a[l], a[r]] = [a[r], a[l]]
      l++
      r--
    }
  }

  for (let size = a.length - 1; size > 0; size--) {
    let mi = 0
    for (let i = 1; i <= size; i++) {
      if (a[i] > a[mi]) mi = i
    }
    if (mi !== size) {
      if (mi !== 0) flip(mi)
      flip(size)
    }
  }
  return a
}
