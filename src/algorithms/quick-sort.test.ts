import { describe, it, expect } from 'vitest'
import { quickSort, quickSortSteps } from './quick-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Quick Sort', () => {
  describe('quickSort', () => {
    it('handles empty array', () => expect(quickSort([])).toEqual([]))
    it('handles single element', () => expect(quickSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(quickSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(quickSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(quickSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('quickSortSteps', () => {
    it('ends with done', () => {
      const steps = [...quickSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(quickSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      expect(drainSteps(quickSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })
  })
})
