# Migrating to Paris v0.24 — Compiled Components

> **You are an AI coding agent performing this migration.** Read this entire guide
> first, then make the smallest set of changes needed. Do not refactor unrelated
> code. After each step, prefer verifying over assuming. At the end, run the
> project's build/typecheck and report what you changed.

## What changed and why

Before v0.24, Paris shipped **unbundled `.tsx` + SCSS module source**, so every
consumer had to transpile Paris themselves (`transpilePackages`) and provide a
Sass toolchain. As of **v0.24, Paris ships precompiled ESM** with extracted CSS
and TypeScript declarations.

> **Use `paris@^0.24.1` or newer.** v0.24.0 had a packaging bug where per-component
> CSS shipped as `*.module.css`, which consumer bundlers re-scoped — so components
> rendered unstyled. This is fixed in **0.24.1**; always upgrade to at least that.

For the consumer this means **less** setup, not more:

- ❌ Remove `transpilePackages: ['paris']` — no longer needed.
- ❌ Remove the `sass` dependency — Paris no longer requires it.
- 🔁 Change the global-styles import: `paris/theme/global.scss` → `paris/theme/global.css`.
- ✅ **Component import paths are unchanged** (`paris/button`, `paris/text`, …). No component code changes.

This works in **Next.js (App Router / RSC) and Vite React** with no special bundler config.

---

## Migration steps

### Step 1 — Bump the dependency

Update `paris` to `^0.24.1` (or newer) in the consumer's `package.json`, then
install with the project's package manager.

```bash
# Detect the package manager from the lockfile, then run the matching install.
# bun.lock(b) → bun add paris@^0.24.1
# pnpm-lock.yaml → pnpm add paris@^0.24.1
# yarn.lock → yarn add paris@^0.24.1
# package-lock.json → npm install paris@^0.24.1
```

Verify the installed version afterward (e.g. check `node_modules/paris/package.json`
has `"version": "0.24.1"` or higher and a `dist/` directory). Do **not** stay on
0.24.0 — its per-component CSS is mis-scoped and components will render unstyled.

### Step 2 — Remove `transpilePackages: ['paris']`

Find the Next.js config (`next.config.js`, `next.config.mjs`, or `next.config.ts`).
Remove `'paris'` from the `transpilePackages` array.

- If `transpilePackages` contained **only** `'paris'`, remove the whole key.
- If it lists **other** packages, remove just the `'paris'` entry and keep the rest.
- If the project is **not** Next.js (e.g. Vite, Remix, plain React), there is
  nothing to do here — skip this step.

Example (before → after):

```js
// before
const nextConfig = { transpilePackages: ['paris'] };
// after
const nextConfig = {};
```

### Step 3 — Remove the `sass` dependency (only if Paris was the reason for it)

`sass` is no longer a peer dependency of Paris. **Before removing it**, check
whether the consumer's own code still needs it:

1. Search the project (excluding `node_modules`) for `.scss` / `.sass` files or
   `.module.scss` imports authored by the consumer.
2. **If none exist**, remove `sass` from the consumer's `dependencies` /
   `devDependencies` and reinstall.
3. **If the consumer uses Sass for its own styles**, leave `sass` installed — it's
   only "no longer required *by Paris*," not forbidden.

When unsure, leave `sass` in place; a redundant dev dependency is harmless.

### Step 4 — Update the global styles import

Find every import of Paris's global stylesheet and change the extension from
`.scss` to `.css`:

```diff
- import 'paris/theme/global.scss';
+ import 'paris/theme/global.css';
```

Search the whole project for `paris/theme/global.scss` and replace each occurrence.
This is usually in the root layout / app entry (e.g. `app/layout.tsx`,
`src/main.tsx`, `pages/_app.tsx`). **Do not** change the theme-injection code
(`generateCSS` / `generateThemeInjection` from `paris/theme`) — that is unchanged.

### Step 5 — Confirm TypeScript module resolution

Ensure `tsconfig.json` `compilerOptions.moduleResolution` is one of `"bundler"`,
`"nodenext"`, or `"node16"` (needed to resolve Paris's `exports` subpaths +
types). If it's `"node"`/`"classic"`, set it to `"bundler"`.

### Step 6 — Verify

Run the project's existing checks and confirm they pass:

```bash
# typecheck (if present), then a production build
# e.g. tsc --noEmit ; next build   |   tsc -b ; vite build
```

Confirm:

- The build succeeds with **no** `transpilePackages` and **no** Sass setup.
- Paris components still render and their styles apply (the per-component CSS is
  auto-imported now; you do not need to import any component stylesheet manually).
- `paris/theme/global.css` loads without a Sass error.

---

## Optional

- **One-import stylesheet.** If you prefer a single stylesheet over per-component
  auto-imported CSS, you can `import 'paris/styles.css'` once at your app root. The
  default (per-component CSS) is recommended and tree-shakeable.
- **React Server Components.** Paris client components ship with their `'use client'`
  directives preserved, so you can import them directly into Server Components.

## Rollback

This is a dependency + config change only. To roll back, restore the previous
`paris` version, re-add `transpilePackages: ['paris']` and `sass`, and revert the
`global.css` → `global.scss` import.

## Done

Report a concise summary of: the new `paris` version, which files you edited
(config, imports, package.json), whether `sass` was removed or kept (and why), and
the result of the build/typecheck.
