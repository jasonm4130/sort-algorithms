import { describe, it, expect } from 'vitest'
import { bogoSort, bogoSortSteps } from './bogo-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Bogo Sort', () => {
  describe('bogoSort', () => {
    it('handles empty array', () => expect(bogoSort([])).toEqual([]))
    it('handles single element', () => expect(bogoSort([1])).toEqual([1]))
    it('sorts two elements', () => {
      const result = bogoSort([2, 1])
      expect(result).toEqual([1, 2])
    })
    it('sorts three elements', () => {
      const result = bogoSort([3, 2, 1])
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('bogoSortSteps', () => {
    it('ends with done for already-sorted input', () => {
      const steps = [...bogoSortSteps(toEntries([1, 2, 3]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('ends with done for single element', () => {
      const steps = [...bogoSortSteps(toEntries([42]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([1, 2, 3])
      const original = JSON.stringify(arr)
      drainSteps(bogoSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('terminates once it happens to be sorted', () => {
      // Use already-sorted to guarantee immediate termination
      const arr = toEntries([1, 2])
      const steps = [...bogoSortSteps(arr)]
      expect(steps.at(-1)?.type).toBe('done')
    })
  })
})
