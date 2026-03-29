import { describe, it, expect } from 'vitest'
import { cycleSort, cycleSortSteps } from './cycle-sort'

describe('Cycle Sort', () => {
  describe('cycleSort', () => {
    it('handles empty array', () => {
      expect(cycleSort([])).toEqual([])
    })

    it('handles single element', () => {
      expect(cycleSort([1])).toEqual([1])
    })

    it('sorts already sorted array', () => {
      expect(cycleSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts reverse sorted array', () => {
      expect(cycleSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts array with duplicates', () => {
      expect(cycleSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('handles all identical elements', () => {
      expect(cycleSort([5, 5, 5, 5])).toEqual([5, 5, 5, 5])
    })

    it('minimises writes — only overwrites when necessary', () => {
      // Two-element unsorted: exactly one cycle → two writes
      const writes: number[] = []
      const arr = [{ id: '1', value: 2 }, { id: '2', value: 1 }]
      for (const step of cycleSortSteps(arr)) {
        if (step.type === 'overwrite') writes.push(step.i)
      }
      expect(writes.length).toBeLessThanOrEqual(2)
    })
  })

  describe('cycleSortSteps generator', () => {
    it('final step is done', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...cycleSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }]
      const original = JSON.stringify(arr)
      void [...cycleSortSteps(arr)]
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('uses overwrite steps (not swap) — minimum-write property', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...cycleSortSteps(arr)]
      expect(steps.some((s) => s.type === 'overwrite')).toBe(true)
      expect(steps.some((s) => s.type === 'swap')).toBe(false)
    })
  })
})
