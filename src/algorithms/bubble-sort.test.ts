import { describe, it, expect } from 'vitest'
import { bubbleSort, bubbleSortSteps } from './bubble-sort.ts'
import { toEntries, drainSteps } from './test-helpers.ts'

describe('Bubble Sort', () => {
  describe('bubbleSort', () => {
    it('handles empty array', () => expect(bubbleSort([])).toEqual([]))
    it('handles single element', () => expect(bubbleSort([1])).toEqual([1]))
    it('sorts already sorted', () => expect(bubbleSort([1, 2, 3])).toEqual([1, 2, 3]))
    it('sorts reverse sorted', () => expect(bubbleSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]))
    it('handles duplicates', () => expect(bubbleSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]))
  })

  describe('bubbleSortSteps', () => {
    it('ends with done', () => {
      const steps = [...bubbleSortSteps(toEntries([3, 1, 2]))]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate input', () => {
      const arr = toEntries([3, 1, 2])
      const original = JSON.stringify(arr)
      drainSteps(bubbleSortSteps(arr), arr)
      expect(JSON.stringify(arr)).toBe(original)
    })

    it('generator produces sorted result', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      expect(drainSteps(bubbleSortSteps(arr), arr)).toEqual([1, 2, 3, 4, 5])
    })

    it('performs n(n-1)/2 comparisons on worst case', () => {
      const arr = toEntries([5, 4, 3, 2, 1])
      const comparisons = [...bubbleSortSteps(arr)].filter((s) => (s as {type:string}).type === 'compare')
      expect(comparisons).toHaveLength(10) // 5*4/2
    })
  })
})
