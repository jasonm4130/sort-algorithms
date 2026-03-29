import { describe, it, expect } from 'vitest'
import { pancakeSort, pancakeSortSteps } from './pancake-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Pancake Sort', () => {
  describe('pancakeSort', () => {
    it('handles empty array', () => expect(pancakeSort([])).toEqual([]))
    it('handles single element', () => expect(pancakeSort([1])).toEqual([1]))
    it('sorts already sorted array', () => expect(pancakeSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]))
    it('sorts reverse sorted array', () => expect(pancakeSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]))
    it('sorts array with duplicates', () =>
      expect(pancakeSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9]))
  })

  describe('pancakeSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...pancakeSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(pancakeSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('produces a sorted array after applying all steps', () => {
      const arr = toEntries([4, 3, 2, 1])
      expect(drainSteps(pancakeSortSteps(arr), arr)).toEqual([1, 2, 3, 4])
    })

    it('produces sorted array for mixed input', () => {
      const arr = toEntries([5, 3, 8, 1, 9, 2])
      expect(drainSteps(pancakeSortSteps(arr), arr)).toEqual([1, 2, 3, 5, 8, 9])
    })

    it('handles empty array', () => {
      const arr = toEntries([])
      const steps = [...pancakeSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })
  })
})
