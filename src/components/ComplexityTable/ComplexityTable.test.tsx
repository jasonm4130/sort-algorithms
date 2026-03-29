import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ComplexityTable } from './ComplexityTable.tsx'
import type { AlgorithmMeta } from '../../types/index.ts'

const algo: AlgorithmMeta = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  group: 'quadratic',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description: 'Test description',
}

describe('ComplexityTable', () => {
  it('renders time complexities', () => {
    render(<ComplexityTable algorithm={algo} />)
    expect(screen.getByText('O(n)')).toBeTruthy()
    expect(screen.getAllByText('O(n²)').length).toBeGreaterThan(0)
  })

  it('renders space complexity', () => {
    render(<ComplexityTable algorithm={algo} />)
    expect(screen.getByText('O(1)')).toBeTruthy()
  })

  it('shows stable status', () => {
    render(<ComplexityTable algorithm={algo} />)
    expect(screen.getByText('Yes')).toBeTruthy()
  })

  it('renders description', () => {
    render(<ComplexityTable algorithm={algo} />)
    expect(screen.getByText('Test description')).toBeTruthy()
  })
})
