---
name: accessibility-audit
description: "Run an axe-core accessibility audit across all algorithm visualizer routes. Use before any release to verify WCAG 2.1 AA compliance, especially after UI or animation changes."
user-invocable: true
---

# Accessibility Audit

Runs axe-core against every `/algorithm/:id` route and reports WCAG violations.

## When to Use
- Before any public release
- After adding or modifying interactive controls (sliders, buttons)
- After any animation or motion changes that could affect reduced-motion support

## Procedure

1. Build the app: `npm run build`

2. Run the audit script:
   ```bash
   npx tsx .github/skills/accessibility-audit/scripts/audit.ts
   ```
   This starts `wrangler pages dev`, visits each algorithm route, runs axe-core, and outputs a report.

3. Review violations in the terminal output or in `accessibility-report.json`

4. Cross-reference against [wcag-checklist.md](./references/wcag-checklist.md) for manual checks that axe cannot automate (e.g., animation pause controls, colour contrast during animation states)

## Pass criteria
- Zero `critical` or `serious` violations
- All animated regions have `role="img"` and descriptive `aria-label`
- All controls have accessible labels
- Reduced-motion: animations disabled when `prefers-reduced-motion: reduce`
