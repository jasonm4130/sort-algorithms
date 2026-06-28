# sort-algorithms

A Cloudflare Pages static site that visualizes sorting algorithms with animated bar charts, step-by-step pseudocode, and Big-O complexity information.

## Stack
- React 19 + Vite 8 + TypeScript (strict)
- Animation: `motion/react` v12+
- Testing: Vitest 4 (unit) + Playwright (E2E)
- Deploy: Cloudflare Pages native Git integration

## Key commands
```bash
npm run dev        # dev server
npm run ci         # typecheck + lint + test + build
npm run test:run   # unit tests (single pass)
npm run test:e2e   # Playwright E2E
npm run pages:dev  # local Cloudflare Pages simulate
```

## Architecture rules
- `src/algorithms/` — pure generator functions only, no React
- `src/hooks/` — bridges generators to React state
- `src/components/` — every component has a co-located `.test.tsx`
- `src/types/` — single source of truth for all shared types
- `src/constants/algorithms.ts` — algorithm registry with Big-O metadata

## Critical conventions
- Algorithm generators must yield typed `Step` descriptors and end with `{ type: 'done' }`
- React keys on animated bars must use `entry.id` (stable), never array indices
- CSS custom properties drive all theming — no hardcoded colours in components
- Wrap all animated components in tests with `<MotionConfig reducedMotion="always">`
