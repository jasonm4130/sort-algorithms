---
name: deploy-smoke-test
description: "Run a pre-deploy smoke test: builds the app, starts wrangler pages dev, and verifies every algorithm route loads and the visualizer renders correctly. Run before pushing to main."
user-invocable: true
---

# Deploy Smoke Test

Validates the production build against all algorithm routes before deploying.

## When to Use
- Before merging to `main`
- After adding a new algorithm route
- After any routing or build config change

## Procedure

1. Run the smoke test script:
   ```bash
   npx tsx .github/skills/deploy-smoke-test/scripts/smoke-test.ts
   ```
   This will:
   - Run `npm run build`
   - Start `wrangler pages dev dist` on port 8788
   - Visit every route in [route-registry.md](./references/route-registry.md)
   - Assert the visualizer mounts and the play button is present
   - Shut down the dev server

2. All routes must return HTTP 200 and render the play button

## Pass criteria
- Zero failed route assertions
- No console errors on load
- Build output size within expected range (warn if >500kb gzipped)
