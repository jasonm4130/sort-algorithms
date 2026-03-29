import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Controls } from './Controls.tsx'

const defaults = {
  status: 'idle' as const,
  speed: 60,
  arraySize: 30,
  stepIndex: 0,
  soundEnabled: false,
  onPlay: vi.fn(),
  onPause: vi.fn(),
  onReset: vi.fn(),
  onStepForward: vi.fn(),
  onStepBackward: vi.fn(),
  onRandomize: vi.fn(),
  onSpeedChange: vi.fn(),
  onArraySizeChange: vi.fn(),
  onToggleSound: vi.fn(),
}

describe('Controls', () => {
  it('renders play button when idle', () => {
    render(<Controls {...defaults} />)
    expect(screen.getByLabelText('Play')).toBeTruthy()
  })

  it('shows pause button when playing', () => {
    render(<Controls {...defaults} status="playing" />)
    expect(screen.getByLabelText('Pause')).toBeTruthy()
  })

  it('calls onPlay when play button clicked', async () => {
    const onPlay = vi.fn()
    render(<Controls {...defaults} onPlay={onPlay} />)
    await userEvent.click(screen.getByLabelText('Play'))
    expect(onPlay).toHaveBeenCalledOnce()
  })

  it('disables play/step-forward when done', () => {
    render(<Controls {...defaults} status="done" />)
    expect(screen.getByLabelText('Play')).toBeDisabled()
    expect(screen.getByLabelText('Step forward')).toBeDisabled()
  })

  it('disables step backward at step 0', () => {
    render(<Controls {...defaults} stepIndex={0} />)
    expect(screen.getByLabelText('Step backward')).toBeDisabled()
  })

  it('renders sound-off button when soundEnabled=false', () => {
    render(<Controls {...defaults} soundEnabled={false} />)
    expect(screen.getByLabelText('Sound off')).toBeTruthy()
  })

  it('renders sound-on button when soundEnabled=true', () => {
    render(<Controls {...defaults} soundEnabled={true} />)
    expect(screen.getByLabelText('Sound on')).toBeTruthy()
  })

  it('calls onToggleSound when sound button is clicked', async () => {
    const onToggleSound = vi.fn()
    render(<Controls {...defaults} onToggleSound={onToggleSound} />)
    await userEvent.click(screen.getByLabelText('Sound off'))
    expect(onToggleSound).toHaveBeenCalledOnce()
  })
})
