import { useCallback, useEffect, useRef, useState } from 'react'
import type { ArrayEntry, BarState, PlayerStatus, Step } from '../types/index.ts'
import {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
  heapSortSteps,
  shellSortSteps,
  timSortSteps,
  introSortSteps,
  combSortSteps,
  treeSortSteps,
  countingSortSteps,
  radixSortSteps,
  bucketSortSteps,
  cocktailShakerSortSteps,
  cycleSortSteps,
  bogoSortSteps,
  gnomeSortSteps,
  stoogeSortSteps,
  pancakeSortSteps,
  sleepSortSteps,
  stalinSortSteps,
  slowSortSteps,
  miracleSortSteps,
  quantumBogoSortSteps,
} from '../algorithms/index.ts'

// ── Helpers ────────────────────────────────────────────────────────────────

function makeEntries(size: number): ArrayEntry[] {
  return Array.from({ length: size }, () => ({
    id: crypto.randomUUID(),
    value: Math.floor(Math.random() * 95) + 5,
  }))
}

function entriesToBars(entries: ArrayEntry[]): BarState[] {
  return entries.map(entry => ({ entry, status: 'default' }))
}

const GENERATORS: Record<string, (arr: ArrayEntry[]) => Generator<Step>> = {
  'bubble-sort': bubbleSortSteps,
  'selection-sort': selectionSortSteps,
  'insertion-sort': insertionSortSteps,
  'merge-sort': mergeSortSteps,
  'quick-sort': quickSortSteps,
  'heap-sort': heapSortSteps,
  'shell-sort': shellSortSteps,
  'tim-sort': timSortSteps,
  'intro-sort': introSortSteps,
  'comb-sort': combSortSteps,
  'tree-sort': treeSortSteps,
  'counting-sort': countingSortSteps,
  'radix-sort': radixSortSteps,
  'bucket-sort': bucketSortSteps,
  'cocktail-shaker-sort': cocktailShakerSortSteps,
  'cycle-sort': cycleSortSteps,
  'bogo-sort': bogoSortSteps,
  'gnome-sort': gnomeSortSteps,
  'stooge-sort': stoogeSortSteps,
  'pancake-sort': pancakeSortSteps,
  'sleep-sort': sleepSortSteps,
  'stalin-sort': stalinSortSteps,
  'slow-sort': slowSortSteps,
  'miracle-sort': miracleSortSteps,
  'quantum-bogosort': quantumBogoSortSteps,
}

function applyStep(bars: BarState[], step: Step): BarState[] {
  const next = bars.map(b => ({ ...b, status: 'default' as BarState['status'] }))

  switch (step.type) {
    case 'compare':
      next[step.i] = { ...next[step.i], status: 'comparing' }
      next[step.j] = { ...next[step.j], status: 'comparing' }
      break
    case 'swap': {
      next[step.i] = { ...next[step.i], status: 'swapping' }
      next[step.j] = { ...next[step.j], status: 'swapping' }
      // Swap entries
      const tmp = next[step.i].entry
      next[step.i] = { ...next[step.i], entry: next[step.j].entry }
      next[step.j] = { ...next[step.j], entry: tmp }
      break
    }
    case 'overwrite':
      next[step.i] = {
        ...next[step.i],
        entry: { ...next[step.i].entry, value: step.value },
        status: 'swapping',
      }
      break
    case 'pivot':
      next[step.i] = { ...next[step.i], status: 'pivot' }
      break
    case 'mark-sorted':
      step.indices.forEach(idx => {
        next[idx] = { ...next[idx], status: 'sorted' }
      })
      break
    case 'done':
      return next.map(b => ({ ...b, status: 'sorted' }))
  }

  return next
}

// ── Hook ──────────────────────────────────────────────────────────────────

export interface AlgorithmPlayerState {
  bars: BarState[]
  status: PlayerStatus
  speed: number
  arraySize: number
  stepIndex: number
}

export interface AlgorithmPlayerActions {
  play: () => void
  pause: () => void
  reset: () => void
  stepForward: () => void
  stepBackward: () => void
  setSpeed: (speed: number) => void
  setArraySize: (size: number) => void
  randomize: () => void
}

