# Task 3: Robin Hood Sort — generator + tests

## Summary

Created `src/algorithms/robin-hood-sort.ts` and `src/algorithms/robin-hood-sort.test.ts`.
No other files touched.

- `robinHoodSort(values: number[]): number[]` — pure function. Computes
  `total`, `base = Math.floor(total/n)`, `r = total - base*n`, returns
  `n - r` copies of `base` followed by `r` copies of `base + 1` (`[]` for
  empty input).
- `robinHoodSortSteps(arr: ArrayEntry[]): Generator<Step>` — redistribution
  generator:
  - Repeats while `max - min > 1` (recomputing rich/poor — leftmost on ties
    via a linear scan — every round since values change): yields `compare`
    for the rich/poor pair, then two `overwrite`s (rich loses
    `d = Math.floor((max-min)/2)`, poor gains `d`), keeping the local copy
    `a` in lockstep with every yielded overwrite.
  - Settling pass: once `max - min <= 1`, all values are `m` or `m + 1`
    (`m` = current min). With `r` = count of `m + 1` values, arranges
    `n - r` copies of `m` followed by `r` copies of `m + 1`, overwriting
    only indices whose value actually changes.
  - Ends with `mark-sorted` over all indices, then `done` (n > 0 case);
    `n === 0` yields only `done`.

Implemented independently of Communist Sort (Task 2) — no cross-import,
per the brief's explicit instruction, even though the two converge to the
same final distribution ("communism with extra steps").

## TDD evidence

**RED** — wrote `robin-hood-sort.test.ts` first, ran it before the
implementation file existed:

```
$ npx vitest run src/algorithms/robin-hood-sort.test.ts
 FAIL  src/algorithms/robin-hood-sort.test.ts [ src/algorithms/robin-hood-sort.test.ts ]
Error: Failed to resolve import "./robin-hood-sort.ts" from "src/algorithms/robin-hood-sort.test.ts". Does the file exist?
...
 Test Files  1 failed (1)
      Tests  no tests
```

Failed for the expected reason (module under test doesn't exist yet).

**GREEN** — after writing `robin-hood-sort.ts`:

```
$ npx vitest run src/algorithms/robin-hood-sort.test.ts

 RUN  v4.1.2 /Users/jasonmatthew/Work/Git/sort-algorithms-joke-sorts-t3


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  19:32:50
   Duration  562ms
```

## Test coverage (14 tests)

`robinHoodSort` block:
- empty array → `[]`; single element `[7]` → `[7]`
- `[1,2,3]` → `[2,2,2]` (evenly divisible)
- `[1,1,1,1,3]` → `[1,1,1,2,2]` (remainder case)
- `[4,4,4]` → `[4,4,4]` (already-equal, no-op)
- property check over 8 varied inputs: sum conserved, result nondecreasing,
  `max - min <= 1`

`robinHoodSortSteps` generator block:
- ends with `done`
- `n === 0` yields exactly `[{ type: 'done' }]`
- does not mutate input (`JSON.stringify` before/after unchanged)
- `drainSteps` result equals `robinHoodSort` of the same values, across 6
  cases including empty/single/remainder/already-equal
- every data step (`overwrite`/`swap`) is `overwrite` — no swaps emitted
- emits at least one `compare` when a transfer round is needed
- ends with `mark-sorted` covering all indices, then `done`
- invariant: no intermediate `overwrite` value falls outside
  `[initial min, initial max]`

## Verification

Focused suite (required gate for Task 3):

```
$ npx vitest run src/algorithms/robin-hood-sort.test.ts
 Test Files  1 passed (1)
      Tests  14 passed (14)
```

Additional checks run before committing (not part of the Task 3 gate, but
done for self-review since `npm run ci` is Task 4's job):

- `npx tsc --noEmit -p .` — no output, clean.
- `npx eslint src/algorithms/robin-hood-sort.ts src/algorithms/robin-hood-sort.test.ts`
  — no output, clean.
- `npx vitest run src/algorithms/` — full algorithms directory:
  `26 passed (26)` files, `250 passed (250)` tests — no regressions from
  the new files.
- `git status --porcelain` before commit showed only the two new files
  (`robin-hood-sort.ts`, `robin-hood-sort.test.ts`) — nothing else touched.

## Self-review

- Implements exactly the brief's semantics: bilateral max/min transfers of
  `d = floor((max-min)/2)` per round, leftmost-on-tie index selection via
  linear scan (correct by construction — first strictly-greater/less
  comparison wins, so first occurrence is kept), settling pass that only
  overwrites when the value differs from target.
- Local copy `a` is updated in lockstep with every yielded `overwrite`
  (verified by the mutation test and by the `drainSteps`-equals-pure-fn
  test, which would diverge if lockstep were broken).
- No swaps used — only `compare` (garnish) and `overwrite` (data), matching
  constraint 4.
- Confirmed by hand (and by the invariant test) that both the rich's new
  value (`max - d`) and poor's new value (`min + d`) stay within the
  current round's `[min, max]`, which is itself always within the
  original array's `[min, max]` by induction — so the "no intermediate
  overwrite value falls outside `[initial min, initial max]`" property
  holds structurally, not just for the tested case.
- Did not import `communist-sort` and did not touch any files outside the
  two named in the brief.

## Concerns

None. The task brief and global constraints were unambiguous and fully
satisfied.
