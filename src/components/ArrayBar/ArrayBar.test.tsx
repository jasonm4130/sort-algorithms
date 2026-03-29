import { render } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { describe, it, expect } from 'vitest'
import { ArrayBar } from './ArrayBar.tsx'

const bar = { entry: { id: 'a1', value: 50 }, status: 'default' as const }

describe('ArrayBar', () => {
  it('renders without errors', () => {
    render(
      <MotionConfig reducedMotion="always">
        <ArrayBar bar={bar} maxValue={100} />
      </MotionConfig>,
    )
    // aria-hidden so no role, but it should be in the DOM
    const el = document.querySelector('.array-bar')
    expect(el).toBeTruthy()
  })

  it('is aria-hidden', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <ArrayBar bar={bar} maxValue={100} />
      </MotionConfig>,
    )
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
  })
})
