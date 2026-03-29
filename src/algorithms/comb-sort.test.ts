import { describe, it, expect } from 'vitest'
import { combSort, combSortSteps } from './comb-sort'

describe('Comb Sort', () => {
  describe('combSort', () => {
    it('handles empty array', () => {
      expect(combSort([])).toEqual([])
    })

    it('handles single element', () => {
      expect(combSort([1])).toEqual([1])
    })

    it('sorts already sorted array', () => {
      expect(combSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts reverse sorted array', () => {
      expect(combSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts array with duplicates', () => {
      expect(combSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('uses large gaps to eliminate turtles efficiently', () => {
      // A value of 1 at the end is a classic "turtle" in bubble sort
      const arr = [9, 8, 7, 6, 5, 4, 3, 2, 1]
      expect(combSort(arr)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
  })

  describe('combSortSteps generator', () => {
    it('final step is done', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...combSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }]
      const original = JSON.stringify(arr)
      void [...combSortSteps(arr)]
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('uses gap-based comparisons — compares non-adjacent elements', () => {
      // A 5-element array: first pass gap = floor(5/1.3) = 3, so compares i vs i+3
      const arr = [{ id: '1', value: 5 }, { id: '2', value: 4 }, { id: '3', value: 3 },
                   { id: '4', value: 2 }, { id: '5', value: 1 }]
      const steps = [...combSortSteps(arr)]
      // At least one compare step should span more than 1 position apart
      const hasGapCompare = steps.some(
        (s) => s.type === 'compare' && Math.abs(s.j - s.i) > 1
      )
      expect(hasGapCompare).toBe(true)
    })
  })
})
