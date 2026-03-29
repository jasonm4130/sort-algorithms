import { describe, it, expect } from 'vitest'
import { countingSort, countingSortSteps } from './counting-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Counting Sort', () => {
  describe('countingSort', () => {
    it('handles empty array', () => expect(countingSort([])).toEqual([]))
    it('handles single element', () => expect(countingSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(countingSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(countingSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(countingSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('countingSortSteps', () => {
    it('ends with done', () => {
      const steps = [...countingSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(countingSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 3, 1, 4, 2])
      expect(drainSteps(countingSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })

    it('all steps are overwrite type (except done and mark-sorted)', () => {
      const steps = [...countingSortSteps(toEntries([3, 1, 2]))]
      const nonDone = steps.filter(s => s.type !== 'done' && s.type !== 'mark-sorted')
      expect(nonDone.every(s => s.type === 'overwrite')).toBe(true)
    })
  })
})
