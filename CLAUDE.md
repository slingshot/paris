# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Paris is Slingshot's React design system. It is authored as `.tsx` components with SCSS modules and **compiled (via Vite) to precompiled ESM in `dist/`** — with per-component extracted CSS, preserved `'use client'` directives, and per-file `.d.ts`. It targets Next.js 14+ (App Router / RSC) and Vite React, with React 19 and TypeScript 5+. Consumers need no `transpilePackages` and no Sass toolchain.

## Commands

```bash
bun run build               # Compile the library to dist/ (ESM + extracted CSS + .d.ts)
bun run storybook           # Run Storybook dev server on port 6006
bun run build:storybook     # Build Storybook for production
bun run build:site          # Build the docs site (Next.js)
bun run create:component Name  # Scaffold a new component
bun run generate:exports    # Regenerate package.json exports after adding components
bun run lint                # Run Biome (lint + format check)
bun run lint:fix            # Auto-fix lint and formatting issues
bun run format              # Format all files
bun run typecheck           # Run TypeScript type checking
```

The `build` pipeline is `generate:exports` → `vite build` (see `vite.config.ts`) → `scripts/postbuild.mjs`, which: (1) renames each extracted `*.module.css` → plain `*.css` and rewrites the JS side-effect imports to match — critical so consumer bundlers (Next.js/Vite) don't re-scope Paris's already-hashed `paris_*` class names; (2) compiles `theme/global.scss` → `dist/.../global.css`; (3) writes an aggregate `dist/styles.css`. It runs automatically on publish via `prepack`. `dist/` is git-ignored.

## Tooling

- **Package manager**: Bun
- **Linting & formatting**: Biome (configured in `biome.json`)
- **Git hooks**: Lefthook (configured in `lefthook.yml`) — runs biome check and CSS var validation on pre-commit, commitlint on commit-msg
- **Commit conventions**: Commitlint with `@commitlint/config-conventional` — all commits must follow conventional commit format
- **Dependency updates**: Dependabot (configured in `.github/dependabot.yml`) — weekly grouped version updates for npm and GitHub Actions

### Dependabot caveats

Two non-obvious constraints govern `.github/dependabot.yml`:

1. **Bun has no ecosystem of its own.** It is handled by `package-ecosystem: npm`, which reads the text-based `bun.lock` (the legacy binary `bun.lockb` is unsupported). Dependabot *version* updates support Bun; *security* updates do **not** yet. So a Dependabot security alert on a runtime dependency will never produce a fix PR on its own and must be bumped by hand — the weekly version updates are what sweep such fixes up in practice.
2. **A dependency joins the first group whose patterns match it.** Version-locked families (`@tiptap/*`, `@storybook/*`, `@fortawesome/*`, `@radix-ui/*`, `@commitlint/*`, React, the test stack) are therefore listed *above* the `patterns: ['*']` catch-alls; reordering them collapses everything into one bucket. Those families intentionally omit `update-types` so they capture majors too and always move in lockstep.

`versioning-strategy: increase-if-necessary` is set because Paris is a published library: a range is only edited when it genuinely cannot admit the new version, so consumers' resolvable range is never narrowed needlessly.

### CI test reporting

`.github/workflows/check.yml` posts a PR comment summarising both test jobs. The counts come from Vitest's **JSON reporter**, parsed by `scripts/ciTestSummary.mjs`, which writes the step outputs the comment job reads.

**Never parse Vitest's terminal output to get these numbers.** Vitest colourises in CI — picocolors enables colour whenever `$CI` is set, with or without a TTY — so the summary lines are full of ANSI escapes. `grep`-based parsing silently reported `0 tests` for every run: `^\s+Tests` cannot match a line whose first byte is `ESC`, `\s` cannot cross an escape sequence (`Duration \e[22m 13.12s`, `505\e[2mms`), and per-file lines carry a project badge (` ✓  unit  src/foo.test.tsx`) that defeats `(✓|×)\s+src/`.

Each test job therefore runs `--reporter=default --reporter=json --outputFile.json=<file>` — the default reporter keeps the log readable, the JSON reporter feeds the summary. `scripts/ciTestSummary.mjs` is covered by `scripts/ciTestSummary.test.mjs` (the `unit` project includes `scripts/**/*.test.mjs`). Two traps it encodes: `numTotalTestSuites` counts `describe` blocks, not files — use `testResults.length`; and the report has no top-level duration, so it is derived from `startTime` to the last `endTime`.

## Architecture

### Component Structure

Every component lives in `src/stories/<componentname>/` with four files:
- `ComponentName.tsx` - Component implementation
- `ComponentName.module.scss` - Styles using theme variables
- `ComponentName.stories.ts` - Storybook stories
- `index.ts` - Exports

### Theming System

The theme engine (`pte`) generates CSS variables from TypeScript theme definitions:

