# Testing

Paris uses a two-layer testing strategy: fast unit tests via Vitest and browser-based story tests via the Storybook Vitest addon.

## Quick reference

```bash
bun run test                # Unit tests (jsdom, ~5s)
bun run test:watch          # Unit tests in watch mode
bun run test:storybook      # Story tests (Chromium via Playwright)
bun run test:all            # Both unit + story tests
bun run test:coverage       # Unit tests with coverage report
bun run test:coverage-check # Check for missing/stale tests
```

## Architecture

### Unit tests (`--project unit`)

- **Runner:** Vitest with jsdom environment
- **Libraries:** @testing-library/react, @testing-library/user-event, @testing-library/jest-dom
- **Speed:** ~5 seconds for 500+ tests
- **What they catch:** Logic bugs, prop handling, accessibility, event handlers, state management

Each component has a test file alongside its source:

```
src/stories/button/
├── Button.tsx
├── Button.module.scss
├── Button.stories.ts
├── Button.test.tsx        ← unit tests
└── index.ts
```

### Story tests (`--project storybook`)

- **Runner:** Vitest with `@storybook/addon-vitest` plugin
- **Browser:** Chromium via Playwright (headless)
- **What they catch:** Rendering errors, layout issues, CSS regressions, play function assertions

Story tests are auto-generated from existing `.stories.ts` files — no separate test files needed. Every story gets a smoke test (renders without error), and stories with `play` functions have their interactions validated.

## Configuration

### `vitest.config.ts`

Defines two Vitest projects:

1. **`unit`** — jsdom environment, globals enabled, SCSS module support via `classNameStrategy: 'non-scoped'`
2. **`storybook`** — browser environment using Playwright Chromium, driven by `@storybook/addon-vitest` plugin

### `src/test/setup.ts`

Global test setup for unit tests:

- Extends `expect` with jest-dom matchers (`toBeInTheDocument`, `toHaveClass`, etc.)
- Mocks `ResizeObserver` (used by Tilt)
- Mocks `window.matchMedia` (used by @headlessui/react)
- Mocks `IntersectionObserver`

### `src/test/render.tsx`

Custom render helper that wraps Testing Library's `render` with `userEvent.setup()`:

```tsx
import { render, screen, waitFor } from '../../test/render';

it('handles click', async () => {
    const onClick = vi.fn();
    const { user } = render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
});
```

## Writing tests

### Test file location

Always place tests alongside the component: `src/stories/<component>/ComponentName.test.tsx`

### Imports

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/render';
import { ComponentName } from './ComponentName';
```

### What to test

| Category | Examples |
|----------|----------|
| Rendering | Default render, children, conditional content |
| Props/variants | `kind`, `size`, `status`, `shape` — verify class or attribute changes |
| Interactions | Click, type, hover, keyboard navigation |
| Disabled/loading | No interaction, visual indicators |
| Accessibility | `role`, `aria-*`, label association (`getByLabelText`) |
| Forwarding | `className`, `ref`, HTML props |
| Edge cases | Empty content, rapid toggles, boundary values |

### Component-specific patterns

#### HeadlessUI components (Dialog, Drawer, Menu, Select, Combobox, Tabs)

HeadlessUI uses async transitions. Always wrap assertions about opened/closed content in `waitFor`:

```tsx
render(<Dialog isOpen={true} title="Test" onClose={vi.fn()}>Content</Dialog>);
await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

#### Radix components (Checkbox, Tooltip)

Radix renders via Portal to `document.body`. Testing Library's `screen` queries search the full document, so portal content is queryable without extra setup.

#### Tiptap/MarkdownEditor

Mock `@tiptap/react` since ProseMirror requires real DOM measurement APIs unavailable in jsdom. Test the component shell (toolbar, status, structure) rather than editor behavior.

#### Form components (Input, TextArea, Combobox)

Use accessibility queries for reliable tests:

```tsx
render(<Input label="Email" placeholder="you@example.com" />);
const input = screen.getByLabelText('Email');
await user.type(input, 'test@test.com');
expect(input).toHaveValue('test@test.com');
```

## Coverage check script

`scripts/checkTestCoverage.js` compares git timestamps of source files vs test files for every component:

```bash
node scripts/checkTestCoverage.js         # Human-readable output
node scripts/checkTestCoverage.js --json  # JSON output
```

Reports three categories:
- **Missing** — component has no test file
- **Stale** — source files modified more recently than test files
- **Current** — tests are up to date

The `/update-tests` Claude skill uses this script to identify and fix coverage gaps.

## CI

The GitHub Actions workflow (`.github/workflows/check.yml`) runs three parallel jobs:

1. **Lint & Typecheck** — Biome + tsc
2. **Unit Tests** — `bun run test` with structured output parsing
3. **Story Tests** — `bun run test:storybook` with Playwright Chromium

A **Report** job aggregates results into a rich PR comment with:
- Summary table with pass/fail counts and timing
- Collapsible per-component breakdown
- Failed test details shown prominently

## Formatting

Tests follow the same Biome rules as the rest of the codebase:
- Single quotes, trailing commas, semicolons
- 4-space indent, 120 character line width
- Run `bun run lint:fix` to auto-format
