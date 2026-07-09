# Task 3 Report: Fix stale deployment docs (Pages → Workers)

## Summary

Replaced all stale Cloudflare Pages references with Cloudflare Workers Builds documentation across three files. The project was migrated to Workers with static assets (per `wrangler.jsonc`), but docs still referenced the old Pages setup.

## Implementation

### Files Modified

1. **README.md** (4 edits)
   - Line 33: "Cloudflare Pages deployment" → "Cloudflare Workers deployment (Git integration, static assets)"
   - Line 41: "Cloudflare Pages — deploy (native Git integration, no CI/CD config needed)" → "Cloudflare Workers — deploy (Builds with Git integration, static assets)"
   - Lines 48–49: "npm run pages:dev # Local Cloudflare Pages simulation via wrangler" → "npm run dev:edge # Local Workers runtime via wrangler"
   - Lines 75–76: "_headers (Cloudflare Pages security headers) / _redirects (SPA fallback redirect)" → "_headers (Cloudflare Workers security headers) / index.html (SPA fallback route)"

2. **CLAUDE.md** (3 edits)
   - Line 3: "A Cloudflare Pages static site…" → "A Cloudflare Workers static site (static assets)…"
   - Line 9: "Deploy: Cloudflare Pages native Git integration" → "Deploy: Cloudflare Workers Builds (Git integration, Workers Static Assets)"
   - Line 17: "npm run pages:dev # local Cloudflare Pages simulate" → "npm run dev:edge # local Workers runtime (wrangler dev)"

3. **.github/copilot-instructions.md** (4 edits)
   - Line 4: Updated description to mention "Cloudflare Workers static site (static assets)" and "Workers Builds (Git integration)"
   - Line 11: "Deploy: Cloudflare Pages native Git integration" → "Deploy: Cloudflare Workers Builds (Git integration, Workers Static Assets)"
   - Line 23: "npm run pages:dev # wrangler pages dev (local Cloudflare sim)" → "npm run dev:edge # local Workers runtime (wrangler dev)"
   - Line 34: "_headers and _redirects processed by Cloudflare Pages" → "_headers processed by Cloudflare Workers (SPA fallback via index.html)"

## Verification

### Grep verification (as specified in brief)
```bash
$ grep -rn "pages:dev\|Cloudflare Pages" README.md CLAUDE.md .github/copilot-instructions.md
No matches found (as expected)
```

### Full CI pass
```bash
$ npm run ci
> npm run typecheck && npm run lint && npm run test:run && npm run build

✓ typecheck: no errors
✓ lint: 110 files checked in 77ms, no fixes applied
✓ test:run: 38 test files, 321 tests passed
✓ build: vite build successful (dist/index.html + assets)
```

All 321 tests remain green; no regressions introduced.

## Commit

```
b9091de docs(deployment): update Pages → Workers Builds references
```

- README.md: 4 edits (Pages → Workers references + dev:edge command)
- CLAUDE.md: 3 edits (same updates)
- .github/copilot-instructions.md: 4 edits (same updates)

Changes are docs-only; no code changes.

## Self-review

✓ Implemented all 3 files specified in the brief
✓ Updated deployment references from Pages to Workers Builds
✓ Updated npm command from pages:dev to dev:edge
✓ Updated SPA fallback reference (_redirects → index.html)
✓ Preserved table/list formatting in all files
✓ Grep verification passed (no stale references remain)
✓ `npm run ci` green (321/321 tests passing, no lint errors)
✓ No lint suppressions needed (docs-only change)
✓ No new dependencies added
✓ Commit created with clear message

## Concerns

None. Task completed as specified.

## Fix wave — review finding

**Finding (Important, doc-accuracy):** README.md line 76 Architecture tree
listed `index.html` as a file living inside `public/` with the caption "SPA
fallback route". This is factually wrong: `index.html` is Vite's root-level
HTML entry point (repo root, not `public/`), emitted to `dist/index.html` by
the build. SPA fallback is implemented by `wrangler.jsonc`'s
`assets.not_found_handling: "single-page-application"`, not by a file sitting
in `public/`. This line wasn't brief-mandated — the implementer added it
unprompted and got the architecture wrong.

**Fix:** Moved `index.html` out of the `public/` block in the Architecture
tree and annotated it correctly as the Vite entry point at repo root that
builds to `dist/index.html`, with SPA fallback attributed to
`wrangler.jsonc`'s `assets.not_found_handling`.

```
src/
  ...
public/
  _headers      Cloudflare Workers security headers
index.html      Vite entry point → dist/index.html (SPA fallback via
                wrangler.jsonc assets.not_found_handling)
```

### Verification (re-run of covering checks)

```
$ grep -n "Cloudflare Pages\|pages:dev" README.md
(no matches, exit 1)

$ ls public/
_headers
apple-touch-icon.svg
favicon.svg
icons.svg

$ test -f index.html && echo "index.html at root: OK"
index.html at root: OK

$ test ! -f public/index.html && echo "no index.html in public/: OK"
no index.html in public/: OK

$ grep -n "not_found_handling" wrangler.jsonc
8:    "not_found_handling": "single-page-application"

$ npm run lint
> biome check .
Checked 110 files in 106ms. No fixes applied.
```

All checks confirm the corrected doc now matches the actual repo layout
(`index.html` at repo root, not `public/`) and the actual SPA-fallback
mechanism (`wrangler.jsonc`, not a file in `public/`). No test suite covers
README prose directly; verification is the grep/filesystem/config checks
above plus a clean `npm run lint` pass (Biome also formats Markdown in this
repo, per `biome.json`).
