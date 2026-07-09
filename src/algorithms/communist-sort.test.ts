import { describe, it, expect } from 'vitest'
import { communistSort, communistSortSteps } from './communist-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Communist Sort', () => {
  describe('communistSort', () => {
    it('handles empty array', () => expect(communistSort([])).toEqual([]))
    it('handles single element', () => expect(communistSort([7])).toEqual([7]))
    it('redistributes an already-sorted input evenly', () =>
      expect(communistSort([1, 2, 3])).toEqual([2, 2, 2]))
    it('redistributes evenly when total divides n', () =>
      expect(communistSort([5, 3, 1, 4, 2])).toEqual([3, 3, 3, 3, 3]))
    it('puts the remainder on the last r indices', () =>
      expect(communistSort([1, 1, 1, 1, 3])).toEqual([1, 1, 1, 2, 2]))

    it('conserves the sum, is nondecreasing, and has max - min <= 1', () => {
      const cases = [[1, 2, 3], [5, 3, 1, 4, 2], [1, 1, 1, 1, 3], [10], [], [4, 4, 4, 4]]
      for (const input of cases) {
        const result = communistSort(input)
        expect(result.reduce((s, v) => s + v, 0)).toBe(input.reduce((s, v) => s + v, 0))
        for (let i = 1; i < result.length; i++) {
          expect(result[i]).toBeGreaterThanOrEqual(result[i - 1])
        }
        if (result.length > 0) {
          expect(Math.max(...result) - Math.min(...result)).toBeLessThanOrEqual(1)
        }
      }
    })
  })

  describe('communistSortSteps', () => {
    it('ends with done', () => {
      const steps = [...communistSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('yields only done for empty input', () => {
      const steps = [...communistSortSteps(toEntries([]))]
      expect(steps).toEqual([{ type: 'done' }])
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(communistSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('drainSteps matches plain fn', () => {
      const values = [5, 3, 1, 4, 2]
      const arr = toEntries(values)
      expect(drainSteps(communistSortSteps(arr), arr)).toEqual(communistSort(values))
    })

    it('drainSteps matches plain fn on a remainder case', () => {
      const values = [1, 1, 1, 1, 3]
      const arr = toEntries(values)
      expect(drainSteps(communistSortSteps(arr), arr)).toEqual(communistSort(values))
    })

    it('every non-done/non-mark-sorted step is overwrite', () => {
      const steps = [...communistSortSteps(toEntries([3, 1, 2]))]
      const rest = steps.filter((s) => s.type !== 'done' && s.type !== 'mark-sorted')
      expect(rest.every((s) => s.type === 'overwrite')).toBe(true)
    })
  })
})
