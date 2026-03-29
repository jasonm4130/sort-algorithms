import type { ArrayEntry, Step } from '../types/index.ts'

// Quantum Bogosort: make a quantum observation of the array.
// All universes where the array is not sorted are instantly destroyed.
// In the one surviving universe, it was already sorted — O(1).
// Simulated here: a single quantum observation, then all values collapse
// into their correct positions via overwrite (the surviving universe's state).
export function* quantumBogoSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))

  // Quantum observation — collapse the wave function
  if (a.length > 1) {
    yield { type: 'compare', i: 0, j: a.length - 1 }
  }

  // Overwrite each position with the sorted value (the surviving universe)
  const sorted = [...a].sort((x, y) => x.value - y.value)
  for (let i = 0; i < a.length; i++) {
    if (a[i].value !== sorted[i].value) {
      yield { type: 'overwrite', i, value: sorted[i].value }
    }
  }

  yield { type: 'mark-sorted', indices: a.map((_, i) => i) }
  yield { type: 'done' }
}

export function quantumBogoSort(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b)
}
