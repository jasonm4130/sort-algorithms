import { describe, it, expect } from 'vitest'
import { ALGORITHMS } from './algorithms.ts'
import { PSEUDOCODE } from './pseudocode.ts'

describe('PSEUDOCODE coverage', () => {
  it('has a non-empty entry for every registered algorithm', () => {
    for (const algo of ALGORITHMS) {
      const lines = PSEUDOCODE[algo.id]
      expect(lines, `${algo.id} is missing pseudocode`).toBeDefined()
      expect(lines.length, `${algo.id} pseudocode has no lines`).toBeGreaterThan(0)
    }
  })

  it('every entry ends with a done step', () => {
    for (const algo of ALGORITHMS) {
      const lines = PSEUDOCODE[algo.id]
      const last = lines.at(-1)
      expect(last?.stepTypes, `${algo.id} last line should reference 'done'`).toContain('done')
    }
  })
})
