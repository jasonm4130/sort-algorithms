import { LayoutGroup, MotionConfig } from 'motion/react'
import type { BarState } from '../../types/index.ts'
import { ArrayBar } from '../ArrayBar/ArrayBar.tsx'

interface SortBarsProps {
  bars: BarState[]
}

export function SortBars({ bars }: SortBarsProps) {
  const maxValue = Math.max(...bars.map(b => b.entry.value), 1)

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div
          className="sort-bars"
          role="img"
          aria-label={`Bar chart showing ${bars.length} values being sorted`}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            width: '100%',
            height: '100%',
            gap: 1,
          }}
        >
          {bars.map(bar => (
            <ArrayBar
              key={bar.entry.id}
              bar={bar}
              maxValue={maxValue}
            />
          ))}
        </div>
      </LayoutGroup>
    </MotionConfig>
  )
}
