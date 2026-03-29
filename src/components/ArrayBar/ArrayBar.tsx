import { motion } from 'motion/react'
import type { BarState } from '../../types/index.ts'

const STATUS_COLORS: Record<BarState['status'], string> = {
  default: 'var(--color-bar-default)',
  comparing: 'var(--color-bar-comparing)',
  swapping: 'var(--color-bar-swapping)',
  pivot: 'var(--color-bar-pivot)',
  sorted: 'var(--color-bar-sorted)',
}

interface ArrayBarProps {
  bar: BarState
  maxValue: number
}

export function ArrayBar({ bar, maxValue }: ArrayBarProps) {
  const heightPct = (bar.entry.value / maxValue) * 100
  const color = STATUS_COLORS[bar.status]

  return (
    <motion.div
      layout
      layoutId={bar.entry.id}
      className="array-bar"
      style={{
        height: `${heightPct}%`,
        flex: '1 1 0',
        minWidth: 2,
        borderRadius: '2px 2px 0 0',
      }}
      animate={{ backgroundColor: color }}
      transition={{ backgroundColor: { duration: 0.1 }, layout: { duration: 0.15 } }}
      aria-hidden="true"
    />
  )
}
