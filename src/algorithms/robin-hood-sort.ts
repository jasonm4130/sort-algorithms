import type { ArrayEntry, Step } from '../types/index.ts'

// Robin Hood sort: take from the richest, give to the poorest. Each round finds
// the max ("rich") and min ("poor") value, transfers half their difference from
// rich to poor, and repeats until every value differs by at most 1. A settling
// pass then arranges the two remaining value classes in non-decreasing order.
//
// Deliberate joke: this converges to the exact same distribution as Communist
// Sort — communism with extra steps. Implemented independently (no shared import).
export function* robinHoodSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length
  if (n === 0) {
    yield { type: 'done' }
    return
  }

  // Redistribution: each transfer strictly shrinks the sum of squared values
  // (bounded below by 0), so this terminates.
  while (true) {
    let rich = 0
    let poor = 0
    for (let i = 1; i < n; i++) {
      if (a[i].value > a[rich].value) rich = i
      if (a[i].value < a[poor].value) poor = i
    }
    const max = a[rich].value
    const min = a[poor].value
    if (max - min <= 1) break

    const d = Math.floor((max - min) / 2)
    yield { type: 'compare', i: rich, j: poor }

    const richValue = max - d
    a[rich] = { ...a[rich], value: richValue }
    yield { type: 'overwrite', i: rich, value: richValue }

    const poorValue = min + d
    a[poor] = { ...a[poor], value: poorValue }
    yield { type: 'overwrite', i: poor, value: poorValue }
  }

  // Settling pass: values are now all m or m + 1. Arrange n - r copies of m
  // followed by r copies of m + 1.
  const m = Math.min(...a.map((e) => e.value))
  const r = a.filter((e) => e.value === m + 1).length
  for (let i = 0; i < n; i++) {
    const target = i < n - r ? m : m + 1
    if (a[i].value !== target) {
      a[i] = { ...a[i], value: target }
      yield { type: 'overwrite', i, value: target }
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

// Pure robin hood sort: redistributes the total evenly. With total = sum,
// base = floor(total / n), r = total - base * n: n - r copies of base
// followed by r copies of base + 1.
export function robinHoodSort(arr: number[]): number[] {
  const n = arr.length
  if (n === 0) return []
  const total = arr.reduce((sum, v) => sum + v, 0)
  const base = Math.floor(total / n)
  const r = total - base * n
  const result: number[] = []
  for (let i = 0; i < n - r; i++) result.push(base)
  for (let i = 0; i < r; i++) result.push(base + 1)
  return result
}
