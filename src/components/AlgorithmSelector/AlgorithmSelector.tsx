import { ALGORITHM_GROUPS } from '../../constants/algorithms.ts'
import { cn } from '@/lib/utils.ts'

interface AlgorithmSelectorProps {
  selectedId: string
  onSelect: (id: string) => void
}

export function AlgorithmSelector({ selectedId, onSelect }: AlgorithmSelectorProps) {
  return (
    <nav className="px-3" aria-label="Select algorithm">
      {Object.entries(ALGORITHM_GROUPS).map(([groupName, algorithms]) => (
        <div key={groupName} className="mb-6">
          <h3 className="mb-1.5 px-2 text-[0.7rem] font-semibold uppercase tracking-widest text-text-muted">
            {groupName}
          </h3>
          <ul>
            {algorithms.map(algo => (
              <li key={algo.id}>
                <button
                  className={cn(
                    'w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                    selectedId === algo.id
                      ? 'bg-surface-raised font-semibold text-accent'
                      : 'text-text hover:bg-surface-raised',
                  )}
                  onClick={() => onSelect(algo.id)}
                  aria-current={selectedId === algo.id ? 'page' : undefined}
                >
                  {algo.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

