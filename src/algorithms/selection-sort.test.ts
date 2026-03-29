import { describe, it, expect } from 'vitest'
import { selectionSort, selectionSortSteps } from './selection-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Selection Sort', () => {
  describe('selectionSort', () => {
    it('handles empty array', () => expect(selectionSort([])).toEqual([]))
    it('handles single element', () => expect(selectionSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(selectionSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(selectionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(selectionSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('selectionSortSteps', () => {
    it('ends with done', () => {
      const steps = [...selectionSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(selectionSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      expect(drainSteps(selectionSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })

    it('always performs n(n-1)/2 comparisons', () => {
      const arr = toEntries([1, 2, 3, 4, 5]) // already sorted
      const comparisons = [...selectionSortSteps(arr)].filter((s) => (s as {type:string}).type === 'compare')
      expect(comparisons).toHaveLength(10) // always 5*4/2
    })
  })
})
