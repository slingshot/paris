# AGENTS.md - AI Agent Instructions for Paris

This document provides instructions for AI agents working with the Paris design system repository.

## Project Overview

**Paris** is Slingshot's React design system, designed to work universally across server and client components (RSC-compatible). It provides reusable UI components, design tokens, and theming capabilities for building consistent, accessible, and performant user interfaces.

- **Package name:** `paris`
- **Version:** See `package.json`
- **Homepage:** https://paris.slingshot.fm
- **Repository:** https://github.com/slingshot/paris
- **License:** MIT

### Key Characteristics

- **Unbundled components:** Ships as raw `.tsx` files with SCSS modules (not pre-compiled)
- **Framework:** Optimized for Next.js 14+ with built-in TypeScript and SCSS module support
- **Styling:** Uses SCSS modules (no CSS-in-JS, no Tailwind for component internals)
- **Theming:** Powered by `pte` (Paris Theme Engine) using CSS variables
- **Accessibility:** Built on accessible primitives from Ariakit, Headless UI, and Radix UI
- **Design inspiration:** Uber's Base Web design system

---

## Repository Structure

```
paris/
├── src/
│   ├── stories/           # All components live here
│   │   ├── accordion/     # Each component in its own directory
│   │   ├── avatar/
│   │   ├── button/
│   │   ├── ...
│   │   ├── theme/         # Theming system (tokens, themes, global styles)
│   │   └── utility/       # Utility components and helpers
│   ├── types/             # Shared TypeScript types
│   └── helpers/           # Shared helper functions
├── scripts/               # Build and generation scripts
├── public/                # Static assets (fonts, etc.)
├── .storybook/            # Storybook configuration
├── .changeset/            # Changeset configuration for releases
└── package.json
```

### Component Directory Structure

Each component follows this structure:
```
src/stories/<componentname>/
├── ComponentName.tsx           # Main component file
├── ComponentName.module.scss   # SCSS module styles
├── ComponentName.stories.ts    # Storybook stories
└── index.ts                    # Public exports
```

---

## Available Components

### Layout & Containers
- **Card** - Content container with styling
- **CardButton** - Interactive card variant
- **Dialog** - Modal dialog with backdrop
- **Drawer** - Slide-out panel
- **Popover** - Floating content panel

### Form Inputs
- **Input** - Text input field
- **TextArea** - Multi-line text input
- **Select** - Dropdown/listbox/radio/segmented selection
- **Checkbox** - Checkbox with switch variant
- **Combobox** - Autocomplete input

### Navigation & Actions
- **Button** - Primary action trigger
- **StyledLink** - Styled anchor element
- **Menu** - Dropdown menu
- **Tabs** - Tabbed navigation

### Data Display
- **Text** - Typography component with theme styles
- **Table** - Data table
- **Avatar** - User/entity avatar
- **Tag** - Label/badge component
- **Callout** - Alert/notice box
- **Toast** - Notification toasts

### Feedback & Overlays
- **Accordion** - Collapsible content
- **InformationalTooltip** - Info tooltip with content
- **Tilt** - 3D tilt effect wrapper

### Utilities
- **Field** - Form field wrapper with label/description
- **Icon** - Icon rendering (Close, ChevronLeft, ChevronRight, etc.)
- **Pagination** - Pagination hook
- **Utility** - Helper components (VisuallyHidden, TextWhenString, etc.)

### Theming
- **theme** - Theme definitions, tokens, CSS generation utilities

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Run Storybook development server (port 6006)
pnpm storybook

# Build Storybook for production
pnpm build:storybook

# Create a new component
pnpm create:component ComponentName

# Generate package exports (run after adding components)
pnpm generate:exports

# Run ESLint
pnpm lint

# Publish a release (uses changesets)
pnpm release
```

---

## Code Patterns & Conventions

### Component Pattern

```tsx
'use client'; // Only if component uses client-side features

