import { describe, it, expect } from 'vitest'
import { robinHoodSort, robinHoodSortSteps } from './robin-hood-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Robin Hood Sort', () => {
  // Robin Hood sort is NOT a permutation of the input: it redistributes wealth
  // (take from the richest, give to the poorest) until at most two value classes
  // remain, then settles them into non-decreasing order. Same final distribution
  // as Communist Sort, implemented independently — communism with extra steps.
  describe('robinHoodSort', () => {
    it('handles empty array', () => expect(robinHoodSort([])).toEqual([]))
    it('handles single element', () => expect(robinHoodSort([7])).toEqual([7]))
    it('redistributes evenly divisible total', () =>
      expect(robinHoodSort([1, 2, 3])).toEqual([2, 2, 2]))
    it('handles remainder case', () =>
      expect(robinHoodSort([1, 1, 1, 1, 3])).toEqual([1, 1, 1, 2, 2]))
    it('leaves already-equal input untouched', () =>
      expect(robinHoodSort([4, 4, 4])).toEqual([4, 4, 4]))

    it('conserves sum, is nondecreasing, and settles within 1 for varied inputs', () => {
      const cases = [
        [5],
        [1, 2, 3, 4, 5],
        [10, 0, 0, 0],
        [3, 3, 3, 3],
        [9, 1, 1, 1, 1, 1, 1],
        [100, 1],
        [2, 2, 2, 3],
        [0, 0, 0, 0, 1],
      ]
      for (const values of cases) {
        const result = robinHoodSort(values)
        expect(result.reduce((a, b) => a + b, 0)).toBe(values.reduce((a, b) => a + b, 0))
        for (let i = 1; i < result.length; i++) {
          expect(result[i]).toBeGreaterThanOrEqual(result[i - 1])
        }
        if (result.length > 0) {
          expect(Math.max(...result) - Math.min(...result)).toBeLessThanOrEqual(1)
        }
      }
    })
  })

  describe('robinHoodSortSteps generator', () => {
    it('ends with done', () => {
      const steps = [...robinHoodSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('handles empty array with only done', () => {
      const steps = [...robinHoodSortSteps(toEntries([]))]
      expect(steps).toEqual([{ type: 'done' }])
    })

    it('does not mutate input', () => {
      const arr = toEntries([1, 1, 1, 1, 3])
      const original = JSON.stringify(arr)
      drainSteps(robinHoodSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('drainSteps result equals robinHoodSort of the same values', () => {
      const cases = [[], [7], [1, 2, 3], [1, 1, 1, 1, 3], [4, 4, 4], [9, 1, 1, 1, 1, 1, 1]]
      for (const values of cases) {
        const arr = toEntries(values)
        expect(drainSteps(robinHoodSortSteps(arr), arr)).toEqual(robinHoodSort(values))
      }
    })

    it('every data step is overwrite (no swaps)', () => {
      const steps = [...robinHoodSortSteps(toEntries([9, 1, 1, 1, 1, 1, 1]))]
      const dataSteps = steps.filter((s) => s.type === 'overwrite' || s.type === 'swap')
      expect(dataSteps.every((s) => s.type === 'overwrite')).toBe(true)
    })

    it('emits a compare before each transfer round', () => {
      const steps = [...robinHoodSortSteps(toEntries([1, 2, 3]))]
      expect(steps.some((s) => s.type === 'compare')).toBe(true)
    })

    it('ends with mark-sorted covering all indices then done', () => {
      const arr = toEntries([5, 1, 2, 8])
      const steps = [...robinHoodSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
      const markSorted = steps.at(-2) as { type: 'mark-sorted'; indices: number[] }
      expect(markSorted.type).toBe('mark-sorted')
      expect(markSorted.indices.slice().sort((a, b) => a - b)).toEqual([0, 1, 2, 3])
    })

    it('no intermediate overwrite value falls outside the initial [min, max]', () => {
      const values = [9, 1, 1, 1, 1, 1, 1]
      const initialMin = Math.min(...values)
      const initialMax = Math.max(...values)
      const steps = [...robinHoodSortSteps(toEntries(values))]
      for (const s of steps) {
        if (s.type === 'overwrite') {
          expect(s.value).toBeGreaterThanOrEqual(initialMin)
          expect(s.value).toBeLessThanOrEqual(initialMax)
        }
      }
    })
  })
})
