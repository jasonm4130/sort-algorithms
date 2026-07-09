# Joke Sorts: Communist, Capitalist, Robin Hood

Add three novelty "sorting" algorithms to the visualizer. Unlike real sorts, these
redistribute **value between bars** rather than reorder them. All three end in a
genuinely nondecreasing array, so they play nicely with the visualizer's finish state.

## Context (read first)

- Repo: React 19 + Vite + TypeScript strict. Algorithms are pure generator functions
  in `src/algorithms/` yielding typed `Step` descriptors (`src/types/index.ts`):

  ```ts
  export type Step =
    | { type: 'compare'; i: number; j: number }
    | { type: 'swap'; i: number; j: number }
    | { type: 'overwrite'; i: number; value: number }
    | { type: 'pivot'; i: number }
    | { type: 'mark-sorted'; indices: number[] }
    | { type: 'done' }

  export interface ArrayEntry { id: string; value: number }
  ```

- `overwrite {i, value}` changes a bar's value in place (id preserved). It is the
  mechanism for all value redistribution here. Precedent: `src/algorithms/counting-sort.ts`
  (overwrites values) and Stalin Sort (overwrites purged values to `0` — zero-height
  bars are fine; `SortBars` scales heights to the current max).
- Test helpers: `src/algorithms/test-helpers.ts` exports `toEntries(values)` and
  `drainSteps(gen, arr)`. **`drainSteps` replays only `swap` and `overwrite` steps** to
  reconstruct the final array — all data changes MUST be expressed via those two step types.
- Every algorithm file exports TWO functions: a plain reference fn
  `xSort(values: number[]): number[]` and the generator
  `function* xSortSteps(arr: ArrayEntry[]): Generator<Step>`.
- App input domain: integers 5–99, default 30 bars. Tests may use any non-negative ints.

## Global Constraints

1. **These are novelty algorithms: the output is NOT a permutation of the input.**
   Correctness = the redistribution semantics specified per task, PLUS: final array is
   nondecreasing, and the total (sum of values) is conserved. Reviewers must NOT flag
   non-permutation output or "doesn't actually sort the input values" as a defect — that
   is the spec and the joke. Everything else (mutation, step-contract violations, missing
   `done`) IS a defect.
2. Generators must not mutate their input: first line `const a = arr.map((e) => ({ ...e }))`,
   and the local copy must be updated in lockstep with every `overwrite`/`swap` yielded
   (see `counting-sort.ts` for the pattern: `a[i] = { ...a[i], value: v }` then yield).
3. Every generator ends with `yield { type: 'mark-sorted', indices: [all indices] }` (when
   n > 0) followed by `yield { type: 'done' }` as the final step. Handle n === 0 (yield
   only `done`) and n === 1.
4. All data changes via `overwrite` (and, for Task 2 only, one final `swap`). `compare`
   steps are visual garnish — yield them where specified so the animation highlights the
   bars being taxed/robbed.
5. `src/algorithms/` stays pure — no React, no imports outside `../types/index.ts` and
   siblings. Do not import one joke sort from another.
