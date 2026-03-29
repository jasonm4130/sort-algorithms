import { describe, it, expect } from 'vitest'
import { introSort, introSortSteps } from './intro-sort'

describe('Intro Sort', () => {
  describe('introSort', () => {
    it('handles empty array', () => {
      expect(introSort([])).toEqual([])
    })

    it('handles single element', () => {
      expect(introSort([1])).toEqual([1])
    })

    it('sorts already sorted array', () => {
      expect(introSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts reverse sorted array', () => {
      expect(introSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts array with duplicates', () => {
      expect(introSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('uses insertion sort path for small arrays (≤ 16 elements)', () => {
      const arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
      expect(introSort(arr)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    })

    it('uses quicksort path for larger arrays (> 16 elements)', () => {
      const arr = Array.from({ length: 20 }, (_, i) => 20 - i)
      expect(introSort(arr)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
    })
  })

  describe('introSortSteps generator', () => {
    it('final step is done', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...introSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }]
      const original = JSON.stringify(arr)
      void [...introSortSteps(arr)]
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('yields pivot steps when quicksort path is triggered (> 16 elements)', () => {
      const arr = Array.from({ length: 20 }, (_, i) => ({ id: String(i), value: 20 - i }))
      const steps = [...introSortSteps(arr)]
      expect(steps.some((s) => s.type === 'pivot')).toBe(true)
    })

    it('handles empty array', () => {
      const steps = [...introSortSteps([])]
      expect(steps).toEqual([{ type: 'done' }])
    })
  })
})