import type { FC, ReactNode, ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import styles from './ComponentName.module.scss';

export type ComponentNameProps = {
    /** JSDoc description for the prop */
    propName?: string;
    /** The contents of the component */
    children?: ReactNode;
} & ComponentPropsWithoutRef<'div'>; // Extend HTML element props

/**
 * Component description.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { ComponentName } from 'paris/componentname';
 * ```
 * @constructor
 */
export const ComponentName: FC<ComponentNameProps> = ({
    propName,
    children,
    className,
    ...props
}) => (
    <div
        {...props}
        className={clsx(styles.root, className)}
    >
        {children}
    </div>
);
```

### Client vs Server Components

- Use `'use client';` directive only when the component requires:
  - React hooks (useState, useEffect, etc.)
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs
- Omit the directive for purely presentational components (SSR-compatible)

### Styling with SCSS Modules

```scss
// ComponentName.module.scss
@use '../theme/util.scss' as *;

.root {
    // Use pvar() for theme variables
    background-color: pvar(new, colors, backgroundPrimary);
    color: pvar(new, colors, contentPrimary);
    border-radius: pvar(new, borders, radius, rounded);

    // Responsive with container queries
    @container (min-width: 768px) {
        padding: 24px;
    }
}

// State variants using data attributes
.root[data-status="error"] {
    border-color: pvar(new, colors, contentNegative);
}
```

### Overrides Pattern

Many components support an `overrides` prop for customization:

```tsx
export type ComponentProps = {
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        label?: TextProps<'label'>;
        // ... other overridable elements
    }
};
```

### Enhancer Pattern

Used for icons/decorators in buttons, inputs, etc.:

```tsx
import type { Enhancer } from '../../types/Enhancer';

// Enhancer type: ReactNode | (({ size }) => ReactNode)
export type Props = {
    startEnhancer?: Enhancer;
    endEnhancer?: Enhancer;
};
```

### Index Exports

Each component's `index.ts` should export everything:

```tsx
export * from './ComponentName';
```

---

## Theming System

### Theme Structure

The theme is defined in `src/stories/theme/themes.ts` with two variants:
- `LightTheme` - Default light mode
- `DarkTheme` - Dark mode (extends LightTheme)

### Key Theme Namespaces

```typescript
theme.new.colors       // Color tokens (contentPrimary, backgroundPrimary, etc.)
theme.new.typography   // Font definitions (fontFamily, fontWeights, styles)
theme.new.lighting     // Shadows and glows
theme.new.borders      // Border radii and dropdown styling
theme.new.animations   // Timing functions and durations
theme.new.breakpoints  // Responsive breakpoints
theme.new.materials    // Glassmorphic material definitions
```

### Using Theme Values

```tsx
// In TypeScript
import { pvar, pget, theme } from 'paris/theme';

// pvar() returns CSS variable reference: var(--pte-new-colors-contentPrimary)
const color = pvar('new.colors.contentPrimary');

// pget() returns actual value from current theme
const colorValue = pget('new.colors.contentPrimary');

// Direct theme access
const fontSize = theme.new.typography.styles.paragraphMedium.fontSize;
```

### Typography Styles

Available text kinds (use with `<Text kind="...">`:

**Display:** `displayLarge`, `displayMedium`, `display`, `displaySmall`
**Heading:** `headingLarge`, `headingMedium`, `headingSmall`, `headingXSmall`, `headingXXSmall`
**Label:** `labelXLarge`, `labelLarge`, `labelMedium`, `labelSmall`, `labelXSmall`, `labelXXSmall`
**Paragraph:** `paragraphLarge`, `paragraphMedium`, `paragraphSmall`, `paragraphXSmall`, `paragraphXXSmall`

---

## Testing & Quality

### Storybook Stories

Create comprehensive stories for each component:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
    title: 'Category/ComponentName',
    component: ComponentName,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
    args: {
        children: 'Example content',
    },
};

export const Variant: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary variant',
    },
};
```

### ESLint

The project uses `@ssh/eslint-config` with React and TypeScript rules. Key points:
- No unused variables (disabled for flexibility)
- JSX props spreading allowed
- Strict TypeScript checks enabled

---

## Dependencies

### Core Dependencies
- `react` ^18.x (peer)
- `react-dom` ^18.x (peer)
- `sass` ^1.x (peer)
- `typescript` ^5.0 (peer)

