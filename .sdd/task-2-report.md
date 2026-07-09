# Task 2 Report — Capitalist Sort: generator + tests

## What was built

- `src/algorithms/capitalist-sort.ts`
  - `capitalistSortSteps(arr: ArrayEntry[]): Generator<Step>` — each round finds
    `poor` (min value among indices with value > 0, leftmost on ties, found via
    strict `<` so ties never overwrite) and `rich` (max value overall, rightmost
    on ties, found via `>=` so later indices win ties). Yields `compare {poor,
    rich}`, then `overwrite` for the richer bar's new total, then `overwrite`
    for the poorer bar zeroed out, with the local copy updated in lockstep
    before each yield. Loop continues while more than one index has
    value > 0. After the loop, if exactly one nonzero index `k` remains and
    `k !== n - 1`, swaps it into the last slot with a single `swap` step (also
    applied to the local copy first). Handles `n === 0` (done only) and
    `n === 1` (mark-sorted `[0]` then done) as special cases before the loop.
    Ends with `mark-sorted` over all indices, then `done`.
  - `capitalistSort(values: number[]): number[]` — pure reference: `n - 1`
    zeros followed by the sum of all values (`[]` for empty input).
- `src/algorithms/capitalist-sort.test.ts` — plain-fn block (empty, single,
  concentration examples, all-equal, all-zero, plus a property-based
  `it.each` checking sum conservation / nondecreasing / at-most-one-nonzero
  across several inputs) and a generator block (ends with `done`; empty-array
  and single-element step sequences; does-not-mutate-input; `drainSteps`
  matches `capitalistSort`; data-changing steps are only `overwrite`/`swap`
  with at most one `swap`; final `mark-sorted` covers all indices; compare
  count matches the number of transfer rounds for a worked example).

No other files touched (brief scope: create only these two files).

## TDD evidence

**RED** — `npx vitest run src/algorithms/capitalist-sort.test.ts` before
`capitalist-sort.ts` existed:

```
 FAIL  src/algorithms/capitalist-sort.test.ts [ src/algorithms/capitalist-sort.test.ts ]
Error: Failed to resolve import "./capitalist-sort.ts" from "src/algorithms/capitalist-sort.test.ts". Does the file exist?
...
 Test Files  1 failed (1)
      Tests  no tests
```

**GREEN** — same command after implementing `capitalist-sort.ts`:

```
 RUN  v4.1.2 /Users/jasonmatthew/Work/Git/sort-algorithms-joke-sorts-t2

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  19:32:31
   Duration  536ms (transform 30ms, setup 61ms, import 23ms, tests 5ms, environment 357ms)
```

## Additional verification

- `npx tsc --noEmit -p .` — no output, clean.
- `npx eslint src/algorithms/capitalist-sort.ts src/algorithms/capitalist-sort.test.ts`
  — no output, clean.
- `git status --porcelain` before commit showed only the two new files
  (`capitalist-sort.ts`, `capitalist-sort.test.ts`) — nothing else touched.

## Self-review

- Implements exactly the brief's algorithm and step sequence: `compare` →
  `overwrite` (rich) → `overwrite` (poor) per round, one optional trailing
  `swap`, then `mark-sorted` + `done`. Nothing extra added.
- Verified `rich !== poor` reasoning: the while-loop guard ensures ≥ 2
  nonzero indices whenever a round runs, so the overall max (`rich`) is
  always a positive value; on equal-value ties, leftmost-min vs
  rightmost-max tie-breaking guarantees distinct indices (confirmed by the
  `[4, 4]` and `[1,2,3]` test cases).
- Input mutation avoided: first line is `arr.map((e) => ({ ...e }))`; every
  `overwrite`/`swap` yield is preceded by updating the local copy the same
  way `counting-sort.ts` does.
- Tests assert redistribution semantics (not permutation/sortedness of
  original values), per the global constraint that these are novelty
  algorithms.

## Concerns

None. Task-2-scoped test command (`npx vitest run
src/algorithms/capitalist-sort.test.ts`) is green as required by the plan's
Task 1–3 verification bar; full-suite `npm run ci` is out of scope for this
task (reserved for Task 4 after all three joke sorts are merged).
