import { describe, it, expect } from 'vitest'
import { sleepSort, sleepSortSteps } from './sleep-sort.ts'
import { toEntries } from './test-helpers.ts'

describe('Sleep Sort', () => {
  describe('sleepSort', () => {
    it('handles empty array', () => expect(sleepSort([])).toEqual([]))
    it('handles single element', () => expect(sleepSort([1])).toEqual([1]))
    it('sorts already sorted array', () => expect(sleepSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]))
    it('sorts reverse sorted array', () => expect(sleepSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]))
    it('sorts array with duplicates', () =>
      expect(sleepSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9]))
  })

  describe('sleepSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...sleepSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      void [...sleepSortSteps(arr)]
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('dispatches a pivot step for each element (thread launch phase)', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...sleepSortSteps(arr)]
      const pivots = steps.filter((s) => s.type === 'pivot')
      expect(pivots).toHaveLength(arr.length)
    })

    it('overwrites positions 0..n-1 with values in ascending order', () => {
      const arr = toEntries([30, 10, 20])
      const steps = [...sleepSortSteps(arr)]
      const overwriteValues = steps
        .filter((s) => s.type === 'overwrite')
        .map((s) => (s as { type: 'overwrite'; i: number; value: number }).value)
      expect(overwriteValues).toEqual([10, 20, 30])
    })

    it('all positions are marked sorted', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...sleepSortSteps(arr)]
      const marked = steps
        .filter((s) => s.type === 'mark-sorted')
        .flatMap((s) => (s as { type: 'mark-sorted'; indices: number[] }).indices)
      expect(marked.sort((a, b) => a - b)).toEqual([0, 1, 2])
    })

    it('handles single element', () => {
      const arr = toEntries([42])
      const steps = [...sleepSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })
  })
})
