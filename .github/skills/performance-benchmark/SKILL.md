---
name: performance-benchmark
description: "Benchmark all sorting algorithm generators: measures step counts and execution time across input sizes and patterns (random, sorted, reverse, duplicates). Use when adding or modifying an algorithm to verify Big-O behaviour."
user-invocable: true
---

# Performance Benchmark

Runs all algorithm generators across multiple input sizes and patterns, outputting step counts and timing.

## When to Use
- After implementing a new algorithm (verify step count matches expected Big-O)
- After modifying an existing algorithm (regression check)
- When comparing two implementations

## Procedure

1. Run the benchmark:
   ```bash
   npx tsx .github/skills/performance-benchmark/scripts/benchmark.ts
   ```

2. Review the output table showing step counts per algorithm × input pattern × size

3. Cross-reference against [complexity-expectations.md](./references/complexity-expectations.md) to verify that step counts are within expected ranges

## Interpreting results
- Compare counts against theoretical values in the expectations file
- A `compare` count significantly above the expected range indicates a bug
- Timing is indicative only — generator overhead dominates at small n
