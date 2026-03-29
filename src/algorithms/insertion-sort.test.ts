import { describe, it, expect } from 'vitest'
import { insertionSort, insertionSortSteps } from './insertion-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Insertion Sort', () => {
  describe('insertionSort', () => {
    it('handles empty array', () => expect(insertionSort([])).toEqual([]))
    it('handles single element', () => expect(insertionSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(insertionSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(insertionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(insertionSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('insertionSortSteps', () => {
    it('ends with done', () => {
      const steps = [...insertionSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(insertionSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      expect(drainSteps(insertionSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })

    it('performs O(n) comparisons on already sorted input', () => {
      const arr = toEntries([1, 2, 3, 4, 5])
      const comparisons = [...insertionSortSteps(arr)].filter((s) => (s as {type:string}).type === 'compare')
      expect(comparisons.length).toBeLessThanOrEqual(4) // n-1 comparisons best case
    })
  })
})
