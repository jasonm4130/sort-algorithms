// Shared TypeScript types — import from here, never redefine locally

export interface ArrayEntry {
  id: string
  value: number
}

export type Step =
  | { type: 'compare'; i: number; j: number }
  | { type: 'swap'; i: number; j: number }
  | { type: 'overwrite'; i: number; value: number }
  | { type: 'pivot'; i: number }
  | { type: 'mark-sorted'; indices: number[] }
  | { type: 'done' }

export type AlgorithmGroup =
  | 'quadratic'
  | 'efficient'
  | 'hybrid'
  | 'distribution'
  | 'novelty'

export interface Complexity {
  best: string
  average: string
  worst: string
}

export interface AlgorithmMeta {
  id: string
  name: string
  group: AlgorithmGroup
  timeComplexity: Complexity
  spaceComplexity: string
  stable: boolean
  description: string
}

export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'done'

export interface BarState {
  entry: ArrayEntry
  status: 'default' | 'comparing' | 'swapping' | 'pivot' | 'sorted'
}
