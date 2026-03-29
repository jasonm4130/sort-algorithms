import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StepCodeWalkthrough } from './StepCodeWalkthrough.tsx'

describe('StepCodeWalkthrough', () => {
  it('renders pseudocode lines for a known algorithm', () => {
    render(<StepCodeWalkthrough algorithmId="bubble-sort" currentStep={null} />)
    expect(screen.getByText(/compare a\[j\] and a\[j\+1\]/)).toBeTruthy()
  })

  it('highlights the active line matching current step type', () => {
    render(
      <StepCodeWalkthrough
        algorithmId="bubble-sort"
        currentStep={{ type: 'swap', i: 0, j: 1 }}
      />,
    )
    const activeLines = document.querySelectorAll('[aria-current="true"]')
    expect(activeLines.length).toBeGreaterThan(0)
  })

  it('highlights no lines when step is null', () => {
    render(<StepCodeWalkthrough algorithmId="bubble-sort" currentStep={null} />)
    expect(document.querySelectorAll('[aria-current="true"]').length).toBe(0)
  })

  it('renders empty pre for unknown algorithm', () => {
    render(<StepCodeWalkthrough algorithmId="unknown-sort" currentStep={null} />)
    expect(document.querySelectorAll('pre > div').length).toBe(0)
  })
})
