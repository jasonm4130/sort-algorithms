---
name: visual-regression
description: "Capture and compare visual screenshots of the sorting visualizer. Use before/after animation changes, styling updates, or any UI refactors to detect unintended regressions."
user-invocable: true
---

# Visual Regression

Captures screenshots of every algorithm route and diffs against stored baselines.

## When to Use
- Before merging any animation, CSS, or component change
- After updating Motion transition configs or design tokens
- When upgrading `motion` library version

## Procedure

1. Ensure the app is built: `npm run build`

2. Run the capture script (starts wrangler, captures all routes):
   ```bash
   npx tsx .github/skills/visual-regression/scripts/capture-screenshots.ts
   ```
   Screenshots saved to `.github/skills/visual-regression/references/current/`

3. If no baselines exist yet, promote current as baseline:
   ```bash
   cp -r .github/skills/visual-regression/references/current/ .github/skills/visual-regression/references/baselines/
   ```

4. Otherwise, run the diff:
   ```bash
   npx tsx .github/skills/visual-regression/scripts/compare.ts
   ```
   Review any flagged diffs before merging.

## Notes
- Baselines are committed to the repo (`references/baselines/`)
- Current captures are gitignored (`references/current/`)
- Each screenshot is named `<algorithm-id>-<theme>.png`
