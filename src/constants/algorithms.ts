import type { AlgorithmMeta } from '../types/index.ts'

export const ALGORITHMS = [
  // ── Group 1: Quadratic O(n²) ──────────────────────────────────────────
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    group: 'quadratic',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Repeatedly steps through the list, compares adjacent elements, and swaps them if out of order. Simple but slow — great for showing why O(n²) hurts.',
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    group: 'quadratic',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Finds the minimum element and places it at the front. Performs the fewest swaps of any O(n²) sort, but always makes n(n-1)/2 comparisons.',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    group: 'quadratic',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Builds the sorted array one item at a time by inserting each element into its correct position. Very efficient on nearly-sorted data.',
  },

  // ── Group 2: Efficient O(n log n) ─────────────────────────────────────
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    group: 'efficient',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    description:
      'Divides the array in half recursively, sorts each half, then merges. Guaranteed O(n log n) — the split and merge phases are visually dramatic.',
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    group: 'efficient',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    description:
      'Selects a pivot, partitions the array around it, and recursively sorts the partitions. The pivot selection and partition are the most visually engaging steps.',
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    group: 'efficient',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Builds a max-heap from the array, then repeatedly extracts the maximum. In-place and O(n log n) guaranteed — the heapify phase creates a distinctive visual pattern.',
  },

  // ── Group 3: Hybrid / Adaptive ────────────────────────────────────────
  {
    id: 'comb-sort',
    name: 'Comb Sort',
    group: 'hybrid',
    timeComplexity: { best: 'O(n log n)', average: 'O(n²/2ᵖ)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Improves bubble sort by comparing elements a shrinking gap apart rather than adjacent pairs. The gap starts large (eliminating "turtles") and shrinks by 1.3× each pass until it becomes 1. O(1) space — a memory-efficient improvement over plain bubble.',
  },
  {
    id: 'intro-sort',
    name: 'Intro Sort',
    group: 'hybrid',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    description:
      'The algorithm behind C++ std::sort. Starts as quicksort, switches to heapsort if recursion depth exceeds 2·log₂n, and uses insertion sort for small partitions. Guaranteed O(n log n) in all cases with excellent real-world performance.',
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    group: 'hybrid',
    timeComplexity: { best: 'O(n log n)', average: 'O(n^1.25)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      "An optimised insertion sort that first compares distant elements. The decreasing gap sequence creates a visually interesting multi-pass pattern.",
  },
  {
    id: 'tim-sort',
    name: 'Tim Sort',
    group: 'hybrid',
    timeComplexity: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    description:
      "Python and Java's real-world algorithm. Detects natural runs (already-sorted subsets) and merges them. Educational because it shows how practical sorts optimize for real data.",
  },

  // ── Group 4: Distribution / Non-comparison ────────────────────────────
  {
    id: 'tree-sort',
    name: 'Tree Sort',
    group: 'distribution',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(n)',
    stable: false,
    description:
      'Inserts every element into a Binary Search Tree, then reads it back via in-order traversal. Two distinct visual phases: a BST-build phase (comparisons + pivot highlights) followed by a left-to-right readout that overwrites the array in sorted order.',
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    group: 'distribution',
    timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
    spaceComplexity: 'O(k)',
    stable: true,
    description:
      'Counts occurrences of each value, then reconstructs the sorted array. Only works for integers in a bounded range — no comparisons at all.',
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    group: 'distribution',
    timeComplexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
    spaceComplexity: 'O(n + k)',
    stable: true,
    description:
      'Sorts digit by digit from least significant to most significant using a stable sub-sort. The multi-pass columnar grouping is visually distinctive.',
  },
  {
    id: 'bucket-sort',
    name: 'Bucket Sort',
    group: 'distribution',
    timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)' },
    spaceComplexity: 'O(n + k)',
    stable: true,
    description:
      'Distributes elements into buckets, sorts each bucket individually, then concatenates. Visualizing the bucket assignment and merge is instructive.',
  },

  // ── Group 5: Quadratic — O(1) space, write-optimised ─────────────────
  {
    id: 'cocktail-shaker-sort',
    name: 'Cocktail Shaker Sort',
    group: 'quadratic',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Bidirectional bubble sort: a forward pass pushes the largest element right, then a backward pass pushes the smallest element left. Converges in fewer passes than bubble sort and handles "turtles" (small values near the end) more efficiently.',
  },
  {
    id: 'cycle-sort',
    name: 'Cycle Sort',
    group: 'quadratic',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Provably minimises the number of writes to memory — each element is written at most twice. O(n²) time but O(1) space with the theoretical minimum of memory writes. The write-optimal algorithm for flash storage and write-constrained hardware.',
  },

  // ── Novelty ───────────────────────────────────────────────────────────
  {
    id: 'bogo-sort',
    name: 'Bogo Sort',
    group: 'novelty',
    timeComplexity: { best: 'O(n)', average: 'O(n · n!)', worst: 'O(∞)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Randomly shuffles the array until it happens to be sorted. Humorously terrible — used to illustrate why algorithm design matters.',
  },
  {
    id: 'gnome-sort',
    name: 'Gnome Sort',
    group: 'novelty',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'A garden gnome sorts flower pots by looking at two adjacent pots: if in order, step forward; if not, swap and step back. Simple, slow, and strangely charming.',
  },
  {
    id: 'stooge-sort',
    name: 'Stooge Sort',
    group: 'novelty',
    timeComplexity: { best: 'O(n^2.71)', average: 'O(n^2.71)', worst: 'O(n^2.71)' },
    spaceComplexity: 'O(n)',
    stable: false,
    description:
      'Recursively sort the first 2/3, then the last 2/3, then the first 2/3 again. Provably correct, provably terrible — slower than O(n²) for no good reason.',
  },
  {
    id: 'pancake-sort',
    name: 'Pancake Sort',
    group: 'novelty',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Sort a stack of pancakes using only a spatula. Find the largest unsorted pancake, flip it to the top, then flip it into position. Repeat until breakfast is ready.',
  },
  {
    id: 'sleep-sort',
    name: 'Sleep Sort',
    group: 'novelty',
    timeComplexity: { best: 'O(n + max)', average: 'O(n + max)', worst: 'O(n + max)' },
    spaceComplexity: 'O(n)',
    stable: false,
    description:
      'Launch a thread for each element that sleeps for a duration equal to its value, then announces itself. Elements wake up in sorted order — the bars light up green from smallest to largest.',
  },
  {
    id: 'stalin-sort',
    name: 'Stalin Sort',
    group: 'novelty',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'O(n) guaranteed — simply remove any element that is out of order. The result is technically sorted, just... shorter. Out-of-order bars are purged and collapse to zero.',
  },
  {
    id: 'slow-sort',
    name: 'Slow Sort',
    group: 'novelty',
    timeComplexity: { best: 'Ω(n^(log n/2))', average: 'Ω(n^(log n/2))', worst: 'Ω(n^(log n/2))' },
    spaceComplexity: 'O(log n)',
    stable: false,
    description:
      'The "Multiply and Surrender" paradigm. Sort the first half, sort the second half, put the max at the end, then sort the rest again. Provably orders of magnitude slower than any sane algorithm.',
  },
  {
    id: 'miracle-sort',
    name: 'Miracle Sort',
    group: 'novelty',
    timeComplexity: { best: 'O(1)', average: 'O(∞)', worst: 'O(∞)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Check if the array is sorted. If not, do nothing and check again — relying on cosmic rays to flip bits into the correct order. After a few fruitless checks, a miracle occurs.',
  },
  {
    id: 'quantum-bogosort',
    name: 'Quantum Bogosort',
    group: 'novelty',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Make a quantum observation of the array. All universes where it is not sorted are instantly destroyed. In the one surviving universe, it was already sorted. O(1) guaranteed.',
  },
] satisfies AlgorithmMeta[]

export type AlgorithmId = typeof ALGORITHMS[number]['id']

export const ALGORITHM_MAP = new Map(ALGORITHMS.map((a) => [a.id, a]))

export const ALGORITHM_GROUPS: Record<string, AlgorithmMeta[]> = {
  'Simple O(n²)': ALGORITHMS.filter((a) => a.group === 'quadratic'),
  'Efficient O(n log n)': ALGORITHMS.filter((a) => a.group === 'efficient'),
  'Hybrid / Adaptive': ALGORITHMS.filter((a) => a.group === 'hybrid'),
  'Distribution': ALGORITHMS.filter((a) => a.group === 'distribution'),
  'Novelty': ALGORITHMS.filter((a) => a.group === 'novelty'),
}
