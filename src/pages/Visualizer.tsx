import { useNavigate, useParams } from 'react-router'
import { useCallback, useRef, useState } from 'react'
import { ALGORITHM_MAP } from '../constants/algorithms.ts'
import { useAlgorithmPlayer } from '../hooks/useAlgorithmPlayer.ts'
import { useSound } from '../hooks/useSound.ts'
import { SortBars } from '../components/SortBars/SortBars.tsx'
import { Controls } from '../components/Controls/Controls.tsx'
import { AlgorithmSelector } from '../components/AlgorithmSelector/AlgorithmSelector.tsx'
import { ComplexityTable } from '../components/ComplexityTable/ComplexityTable.tsx'
import { StepCodeWalkthrough } from '../components/StepCodeWalkthrough/StepCodeWalkthrough.tsx'
import { Menu, X } from 'react-feather'
import type { Step } from '../types/index.ts'

export default function Visualizer() {
  const { id = 'bubble-sort' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currentStepRef = useRef<Step | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const algo = ALGORITHM_MAP.get(id) ?? ALGORITHM_MAP.get('bubble-sort')!

  const { soundEnabled, toggleSound, playStep } = useSound()
  const player = useAlgorithmPlayer(id, 30, playStep)

  const handleSelect = useCallback(
    (newId: string) => {
      navigate(`/algorithm/${newId}`)
      setMobileMenuOpen(false)
    },
    [navigate],
  )

  return (
    <div className="grid h-[calc(100dvh-3.5rem)] grid-cols-[220px_1fr] max-md:grid-cols-1 max-md:h-auto">
      {/* Mobile algorithm picker toggle */}
      <div className="hidden max-md:flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
        <span className="text-sm font-semibold text-text">{algo.name}</span>
        <button
          className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-raised hover:text-text"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label={mobileMenuOpen ? 'Close algorithm menu' : 'Open algorithm menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile collapsible menu */}
      {mobileMenuOpen && (
        <div className="hidden max-md:block max-h-[50dvh] overflow-y-auto border-b border-border bg-surface">
          <AlgorithmSelector selectedId={id} onSelect={handleSelect} />
        </div>
      )}

      {/* Desktop sidebar — always visible */}
      <aside className="overflow-y-auto border-r border-border bg-surface py-4 max-md:hidden">
        <AlgorithmSelector selectedId={id} onSelect={handleSelect} />
      </aside>

      <main className="flex flex-col gap-5 overflow-y-auto p-6">
        <header>
          <h1 className="text-2xl font-bold">{algo.name}</h1>
        </header>

        <div
          className="min-h-[300px] max-h-[420px] flex-1 overflow-hidden rounded-lg border border-border bg-surface p-3 pb-0"
          aria-label="Sorting visualization"
        >
          <SortBars bars={player.bars} />
        </div>

        <Controls
          status={player.status}
          speed={player.speed}
          arraySize={player.arraySize}
          stepIndex={player.stepIndex}
          soundEnabled={soundEnabled}
          onPlay={player.play}
          onPause={player.pause}
          onReset={player.reset}
          onStepForward={player.stepForward}
          onStepBackward={player.stepBackward}
          onRandomize={player.randomize}
          onSpeedChange={player.setSpeed}
          onArraySizeChange={player.setArraySize}
          onToggleSound={toggleSound}
        />

        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <ComplexityTable algorithm={algo} />
          <StepCodeWalkthrough algorithmId={id} currentStep={currentStepRef.current} />
        </div>
      </main>
    </div>
  )
}
