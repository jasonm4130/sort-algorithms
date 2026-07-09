# Task 1 report — Communist Sort — generator + tests

## What I built

- `src/algorithms/communist-sort.ts`
  - `communistSort(values: number[]): number[]` — pure redistribution function.
    `total = sum(values)`, `n = values.length`, `base = Math.floor(total / n)`,
    `r = total - base * n`. Returns `base` for every index, except the last `r`
    indices get `base + 1`. Empty input returns `[]`.
  - `communistSortSteps(arr: ArrayEntry[]): Generator<Step>` — same math, driven
    over a local copy (`const a = arr.map((e) => ({ ...e }))`, never mutating the
    input). For `n === 0` yields only `{ type: 'done' }`. Otherwise yields an
    `overwrite` for every index (even when the value is unchanged, per brief —
    "the sweep is the animation"), then `{ type: 'mark-sorted', indices: [0..n-1] }`,
    then `{ type: 'done' }`.
- `src/algorithms/communist-sort.test.ts` — plain-fn block (empty, single,
  even-redistribution, remainder-goes-last, and a table-driven sum-conserved /
  nondecreasing / max-min<=1 property check) + generator block (ends with
  `done`, empty-input yields only `done`, does not mutate input, `drainSteps`
  matches the plain fn on both an even case and a remainder case, every
  non-`done`/non-`mark-sorted` step is `overwrite`).

No other files touched — wiring into the algorithm registry is Task 4's job
per the brief.

## TDD evidence

**RED** — wrote the test file first, ran it against the not-yet-created
implementation:

```
$ npx vitest run src/algorithms/communist-sort.test.ts
 FAIL  src/algorithms/communist-sort.test.ts [ src/algorithms/communist-sort.test.ts ]
Error: Failed to resolve import "./communist-sort.ts" from "src/algorithms/communist-sort.test.ts". Does the file exist?
...
 Test Files  1 failed (1)
      Tests  no tests
```

Failed for the expected reason (implementation module doesn't exist yet).

**GREEN** — added `communist-sort.ts`, reran:

```
$ npx vitest run src/algorithms/communist-sort.test.ts
 Test Files  1 passed (1)
      Tests  12 passed (12)
   Duration  548ms
```

## Other verification

- `npx tsc --noEmit -p .` — clean, no output (strict TS passes).
- `npx eslint src/algorithms/communist-sort.ts src/algorithms/communist-sort.test.ts --max-warnings 0` — clean, no output.

## Files changed

- `src/algorithms/communist-sort.ts` (new)
- `src/algorithms/communist-sort.test.ts` (new)

`git status` confirms no other files were touched. Committed as `8a9508d`.

## Self-review

- Matches the brief's step sequence and math exactly (verified against
  `[1,2,3] -> [2,2,2]`, `[5,3,1,4,2] -> [3,3,3,3,3]`, `[1,1,1,1,3] -> [1,1,1,2,2]`).
- Input non-mutation follows the `counting-sort.ts` pattern: local copy created
  first, updated in lockstep (`a[i] = { ...a[i], value: newVal }`) before each
  `overwrite` yield.
- `n === 0` and `n === 1` both covered by tests and handled correctly (n===1:
  `base = total`, `r = 0`, single index keeps its value).
- No permutation-based assertions in tests — correctness is judged by
  redistribution semantics (sum conserved, nondecreasing, max-min<=1) per the
  global constraints, not by "is it the same multiset as the input".
- No imports beyond `../types/index.ts` and the sibling `test-helpers.ts`; no
  cross-imports of other joke sorts.
- Did not wire the algorithm into any registry/constants file — out of scope
  for this task.

## Concerns

None. The task was self-contained and the brief's spec was unambiguous.
