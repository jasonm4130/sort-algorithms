import type { ArrayEntry } from '../types/index.ts'

/** Build ArrayEntry[] from plain numbers with stable string IDs */
export function toEntries(values: number[]): ArrayEntry[] {
  return values.map((value, i) => ({ id: `${i}`, value }))
}

/** Consume a generator and return the final array values in order */
export function drainSteps(
  gen: Generator<unknown>,
  arr: ArrayEntry[]
): number[] {
  const a = arr.map((e) => ({ ...e }))
  for (const step of gen) {
    const s = step as { type: string; i?: number; j?: number; value?: number }
    if (s.type === 'swap' && s.i !== undefined && s.j !== undefined) {
      ;[a[s.i], a[s.j]] = [a[s.j], a[s.i]]
    } else if (s.type === 'overwrite' && s.i !== undefined && s.value !== undefined) {
      a[s.i] = { ...a[s.i], value: s.value }
    }
  }
  return a.map((e) => e.value)
}
