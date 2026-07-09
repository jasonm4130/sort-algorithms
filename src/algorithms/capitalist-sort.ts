import type { ArrayEntry, Step } from '../types/index.ts'

// Capitalist sort: take from the poorest, give to the richest. Each round,
// the entire holding of the minimum nonzero-value index is transferred to
// the maximum-value index. Wealth concentrates until one bar owns the whole
// sum; that bar then rises to the last position so the array is
// nondecreasing (n - 1 zeros followed by the total).
export function* capitalistSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  if (n === 0) {
    yield { type: 'done' }
    return
  }
  if (n === 1) {
    yield { type: 'mark-sorted', indices: [0] }
    yield { type: 'done' }
    return
  }

  while (a.filter((e) => e.value > 0).length > 1) {
    let poor = -1
    let rich = -1
    for (let i = 0; i < n; i++) {
      if (a[i].value > 0 && (poor === -1 || a[i].value < a[poor].value)) {
        poor = i
      }
      if (rich === -1 || a[i].value >= a[rich].value) {
        rich = i
      }
    }

    yield { type: 'compare', i: poor, j: rich }

    const richVal = a[rich].value + a[poor].value
    a[rich] = { ...a[rich], value: richVal }
    yield { type: 'overwrite', i: rich, value: richVal }

    a[poor] = { ...a[poor], value: 0 }
    yield { type: 'overwrite', i: poor, value: 0 }
  }

  const k = a.findIndex((e) => e.value !== 0)
  if (k !== -1 && k !== n - 1) {
    ;[a[k], a[n - 1]] = [a[n - 1], a[k]]
    yield { type: 'swap', i: k, j: n - 1 }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

// Pure capitalist sort: n - 1 zeros followed by the sum of all values.
export function capitalistSort(arr: number[]): number[] {
  const n = arr.length
  if (n === 0) return []
  const total = arr.reduce((s, v) => s + v, 0)
  return new Array<number>(n - 1).fill(0).concat(total)
}
