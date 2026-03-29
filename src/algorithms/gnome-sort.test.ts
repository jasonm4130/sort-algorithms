import { describe, it, expect } from 'vitest'
import { gnomeSort, gnomeSortSteps } from './gnome-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Gnome Sort', () => {
  describe('gnomeSort', () => {
    it('handles empty array', () => expect(gnomeSort([])).toEqual([]))
    it('handles single element', () => expect(gnomeSort([1])).toEqual([1]))
    it('sorts already sorted array', () => expect(gnomeSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]))
    it('sorts reverse sorted array', () => expect(gnomeSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]))
    it('sorts array with duplicates', () =>
      expect(gnomeSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9]))
    it('is stable: preserves relative order of equal elements', () => {
      // gnome sort only swaps adjacent elements — stable by definition
      expect(gnomeSort([2, 2, 1, 1])).toEqual([1, 1, 2, 2])
    })
  })

  describe('gnomeSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...gnomeSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(gnomeSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('produces a sorted array after applying all steps', () => {
      const arr = toEntries([5, 3, 8, 1, 9, 2])
      expect(drainSteps(gnomeSortSteps(arr), arr)).toEqual([1, 2, 3, 5, 8, 9])
    })

    it('handles already sorted input', () => {
      const arr = toEntries([1, 2, 3])
      const steps = [...gnomeSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
      expect(drainSteps(gnomeSortSteps(arr), arr)).toEqual([1, 2, 3])
    })
  })
})
