import { describe, it, expect } from 'vitest'
import { stalinSort, stalinSortSteps } from './stalin-sort.ts'
import { toEntries } from './test-helpers.ts'

describe('Stalin Sort', () => {
  // Stalin sort is NOT a full sort — it removes out-of-order elements.
  describe('stalinSort', () => {
    it('handles empty array', () => expect(stalinSort([])).toEqual([]))
    it('handles single element', () => expect(stalinSort([1])).toEqual([1]))
    it('returns all elements for already sorted array', () =>
      expect(stalinSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]))
    it('returns only first element for reverse sorted array', () =>
      expect(stalinSort([4, 3, 2, 1])).toEqual([4]))
    it('removes out-of-order elements', () =>
      expect(stalinSort([1, 3, 2, 4])).toEqual([1, 3, 4]))
    it('keeps duplicates that are non-decreasing', () =>
      expect(stalinSort([1, 2, 2, 3])).toEqual([1, 2, 2, 3]))
    it('removes elements below the running maximum', () =>
      expect(stalinSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([3, 4, 5, 9]))
  })

  describe('stalinSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...stalinSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      const steps = [...stalinSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('emits overwrite steps for purged elements', () => {
      // [3, 1, 2] → 1 is purged (1 < 3), 2 is purged (2 < 3)
      const arr = toEntries([3, 1, 2])
      const steps = [...stalinSortSteps(arr)]
      const overwrites = steps.filter((s) => s.type === 'overwrite')
      expect(overwrites).toHaveLength(2)
      overwrites.forEach((s) => {
        expect((s as { type: 'overwrite'; value: number }).value).toBe(0)
      })
    })

    it('emits no overwrite steps for already sorted input', () => {
      const arr = toEntries([1, 2, 3])
      const steps = [...stalinSortSteps(arr)]
      expect(steps.filter((s) => s.type === 'overwrite')).toHaveLength(0)
    })

    it('mark-sorted indices match the kept elements', () => {
      // [1, 3, 2, 4] → keeps indices 0 (1), 1 (3), 3 (4)
      const arr = toEntries([1, 3, 2, 4])
      const steps = [...stalinSortSteps(arr)]
      const markSorted = steps.find((s) => s.type === 'mark-sorted') as
        | { type: 'mark-sorted'; indices: number[] }
        | undefined
      expect(markSorted?.indices.sort((a, b) => a - b)).toEqual([0, 1, 3])
    })
  })
})
