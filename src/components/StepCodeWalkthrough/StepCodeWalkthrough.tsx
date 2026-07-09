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
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: role="generic" (default for div) doesn't formally support aria-label per spec, but this is a static labeled region, not interactive content
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
              // biome-ignore lint/suspicious/noArrayIndexKey: lines is a static per-algorithmId constant from PSEUDOCODE, never reordered/inserted/removed while mounted
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
