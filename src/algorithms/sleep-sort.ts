import type { ArrayEntry, Step } from '../types/index.ts'

// Sleep sort: each element launches a thread that sleeps for a duration
// proportional to its value. Threads wake up in ascending value order.
//
// Phase 1 (dispatch): each element is highlighted as its thread launches — a
// left-to-right wave of pivot colours showing threads being spawned.
// Phase 2 (wake-up): elements arrive in value order — overwriting positions
// 0, 1, 2 … with sorted values and immediately marking each green.
export function* sleepSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))

  if (a.length <= 1) {
    yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
    yield { type: 'done' }
    return
  }

  // Phase 1: dispatch — one pivot step per element (threads being launched)
  for (let i = 0; i < a.length; i++) {
    yield { type: 'pivot', i }
  }

  // Phase 2: wake-up — smallest value wakes first, fills next output slot
  const wakeOrder = [...a]
    .map((e, i) => ({ idx: i, value: e.value }))
    .sort((x, y) => x.value - y.value)

  for (let pos = 0; pos < wakeOrder.length; pos++) {
    yield { type: 'overwrite', i: pos, value: wakeOrder[pos].value }
    yield { type: 'mark-sorted', indices: [pos] }
  }

  yield { type: 'done' }
}

export function sleepSort(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b)
}
