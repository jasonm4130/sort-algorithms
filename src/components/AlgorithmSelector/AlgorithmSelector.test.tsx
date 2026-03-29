import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AlgorithmSelector } from './AlgorithmSelector.tsx'

describe('AlgorithmSelector', () => {
  it('renders all algorithm groups', () => {
    render(<AlgorithmSelector selectedId="bubble-sort" onSelect={vi.fn()} />)
    expect(screen.getByText('Simple O(n²)')).toBeTruthy()
    expect(screen.getByText('Efficient O(n log n)')).toBeTruthy()
  })

  it('renders algorithm buttons', () => {
    render(<AlgorithmSelector selectedId="bubble-sort" onSelect={vi.fn()} />)
    expect(screen.getByText('Bubble Sort')).toBeTruthy()
    expect(screen.getByText('Merge Sort')).toBeTruthy()
  })

  it('marks selected algorithm as active', () => {
    render(<AlgorithmSelector selectedId="bubble-sort" onSelect={vi.fn()} />)
    const btn = screen.getByText('Bubble Sort').closest('button')
    expect(btn).toHaveAttribute('aria-current', 'page')
  })

  it('calls onSelect with algorithm id', async () => {
    const onSelect = vi.fn()
    render(<AlgorithmSelector selectedId="bubble-sort" onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Merge Sort'))
    expect(onSelect).toHaveBeenCalledWith('merge-sort')
  })
})
