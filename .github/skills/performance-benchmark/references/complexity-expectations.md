# Algorithm Complexity Expectations

Expected `compare` step counts for each algorithm at various `n`. These are theoretical values;
actual generator counts should be within ±5% for deterministic algorithms.

## n=10, reverse-sorted (worst case for comparison sorts)

| Algorithm     | Expected comparisons | Formula              |
|---------------|----------------------|----------------------|
| Bubble Sort   | 45                   | n(n-1)/2             |
| Selection Sort| 45                   | n(n-1)/2             |
| Insertion Sort| 45                   | n(n-1)/2             |
| Merge Sort    | ~20                  | n·log₂(n) approx    |
| Quick Sort    | ~100 (worst)         | n² worst, varies    |
| Heap Sort     | ~30                  | 2n·log₂(n) approx   |
| Shell Sort    | varies by gap        | depends on sequence  |

## n=10, random input (average case)

| Algorithm     | Expected comparisons |
|---------------|----------------------|
| Bubble Sort   | ~22                  |
| Selection Sort| 45                   |
| Insertion Sort| ~22                  |
| Merge Sort    | ~18                  |
| Quick Sort    | ~23                  |
| Heap Sort     | ~27                  |

## Notes
- Distribution sorts (Counting, Radix, Bucket) do not yield `compare` steps — measure `overwrite` steps instead
- Bogo Sort is excluded from benchmarks (non-deterministic, potentially infinite)
- Tim Sort step counts depend on run detection — random input will differ from nearly-sorted input significantly
