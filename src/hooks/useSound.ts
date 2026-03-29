import { useCallback, useRef, useState } from 'react'
import type { BarState, Step } from '../types/index.ts'

// Map a bar value (5–100) to Hz using an exponential scale (≈ two octaves)
function valueToFreq(value: number): number {
  const t = (Math.max(5, Math.min(100, value)) - 5) / 95
  return 180 * Math.pow(2000 / 180, t)
}

function beep(
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType,
  peakGain: number,
  delaySeconds = 0,
): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.value = freq
  const t = ctx.currentTime + delaySeconds
  gain.gain.setValueAtTime(peakGain, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.01)
}

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    () => localStorage.getItem('sortSound') !== 'off',
  )

  const ctxRef = useRef<AudioContext | null>(null)

  function getCtx(): AudioContext | null {
    if (typeof AudioContext === 'undefined') return null
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume()
    }
    return ctxRef.current
  }

  const playStep = useCallback(
    (step: Step, bars: BarState[]): void => {
      if (!soundEnabled) return
      const ctx = getCtx()
      if (!ctx) return

      switch (step.type) {
        case 'compare': {
          const val = bars[step.i]?.entry.value ?? 50
          beep(ctx, valueToFreq(val), 0.06, 'sine', 0.1)
          break
        }
        case 'swap': {
          const val = bars[step.i]?.entry.value ?? 50
          beep(ctx, valueToFreq(val), 0.09, 'triangle', 0.15)
          break
        }
        case 'overwrite': {
          beep(ctx, valueToFreq(step.value), 0.09, 'triangle', 0.15)
          break
        }
        case 'pivot': {
          const val = bars[step.i]?.entry.value ?? 50
          beep(ctx, valueToFreq(val) * 1.5, 0.12, 'sine', 0.18)
          break
        }
        case 'mark-sorted': {
          const val = bars[step.indices[0]]?.entry.value ?? 50
          beep(ctx, valueToFreq(val), 0.15, 'sine', 0.08)
          break
        }
        case 'done': {
          // Ascending C-major triad: C5 → E5 → G5
          ;[523.25, 659.25, 783.99].forEach((freq, i) => {
            beep(ctx, freq, 0.35, 'sine', 0.2, i * 0.12)
          })
          break
        }
      }
    },
    // getCtx is stable (uses a ref internally), soundEnabled is the only reactive dep
    [soundEnabled],
  )

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev
      localStorage.setItem('sortSound', next ? 'on' : 'off')
      return next
    })
  }, [])

  return { soundEnabled, toggleSound, playStep }
}
