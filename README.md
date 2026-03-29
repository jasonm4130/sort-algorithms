# Sort Algorithms

Interactive visualizations of 25 sorting algorithms — animated bar charts, step-by-step pseudocode, and Big-O complexity info for every algorithm.

**[sortalgorithms.com](https://sortalgorithms.com)**

## Algorithms

### Simple — O(n²)
Bubble Sort · Selection Sort · Insertion Sort · Cocktail Shaker Sort · Cycle Sort

### Efficient — O(n log n)
Merge Sort · Quick Sort · Heap Sort

### Hybrid / Adaptive
Comb Sort · Intro Sort · Shell Sort · Tim Sort

### Distribution / Non-comparison
Tree Sort · Counting Sort · Radix Sort · Bucket Sort

### Novelty
Bogo Sort · Gnome Sort · Stooge Sort · Pancake Sort · Sleep Sort · Stalin Sort · Slow Sort · Miracle Sort · Quantum Bogosort

## Features

- Animated bar-chart visualizations with colour-coded states (comparing, swapping, sorted, pivot)
- Step-by-step pseudocode highlighting synced to the animation
- Big-O complexity table for every algorithm (best / average / worst + space)
- Speed and array-size controls, step-forward / step-backward
- Sound mode — hear the comparisons
- Dark and light themes
- Responsive layout with collapsible algorithm menu on mobile
- Cloudflare Pages deployment (zero-config CI via Git integration)

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

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run lint` | ESLint (0 warnings allowed) |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Vitest single pass |
| `npm run ci` | typecheck + lint + test:run + build |
| `npm run pages:dev` | Local Cloudflare Pages simulation |

## Architecture

```
src/
  algorithms/   Pure generator functions — no React, no side effects
  hooks/        useAlgorithmPlayer — bridges generators to React state
  components/   UI components, each with a co-located .test.tsx
  constants/    Algorithm registry (metadata, pseudocode, groups)
  pages/        Route-level components (Home, Visualizer)
  types/        Shared TypeScript types
public/
  _headers      Cloudflare Pages security headers
  _redirects    SPA fallback redirect
```

Each algorithm file exports two things:
- `*Steps(arr: ArrayEntry[]): Generator<Step>` — yields animated steps for the visualizer
- `*Sort(arr: number[]): number[]` — pure sort for testing

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repo and create a feature branch from `main`
2. **Run `npm run ci`** before opening a PR — it must pass with 0 warnings
3. Keep PRs focused — one feature or fix per PR

### Adding a new algorithm

A new sorting algorithm needs four things:

1. **Generator file** — `src/algorithms/<name>.ts` exporting `*<Name>Steps()` and `*<Name>Sort()`
2. **Test file** — `src/algorithms/<name>.test.ts` covering sorted output, step types, and edge cases
3. **Pseudocode entry** — add to `src/constants/pseudocode.ts`
4. **Constants entry** — add metadata to `src/constants/algorithms.ts` (name, group, complexity, description)

### Adding a new component

- Place it in `src/components/<ComponentName>/`
- Include a co-located `<ComponentName>.test.tsx`
- Use named exports (not default)
- All animations via `motion/react`, all colours via CSS custom properties

### Code style

- TypeScript strict mode — no `any`, no unused variables
- ESLint + Prettier — run `npm run lint` to check
- Algorithm generators must be **pure** — no mutation of input, no global state, no React imports

## License

MIT
