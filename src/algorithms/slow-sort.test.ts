import { describe, it, expect } from 'vitest'
import { slowSort, slowSortSteps } from './slow-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Slow Sort', () => {
  describe('slowSort', () => {
    it('handles empty array', () => expect(slowSort([])).toEqual([]))
    it('handles single element', () => expect(slowSort([1])).toEqual([1]))
    it('sorts already sorted array', () => expect(slowSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted array', () => expect(slowSort([3, 2, 1])).toEqual([1, 2, 3]))
    it('sorts array with duplicates', () => expect(slowSort([2, 2, 1])).toEqual([1, 2, 2]))
    it('sorts larger array', () =>
      expect(slowSort([5, 3, 8, 1, 9, 2, 4])).toEqual([1, 2, 3, 4, 5, 8, 9]))
  })

  describe('slowSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...slowSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(slowSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    // Keep arrays small — slowsort generates many, many steps
    it('produces a sorted array after applying all steps (n=3)', () => {
      const arr = toEntries([3, 1, 2])
      expect(drainSteps(slowSortSteps(arr), arr)).toEqual([1, 2, 3])
    })

    it('produces a sorted array after applying all steps (n=4)', () => {
      const arr = toEntries([4, 3, 2, 1])
      expect(drainSteps(slowSortSteps(arr), arr)).toEqual([1, 2, 3, 4])
    })

    it('all step indices are within array bounds', () => {
      const arr = toEntries([3, 1, 2])
      const n = arr.length
      const steps = [...slowSortSteps(arr)]
      steps.forEach((s) => {
        if (s.type === 'compare' || s.type === 'swap') {
          expect(s.i).toBeGreaterThanOrEqual(0)
          expect(s.i).toBeLessThan(n)
          expect(s.j).toBeGreaterThanOrEqual(0)
          expect(s.j).toBeLessThan(n)
        }
      })
    })
  })
})
