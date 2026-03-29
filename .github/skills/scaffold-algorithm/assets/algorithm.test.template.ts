import { describe, it, expect } from 'vitest'
import { __NAME__Sort, __NAME__Steps } from './__KEBAB_NAME__'

describe('__DISPLAY_NAME__', () => {
  describe('__NAME__Sort', () => {
    it('handles empty array', () => {
      expect(__NAME__Sort([])).toEqual([])
    })

    it('handles single element', () => {
      expect(__NAME__Sort([1])).toEqual([1])
    })

    it('sorts already sorted array', () => {
      expect(__NAME__Sort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts reverse sorted array', () => {
      expect(__NAME__Sort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts array with duplicates', () => {
      expect(__NAME__Sort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })
  })

  describe('__NAME__Steps generator', () => {
    it('final array state is sorted', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...__NAME__Steps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }]
      const original = JSON.stringify(arr)
      ;[...__NAME__Steps(arr)]
      expect(JSON.stringify(arr)).toBe(original)
    })
  })
})
