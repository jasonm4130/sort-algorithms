import type { PlayerStatus } from '../../types/index.ts'
import { Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'react-feather'
import { Button } from '@/components/ui/button.tsx'
import { Slider } from '@/components/ui/slider.tsx'

interface ControlsProps {
  status: PlayerStatus
  speed: number
  arraySize: number
  stepIndex: number
  soundEnabled: boolean
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onRandomize: () => void
  onSpeedChange: (speed: number) => void
  onArraySizeChange: (size: number) => void
  onToggleSound: () => void
}

export function Controls({
  status,
  speed,
  arraySize,
  stepIndex,
  soundEnabled,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onRandomize,
  onSpeedChange,
  onArraySizeChange,
  onToggleSound,
}: ControlsProps) {
  const isPlaying = status === 'playing'
  const isDone = status === 'done'
  const isBusy = isPlaying || status === 'paused'

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3"
      role="group"
      aria-label="Playback controls"
    >
      {/* Play / Pause */}
      <Button
        variant="default"
        size="icon"
        onClick={isPlaying ? onPause : onPlay}
        disabled={isDone}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {/* Step backward */}
      <Button
        variant="outline"
        size="icon"
        onClick={onStepBackward}
        disabled={stepIndex === 0}
        aria-label="Step backward"
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      {/* Step forward */}
      <Button
        variant="outline"
        size="icon"
        onClick={onStepForward}
        disabled={isDone}
        aria-label="Step forward"
      >
        <SkipForward className="h-4 w-4" />
      </Button>

      {/* Reset */}
      <Button variant="outline" size="icon" onClick={onReset} aria-label="Reset">
        <RotateCcw className="h-4 w-4" />
      </Button>

      {/* Randomize */}
      <Button variant="outline" size="icon" onClick={onRandomize} aria-label="Randomize array">
        <Shuffle className="h-4 w-4" />
      </Button>

      {/* Sound toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSound}
        aria-label={soundEnabled ? 'Sound on' : 'Sound off'}
        aria-pressed={soundEnabled}
      >
        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>

      {/* Speed */}
      <label className="flex items-center gap-2 text-sm text-text-muted">
        Speed
        <Slider
          min={5}
          max={200}
          step={5}
          value={[speed]}
          onValueChange={([v]) => onSpeedChange(v)}
          aria-label="Playback speed"
          className="w-24"
        />
        <span className="min-w-[3ch] font-mono text-xs text-text">{speed}/s</span>
      </label>

      {/* Array size */}
      <label className="flex items-center gap-2 text-sm text-text-muted">
        Size
        <Slider
          min={5}
          max={100}
          step={5}
          value={[arraySize]}
          onValueChange={([v]) => onArraySizeChange(v)}
          aria-label="Array size"
          className="w-24"
          disabled={isBusy}
        />
        <span className="min-w-[3ch] font-mono text-xs text-text">{arraySize}</span>
      </label>
    </div>
  )
}

