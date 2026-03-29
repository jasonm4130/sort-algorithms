import { describe, it, expect } from 'vitest'
import { shellSort, shellSortSteps } from './shell-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Shell Sort', () => {
  describe('shellSort', () => {
    it('handles empty array', () => expect(shellSort([])).toEqual([]))
    it('handles single element', () => expect(shellSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(shellSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(shellSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(shellSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('shellSortSteps', () => {
    it('ends with done', () => {
      const steps = [...shellSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(shellSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      expect(drainSteps(shellSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })
  })
})
