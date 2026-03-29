# Sort Algorithms

Interactive visualizations of 25 sorting algorithms — animated bar charts, step-by-step pseudocode, and Big-O complexity info for every algorithm.

**[sortalgorithms.com](https://sortalgorithms.com)**

## Algorithms

### Quadratic — O(n²)
Bubble Sort · Selection Sort · Insertion Sort · Cocktail Shaker Sort · Cycle Sort

### Efficient — O(n log n)
Merge Sort · Quick Sort · Heap Sort

### Hybrid / Adaptive
Comb Sort · Intro Sort · Shell Sort · Tim Sort · Tree Sort

### Distribution / Non-comparison
Counting Sort · Radix Sort · Bucket Sort

### Novelty
Bogo Sort · Gnome Sort · Stooge Sort · Pancake Sort · Sleep Sort · Stalin Sort · Slow Sort · Miracle Sort · Quantum Bogosort

## Stack

- **React 19** + **Vite 8** + **TypeScript** (strict)
- **motion/react** v12 — all animations
- **Tailwind CSS v4** + **shadcn/ui** — styling
- **Vitest 4** — unit tests · **Playwright** — E2E
- **Cloudflare Pages** — deploy (native Git integration, no CI/CD config needed)

## Local development

```bash
npm install
npm run dev          # Vite dev server → http://localhost:5173
npm run pages:dev    # Local Cloudflare Pages simulation via wrangler
```

## Commands

```bash
npm run build        # Production build → dist/
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint (0 warnings allowed)
npm run test         # Vitest watch mode
npm run test:run     # Vitest single pass
npm run ci           # typecheck + lint + test:run + build
```

## Architecture

```
src/
  algorithms/   # Pure generator functions — no React, no side effects
  hooks/        # useAlgorithmPlayer — bridges generators to React state
  components/   # UI components, each with a co-located .test.tsx
  constants/    # Algorithm registry (metadata, pseudocode)
  pages/        # Route-level components (Home, Visualizer)
  types/        # Shared TypeScript types
public/
  _headers      # Cloudflare Pages security headers
  _redirects    # SPA fallback redirect
```

Each algorithm file exports two things:
- `*Steps(arr: ArrayEntry[]): Generator<Step>` — yields animated steps for the visualizer
- `*Sort(arr: number[]): number[]` — pure sort for testing

## Contributing

1. Fork and create a branch
2. Use `npm run ci` before opening a PR — it must pass with 0 warnings
3. New algorithms require: a generator file, a test file, a pseudocode entry, and a constants entry
4. New components require a co-located `.test.tsx`
