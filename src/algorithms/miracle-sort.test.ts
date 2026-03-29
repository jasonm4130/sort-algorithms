import { describe, it, expect } from 'vitest'
import { miracleSort, miracleSortSteps } from './miracle-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Miracle Sort', () => {
  describe('miracleSort', () => {
    it('handles empty array', () => expect(miracleSort([])).toEqual([]))
    it('handles single element', () => expect(miracleSort([1])).toEqual([1]))
    it('sorts already sorted array', () => expect(miracleSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]))
    it('sorts reverse sorted array', () => expect(miracleSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]))
    it('sorts array with duplicates', () =>
      expect(miracleSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9]))
  })

  describe('miracleSortSteps generator', () => {
    it('final step is done', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...miracleSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(miracleSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('the miracle produces a sorted array via overwrite steps', () => {
      const arr = toEntries([4, 2, 3, 1])
      expect(drainSteps(miracleSortSteps(arr), arr)).toEqual([1, 2, 3, 4])
    })

    it('emits only compare steps before the miracle (no early overwrites)', () => {
      const arr = toEntries([3, 1, 2])
      const steps = [...miracleSortSteps(arr)]
      const firstOverwrite = steps.findIndex((s) => s.type === 'overwrite')
      const lastCompare = steps.reduce((last, s, i) => (s.type === 'compare' ? i : last), -1)
      if (firstOverwrite !== -1 && lastCompare !== -1) {
        expect(lastCompare).toBeLessThan(firstOverwrite)
      }
    })

    it('no overwrite steps needed for already sorted input', () => {
      const arr = toEntries([1, 2, 3])
      const steps = [...miracleSortSteps(arr)]
      expect(steps.filter((s) => s.type === 'overwrite')).toHaveLength(0)
    })
  })
})