- `src/stories/theme/tokens.ts` - Raw color values (`Colors`, `ColorsNew`)
- `src/stories/theme/themes.ts` - Complete theme definitions (`LightTheme`, `DarkTheme`)
- Theme values accessed via `pvar('new.colors.contentPrimary')` which returns `var(--pte-new-colors-contentPrimary)`

### Key Patterns

**Client Directive**: Only add `'use client'` when component uses hooks, event handlers, or browser APIs.

**Enhancer Pattern**: Icons/decorators use `Enhancer` type - either a ReactNode or function `({ size }) => ReactNode`.

**Overrides Pattern**: Complex components accept `overrides` prop with element-specific props for customization.

**Field Wrapper**: Form inputs (Input, Select, Combobox, TextArea, PhoneInput) use the `Field` component for consistent label/description handling.

**Generic Option Components**: `Select`, `Combobox`, and `AccordionSelect` are generic over their option `metadata` and `id` types (`Option<T, Id>`); with literal-id `options`, `value` and the selected option's `id` narrow to that union (`Id` defaults to `string`). Their `onChange` returns the full selected option(s) with typed `metadata` (not just the id). Because `forwardRef` erases generics, these components cast their `forwardRef` export back to a generic function type so `<Select<MyMeta> />` keeps working — follow that pattern when adding a generic + ref-forwarding component. `Tabs` is generic over an optional per-tab `id` passed to `onTabChange`.

**Form Focus & Error State**: form inputs forward a `ref` to a focusable element for `react-hook-form` `setFocus` (the ref target must stay mounted and focusable — e.g. `Select`'s radio/card/segmented groups carry `tabIndex={-1}`, and `Combobox` falls back to its container when the input unmounts). Components without a DOM input (`MarkdownEditor`) expose an imperative `{ focus() }` handle via `useImperativeHandle` instead. Field-like components take `status?: 'default' | 'error'` and render error state via a `data-status="error"` attribute styled in SCSS.

### Z-Index Layering

Global z-index values use semantic layer tokens defined in `Theme.new.layers`:

| Token | Value | Usage |
|-------|-------|-------|
| `below` | -1 | Decorative pseudo-elements behind content |
| `sticky` | 100 | Sticky headers/bars (e.g. GlassTabs) |
| `dropdown` | 200 | Floating dropdowns, select menus |
| `overlay` | 300 | Full-page overlays (Dialog, Drawer) |
| `popover` | 400 | Popovers above overlays |
| `menu` | 500 | Context menus, always topmost |

In SCSS: `z-index: var(--pte-new-layers-overlay);`

**Local vs global**: When a z-index only controls stacking within a single component (e.g. text above background in SegmentedControl), use a hardcoded `z-index: 1` and add `isolation: isolate` to the parent to prevent it from leaking into the global stacking order. Only use layer tokens for elements that participate in page-level stacking.

### Styling

- Use SCSS modules exclusively (no inline styles, no Tailwind)
- Access theme values with `pvar(namespace, ...path)` in SCSS or `pvar('path.to.value')` in TypeScript
- Use data attributes for state variants: `[data-status="error"]`
- Container queries supported via `paris-container` class on root

**Compound Component Pattern**: `MarkdownEditor` uses React context to share editor state with composable toolbar children (`FixedToolbar`, `FloatingToolbar`). Features are gated via the `features` prop.

### Dependencies for UI Primitives

- `@ariakit/react` - Button, other primitives
- `@headlessui/react` - Dialog, Listbox, Menu, RadioGroup, Tabs, Transition
- `@radix-ui/react-checkbox`, `@radix-ui/react-tooltip` - Checkbox, Tooltip
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/markdown` - MarkdownEditor
- `lucide-react` - MarkdownEditor toolbar icons
- `libphonenumber-js` (`/min` entry) - PhoneInput parsing, validation, and formatting

## Maintaining Documentation

When making changes to this repository, update the relevant documentation files:
- `CLAUDE.md` - Update if changing architecture, patterns, commands, or key conventions
- `AGENTS.md` - Update if adding/removing components, changing APIs, or modifying development workflows
- `public/llms.txt` - Update if changing component APIs or usage patterns

## Consumer Integration

Paris ships precompiled, so consumers only need to:
1. Set `moduleResolution: "bundler"` (or `nodenext`) in tsconfig
2. Import `paris/theme/global.css` and inject theme CSS variables (via `generateCSS` / `generateThemeInjection` from `paris/theme`)
3. Add `className="paris-container"` to the root element

No `transpilePackages` and no `sass` dependency are required — each component auto-imports its own extracted CSS. Verified against Next.js App Router (Server Components) and Vite React. Consumers upgrading from the old unbundled model should remove `transpilePackages: ['paris']`, drop the `sass` dependency, and change `paris/theme/global.scss` → `paris/theme/global.css`.
