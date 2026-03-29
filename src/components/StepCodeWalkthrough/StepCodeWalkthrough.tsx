import type { Step } from '../../types/index.ts'
import { PSEUDOCODE } from '../../constants/pseudocode.ts'

interface StepCodeWalkthroughProps {
  algorithmId: string
  currentStep: Step | null
}

export function StepCodeWalkthrough({ algorithmId, currentStep }: StepCodeWalkthroughProps) {
  const lines = PSEUDOCODE[algorithmId] ?? []
  const currentType = currentStep?.type ?? null

  return (
    <div
      className="overflow-auto rounded-lg border border-border bg-surface p-4"
      aria-label="Algorithm pseudocode"
    >
      <pre className="font-mono text-xs leading-relaxed text-text-muted" aria-live="polite">
        {lines.map((line, i) => {
          const isActive =
            currentType !== null && line.stepTypes.includes(currentType as Step['type'])
          return (
            <div
              key={i}
              className={`rounded px-1 transition-colors ${
                isActive ? 'bg-surface-raised font-semibold text-text' : ''
              }`}
              aria-current={isActive ? 'true' : undefined}
            >
              {line.code}
            </div>
          )
        })}
      </pre>
    </div>
  )
}
