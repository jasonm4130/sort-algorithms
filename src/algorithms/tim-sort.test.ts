import { describe, it, expect } from 'vitest'
import { timSort, timSortSteps } from './tim-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Tim Sort', () => {
  describe('timSort', () => {
    it('handles empty array', () => expect(timSort([])).toEqual([]))
    it('handles single element', () => expect(timSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(timSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(timSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(timSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('timSortSteps', () => {
    it('ends with done', () => {
      const steps = [...timSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(timSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      expect(drainSteps(timSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })
  })
})
