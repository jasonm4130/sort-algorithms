# Toolchain migration: Volta → mise, ESLint + Prettier → Biome 2

Replace the two-tool version pin (Volta) with mise + `.node-version`, and the
nine-package lint/format stack (ESLint 9 + plugins + Prettier 3) with Biome 2.
Behavior parity, not improvement: same style, same rule strictness, `npm run ci`
green after every task.

## Context (read first)

- Node pin today: `volta` block in `package.json` — node `24.15.0`, npm `10.8.2`.
  No `.nvmrc`, `.node-version`, `engines`, or CI workflows exist. Cloudflare
  Workers Builds currently gets NO node pin at all (it ignores the volta block);
  `.node-version` fixes that — its build image reads it.
- ESLint config (`eslint.config.js`): flat config extending `js.configs.recommended`,
  `tseslint.configs.recommended` (NOT type-checked — type-aware rules are OFF),
  `reactHooks.configs['recommended-latest']`, `reactRefresh.configs.vite`,
  `jsxA11y.flatConfigs.recommended`, `configPrettier`. **Zero custom rule overrides.**
  Ignores: `dist`, `coverage`, `e2e`, `.github/skills`. Files: `**/*.{ts,tsx}`.
- Prettier config (`prettier.config.js`): `semi: false`, `singleQuote: true`,
  `tabWidth: 2`, `trailingComma: 'es5'`, `printWidth: 100`.
  `.prettierignore`: `dist`, `coverage`, `node_modules`, `*.tsbuildinfo`.
- Lockfile: npm `package-lock.json`. Latest Biome: **2.5.3**.
- Accepted coverage loss (user-approved): Biome does not format `.md`, `.html`,
  or `.svg` — those files simply go unformatted. Prettier is removed entirely.
- `.vscode/settings.json` is untracked/git-ignored — it will NOT exist in your
  worktree. Do not attempt to create or edit it; the controller handles it locally.

## Global Constraints

1. Formatting style is fixed and must not change: single quotes, no semicolons
   (as-needed), 2-space indent, es5 trailing commas, 100 line width.
2. Lint strictness parity: Biome recommended rules only — do NOT enable
   type-aware/`nursery` rule groups beyond what the task specifies. Keep import
   organizing (assist `organizeImports`) OFF to contain the diff.
3. `npm run ci` (typecheck + lint + test:run + build) must pass at the end of
   every task. 321 existing tests must stay green.
4. The one-time Biome reformat must be its own commit containing ONLY
   formatter-produced changes — no manual edits mixed in.
5. No new lint suppressions (`// biome-ignore`) without an inline reason; if a
   Biome rule flags existing code and the fix is not mechanically obvious,
   prefer a targeted suppression with reason over rewriting logic, and list it
   in your task report.
6. `package-lock.json` changes only via npm commands (`npm install` /
   `npm uninstall`), never hand-edited.
7. Match repo conventions: this project is a Cloudflare **Worker** (static
   assets), not Pages.

## Task 1: Replace Volta with mise + .node-version

**Edit/create exactly 3 files:**

1. **Create `mise.toml`** at repo root:
   ```toml
   # Node pin — keep in sync with .node-version (Cloudflare Workers Builds reads that file)
   [tools]
   node = "24.15.0"
   ```
2. **Create `.node-version`** at repo root containing exactly:
   ```
   24.15.0
   ```
   (single line, trailing newline). mise reads this natively too; it is the pin
   Cloudflare Workers Builds respects.
3. **Edit `package.json`**: delete the entire `volta` block (currently the last
   key in the file — mind the trailing comma on the preceding
   `optionalDependencies` block). Change nothing else.

Note: mise does not pin npm (npm ships with node) — the old `npm: 10.8.2` pin
is intentionally dropped; node 24.15.0 bundles npm 11.x, and lockfileVersion 3
is compatible across npm 10/11.

**Verification**: `npm run ci` green; `git diff` shows only the 3 files above.

## Task 2: Replace ESLint + Prettier with Biome 2

**Dependencies** (all via npm so the lockfile regenerates):
- Remove these 9 devDependencies: `@eslint/js`, `eslint`, `eslint-config-prettier`,
  `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
  `globals`, `prettier`, `typescript-eslint`.
- Add: `npm install -D -E @biomejs/biome@2.5.3` (exact pin, per Biome's own
  recommendation — formatter output must be reproducible).

**Delete**: `eslint.config.js`, `prettier.config.js`, `.prettierignore`.

**Create `biome.json`** at repo root. Target configuration (verify exact key
names/groups against the installed 2.5.3 — run `npx biome check` and consult
`npx biome explain <rule>` if a key is rejected; do not silently drop a setting):

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.3/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "includes": ["**", "!e2e", "!.github/skills"] },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "semicolons": "asNeeded",
      "quoteStyle": "single",
      "trailingCommas": "es5"
    }
  },
  "linter": {
    "enabled": true,
    "domains": { "react": "recommended" },
    "rules": { "recommended": true }
  },
  "assist": { "actions": { "source": { "organizeImports": "off" } } }
}
```

