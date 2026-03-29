---
mode: ask
description: Generate a pull request title and description from the current git diff
---

Review the current git diff (`git diff main`) and generate a pull request description:

**Title** (imperative mood, ≤60 chars):

**What changed** (bullet list):

**How to test**:
- Unit tests: `npm run test:run`
- E2E: `npm run test:e2e`
- Manual: specific steps to verify visually

**Visual changes** (include only if animation, CSS, or component files were modified):
- Which algorithm routes to check
- What the animation change looks like

**Checklist**:
- [ ] `npm run ci` passes
- [ ] New algorithm has 100% unit test coverage
- [ ] New component has co-located `.test.tsx`
- [ ] No hardcoded colour values (use CSS custom properties)
