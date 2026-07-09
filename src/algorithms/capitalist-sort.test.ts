import { describe, it, expect } from 'vitest'
import { capitalistSort, capitalistSortSteps } from './capitalist-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Capitalist Sort', () => {
  // Capitalist sort is NOT a permutation sort — wealth concentrates into a
  // single index (the sum), the rest become 0.
  describe('capitalistSort', () => {
    it('handles empty array', () => expect(capitalistSort([])).toEqual([]))
    it('handles single element', () => expect(capitalistSort([7])).toEqual([7]))
    it('concentrates wealth into the last index', () =>
      expect(capitalistSort([1, 2, 3])).toEqual([0, 0, 6]))
    it('concentrates wealth for a larger input', () =>
      expect(capitalistSort([3, 1, 4, 1, 5])).toEqual([0, 0, 0, 0, 14]))
    it('handles all-equal input', () => expect(capitalistSort([4, 4])).toEqual([0, 8]))
    it('handles all-zero input (stays all zeros)', () =>
      expect(capitalistSort([0, 0, 0])).toEqual([0, 0, 0]))

    it.each([
      [1, 2, 3],
      [3, 1, 4, 1, 5],
      [4, 4],
      [9, 0, 2, 7, 0, 3],
      [10],
      [0, 0, 5, 0],
    ])('conserves sum, is nondecreasing, has at most one nonzero element for %j', (...values) => {
      const total = values.reduce((s, v) => s + v, 0)
      const result = capitalistSort(values)
      expect(result.reduce((s, v) => s + v, 0)).toBe(total)
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(result[i - 1])
      }
      const nonzeroCount = result.filter((v) => v !== 0).length
      if (total > 0) {
        expect(nonzeroCount).toBe(1)
        expect(result.at(-1)).toBe(total)
      } else {
        expect(nonzeroCount).toBe(0)
      }
    })
  })

  describe('capitalistSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 4, 1, 5])
      const steps = [...capitalistSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('handles empty array (done only)', () => {
      const arr = toEntries([])
      const steps = [...capitalistSortSteps(arr)]
      expect(steps).toEqual([{ type: 'done' }])
    })

    it('handles single element (mark-sorted then done)', () => {
      const arr = toEntries([7])
      const steps = [...capitalistSortSteps(arr)]
      expect(steps).toEqual([{ type: 'mark-sorted', indices: [0] }, { type: 'done' }])
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 4, 1, 5])
      const original = JSON.stringify(arr)
      const steps = [...capitalistSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('drainSteps result equals capitalistSort of the same values', () => {
      for (const values of [[1, 2, 3], [3, 1, 4, 1, 5], [4, 4], [9, 0, 2, 7, 0, 3], [10]]) {
        const arr = toEntries(values)
        const result = drainSteps(capitalistSortSteps(arr), arr)
        expect(result).toEqual(capitalistSort(values))
      }
    })

    it('data-changing steps are only overwrite plus at most one swap', () => {
      const arr = toEntries([3, 1, 4, 1, 5])
      const steps = [...capitalistSortSteps(arr)]
      const dataSteps = steps.filter((s) => s.type === 'overwrite' || s.type === 'swap')
      const swaps = dataSteps.filter((s) => s.type === 'swap')
      expect(swaps.length).toBeLessThanOrEqual(1)
      dataSteps.forEach((s) => {
        expect(['overwrite', 'swap']).toContain(s.type)
      })
    })

    it('ends with mark-sorted over all indices before done', () => {
      const arr = toEntries([3, 1, 4, 1, 5])
      const steps = [...capitalistSortSteps(arr)]
      const markSorted = steps.at(-2) as { type: 'mark-sorted'; indices: number[] }
      expect(markSorted.type).toBe('mark-sorted')
      expect(markSorted.indices.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4])
    })

    it('yields a compare step for each transfer round', () => {
      // [1, 2, 3]: poorest=0(1) richest=2(3) -> transfer -> [0,2,4]; poorest=1(2) richest=2(4) -> [0,0,6]
      const arr = toEntries([1, 2, 3])
      const steps = [...capitalistSortSteps(arr)]
      const compares = steps.filter((s) => s.type === 'compare')
      expect(compares).toHaveLength(2)
    })
  })
})
