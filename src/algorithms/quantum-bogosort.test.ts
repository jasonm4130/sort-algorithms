import { describe, it, expect } from 'vitest'
import { quantumBogoSort, quantumBogoSortSteps } from './quantum-bogosort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Quantum Bogosort', () => {
  describe('quantumBogoSort', () => {
    it('handles empty array', () => expect(quantumBogoSort([])).toEqual([]))
    it('handles single element', () => expect(quantumBogoSort([1])).toEqual([1]))
    it('sorts already sorted array', () =>
      expect(quantumBogoSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]))
    it('sorts reverse sorted array', () =>
      expect(quantumBogoSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]))
    it('sorts array with duplicates', () =>
      expect(quantumBogoSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9]))
  })

  describe('quantumBogoSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...quantumBogoSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(quantumBogoSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('produces a sorted array via quantum collapse (overwrite steps)', () => {
      const arr = toEntries([4, 2, 3, 1])
      expect(drainSteps(quantumBogoSortSteps(arr), arr)).toEqual([1, 2, 3, 4])
    })

    it('emits exactly one compare step (the quantum observation)', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...quantumBogoSortSteps(arr)]
      expect(steps.filter((s) => s.type === 'compare')).toHaveLength(1)
    })

    it('emits no compare steps for single element', () => {
      const arr = toEntries([1])
      const steps = [...quantumBogoSortSteps(arr)]
      expect(steps.filter((s) => s.type === 'compare')).toHaveLength(0)
    })

    it('no overwrite steps needed for already sorted input', () => {
      const arr = toEntries([1, 2, 3])
      const steps = [...quantumBogoSortSteps(arr)]
      expect(steps.filter((s) => s.type === 'overwrite')).toHaveLength(0)
    })
  })
})
