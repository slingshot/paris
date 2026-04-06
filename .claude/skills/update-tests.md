---
description: Check test coverage gaps and update/create tests for components that are missing tests or have stale tests (source changed after tests were last updated).
user_invocable: true
---

# /update-tests

You are updating the test suite for the Paris design system. Follow these steps exactly.

## Step 1: Run the coverage check script

Run the helper script to identify components that need test attention:

```bash
node scripts/checkTestCoverage.js
```

This script compares git timestamps of source files vs test files for every component in `src/stories/`. It reports:
- **Missing**: Components with no test file at all
- **Stale**: Components where source files were modified more recently than test files
- **Current**: Components with up-to-date tests

Also run with `--json` to get structured output for programmatic use:

```bash
node scripts/checkTestCoverage.js --json
```

## Step 2: For each component that needs attention

### If tests are MISSING (no test file exists):

1. Read the component source file(s) in `src/stories/<component>/`
2. Read the component's stories file for usage examples
3. Create `src/stories/<component>/ComponentName.test.tsx`
4. Import `render`, `screen`, and other helpers from `../../test/render`
5. Write comprehensive tests covering:
   - Default rendering
   - All prop variants (kind, size, status, etc.)
   - User interactions (click, type, hover) using `user` from render helper
   - Disabled/loading states
   - Accessibility (roles, aria attributes, label association)
   - className forwarding
   - Ref forwarding (if component uses forwardRef)
   - Edge cases

### If tests are STALE (source changed after tests):

1. Read the component source file to understand what changed
2. Use `git diff` or `git log` on the source files to see the specific changes since the test was last updated
3. Read the existing test file
4. Update or add tests to cover the new/changed functionality
5. Do NOT rewrite tests that still validly cover unchanged behavior

## Step 3: Verify

After writing/updating tests:

```bash
bun run test          # Run unit tests (must all pass)
bun run lint          # Must pass (fix with bun run lint:fix if needed)
```

## Testing conventions

- **Test file location**: `src/stories/<component>/ComponentName.test.tsx` (alongside source)
- **Import render helper**: `import { render, screen, waitFor } from '../../test/render';`
- **Mock functions**: Use `vi.fn()` (Vitest globals are available)
- **Async HeadlessUI components**: Wrap assertions in `waitFor(() => { ... })` for Dialog, Drawer, Menu, Select, Combobox, Tabs
- **Radix components**: Content renders via Portal — `screen` queries search the full document
- **Tiptap/MarkdownEditor**: Mock `@tiptap/react` since ProseMirror needs real DOM APIs
- **Formatting**: Single quotes, trailing commas, semicolons, 4-space indent, 120 char line width (Biome enforced)

## Example test structure

```tsx
import { describe, expect, it, vi } from 'vitest';
import { ComponentName } from './ComponentName';
import { render, screen } from '../../test/render';

describe('ComponentName', () => {
    it('renders children', () => {
        render(<ComponentName>Hello</ComponentName>);
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('applies variant class', () => {
        const { container } = render(<ComponentName kind="secondary">Test</ComponentName>);
        expect(container.firstChild).toHaveClass('secondary');
    });

    it('fires onClick', async () => {
        const onClick = vi.fn();
        const { user } = render(<ComponentName onClick={onClick}>Click me</ComponentName>);
        await user.click(screen.getByText('Click me'));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
```
