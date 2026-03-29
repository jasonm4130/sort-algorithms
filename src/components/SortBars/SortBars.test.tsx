import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SortBars } from './SortBars.tsx'

const makeBars = (values: number[]) =>
  values.map((value, i) => ({
    entry: { id: `id-${i}`, value },
    status: 'default' as const,
  }))

describe('SortBars', () => {
  it('renders the correct number of bars', () => {
    render(<SortBars bars={makeBars([10, 30, 20])} />)
    const bars = document.querySelectorAll('.array-bar')
    expect(bars.length).toBe(3)
  })

  it('has an accessible label', () => {
    render(<SortBars bars={makeBars([10, 20])} />)
    expect(screen.getByRole('img')).toBeTruthy()
  })
})
