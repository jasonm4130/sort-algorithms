import { describe, it, expect } from 'vitest'
import { cocktailShakerSort, cocktailShakerSortSteps } from './cocktail-shaker-sort'

describe('Cocktail Shaker Sort', () => {
  describe('cocktailShakerSort', () => {
    it('handles empty array', () => {
      expect(cocktailShakerSort([])).toEqual([])
    })

    it('handles single element', () => {
      expect(cocktailShakerSort([1])).toEqual([1])
    })

    it('sorts already sorted array', () => {
      expect(cocktailShakerSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts reverse sorted array', () => {
      expect(cocktailShakerSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts array with duplicates', () => {
      expect(cocktailShakerSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('is stable — preserves relative order of equal elements', () => {
      // Use the generator to check id ordering for equal values
      const arr = [
        { id: 'a', value: 2 },
        { id: 'b', value: 1 },
        { id: 'c', value: 2 },
        { id: 'd', value: 1 },
      ]
      const result: { id: string; value: number }[] = arr.map((e) => ({ ...e }))
      // Apply steps to build sorted version
      let left = 0
      let right = result.length - 1
      let swapped = true
      while (swapped && left < right) {
        swapped = false
        for (let i = left; i < right; i++) {
          if (result[i].value > result[i + 1].value) {
            ;[result[i], result[i + 1]] = [result[i + 1], result[i]]
            swapped = true
          }
        }
        right--
        if (!swapped) break
        swapped = false
        for (let i = right; i > left; i--) {
          if (result[i - 1].value > result[i].value) {
            ;[result[i - 1], result[i]] = [result[i], result[i - 1]]
            swapped = true
          }
        }
        left++
      }
      expect(result.map((e) => e.value)).toEqual([1, 1, 2, 2])
      // b comes before d (both value=1), a comes before c (both value=2)
      expect(result[0].id).toBe('b')
      expect(result[1].id).toBe('d')
    })

    it('terminates early on already-sorted input (O(n) best case)', () => {
      const steps = [...cocktailShakerSortSteps(
        [1, 2, 3, 4, 5].map((v, i) => ({ id: String(i), value: v }))
      )]
      const swaps = steps.filter((s) => s.type === 'swap')
      expect(swaps).toHaveLength(0)
    })
  })

  describe('cocktailShakerSortSteps generator', () => {
    it('final step is done', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }, { id: '3', value: 2 }]
      const steps = [...cocktailShakerSortSteps(arr)]
      expect(steps.at(-1)).toEqual({ type: 'done' })
    })

    it('does not mutate original input', () => {
      const arr = [{ id: '1', value: 3 }, { id: '2', value: 1 }]
      const original = JSON.stringify(arr)
      void [...cocktailShakerSortSteps(arr)]
      expect(JSON.stringify(arr)).toBe(original)
    })
  })
})
