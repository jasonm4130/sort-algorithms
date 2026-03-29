---
mode: agent
description: Scaffold a new sorting algorithm with generator, tests, and registry entry
---

Scaffold a new sorting algorithm called **${input:algorithmName:e.g. shell-sort}**.

Perform all of the following steps:

1. **Create `src/algorithms/${input:algorithmName}.ts`**
   - Export `function* ${input:algorithmName:camelCase}Steps(arr: ArrayEntry[]): Generator<Step>` — yields typed Step descriptors (compare, swap, overwrite, pivot, mark-sorted, done)
   - Export `function ${input:algorithmName:camelCase}Sort(arr: number[]): number[]` — pure sort, no generator
   - Import `Step`, `ArrayEntry` from `../../types/index.ts`
   - Follow the existing pattern in `src/algorithms/bubble-sort.ts`

2. **Create `src/algorithms/${input:algorithmName}.test.ts`**
   - Import from `vitest` and the algorithm file
   - Cover all 7 required cases: empty, single element, already sorted, reverse sorted, duplicates, stability (if stable), step count

3. **Register in `src/algorithms/index.ts`**
   - Add named export: `export { ${input:algorithmName:camelCase}Steps, ${input:algorithmName:camelCase}Sort } from './${input:algorithmName}'`

4. **Add to `src/constants/algorithms.ts`**
   - Add an `AlgorithmMeta` entry with correct `id`, `name`, `group`, `timeComplexity` (best/average/worst), `spaceComplexity`, `stable`, and `description`

5. **Run `npm run test:run -- ${input:algorithmName}` and confirm the tests pass**