Rule-parity intent (what the config above must achieve):
- `js/recommended` + `tseslint/recommended` → Biome `recommended: true`.
- `eslint-plugin-react-hooks` → the react domain's hook rules
  (`useExhaustiveDependencies`, `useHookAtTopLevel`) must be active — confirm
  they fire (e.g. temporarily introduce a missing dependency in a scratch file,
  see it flagged, revert).
- `eslint-plugin-jsx-a11y` → Biome's `a11y` group (part of recommended).
- `eslint-plugin-react-refresh` → enable `useComponentExportOnlyModules` if
  present in 2.5.3's stable groups; if it is nursery-only, skip it and note that
  in your task report rather than enabling the nursery group.
- `eslint-config-prettier` → obsolete (Biome owns both), no equivalent needed.
- `dist`/`coverage`/`*.tsbuildinfo`/`node_modules` are excluded via
  `useIgnoreFile` (.gitignore); `e2e` + `.github/skills` mirror the old ESLint
  ignores explicitly.

**Rewrite `package.json` scripts** (only these four; `ci` stays untouched and
keeps working via `npm run lint`):
```json
"lint": "biome check .",
"lint:fix": "biome check --write .",
"format": "biome format --write .",
"format:check": "biome format ."
```
(`biome check` = lint + format-check + assists, strictly stronger than the old
`eslint . --max-warnings 0`, and diagnostics are errors by default.)

**Create `.vscode/extensions.json`** (this path IS tracked — `.gitignore`
whitelists it):
```json
{
  "recommendations": ["biomejs.biome"]
}
```

**One-time reformat** (own commit, per Global Constraint 4): run
`npx biome check --write .`, then `git add -A` and commit ONLY the
formatter/fixer output. Expected to be small (Biome ≈97% Prettier-compatible
with matched options), but json/css files may shift slightly. If Biome lint
surfaces real diagnostics the autofix can't handle, fix them in a separate
commit per Global Constraint 5.

**Update doc mentions of the old stack** (same task, mechanical):
- `README.md:58`: `| \`npm run lint\` | ESLint (0 warnings allowed) |` →
  `| \`npm run lint\` | Biome check (lint + format, zero tolerance) |`
- `README.md:110`: `- ESLint + Prettier — run \`npm run lint\` to check` →
  `- Biome (lint + format) — run \`npm run lint\` to check, \`npm run lint:fix\` to fix`
- `.github/copilot-instructions.md:12`: `- Linting: ESLint 9 flat config + Prettier 3` →
  `- Linting/formatting: Biome 2`
- `.github/copilot-instructions.md:21`: `npm run lint          # ESLint (0 warnings allowed)` →
  `npm run lint          # Biome check (lint + format)`

**Verification**: `npm run ci` fully green; `npx biome check .` reports no
diagnostics; `grep -ri "eslint\|prettier" package.json` returns nothing;
deleted config files are gone.

## Task 3: Fix stale deployment docs (Pages → Workers)

Docs still describe the pre-migration Cloudflare Pages setup and a
`npm run pages:dev` script that no longer exists (actual scripts:
`dev:edge` = `wrangler dev`, `deploy` = `npm run build && wrangler deploy`;
the project is a Worker with static assets — see `wrangler.jsonc`).

**Edit exactly 3 files:**
1. `README.md:62`: replace the `| \`npm run pages:dev\` | Local Cloudflare Pages simulation |`
   row with `| \`npm run dev:edge\` | Local Workers runtime (wrangler dev) |`.
2. `CLAUDE.md`:
   - Line 3: "A Cloudflare Pages static site…" → "A Cloudflare Workers static
     site (static assets)…"
   - Line 9 (Stack list): `Deploy: Cloudflare Pages native Git integration` →
     `Deploy: Cloudflare Workers Builds (Git integration, Workers Static Assets)`
   - Line 17 (key commands): `npm run pages:dev  # local Cloudflare Pages simulate` →
     `npm run dev:edge   # local Workers runtime (wrangler dev)`
3. `.github/copilot-instructions.md`:
   - Line 11: same Pages → Workers Builds replacement as CLAUDE.md line 9.
   - Line 26: same `pages:dev` → `dev:edge` replacement as CLAUDE.md line 17.

Line numbers are pre-Task-2 references — Task 2 edits other lines in README.md
and copilot-instructions.md, so locate by content, not blindly by number.
Preserve each file's table/list formatting.

**Verification**: `grep -rn "pages:dev\|Cloudflare Pages" README.md CLAUDE.md .github/copilot-instructions.md`
returns nothing; `npm run ci` green (docs-only change — run it anyway).
