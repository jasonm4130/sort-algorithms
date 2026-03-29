import { describe, it, expect } from 'vitest'
import { mergeSort, mergeSortSteps } from './merge-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Merge Sort', () => {
  describe('mergeSort', () => {
    it('handles empty array', () => expect(mergeSort([])).toEqual([]))
    it('handles single element', () => expect(mergeSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(mergeSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(mergeSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('mergeSortSteps', () => {
    it('ends with done', () => {
      const steps = [...mergeSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(mergeSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      expect(drainSteps(mergeSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })
  })
})
