import { describe, it, expect } from 'vitest'
import { radixSort, radixSortSteps } from './radix-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Radix Sort', () => {
  describe('radixSort', () => {
    it('handles empty array', () => expect(radixSort([])).toEqual([]))
    it('handles single element', () => expect(radixSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(radixSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(radixSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles multi-digit numbers', () =>
      expect(radixSort([170, 45, 75, 90, 802, 24, 2, 66])).toEqual([2, 24, 45, 66, 75, 90, 170, 802]))
  })

  describe('radixSortSteps', () => {
    it('ends with done', () => {
      const steps = [...radixSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(radixSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 3, 1, 4, 2])
      expect(drainSteps(radixSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })
  })
})
