import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSound } from './useSound.ts'
import type { BarState, Step } from '../types/index.ts'

// ── AudioContext mock ─────────────────────────────────────────────────────
// Must use a regular `function` (not arrow) so `new AudioContext()` works.
// If a constructor explicitly returns an object, `new` yields that object.

const mockStop = vi.fn()
const mockStart = vi.fn()
const mockOscConnect = vi.fn()
const mockGainConnect = vi.fn()
const mockSetValueAtTime = vi.fn()
const mockRampToValue = vi.fn()

const mockOscillator = {
  connect: mockOscConnect,
  start: mockStart,
  stop: mockStop,
  type: 'sine' as OscillatorType,
  frequency: { value: 0 },
}

const mockGainNode = {
  connect: mockGainConnect,
  gain: {
    setValueAtTime: mockSetValueAtTime,
    exponentialRampToValueAtTime: mockRampToValue,
  },
}

const mockResume = vi.fn().mockResolvedValue(undefined)
const mockCreateOscillator = vi.fn(() => mockOscillator)
const mockCreateGain = vi.fn(() => mockGainNode)

function MockAudioContext(this: unknown) {
  return {
    state: 'running' as AudioContextState,
    resume: mockResume,
    createOscillator: mockCreateOscillator,
    createGain: mockCreateGain,
    currentTime: 0,
    destination: {},
  }
}

beforeEach(() => {
  vi.stubGlobal('AudioContext', MockAudioContext)
  localStorage.clear()
  vi.clearAllMocks()
  mockResume.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const dummyBars: BarState[] = [
  { entry: { id: '0', value: 50 }, status: 'default' },
  { entry: { id: '1', value: 80 }, status: 'default' },
]

describe('useSound', () => {
  it('defaults to sound enabled when no localStorage entry', () => {
    const { result } = renderHook(() => useSound())
    expect(result.current.soundEnabled).toBe(true)
  })

  it('reads soundEnabled=false from localStorage', () => {
    localStorage.setItem('sortSound', 'off')
    const { result } = renderHook(() => useSound())
    expect(result.current.soundEnabled).toBe(false)
  })

  it('toggleSound flips soundEnabled and persists to localStorage', () => {
    const { result } = renderHook(() => useSound())
    expect(result.current.soundEnabled).toBe(true)

    act(() => result.current.toggleSound())
    expect(result.current.soundEnabled).toBe(false)
    expect(localStorage.getItem('sortSound')).toBe('off')

    act(() => result.current.toggleSound())
    expect(result.current.soundEnabled).toBe(true)
    expect(localStorage.getItem('sortSound')).toBe('on')
  })

  it('playStep creates AudioContext and plays sound when enabled', () => {
    const { result } = renderHook(() => useSound())
    const step: Step = { type: 'compare', i: 0, j: 1 }
    act(() => result.current.playStep(step, dummyBars))
    expect(mockCreateOscillator).toHaveBeenCalled()
    expect(mockStart).toHaveBeenCalled()
  })

  it('playStep is a no-op when sound is disabled', () => {
    localStorage.setItem('sortSound', 'off')
    const { result } = renderHook(() => useSound())
    act(() => result.current.playStep({ type: 'compare', i: 0, j: 1 }, dummyBars))
    expect(mockCreateOscillator).not.toHaveBeenCalled()
  })

  it('playStep handles every step type without throwing', () => {
    const { result } = renderHook(() => useSound())
    const steps: Step[] = [
      { type: 'compare', i: 0, j: 1 },
      { type: 'swap', i: 0, j: 1 },
      { type: 'overwrite', i: 0, value: 42 },
      { type: 'pivot', i: 0 },
      { type: 'mark-sorted', indices: [0] },
      { type: 'done' },
    ]
    steps.forEach((step) => {
      expect(() => act(() => result.current.playStep(step, dummyBars))).not.toThrow()
    })
  })

  it('done step schedules three notes', () => {
    const { result } = renderHook(() => useSound())
    act(() => result.current.playStep({ type: 'done' }, dummyBars))
    // C5, E5, G5 — three oscillators
    expect(mockCreateOscillator).toHaveBeenCalledTimes(3)
  })
})
