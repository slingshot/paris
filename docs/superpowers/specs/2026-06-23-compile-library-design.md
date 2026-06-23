# Design: Compile Paris components (replace unbundled `.tsx` shipping)

**Date:** 2026-06-23
**Status:** Approved (design); pending implementation plan
**Author:** Sanil Chawla (with Claude)

## Problem

Paris currently ships **unbundled source**: `package.json#exports` map each subpath
(`paris/button`) directly to `./src/stories/<name>/index.ts`, and `files` includes
`src`. Consumers must:

1. Add `transpilePackages: ['paris']` to `next.config.js`
2. Provide `sass` themselves (it is a `peerDependency`)
3. Set `moduleResolution: "bundler"`
4. Import `paris/theme/global.scss` (a raw, uncompiled SCSS entrypoint)

This couples Paris to each consumer's build pipeline, forces a SCSS toolchain on
every consumer, and is brittle across frameworks. The goal is to **precompile
components to `dist/`** so Paris ships ready-to-run ESM + extracted CSS + types,
and works in **Next.js (App Router / RSC)** and **Vite React** with no special
consumer build config.

## Current state (facts that shape the design)

- **32 component directories** under `src/stories/`, each with `index.ts`,
  `Component.tsx`, `Component.module.scss`, `Component.stories.ts`.
- **Every component has a `.module.scss` and a `'use client'` directive**
  (32 of each). Styling is **100% SCSS-modules + CSS custom properties**
  (`var(--pte-*)`). There is **no runtime CSS-in-JS** (no JSS in component code).
- A shared **`Typography.module.css`** (note: `.css`, not `.scss`) is imported by
  ~6 components (`text`, `tabs`, `toast`, `popover`, `table`, `tag`). The toolchain
  must handle both `.module.scss` and `.module.css`.
- **Heavy cross-component imports** via relative paths: `../text` (19), `../icon`
  (13), `../utility` (11), `../theme` (11), `../button` (9), `../field` (6), etc.
  The `paris/...` imports that appear in source are **only inside JSDoc comments and
  `.mdx` files** — not real runtime imports.
- **`pte`** is the only styling runtime dependency, imported only by
  `src/stories/theme/`. `pvar()` returns `var(--pte-*)` strings; this is plain JS
  and is unaffected by compilation.
- An existing `tsup.config.ts` is **stale and broken** for this purpose: it lists
  ~17 of 32 entries and uses `loader: { '.module.scss': 'file' }`, which copies SCSS
  as an opaque asset (so `styles.button` would be `undefined`). It will be removed.
- `next.config.js` (`basePath: '/src'`) and `src/pages`, `src/styles` belong to the
  **docs/Storybook site**, not the published library. They are out of scope except
  where the build script changes.

## Decisions (locked with user)

| Decision | Choice |
|---|---|
| Toolchain | **Vite library build** (Rollup under the hood) |
| Output format | **ESM-only** (+ `.d.ts`) |
| CSS delivery | **Per-component, auto-imported** as side-effect `import './X.css'` |
| Migration | **Compiled-only**; stop shipping raw source |

## Architecture

### Output model: `preserveModules` (1 source file → 1 output file)

Do **not** bundle into per-entry blobs (that would duplicate `Text`/`Icon`/etc. into
every consumer entry and break tree-shaking). Instead drive Rollup with
`output.preserveModules: true` + `preserveModulesRoot: 'src'`, so:

```
src/stories/button/Button.tsx   → dist/stories/button/Button.js  (+ .d.ts)
src/stories/button/index.ts     → dist/stories/button/index.js   (+ .d.ts)
src/stories/button/Button.module.scss → dist/stories/button/Button.css
```

Cross-component relative imports stay as imports in the output graph (no
duplication), output is tree-shakeable, and CSS extracts naturally per module.

We use `rollupOptions.input` as a **glob of every published entrypoint** (each
`src/stories/*/index.ts` plus `theme`) rather than `build.lib`'s single-bundle mode,
because `build.lib` fights `preserveModules`.

### Toolchain / Vite config

- **`@vitejs/plugin-react`** — TSX → JS (automatic JSX runtime; matches
  `tsconfig` `jsx: react-jsx`).
- **Native Vite SCSS + CSS Modules** — no extra plugin. Hashes class names, emits
  the JS name map (`styles.button`), extracts CSS. Requires `sass` as a **dev**
  dependency only (already present).
- **`build.cssCodeSplit: true`** — per-module `.css`, auto-injected as
  `import './X.css'` into the JS module that used it.
- **`rollup-preserve-directives`** — hoists `'use client'` to the top of each output
  file so RSC boundaries survive compilation. (New devDependency.)
- **`vite-plugin-dts`** — per-file `.d.ts` emit (`rollupTypes: false`,
  `entryRoot: 'src'`) so declarations mirror the `preserveModules` layout. (New
  devDependency.)
