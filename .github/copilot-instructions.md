# sort-algorithms — Copilot Instructions

## Project
A Cloudflare Pages static site visualizing sorting algorithms, deployed via native Cloudflare Git integration (no GitHub Actions needed). Built with React 19 + Vite 8 + TypeScript (strict mode).

## Stack
- Runtime: Node 20, Vite 8, React 19
- Language: TypeScript (strict mode, bundler moduleResolution)
- Animation: `motion` v12+ (`motion/react`)
- Testing: Vitest 4 (unit) + Playwright (E2E)
- Deploy: Cloudflare Pages native Git integration — build command `npm run build`, output `dist`
- Linting: ESLint 9 flat config + Prettier 3

## Commands
```bash
npm run dev           # Vite dev server
npm run build         # tsc -b && vite build → dist/
npm run typecheck     # TypeScript check only (no emit)
npm run test          # Vitest watch mode
npm run test:run      # Vitest single pass (use in CI)
npm run lint          # ESLint (0 warnings allowed)
npm run ci            # typecheck + lint + test:run + build
npm run pages:dev     # wrangler pages dev (local Cloudflare sim)
```

## Architecture
- `src/algorithms/` — **Pure generator functions only. No React, no side effects.**
  Each file exports two things: `*Steps(arr: ArrayEntry[]): Generator<Step>` and `*Sort(arr: number[]): number[]`
- `src/hooks/` — Custom hooks that bridge algorithm generators to React state (`useAlgorithmPlayer`)
- `src/components/` — React components. Every component folder has a co-located `.test.tsx`
- `src/types/` — Shared TypeScript types. Import from here, never redefine locally
- `src/constants/` — Algorithm registry with Big-O metadata for the UI
- `src/pages/` — Route-level components only (`Home`, `Visualizer`)
- `public/` — Static assets; `_headers` and `_redirects` processed by Cloudflare Pages

## Key Conventions
- Use **named exports** everywhere except page-level components (which use default exports)
- React keys for animated bar elements must be **stable IDs** (`entry.id`), never array indices
- All animations use `motion/react`. In tests, wrap in `<MotionConfig reducedMotion="always">` to disable animations
- Algorithm generators must be **pure** — no mutation of input, no global state
- New components require a co-located `.test.tsx` file before merging
- CSS custom properties drive theming: `--color-bar-default`, `--color-bar-comparing`, etc.

## Design Tokens
Dark theme base: `#010E1A` bg / `#219EBC` bar default / `#FB8500` comparing / `#FFB703` swapping / `#C1FF72` sorted / `#00C2E4` pivot
Light theme base: `#FAFAF8` bg / `#669BBC` bar default / `#C1121F` comparing / `#780000` swapping / `#2A9D8F` sorted / `#E9C46A` pivot