6. Strict TS must pass. Match repo import style (explicit `.ts` extensions, `import type`).
7. Test files are colocated (`src/algorithms/<name>.test.ts`), use Vitest +
   `toEntries`/`drainSteps`, and follow the existing suite shape (plain-fn block +
   generator block with "ends with done", "does not mutate input", "drainSteps matches
   plain fn").
8. Verification for Tasks 1–3: `npx vitest run src/algorithms/<name>.test.ts` green.
   Verification for Task 4: `npm run ci` (typecheck + lint + full test suite + build) green.

## Task 1: Communist Sort — generator + tests

**Create** `src/algorithms/communist-sort.ts` and `src/algorithms/communist-sort.test.ts`.
Touch no other files (wiring happens in Task 4).

**Semantics — all items are made equal.** One redistribution pass:

- `total = sum of values`, `n = length`, `base = Math.floor(total / n)`, `r = total - base * n`.
- Every index gets `base`, except the **last `r` indices** get `base + 1` (putting the
  larger values last keeps the array nondecreasing — "some are more equal than others").
- `communistSort(values: number[]): number[]` returns that array (`[]` for empty input).

**Generator step sequence** (`communistSortSteps`):
1. If n === 0: `yield { type: 'done' }`, return.
2. For each i in 0..n-1: compute `newVal = i >= n - r ? base + 1 : base`, update local
   copy, `yield { type: 'overwrite', i, value: newVal }`. (Yield for every index, even if
   the value is unchanged — the sweep is the animation.)
3. `yield { type: 'mark-sorted', indices: [0..n-1] }`, then `yield { type: 'done' }`.

**Tests** (assert redistribution semantics, NOT permutation sorting):
- `communistSort([])` → `[]`; `communistSort([7])` → `[7]`
- `communistSort([1, 2, 3])` → `[2, 2, 2]` (yes, an already-sorted input changes!)
- `communistSort([5, 3, 1, 4, 2])` → `[3, 3, 3, 3, 3]`
- Remainder case: `communistSort([1, 1, 1, 1, 3])` → `[1, 1, 1, 2, 2]`
- Property (a few fixed inputs): sum conserved; result nondecreasing; max − min ≤ 1
- Generator: ends with `done`; does not mutate input; `drainSteps` result equals
  `communistSort` of the same values; every non-`done`/non-`mark-sorted` step is `overwrite`.

## Task 2: Capitalist Sort — generator + tests

**Create** `src/algorithms/capitalist-sort.ts` and `src/algorithms/capitalist-sort.test.ts`.
Touch no other files.

**Semantics — take from the poorest, give to the richest.** Wealth concentrates until one
bar owns everything, then the tycoon rises to the top:

- Repeat while **more than one** index has value > 0:
  - `poor` = index of the minimum value among indices with value > 0 (leftmost on ties).
  - `rich` = index of the maximum value (rightmost on ties — guarantees `rich !== poor`
    whenever ≥ 2 nonzero indices exist).
  - Transfer the poorest's entire value to the richest; poorest becomes 0.
- After the loop, at most one index `k` has a nonzero value (the sum). If `k` exists and
  `k !== n - 1`, swap it with index `n - 1` so the array `[0, 0, …, 0, total]` is
  nondecreasing.
- `capitalistSort(values: number[]): number[]` → `n - 1` zeros followed by the sum
  (`[]` for empty; `[v]` for single; all-zeros input stays all zeros).

**Generator step sequence** (`capitalistSortSteps`):
1. n === 0 → `done`. n === 1 → `mark-sorted [0]`, `done`.
2. Each round: `yield { type: 'compare', i: poor, j: rich }`, then
   `yield { type: 'overwrite', i: rich, value: richVal + poorVal }`, then
   `yield { type: 'overwrite', i: poor, value: 0 }` (local copy updated in lockstep).
3. If the final nonzero index `k !== n - 1`: swap entries in the local copy and
   `yield { type: 'swap', i: k, j: n - 1 }`.
4. `mark-sorted` all indices, then `done`.

**Tests**:
- `capitalistSort([])` → `[]`; `capitalistSort([7])` → `[7]`
- `capitalistSort([1, 2, 3])` → `[0, 0, 6]`
- `capitalistSort([3, 1, 4, 1, 5])` → `[0, 0, 0, 0, 14]`
- All-equal input works: `capitalistSort([4, 4])` → `[0, 8]`
- Property: sum conserved; result nondecreasing; exactly one nonzero element (for nonzero inputs)
- Generator: ends with `done`; does not mutate input; `drainSteps` result equals
  `capitalistSort` of the same values; data-changing steps are only `overwrite` + at most
  one `swap`.

## Task 3: Robin Hood Sort — generator + tests

**Create** `src/algorithms/robin-hood-sort.ts` and `src/algorithms/robin-hood-sort.test.ts`.
Touch no other files.

**Semantics — take from the richest, give to the poorest.** Bilateral transfers shrink the
wealth gap until everyone differs by at most 1, then a settling pass orders the two
remaining value classes. (Deliberate joke: the final distribution is identical to
Communist Sort — communism with extra steps. Implement it independently; do not import
`communist-sort`.)

- Repeat while `max − min > 1` (values of the local copy):
  - `rich` = index of max (leftmost on ties); `poor` = index of min (leftmost on ties).
    These are guaranteed distinct because max ≠ min.
  - `d = Math.floor((max − min) / 2)` (≥ 1). Rich loses `d`, poor gains `d`.
  - Terminates: each transfer strictly reduces the sum of squared values; values are
    bounded integers.
- Settling pass: values are now all `m` or `m + 1` where `m` is the current min. With
  `r` = count of `m + 1` values, the sorted arrangement is `n − r` copies of `m` followed
  by `r` copies of `m + 1`. Overwrite each index to its target value (skip the yield when
  the value is already correct).
- `robinHoodSort(values: number[]): number[]` → with `total`, `base = Math.floor(total/n)`,
  `r = total − base·n`: `n − r` copies of `base` then `r` copies of `base + 1`
  (`[]` for empty).

**Generator step sequence** (`robinHoodSortSteps`):
1. n === 0 → `done`.
2. Each transfer round: `yield { type: 'compare', i: rich, j: poor }`, then
   `yield { type: 'overwrite', i: rich, value: max − d }`, then
   `yield { type: 'overwrite', i: poor, value: min + d }` (local copy in lockstep).
3. Settling pass overwrites (only where the value changes).
4. `mark-sorted` all indices, then `done`.

**Tests**:
- `robinHoodSort([])` → `[]`; `robinHoodSort([7])` → `[7]`
- `robinHoodSort([1, 2, 3])` → `[2, 2, 2]`
- Remainder case: `robinHoodSort([1, 1, 1, 1, 3])` → `[1, 1, 1, 2, 2]`
- Already-equal input: `robinHoodSort([4, 4, 4])` → `[4, 4, 4]`
- Property: sum conserved; result nondecreasing; max − min ≤ 1
- Generator: ends with `done`; does not mutate input; `drainSteps` result equals
  `robinHoodSort` of the same values; every data step is `overwrite` (no swaps);
  invariant: no intermediate `overwrite` value falls outside `[initial min, initial max]`.

## Task 4: Wire all three into the app

**Edit** exactly these four files (created algorithms from Tasks 1–3 must be merged first):

1. `src/algorithms/index.ts` — add barrel exports:
   ```ts
   export { communistSortSteps, communistSort } from './communist-sort.ts'
   export { capitalistSortSteps, capitalistSort } from './capitalist-sort.ts'
   export { robinHoodSortSteps, robinHoodSort } from './robin-hood-sort.ts'
   ```
2. `src/hooks/useAlgorithmPlayer.ts` — import the three `…Steps` generators from
   `../algorithms/index.ts` and add to the `GENERATORS` record:
   `'communist-sort'`, `'capitalist-sort'`, `'robin-hood-sort'`.
3. `src/constants/algorithms.ts` — append to the **novelty** group section, verbatim:
   ```ts
   {
     id: 'communist-sort',
     name: 'Communist Sort',
     group: 'novelty',
     timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
     spaceComplexity: 'O(1)',
     stable: true,
     description:
       'Seizes the means of comparison: one redistribution pass reassigns every element the collective mean. All bars end equal — though when the total does not divide evenly, some are more equal than others.',
   },
   {
     id: 'capitalist-sort',
     name: 'Capitalist Sort',
     group: 'novelty',
     timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
     spaceComplexity: 'O(1)',
     stable: false,
     description:
       'Trickle-up economics: repeatedly takes the poorest bar\'s entire value and gives it to the richest, until one bar owns everything and the rest flatline at zero. The tycoon then rises to the top — technically sorted.',
   },
   {
     id: 'robin-hood-sort',
     name: 'Robin Hood Sort',
     group: 'novelty',
     timeComplexity: { best: 'O(n)', average: 'O(n log k)', worst: 'O(n·k)' },
     spaceComplexity: 'O(1)',
     stable: true,
     description:
       'Steals from the rich and gives to the poor: each round moves half the gap between the richest and poorest bars until everyone differs by at most one (k is the initial wealth gap). Communism, but with extra steps.',
   },
   ```
4. `src/constants/pseudocode.ts` — add entries (last line must be
   `{ code: 'done', stepTypes: ['done'] }`; enforced by `pseudocode.test.ts`):
   ```ts
   'communist-sort': [
     { code: 'total = sum(a); mean = total / n', stepTypes: [] },
     { code: 'for i = 0 to n-1', stepTypes: [] },
     { code: '  a[i] = mean  // redistribute', stepTypes: ['overwrite'] },
     { code: 'mark all as sorted (equal)', stepTypes: ['mark-sorted'] },
     { code: 'done', stepTypes: ['done'] },
   ],
   'capitalist-sort': [
     { code: 'while more than one bar has wealth', stepTypes: [] },
     { code: '  find poorest and richest', stepTypes: ['compare'] },
     { code: '  richest += poorest  // hostile takeover', stepTypes: ['overwrite'] },
     { code: '  poorest = 0  // bankrupt', stepTypes: ['overwrite'] },
     { code: 'move tycoon to the top', stepTypes: ['swap'] },
     { code: 'mark all as sorted', stepTypes: ['mark-sorted'] },
     { code: 'done', stepTypes: ['done'] },
   ],
   'robin-hood-sort': [
     { code: 'while max - min > 1', stepTypes: [] },
     { code: '  find richest and poorest', stepTypes: ['compare'] },
     { code: '  d = (max - min) / 2', stepTypes: [] },
     { code: '  richest -= d; poorest += d', stepTypes: ['overwrite'] },
     { code: 'settle: smaller values first', stepTypes: ['overwrite'] },
     { code: 'mark all as sorted', stepTypes: ['mark-sorted'] },
     { code: 'done', stepTypes: ['done'] },
   ],
   ```

No UI/component/routing edits — the sidebar, Home cards, and visualizer all derive from
the registry. `PSEUDOCODE` is `Record<AlgorithmId, Pseudocode>`, so registry entries
without pseudocode entries fail typecheck — steps 3 and 4 must land together.

**Verification**: `npm run ci` fully green (typecheck, lint, all unit tests including
`pseudocode.test.ts` coverage assertions, build).
