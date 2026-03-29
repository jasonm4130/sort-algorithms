import { describe, it, expect } from 'vitest'
import { bucketSort, bucketSortSteps } from './bucket-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Bucket Sort', () => {
  describe('bucketSort', () => {
    it('handles empty array', () => expect(bucketSort([])).toEqual([]))
    it('handles single element', () => expect(bucketSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(bucketSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(bucketSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(bucketSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('bucketSortSteps', () => {
    it('ends with done', () => {
      const steps = [...bucketSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(bucketSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 3, 1, 4, 2])
      expect(drainSteps(bucketSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })
  })
})
