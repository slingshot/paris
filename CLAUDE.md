# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Paris is Slingshot's React design system. It ships as pre-compiled ESM JavaScript with TypeScript declarations (`.d.ts`) and compiled CSS modules, designed for React 18+ projects.

## Commands

```bash
pnpm build               # Build library (JS + types + CSS)
pnpm storybook           # Run Storybook dev server on port 6006
pnpm build:storybook     # Build Storybook for production
pnpm create:component Name  # Scaffold a new component
pnpm generate:exports    # Regenerate package.json exports after adding components
pnpm lint                # Run ESLint
```

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

### Styling

- Use SCSS modules exclusively (no inline styles, no Tailwind)
- Access theme values with `pvar(namespace, ...path)` in SCSS or `pvar('path.to.value')` in TypeScript
- Use data attributes for state variants: `[data-status="error"]`
- Container queries supported via `paris-container` class on root

### Dependencies for UI Primitives

- `@ariakit/react` - Button, other primitives
- `@headlessui/react` - Dialog, Listbox, Menu, RadioGroup, Tabs, Transition
- `@radix-ui/react-checkbox`, `@radix-ui/react-tooltip` - Checkbox, Tooltip

## Maintaining Documentation

When making changes to this repository, update the relevant documentation files:
- `CLAUDE.md` - Update if changing architecture, patterns, commands, or key conventions
- `AGENTS.md` - Update if adding/removing components, changing APIs, or modifying development workflows
- `public/llms.txt` - Update if changing component APIs or usage patterns

## Consumer Integration

Paris requires consumers to:
1. Import `paris/theme/global.css` in the root layout
2. Inject theme CSS variables using `generateCSS(theme)` from `paris/theme`
3. Add `className="paris-container"` to root element

No special bundler configuration is needed - Paris ships pre-compiled.