### UI Primitives
- `@ariakit/react` - Accessible component primitives
- `@headlessui/react` - Unstyled accessible components
- `@radix-ui/react-checkbox`, `@radix-ui/react-tooltip` - Radix primitives

### Styling & Theming
- `clsx` - Conditional className utility
- `pte` - Paris Theme Engine for CSS variables
- `font-color-contrast` - Auto contrast color calculation

### Animation
- `framer-motion` - Animation library

### Icons
- `@fortawesome/react-fontawesome` - FontAwesome icons

### Utilities
- `react-hot-toast` - Toast notifications
- `react-parallax-tilt` - 3D tilt effect
- `react-tiny-popover` - Popover positioning

---

## Integration Guide (for consumers)

### Installation

```bash
pnpm add paris
# or
npm install paris
```

### Next.js Configuration

```js
// next.config.js
module.exports = {
    transpilePackages: ['paris'],
};
```

### TypeScript Configuration

```json
{
    "compilerOptions": {
        "moduleResolution": "bundler" // or "nodenext" or "node16"
    }
}
```

### Theme Setup

```tsx
// app/layout.tsx
import { generateCSS, theme } from 'paris/theme';
import 'paris/theme/global.scss';

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <style
                    id="pte-vars"
                    dangerouslySetInnerHTML={{ __html: generateCSS(theme) }}
                />
            </head>
            <body className="paris-container">
                {children}
            </body>
        </html>
    );
}
```

### Component Usage

```tsx
import { Button } from 'paris/button';
import { Text } from 'paris/text';
import { Input } from 'paris/input';

export const Example = () => (
    <div>
        <Text kind="headingSmall">Welcome</Text>
        <Input label="Email" type="email" />
        <Button kind="primary">Submit</Button>
    </div>
);
```

---

## Versioning & Releases

The project uses [Changesets](https://github.com/changesets/changesets) for version management:

1. Make changes
2. Run `npx changeset` to create a changeset file
3. Describe changes (patch/minor/major)
4. PR gets merged
5. Release workflow publishes to npm

---

## Common Tasks for AI Agents

### Creating a New Component

1. Run `pnpm create:component ComponentName`
2. Edit the generated files in `src/stories/componentname/`
3. Add props with JSDoc comments
4. Implement styling in the SCSS module using theme variables
5. Create comprehensive Storybook stories
6. Run `pnpm generate:exports` to update package exports

### Modifying an Existing Component

1. Locate component in `src/stories/<componentname>/`
2. Update TypeScript types if changing props
3. Update SCSS module for styling changes
4. Update or add Storybook stories to demonstrate changes
5. Create a changeset with `npx changeset`

### Debugging Theming Issues

1. Check `src/stories/theme/themes.ts` for token definitions
2. Verify CSS variable names match (format: `--pte-<path>`)
3. Ensure `paris/theme/global.scss` is imported
4. Verify `paris-container` class is on root element

### Adding a New Icon

1. Create icon component in `src/stories/icon/IconName.tsx`
2. Export from `src/stories/icon/index.ts`
3. Follow pattern of existing icons (accept `size` prop)

---

## Maintaining Documentation

When making changes to this repository, keep documentation in sync:
- **CLAUDE.md** - Update when changing architecture, patterns, commands, or conventions
- **AGENTS.md** - Update when adding/removing components, changing APIs, or modifying workflows
- **public/llms.txt** - Update when changing component APIs, props, or usage patterns

These files help AI agents work effectively with this codebase. Outdated documentation leads to incorrect suggestions and wasted effort.

## Important Notes for AI Agents

1. **No bundling:** Components ship as source - consumers bundle them
2. **SCSS modules only:** Do not use inline styles, Tailwind, or CSS-in-JS
3. **Accessibility first:** Use semantic HTML and ARIA attributes
4. **Theme variables:** Always use `pvar()` for colors, spacing, etc.
5. **Client directive:** Only add `'use client'` when truly needed
6. **Props spreading:** Support `...props` for flexibility
7. **Overrides pattern:** Consider adding overrides for complex components
8. **JSDoc comments:** Document all props with JSDoc
9. **Node 22+:** Required for development
10. **pnpm:** Package manager (not npm or yarn)
