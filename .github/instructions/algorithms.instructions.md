---
applyTo: "src/algorithms/**"
---

# Algorithm File Rules

Every file in `src/algorithms/` must follow this exact contract:

## Exports required
1. A **generator function** — `export function* <name>Steps(arr: ArrayEntry[]): Generator<Step>` that yields typed `Step` descriptors after every comparison, swap, or significant state change
2. A **pure sort function** — `export function <name>Sort(arr: number[]): number[]` that returns a sorted copy without mutation

## Step types to yield
Import `Step`, `ArrayEntry` from `src/types/index.ts`. Use the discriminated union — do not invent new step types:
- `{ type: 'compare'; i: number; j: number }` — two indices being compared
- `{ type: 'swap'; i: number; j: number }` — two indices being swapped
- `{ type: 'overwrite'; i: number; value: number }` — a single index being overwritten (merge, counting sort)
- `{ type: 'pivot'; i: number }` — marking a pivot element
- `{ type: 'mark-sorted'; indices: number[] }` — marking indices as confirmed sorted
- `{ type: 'done' }` — algorithm complete

## Rules
- Generator must operate on a **copy** of the input, not the original: `const a = arr.map(e => ({ ...e }))`
- Generator must yield `{ type: 'done' }` as the final step
- Pure sort function must **not** call the generator — it is a separate, optimized implementation
- No React imports, no side effects, no async code
- File name must match: `<kebab-case-name>.ts` (e.g., `bubble-sort.ts`)

## Test requirement
Every algorithm file must have a corresponding `<name>.test.ts` in the same directory covering:
1. Empty array
2. Single element
3. Already sorted
4. Reverse sorted
5. Duplicates
6. Stability (for stable sorts)
7. Step count matches expected Big-O for small inputs
