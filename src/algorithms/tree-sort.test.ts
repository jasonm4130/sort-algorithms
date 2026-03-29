import { describe, it, expect } from 'vitest'
import { treeSort, treeSortSteps } from './tree-sort'

describe('Tree Sort', () => {
  describe('treeSort', () => {
    it('handles empty array', () => {
      expect(treeSort([])).toEqual([])
    })

    it('handles single element', () => {
      expect(treeSort([1])).toEqual([1])
    })

    it('sorts already sorted array', () => {
      expect(treeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts reverse sorted array', () => {
      expect(treeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts array with duplicates', () => {
      expect(treeSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('handles all identical elements', () => {
      expect(treeSort([7, 7, 7, 7])).toEqual([7, 7, 7, 7])
    })
  })

  describe('treeSortSteps generator', () => {
    it('final step is done', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...treeSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }]
      const original = JSON.stringify(arr)
      void [...treeSortSteps(arr)]
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('yields pivot steps during BST build phase', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...treeSortSteps(arr)]
      expect(steps.some((s) => s.type === 'pivot')).toBe(true)
    })

    it('yields overwrite steps during readout phase', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...treeSortSteps(arr)]
      expect(steps.some((s) => s.type === 'overwrite')).toBe(true)
    })

    it('handles single element', () => {
      const steps = [...treeSortSteps([{ id: '1', value: 5 }])]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('handles empty array', () => {
      const steps = [...treeSortSteps([])]
      expect(steps).toEqual([{ type: 'done' }])
    })
  })
})
