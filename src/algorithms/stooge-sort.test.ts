import { describe, it, expect } from 'vitest'
import { stoogeSort, stoogeSortSteps } from './stooge-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Stooge Sort', () => {
  describe('stoogeSort', () => {
    it('handles empty array', () => expect(stoogeSort([])).toEqual([]))
    it('handles single element', () => expect(stoogeSort([1])).toEqual([1]))
    it('sorts already sorted array', () => expect(stoogeSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted array', () => expect(stoogeSort([3, 2, 1])).toEqual([1, 2, 3]))
    it('sorts array with duplicates', () =>
      expect(stoogeSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
    it('sorts larger array', () =>
      expect(stoogeSort([9, 7, 5, 3, 1, 2, 4, 6, 8])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]))
  })

  describe('stoogeSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...stoogeSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(stoogeSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    // Keep array small — stooge sort is O(n^2.709) and generates many steps
    it('produces a sorted array after applying all steps (small input)', () => {
      const arr = toEntries([4, 2, 3, 1])
      expect(drainSteps(stoogeSortSteps(arr), arr)).toEqual([1, 2, 3, 4])
    })

    it('all compare/swap indices are within bounds', () => {
      const arr = toEntries([3, 1, 4, 1, 5])
      const n = arr.length
      const steps = [...stoogeSortSteps(arr)]
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