- **Externalization** — a `external` regex marks all `dependencies` +
  `peerDependencies` (react, react-dom, @ariakit/react, @headlessui/react, @radix-ui/*,
  @tiptap/*, framer-motion, lucide-react, clsx, **pte**, react-hot-toast,
  react-markdown, react-tiny-popover, rehype-raw, remark-gfm, ts-deepmerge,
  font-color-contrast, @fortawesome/*, @emotion/is-prop-valid, @ssh/csstypes) plus
  their deep sub-paths. Only Paris's own code is compiled. CSS is **not** externalized.

### CSS + theme handling

- **Component CSS:** per-file, auto-imported. Add to `package.json`:
  `"sideEffects": ["**/*.css", "**/*.scss"]` so consumer bundlers (Next/Webpack/Turbopack,
  Vite/Rollup) never drop the side-effect CSS imports during tree-shaking.
- **Global/theme CSS:** `src/stories/theme/global.scss` (which `@use`s
  `tw-preflight.css` and `util.scss`) is **precompiled** to
  `dist/stories/theme/global.css`. Consumers import `paris/theme/global.css` and **no
  longer need `sass`**.
- **`pte`/`pvar`** are runtime JS, untouched — still emit `var(--pte-*)` strings.
  Theme TS (`themes.ts`, `tokens.ts`, `index.ts`) compiles like any other module;
  `pte` stays external.

### `package.json` changes

- **`exports`:** each subpath repoints to compiled output, with conditions:
  ```jsonc
  "./button": {
    "types": "./dist/stories/button/index.d.ts",
    "import": "./dist/stories/button/index.js"
  }
  ```
  Add `"./theme/global.css": "./dist/stories/theme/global.css"` and an aggregate
  `"./styles.css": "./dist/styles.css"` (a concatenation of all component CSS — cheap
  insurance / opt-in single-import path). The `./*` raw-source wildcard is removed.
- **`generateExports.js`** is rewritten to emit the compiled-target map above
  (still derived by scanning `src/stories/`).
- **`files`:** `["dist", "README.md", "CHANGELOG.md"]` (drop `src`, `src/stories`).
- **`sass`** moves from `peerDependencies` → `devDependencies` (consumers no longer
  need it).
- **`main`/`module`/`types`** top-level fields point at a root barrel if one is
  desired; otherwise rely on subpath exports. (Decide in plan; subpath-only is fine.)
- **`scripts.build`** → `vite build` (with dts). `next build` is moved to a separate
  `build:site` script for the docs site. A `prepack`/release step runs the library
  build so `dist` is always fresh on publish.
- **`type": "module"`** is set (ESM-only output).

### Consumer migration (the Next + Vite payoff)

Same imports (`import { Button } from 'paris/button'`). Consumers:
- **Delete** `transpilePackages: ['paris']` from `next.config.js`.
- **Delete** the `sass` dependency (unless used elsewhere).
- Change **one** import: `paris/theme/global.scss` → `paris/theme/global.css`.
- `moduleResolution: "bundler"` still recommended (for `exports` conditions) but a
  modern default.

No component-code changes. Works in Next App Router (RSC + preserved `'use client'`)
and Vite React with no special config.

## Risks & verification

**Primary risk:** Vite library build + `preserveModules` + `cssCodeSplit` must
actually **inject the per-component `import './X.css'`** statements into each JS
module. This has historically been finicky in Vite lib mode. The build is not
"done" until proven against real consumers.

**Hard verification gate (blocks completion):** After building `dist`, smoke-test it
against **two throwaway consumer apps** that install Paris from the local `dist`
(via `file:` or `npm pack`):

1. **Next.js 16 App Router** — a Server Component page that renders a Paris client
   component (`Button`) plus a server-safe one (`Text`); assert it builds, renders,
   `'use client'` is present in the shipped file, and **styles apply** (computed
   style reflects a `.module.scss` rule).
2. **Vite React** — render the same; assert build + styles + types.

Assertions: (a) components render, (b) component CSS is present/applied (not dropped,
not missing), (c) `paris/theme/global.css` loads without a SCSS toolchain, (d)
TypeScript resolves types via the `exports` `types` condition.

**Fallback:** if per-component auto-injection misbehaves, switch CSS delivery to the
**single combined `paris/styles.css`** (already emitted per §package.json) as the
documented primary path, and have components not rely on side-effect CSS imports.

**Secondary hazards to audit (per-component, in the plan's audit phase):** dynamic
imports, SVG/asset imports, `@fortawesome` icon usage, the `.module.css` vs
`.module.scss` mix, any circular dependencies between components, `framer-motion`/
`@tiptap` client-only modules, and any file that imports from `pte` directly.

## Documentation to update

- `CLAUDE.md` — "Consumer Integration" + Architecture/Project Overview ("ships as
  unbundled `.tsx`" is no longer true).
- `AGENTS.md` — build/dev workflow + any consumption notes.
- `public/llms.txt` — consumption/usage section.
- `README.md` — install/setup instructions.

## Out of scope

- The docs/Storybook site itself (kept on Next/Vite-Storybook; only its build script
  is renamed).
- Any component API or behavior change.
- CJS output (explicitly excluded; ESM-only).
- Publishing/release-process changes beyond ensuring `dist` is built before publish.

## Execution (ultracode workflow)

A multi-agent Workflow runs in phases, with the user in the loop between them:

1. **Audit** — parallel agents sweep all 32 components for the compile hazards above;
   produce a structured hazard list.
2. **Configure** — author `vite.config.ts` (lib/preserveModules/dts/directives/
   externals), rewrite `generateExports.js`, update `package.json`, remove
   `tsup.config.ts`.
3. **Build + verify** — run the build; scaffold + run the two consumer smoke tests;
   gate on all assertions.
4. **Review + docs** — adversarial review of config correctness and exports map;
   update `CLAUDE.md`, `AGENTS.md`, `llms.txt`, `README.md`.
