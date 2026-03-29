---
name: scaffold-algorithm
description: "Scaffold a new sorting algorithm: generates the generator file, pure sort function, and Vitest test file from templates, then registers it in the index and constants. Use when adding any new sorting algorithm to the project."
argument-hint: "<kebab-case-algorithm-name> e.g. shell-sort"
---

# Scaffold Algorithm

Creates a complete, test-covered sorting algorithm from templates.

## When to Use
- Adding any new sorting algorithm to the project
- Ensures consistent file structure, export names, and test coverage

## Procedure

1. Determine the algorithm name in three forms:
   - kebab-case: the argument provided (e.g. `shell-sort`)
   - camelCase: for function names (e.g. `shellSort`)
   - Display name: for the UI registry (e.g. `Shell Sort`)

2. Copy and fill [algorithm template](./assets/algorithm.template.ts) → `src/algorithms/<kebab-name>.ts`
   - Replace all `__NAME__` placeholders with the camelCase name
   - Implement the actual algorithm logic

3. Copy and fill [test template](./assets/algorithm.test.template.ts) → `src/algorithms/<kebab-name>.test.ts`
   - Replace all `__NAME__` and `__DISPLAY_NAME__` placeholders

4. Add to `src/algorithms/index.ts`:
   ```ts
   export { __NAME__Steps, __NAME__Sort } from './<kebab-name>'
   ```

5. Add an `AlgorithmMeta` entry to `src/constants/algorithms.ts`

6. Run tests: `npm run test:run -- <kebab-name>`
