import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MotionConfig } from 'motion/react'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders the wordmark text', () => {
    render(
      <MotionConfig reducedMotion="always">
        <Logo />
      </MotionConfig>,
    )
    expect(screen.getByText('Sort Algorithms')).toBeInTheDocument()
  })

  it('renders the bars SVG marked as decorative', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <Logo />
      </MotionConfig>,
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts and applies a custom className', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <Logo className="custom-cls" />
      </MotionConfig>,
    )
    expect(container.firstChild).toHaveClass('custom-cls')
  })
})