export function useAlgorithmPlayer(
  algorithmId: string,
  initialSize = 30,
  onStep?: (step: Step, bars: BarState[]) => void,
): AlgorithmPlayerState & AlgorithmPlayerActions {
  const [arraySize, setArraySizeState] = useState(initialSize)
  const [speed, setSpeedState] = useState(60) // steps per second × scale
  const [status, setStatus] = useState<PlayerStatus>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const barsRef = useRef<BarState[]>([])
  const [bars, setBars] = useState<BarState[]>(() => {
    const initial = entriesToBars(makeEntries(initialSize))
    barsRef.current = initial
    return initial
  })

  // Step history for stepBackward support
  const historyRef = useRef<BarState[][]>([])
  // Source entries snapshot used to (re)build generator
  const sourceRef = useRef<ArrayEntry[]>([])
  // Live generator
  const generatorRef = useRef<Generator<Step> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Stable ref to speed so interval callback always sees current value
  const speedRef = useRef(speed)
  const statusRef = useRef(status)
  const onStepRef = useRef(onStep)
  useEffect(() => { onStepRef.current = onStep }, [onStep])

  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { statusRef.current = status }, [status])

  // Build / rebuild the generator from current source entries
  const buildGenerator = useCallback(
    (entries: ArrayEntry[]) => {
      const genFn = GENERATORS[algorithmId]
      if (!genFn) return null
      return genFn(entries.map(e => ({ ...e }))) // pass a copy
    },
    [algorithmId],
  )

  // Initialise source on mount and when algorithmId changes
  useEffect(() => {
    const entries = makeEntries(arraySize)
    sourceRef.current = entries
    const initialBars = entriesToBars(entries)
    barsRef.current = initialBars
    setBars(initialBars)
    historyRef.current = [initialBars]
    setStepIndex(0)
    setStatus('idle')
    generatorRef.current = buildGenerator(entries)
    stopInterval()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmId])

  // ── Interval management ──────────────────────────────────────────────

  function stopInterval() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function advance(): boolean {
    if (!generatorRef.current) return false
    const result = generatorRef.current.next()
    if (result.done) return false
    const step = result.value as Step

    // Fire sound callback with pre-step snapshot (synchronous, before React batches the update)
    onStepRef.current?.(step, barsRef.current)

    setBars(prev => {
      const next = applyStep(prev, step)
      barsRef.current = next
      historyRef.current.push(next)
      return next
    })
    setStepIndex(i => i + 1)

    if (step.type === 'done') {
      setStatus('done')
      stopInterval()
      return false
    }
    return true
  }

  // Restart interval at current speed
  function startInterval() {
    stopInterval()
    const delay = Math.max(16, Math.round(1000 / speedRef.current))
    intervalRef.current = setInterval(() => {
      const cont = advance()
      if (!cont) stopInterval()
    }, delay)
  }

  useEffect(() => {
    return () => stopInterval()
  }, [])

  // Restart interval when speed changes while playing
  useEffect(() => {
    if (status === 'playing') {
      startInterval()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed])

  // ── Actions ──────────────────────────────────────────────────────────

  const play = useCallback(() => {
    if (statusRef.current === 'done') return
    setStatus('playing')
    startInterval()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pause = useCallback(() => {
    stopInterval()
    setStatus(prev => (prev === 'playing' ? 'paused' : prev))
  }, [])

  const reset = useCallback(() => {
    stopInterval()
    const entries = sourceRef.current
    const initial = entriesToBars(entries)
    historyRef.current = [initial]
    barsRef.current = initial
    setBars(initial)
    setStepIndex(0)
    setStatus('idle')
    generatorRef.current = buildGenerator(entries)
  }, [buildGenerator])

  const randomize = useCallback(() => {
    stopInterval()
    const entries = makeEntries(arraySize)
    sourceRef.current = entries
    const initial = entriesToBars(entries)
    historyRef.current = [initial]
    barsRef.current = initial
    setBars(initial)
    setStepIndex(0)
    setStatus('idle')
    generatorRef.current = buildGenerator(entries)
  }, [arraySize, buildGenerator])

  const stepForward = useCallback(() => {
    pause()
    advance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause])

  const stepBackward = useCallback(() => {
    pause()
    if (historyRef.current.length <= 1) return
    historyRef.current.pop()
    const prev = historyRef.current.at(-1)!
    barsRef.current = prev
    setBars(prev)
    setStepIndex(i => Math.max(0, i - 1))
    setStatus('paused')
    // Rebuild generator from source up to current position is expensive;
    // instead reset so forward play still works from the rewound state.
    const entries = sourceRef.current.map(e => ({ ...e }))
    // Replay steps up to (historyRef length - 1) to resync generator
    const gen = buildGenerator(entries)
    if (gen) {
      const target = historyRef.current.length - 1
      for (let k = 0; k < target; k++) {
        const r = gen.next()
        if (r.done || (r.value as Step).type === 'done') break
      }
      generatorRef.current = gen
    }
  }, [buildGenerator, pause])

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s)
  }, [])

  const setArraySize = useCallback(
    (size: number) => {
      setArraySizeState(size)
      stopInterval()
      const entries = makeEntries(size)
      sourceRef.current = entries
      const initial = entriesToBars(entries)
      historyRef.current = [initial]
      barsRef.current = initial
      setBars(initial)
      setStepIndex(0)
      setStatus('idle')
      generatorRef.current = buildGenerator(entries)
    },
    [buildGenerator],
  )

  return {
    bars,
    status,
    speed,
    arraySize,
    stepIndex,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed,
    setArraySize,
    randomize,
  }
}
