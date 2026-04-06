# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Paris is Slingshot's React design system. It ships as unbundled `.tsx` components with SCSS modules (not pre-compiled), designed for Next.js 14+ with React 18+ and TypeScript 5+.

## Commands

```bash
bun run storybook           # Run Storybook dev server on port 6006
bun run build:storybook     # Build Storybook for production
bun run create:component Name  # Scaffold a new component
bun run generate:exports    # Regenerate package.json exports after adding components
bun run lint                # Run Biome (lint + format check)
bun run lint:fix            # Auto-fix lint and formatting issues
bun run format              # Format all files
bun run typecheck           # Run TypeScript type checking
```

## Tooling

- **Package manager**: Bun
- **Linting & formatting**: Biome (configured in `biome.json`)
- **Git hooks**: Lefthook (configured in `lefthook.yml`) — runs biome check and CSS var validation on pre-commit, commitlint on commit-msg
- **Commit conventions**: Commitlint with `@commitlint/config-conventional` — all commits must follow conventional commit format

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

**Field Wrapper**: Form inputs (Input, Select, Combobox, TextArea) use the `Field` component for consistent label/description handling.

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

## Maintaining Documentation

When making changes to this repository, update the relevant documentation files:
- `CLAUDE.md` - Update if changing architecture, patterns, commands, or key conventions
- `AGENTS.md` - Update if adding/removing components, changing APIs, or modifying development workflows
- `public/llms.txt` - Update if changing component APIs or usage patterns

## Consumer Integration

Paris requires consumers to:
1. Add `transpilePackages: ['paris']` to next.config.js
2. Set `moduleResolution: "bundler"` in tsconfig
3. Import `paris/theme/global.scss` and inject theme CSS variables
4. Add `className="paris-container"` to root element
