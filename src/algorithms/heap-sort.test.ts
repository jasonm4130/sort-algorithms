import { describe, it, expect } from 'vitest'
import { heapSort, heapSortSteps } from './heap-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Heap Sort', () => {
  describe('heapSort', () => {
    it('handles empty array', () => expect(heapSort([])).toEqual([]))
    it('handles single element', () => expect(heapSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(heapSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(heapSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(heapSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('heapSortSteps', () => {
    it('ends with done', () => {
      const steps = [...heapSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(heapSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      expect(drainSteps(heapSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })
  })
})
