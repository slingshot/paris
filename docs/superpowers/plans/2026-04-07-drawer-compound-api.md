# Drawer Compound Component API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compound component API to the Drawer component with slot components (`DrawerTitle`, `DrawerActions`, `DrawerBottomPanel`), context hooks (`useDrawer`, `useDrawerPagination`, `useIsPageActive`), `DrawerPage` wrapper with lazy mount, `onAfterClose` callback, and `mode="append"` with priority ordering.

**Architecture:** Slot components use `createPortal` to render into ref-targeted containers in the Drawer DOM, preserving React tree ancestry (form context, etc.). Each `DrawerPage` is wrapped in a `DrawerPageContext` that tracks active state. Slot components check `isActive` before portaling. The Drawer provides context layers for drawer state, pagination, slots, and page state.

**Tech Stack:** React 18, TypeScript 5, HeadlessUI (`@headlessui/react`), SCSS modules, Vitest + Testing Library

**Spec:** `docs/superpowers/specs/2026-04-07-drawer-pagination-api-design.md`

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `src/stories/drawer/DrawerContext.tsx` | Drawer state context (`useDrawer` hook) |
| `src/stories/drawer/DrawerPaginationContext.tsx` | Pagination context (`useDrawerPagination` hook) |
| `src/stories/drawer/DrawerPageContext.tsx` | Per-page active state (`useIsPageActive` hook) |
| `src/stories/drawer/DrawerSlotContext.tsx` | Slot refs, registration, append/priority state |
| `src/stories/drawer/DrawerPage.tsx` | Page wrapper with lazy mount support |
| `src/stories/drawer/DrawerTitle.tsx` | Title slot component (createPortal-based) |
| `src/stories/drawer/DrawerActions.tsx` | Actions slot component (createPortal-based) |
| `src/stories/drawer/DrawerBottomPanel.tsx` | Bottom panel slot with mode/priority (createPortal-based) |

### Modified Files
| File | Changes |
|------|---------|
| `src/stories/drawer/Drawer.tsx` | Add context providers, slot ref containers, DrawerPage rendering, `onAfterClose` prop |
| `src/stories/drawer/Drawer.module.scss` | Add styles for hidden pages and slot containers |
| `src/stories/drawer/Drawer.test.tsx` | Add tests for all new features |
| `src/stories/drawer/Drawer.stories.tsx` | Add stories demonstrating compound API |
| `src/stories/drawer/index.ts` | Add new exports |

---

### Task 1: DrawerContext — `useDrawer` hook

**Files:**
- Create: `src/stories/drawer/DrawerContext.tsx`
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';
import { getCloseButton, render, screen, waitFor } from '../../test/render';
import { Drawer } from './Drawer';
import { useDrawer } from './DrawerContext';

// ... existing tests ...

describe('useDrawer', () => {
    it('provides close and isOpen to children', async () => {
        const onClose = vi.fn();
        const TestChild = () => {
            const { close, isOpen } = useDrawer();
            return (
                <div>
                    <span data-testid="is-open">{String(isOpen)}</span>
                    <button type="button" onClick={close} data-testid="context-close">
                        Close via context
                    </button>
                </div>
            );
        };

        render(
            <Drawer isOpen={true} title="Test" onClose={onClose}>
                <TestChild />
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('is-open')).toHaveTextContent('true');
        });

        const { user } = render(<div />); // get user for clicking
        await screen.getByTestId('context-close').click();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: FAIL — `useDrawer` does not exist

- [ ] **Step 3: Create DrawerContext**

Create `src/stories/drawer/DrawerContext.tsx`:

```tsx
'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

type DrawerContextValue = {
    close: () => void;
    isOpen: boolean;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export const useDrawer = (): DrawerContextValue => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawer must be used within a <Drawer>');
    }
    return context;
};

export const DrawerProvider = ({
    close,
    isOpen,
    children,
}: DrawerContextValue & { children: ReactNode }) => {
    const value = useMemo(() => ({ close, isOpen }), [close, isOpen]);
    return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};
```

- [ ] **Step 4: Wire DrawerProvider into Drawer.tsx**

In `src/stories/drawer/Drawer.tsx`, add the import and wrap the Dialog content:

Add import at top:
```tsx
import { DrawerProvider } from './DrawerContext';
```

Wrap the `<Dialog>` children in `<DrawerProvider>` after the `<Dialog>` opening tag:
```tsx
<Dialog
    as="div"
    className={clsx(styles.root, overrides?.dialog?.className)}
    onClose={onClose}
    {...overrides?.dialog}
    role="dialog"
>
    <DrawerProvider close={() => onClose(false)} isOpen={isOpen}>
        {/* ... existing Dialog children ... */}
    </DrawerProvider>
</Dialog>
```

Close the `</DrawerProvider>` before `</Dialog>`.

- [ ] **Step 5: Run test to verify it passes**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/stories/drawer/DrawerContext.tsx src/stories/drawer/Drawer.tsx src/stories/drawer/Drawer.test.tsx
git commit -m "feat(drawer): add DrawerContext and useDrawer hook"
```

---

### Task 2: DrawerPaginationContext — `useDrawerPagination` hook

**Files:**
- Create: `src/stories/drawer/DrawerPaginationContext.tsx`
- Modify: `src/stories/drawer/Drawer.tsx`
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
import { useDrawerPagination } from './DrawerPaginationContext';
import { usePagination } from '../pagination';

describe('useDrawerPagination', () => {
    it('provides pagination state to children', async () => {
        const TestChild = () => {
            const pagination = useDrawerPagination();
            return <span data-testid="current-page">{pagination?.currentPage}</span>;
        };

        const Wrapper = () => {
            const pages = ['a', 'b'] as const;
            const pagination = usePagination<typeof pages>('a');
            return (
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                    <div key="a"><TestChild /></div>
                    <div key="b">Page B</div>
                </Drawer>
            );
        };

        render(<Wrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('current-page')).toHaveTextContent('a');
        });
    });

    it('returns null when no pagination is provided', async () => {
        const TestChild = () => {
            const pagination = useDrawerPagination();
            return <span data-testid="has-pagination">{String(pagination !== null)}</span>;
        };

        render(
            <Drawer isOpen={true} title="Test" onClose={vi.fn()}>
                <TestChild />
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('has-pagination')).toHaveTextContent('false');
        });
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: FAIL — `useDrawerPagination` does not exist

- [ ] **Step 3: Create DrawerPaginationContext**

Create `src/stories/drawer/DrawerPaginationContext.tsx`:

```tsx
'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { PaginationState } from '../pagination';

const DrawerPaginationContext = createContext<PaginationState | null>(null);

export const useDrawerPagination = (): PaginationState | null =>
    useContext(DrawerPaginationContext);

export const DrawerPaginationProvider = ({
    pagination,
    children,
}: {
    pagination: PaginationState | null;
    children: ReactNode;
}) => (
    <DrawerPaginationContext.Provider value={pagination}>
        {children}
    </DrawerPaginationContext.Provider>
);
```

- [ ] **Step 4: Wire DrawerPaginationProvider into Drawer.tsx**

In `src/stories/drawer/Drawer.tsx`, add the import:
```tsx
import { DrawerPaginationProvider } from './DrawerPaginationContext';
```

Wrap inside `<DrawerProvider>`:
```tsx
<DrawerProvider close={() => onClose(false)} isOpen={isOpen}>
    <DrawerPaginationProvider pagination={pagination ?? null}>
        {/* ... existing content ... */}
    </DrawerPaginationProvider>
</DrawerProvider>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/stories/drawer/DrawerPaginationContext.tsx src/stories/drawer/Drawer.tsx src/stories/drawer/Drawer.test.tsx
git commit -m "feat(drawer): add DrawerPaginationContext and useDrawerPagination hook"
```

---

### Task 3: DrawerPageContext — `useIsPageActive` hook

**Files:**
- Create: `src/stories/drawer/DrawerPageContext.tsx`
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
import { useIsPageActive, DrawerPageProvider } from './DrawerPageContext';

describe('useIsPageActive', () => {
    it('returns true when page is active', async () => {
        const TestChild = () => {
            const isActive = useIsPageActive();
            return <span data-testid="is-active">{String(isActive)}</span>;
        };

        render(
            <DrawerPageProvider isActive={true} pageID="test">
                <TestChild />
            </DrawerPageProvider>,
        );

        expect(screen.getByTestId('is-active')).toHaveTextContent('true');
    });

    it('returns false when page is not active', async () => {
        const TestChild = () => {
            const isActive = useIsPageActive();
            return <span data-testid="is-active">{String(isActive)}</span>;
        };

        render(
            <DrawerPageProvider isActive={false} pageID="test">
                <TestChild />
            </DrawerPageProvider>,
        );

        expect(screen.getByTestId('is-active')).toHaveTextContent('false');
    });

    it('returns true when used outside DrawerPageProvider (implicit active)', () => {
        const TestChild = () => {
            const isActive = useIsPageActive();
            return <span data-testid="is-active">{String(isActive)}</span>;
        };

        render(<TestChild />);

        expect(screen.getByTestId('is-active')).toHaveTextContent('true');
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: FAIL — `useIsPageActive` does not exist

- [ ] **Step 3: Create DrawerPageContext**

Create `src/stories/drawer/DrawerPageContext.tsx`:

```tsx
'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

type DrawerPageContextValue = {
    isActive: boolean;
    pageID: string;
};

const DrawerPageContext = createContext<DrawerPageContextValue | null>(null);

/**
 * Returns whether the current DrawerPage is active.
 * Returns true when used outside a DrawerPageProvider (implicit always-active).
 */
export const useIsPageActive = (): boolean => {
    const context = useContext(DrawerPageContext);
    return context?.isActive ?? true;
};

export const useDrawerPageContext = (): DrawerPageContextValue | null =>
    useContext(DrawerPageContext);

export const DrawerPageProvider = ({
    isActive,
    pageID,
    children,
}: {
    isActive: boolean;
    pageID: string;
    children: ReactNode;
}) => {
    const value = useMemo(() => ({ isActive, pageID }), [isActive, pageID]);
    return <DrawerPageContext.Provider value={value}>{children}</DrawerPageContext.Provider>;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/stories/drawer/DrawerPageContext.tsx src/stories/drawer/Drawer.test.tsx
git commit -m "feat(drawer): add DrawerPageContext and useIsPageActive hook"
```

---

### Task 4: DrawerSlotContext — slot registration and refs

**Files:**
- Create: `src/stories/drawer/DrawerSlotContext.tsx`
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Create DrawerSlotContext**

This context manages refs to slot containers and tracks which slots are registered (so the Drawer knows when to show fallback props vs portal targets).

Create `src/stories/drawer/DrawerSlotContext.tsx`:

```tsx
'use client';

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
    type RefObject,
} from 'react';

type BottomPanelEntry = {
    id: string;
    mode: 'replace' | 'append';
    priority: number;
};

type DrawerSlotContextValue = {
    titleRef: RefObject<HTMLDivElement | null>;
    actionsRef: RefObject<HTMLDivElement | null>;
    bottomPanelRef: RefObject<HTMLDivElement | null>;

    hasTitleSlot: boolean;
    hasActionsSlot: boolean;

    /** Whether a replace-mode bottom panel is registered */
    hasBottomPanelReplace: boolean;
    /** Sorted list of append-mode bottom panel entries */
    bottomPanelAppendEntries: BottomPanelEntry[];

    registerTitleSlot: () => () => void;
    registerActionsSlot: () => () => void;
    registerBottomPanel: (entry: BottomPanelEntry) => () => void;
};

const DrawerSlotContext = createContext<DrawerSlotContextValue | null>(null);

export const useDrawerSlotContext = (): DrawerSlotContextValue | null =>
    useContext(DrawerSlotContext);

export const DrawerSlotProvider = ({ children }: { children: ReactNode }) => {
    const titleRef = useRef<HTMLDivElement | null>(null);
    const actionsRef = useRef<HTMLDivElement | null>(null);
    const bottomPanelRef = useRef<HTMLDivElement | null>(null);

    const [titleSlotCount, setTitleSlotCount] = useState(0);
    const [actionsSlotCount, setActionsSlotCount] = useState(0);
    const [bottomPanelEntries, setBottomPanelEntries] = useState<BottomPanelEntry[]>([]);

    const registerTitleSlot = useCallback(() => {
        setTitleSlotCount((c) => {
            if (c > 0 && process.env.NODE_ENV === 'development') {
                console.warn('Drawer: Multiple <DrawerTitle> components are active simultaneously. The last one mounted will be displayed.');
            }
            return c + 1;
        });
        return () => setTitleSlotCount((c) => c - 1);
    }, []);

    const registerActionsSlot = useCallback(() => {
        setActionsSlotCount((c) => {
            if (c > 0 && process.env.NODE_ENV === 'development') {
                console.warn('Drawer: Multiple <DrawerActions> components are active simultaneously. The last one mounted will be displayed.');
            }
            return c + 1;
        });
        return () => setActionsSlotCount((c) => c - 1);
    }, []);

    const registerBottomPanel = useCallback((entry: BottomPanelEntry) => {
        setBottomPanelEntries((prev) => {
            if (entry.mode === 'replace' && prev.some((e) => e.mode === 'replace') && process.env.NODE_ENV === 'development') {
                console.warn('Drawer: Multiple <DrawerBottomPanel mode="replace"> components are active simultaneously. The last one mounted will be displayed.');
            }
            return [...prev, entry];
        });
        return () => {
            setBottomPanelEntries((prev) => prev.filter((e) => e.id !== entry.id));
        };
    }, []);

    const hasBottomPanelReplace = bottomPanelEntries.some((e) => e.mode === 'replace');
    const bottomPanelAppendEntries = useMemo(
        () =>
            bottomPanelEntries
                .filter((e) => e.mode === 'append')
                .sort((a, b) => a.priority - b.priority),
        [bottomPanelEntries],
    );

    const value = useMemo<DrawerSlotContextValue>(
        () => ({
            titleRef,
            actionsRef,
            bottomPanelRef,
            hasTitleSlot: titleSlotCount > 0,
            hasActionsSlot: actionsSlotCount > 0,
            hasBottomPanelReplace,
            bottomPanelAppendEntries,
            registerTitleSlot,
            registerActionsSlot,
            registerBottomPanel,
        }),
        [
            titleSlotCount,
            actionsSlotCount,
            hasBottomPanelReplace,
            bottomPanelAppendEntries,
            registerTitleSlot,
            registerActionsSlot,
            registerBottomPanel,
        ],
    );

    return <DrawerSlotContext.Provider value={value}>{children}</DrawerSlotContext.Provider>;
};
```

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`
Expected: PASS (no type errors in new file)

- [ ] **Step 3: Commit**

```bash
git add src/stories/drawer/DrawerSlotContext.tsx
git commit -m "feat(drawer): add DrawerSlotContext for slot registration and refs"
```

---

### Task 5: DrawerPage component with lazy mount

**Files:**
- Create: `src/stories/drawer/DrawerPage.tsx` (overwrite existing stub)
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
import { DrawerPage } from './DrawerPage';

describe('DrawerPage', () => {
    it('renders children inside a paginated drawer', async () => {
        const Wrapper = () => {
            const pages = ['a', 'b'] as const;
            const pagination = usePagination<typeof pages>('a');
            return (
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                    <DrawerPage id="a">Page A Content</DrawerPage>
                    <DrawerPage id="b">Page B Content</DrawerPage>
                </Drawer>
            );
        };

        render(<Wrapper />);

        await waitFor(() => {
            expect(screen.getByText('Page A Content')).toBeInTheDocument();
        });
    });

    it('does not render lazy page until it becomes active', async () => {
        const LazyChild = () => <span data-testid="lazy-content">Lazy Loaded</span>;

        const Wrapper = () => {
            const pages = ['a', 'b'] as const;
            const pagination = usePagination<typeof pages>('a');
            return (
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                    <DrawerPage id="a">
                        <button type="button" onClick={() => pagination.open('b')}>Go to B</button>
                    </DrawerPage>
                    <DrawerPage id="b" lazy>
                        <LazyChild />
                    </DrawerPage>
                </Drawer>
            );
        };

        const { user } = render(<Wrapper />);

        await waitFor(() => {
            expect(screen.getByText('Go to B')).toBeInTheDocument();
        });

        // Lazy page should NOT be mounted yet
        expect(screen.queryByTestId('lazy-content')).not.toBeInTheDocument();

        // Navigate to page B
        await user.click(screen.getByText('Go to B'));

        await waitFor(() => {
            expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
        });
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: FAIL — DrawerPage is not wired into Drawer rendering

- [ ] **Step 3: Create DrawerPage component**

Overwrite `src/stories/drawer/DrawerPage.tsx`:

```tsx
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useIsPageActive } from './DrawerPageContext';

export type DrawerPageProps<TPageID extends string = string> = {
    /** Unique identifier for this page. Must match a pagination page ID. */
    id: TPageID;
    /** Defer first mount until page becomes active. Once mounted, stays mounted. */
    lazy?: boolean;
    /** Page content. */
    children: ReactNode;
};

export const DrawerPage = <TPageID extends string = string>({
    lazy = false,
    children,
}: DrawerPageProps<TPageID>) => {
    const isActive = useIsPageActive();
    const [hasBeenActive, setHasBeenActive] = useState(isActive);

    useEffect(() => {
        if (isActive && !hasBeenActive) {
            setHasBeenActive(true);
        }
    }, [isActive, hasBeenActive]);

    // Lazy pages: don't render until first activation
    if (lazy && !hasBeenActive) {
        return null;
    }

    return <>{children}</>;
};

/** Type guard to check if a React element is a DrawerPage */
export const isDrawerPageElement = (
    element: unknown,
): element is React.ReactElement<DrawerPageProps> =>
    element != null &&
    typeof element === 'object' &&
    'type' in element &&
    (element as { type: unknown }).type === DrawerPage;
```

- [ ] **Step 4: Wire DrawerPage into Drawer.tsx rendering**

In `src/stories/drawer/Drawer.tsx`, update the paginated children rendering section. Replace the existing `isPaginated && Array.isArray(children)` block in the content area (around line 341-371) with logic that:

1. Detects `DrawerPage` children via `isDrawerPageElement`
2. Wraps each in `DrawerPageProvider` with `isActive` based on `pagination.currentPage`
3. Uses `Transition` with `unmount={false}` for animation
4. Falls back to the existing `key`-based rendering for plain `div` children

Add imports:
```tsx
import { DrawerPageProvider } from './DrawerPageContext';
import { DrawerSlotProvider } from './DrawerSlotContext';
import { isDrawerPageElement } from './DrawerPage';
```

Replace the content children rendering:
```tsx
{isPaginated && Array.isArray(children)
    ? children.map((child) => {
          if (!child || typeof child !== 'object' || !('key' in child || isDrawerPageElement(child))) {
              return child;
          }
          const pageID = isDrawerPageElement(child) ? child.props.id : child.key;
          if (!pageID || typeof pageID !== 'string') return child;
          const isActive = pageID === pagination?.currentPage;
          return (
              <Transition
                  show={isActive}
                  key={`transition_${pageID}`}
                  as="div"
                  unmount={false}
                  enter={styles.paginationEnter}
                  enterFrom={styles.enterFromOpacity}
                  enterTo={styles.enterToOpacity}
                  leave={styles.paginationLeave}
                  leaveFrom={styles.leaveFromOpacity}
                  leaveTo={styles.leaveToOpacity}
                  className={clsx(overrides?.contentChildrenChildren?.className)}
              >
                  <DrawerPageProvider isActive={isActive} pageID={pageID}>
                      {child}
                  </DrawerPageProvider>
              </Transition>
          );
      })
    : children}
```

Also wrap the entire Dialog content in `<DrawerSlotProvider>` (inside `DrawerPaginationProvider`):
```tsx
<DrawerPaginationProvider pagination={pagination ?? null}>
    <DrawerSlotProvider>
        {/* ... rest of Dialog content ... */}
    </DrawerSlotProvider>
</DrawerPaginationProvider>
```

Remove the `loadedPage` state and `currentChild` memo — they're replaced by this approach.

- [ ] **Step 5: Run test to verify it passes**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: PASS

- [ ] **Step 6: Run full existing test suite to check backward compat**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: All existing tests still PASS

- [ ] **Step 7: Commit**

```bash
git add src/stories/drawer/DrawerPage.tsx src/stories/drawer/Drawer.tsx src/stories/drawer/Drawer.test.tsx
git commit -m "feat(drawer): add DrawerPage component with lazy mount and page context"
```

---

### Task 6: DrawerTitle slot component

**Files:**
- Create: `src/stories/drawer/DrawerTitle.tsx`
- Modify: `src/stories/drawer/Drawer.tsx`
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
import { DrawerTitle } from './DrawerTitle';

describe('DrawerTitle', () => {
    it('overrides the drawer title prop', async () => {
        render(
            <Drawer isOpen={true} title="Fallback Title" onClose={vi.fn()}>
                <DrawerTitle>Custom Title</DrawerTitle>
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('Custom Title')).toBeInTheDocument();
        });

        expect(screen.queryByText('Fallback Title')).not.toBeInTheDocument();
    });

    it('shows fallback title when no DrawerTitle is used', async () => {
        render(
            <Drawer isOpen={true} title="Fallback Title" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('Fallback Title')).toBeInTheDocument();
        });
    });

    it('only shows active page DrawerTitle in paginated drawer', async () => {
        const Wrapper = () => {
            const pages = ['a', 'b'] as const;
            const pagination = usePagination<typeof pages>('a');
            return (
                <Drawer isOpen={true} title="Fallback" onClose={vi.fn()} pagination={pagination}>
                    <DrawerPage id="a">
                        <DrawerTitle>Title A</DrawerTitle>
                        Page A
                    </DrawerPage>
                    <DrawerPage id="b">
                        <DrawerTitle>Title B</DrawerTitle>
                        Page B
                    </DrawerPage>
                </Drawer>
            );
        };

        render(<Wrapper />);

        await waitFor(() => {
            expect(screen.getByText('Title A')).toBeInTheDocument();
        });

        expect(screen.queryByText('Title B')).not.toBeInTheDocument();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: FAIL — `DrawerTitle` does not exist

- [ ] **Step 3: Create DrawerTitle component**

Create `src/stories/drawer/DrawerTitle.tsx`:

```tsx
'use client';

import { useLayoutEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useIsPageActive } from './DrawerPageContext';
import { useDrawerSlotContext } from './DrawerSlotContext';
import { TextWhenString } from '../utility/TextWhenString';

export type DrawerTitleProps = {
    children: ReactNode;
};

export const DrawerTitle = ({ children }: DrawerTitleProps) => {
    const isActive = useIsPageActive();
    const slotContext = useDrawerSlotContext();
    const id = useId();

    useLayoutEffect(() => {
        if (!isActive || !slotContext) return;
        const unregister = slotContext.registerTitleSlot();
        return unregister;
    }, [isActive, slotContext]);

    if (!isActive || !slotContext?.titleRef.current) {
        return null;
    }

    return createPortal(
        <TextWhenString kind="paragraphSmall" weight="medium">
            {children}
        </TextWhenString>,
        slotContext.titleRef.current,
        id,
    );
};
```

- [ ] **Step 4: Update Drawer.tsx title bar to support slot ref**

In `src/stories/drawer/Drawer.tsx`, update the title bar section. Replace the existing `<DialogTitle>` wrapper area with a structure that has a slot ref target and a fallback:

In the title area, replace:
```tsx
<VisuallyHidden when={hideTitle}>
    <DialogTitle as="h2" className={styles.titleTextContainer}>
        <TextWhenString kind="paragraphSmall" weight="medium">
            {title}
        </TextWhenString>
    </DialogTitle>
</VisuallyHidden>
```

With:
```tsx
<VisuallyHidden when={hideTitle}>
    <DialogTitle as="h2" className={styles.titleTextContainer}>
        <div ref={slotContext.titleRef} />
        {!slotContext.hasTitleSlot && (
            <TextWhenString kind="paragraphSmall" weight="medium">
                {title}
            </TextWhenString>
        )}
    </DialogTitle>
</VisuallyHidden>
```

Where `slotContext` is obtained from `useDrawerSlotContext()` inside a new `DrawerContent` component or by restructuring. Since the slot context provider wraps the dialog content, you need to extract the rendering into an inner component that can call `useDrawerSlotContext()`:

Create an inner `DrawerInner` component that receives all the props and calls `useDrawerSlotContext()`:
```tsx
const slotContext = useDrawerSlotContext()!;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/stories/drawer/DrawerTitle.tsx src/stories/drawer/Drawer.tsx src/stories/drawer/Drawer.test.tsx
git commit -m "feat(drawer): add DrawerTitle slot component with createPortal"
```

---

### Task 7: DrawerActions slot component

**Files:**
- Create: `src/stories/drawer/DrawerActions.tsx`
- Modify: `src/stories/drawer/Drawer.tsx`
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
import { DrawerActions } from './DrawerActions';

describe('DrawerActions', () => {
    it('renders actions via slot component', async () => {
        render(
            <Drawer isOpen={true} title="Test" onClose={vi.fn()}>
                <DrawerActions>
                    <button type="button">Slot Action</button>
                </DrawerActions>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('Slot Action')).toBeInTheDocument();
        });
    });

    it('falls back to additionalActions prop when no DrawerActions slot', async () => {
        render(
            <Drawer
                isOpen={true}
                title="Test"
                onClose={vi.fn()}
                additionalActions={<button type="button">Prop Action</button>}
            >
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('Prop Action')).toBeInTheDocument();
        });
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: FAIL — `DrawerActions` does not exist

- [ ] **Step 3: Create DrawerActions component**

Create `src/stories/drawer/DrawerActions.tsx`:

```tsx
'use client';

import { useLayoutEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useIsPageActive } from './DrawerPageContext';
import { useDrawerSlotContext } from './DrawerSlotContext';

export type DrawerActionsProps = {
    children: ReactNode;
};

export const DrawerActions = ({ children }: DrawerActionsProps) => {
    const isActive = useIsPageActive();
    const slotContext = useDrawerSlotContext();
    const id = useId();

    useLayoutEffect(() => {
        if (!isActive || !slotContext) return;
        const unregister = slotContext.registerActionsSlot();
        return unregister;
    }, [isActive, slotContext]);

    if (!isActive || !slotContext?.actionsRef.current) {
        return null;
    }

    return createPortal(children, slotContext.actionsRef.current, id);
};
```

- [ ] **Step 4: Update Drawer.tsx actions area to support slot ref**

In the title bar buttons section, update:
```tsx
<div className={clsx(styles.titleBarButtons, overrides?.titleBarButtons?.className)}>
    <div ref={slotContext.actionsRef} />
    {!slotContext.hasActionsSlot && (
        <RemoveFromDOM when={!hasAdditionalActions}>{additionalActions}</RemoveFromDOM>
    )}
    {/* Close button stays as-is */}
    <RemoveFromDOM when={hideCloseButton}>
        {/* ... close button ... */}
    </RemoveFromDOM>
</div>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/stories/drawer/DrawerActions.tsx src/stories/drawer/Drawer.tsx src/stories/drawer/Drawer.test.tsx
git commit -m "feat(drawer): add DrawerActions slot component"
```

---

### Task 8: DrawerBottomPanel slot component with mode and priority

**Files:**
- Create: `src/stories/drawer/DrawerBottomPanel.tsx`
- Modify: `src/stories/drawer/Drawer.tsx`
- Modify: `src/stories/drawer/Drawer.module.scss`
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Write the failing tests**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
import { DrawerBottomPanel } from './DrawerBottomPanel';

describe('DrawerBottomPanel', () => {
    it('renders bottom panel content via slot component (replace mode)', async () => {
        render(
            <Drawer isOpen={true} title="Test" onClose={vi.fn()} bottomPanel={<span>Fallback Panel</span>}>
                <DrawerBottomPanel>
                    <button type="button">Slot Panel</button>
                </DrawerBottomPanel>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('Slot Panel')).toBeInTheDocument();
        });

        // Fallback should not render when slot is active
        expect(screen.queryByText('Fallback Panel')).not.toBeInTheDocument();
    });

    it('falls back to bottomPanel prop when no slot', async () => {
        render(
            <Drawer isOpen={true} title="Test" onClose={vi.fn()} bottomPanel={<span>Fallback Panel</span>}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getAllByText('Fallback Panel').length).toBeGreaterThan(0);
        });
    });

    it('appends content after base bottomPanel in append mode', async () => {
        render(
            <Drawer isOpen={true} title="Test" onClose={vi.fn()} bottomPanel={<span>Base Panel</span>}>
                <DrawerBottomPanel mode="append">
                    <span>Appended Content</span>
                </DrawerBottomPanel>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getAllByText('Base Panel').length).toBeGreaterThan(0);
            expect(screen.getByText('Appended Content')).toBeInTheDocument();
        });
    });

    it('orders multiple append slots by priority', async () => {
        render(
            <Drawer isOpen={true} title="Test" onClose={vi.fn()} bottomPanel={<span>Base</span>}>
                <DrawerBottomPanel mode="append" priority={20}>
                    <span data-testid="p20">Priority 20</span>
                </DrawerBottomPanel>
                <DrawerBottomPanel mode="append" priority={10}>
                    <span data-testid="p10">Priority 10</span>
                </DrawerBottomPanel>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            const p10 = screen.getByTestId('p10');
            const p20 = screen.getByTestId('p20');
            // p10 should appear before p20 in the DOM
            expect(p10.compareDocumentPosition(p20) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        });
    });

    it('only shows active page bottom panel in paginated drawer', async () => {
        const Wrapper = () => {
            const pages = ['a', 'b'] as const;
            const pagination = usePagination<typeof pages>('a');
            return (
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                    <DrawerPage id="a">
                        <DrawerBottomPanel><span>Panel A</span></DrawerBottomPanel>
                        Page A
                    </DrawerPage>
                    <DrawerPage id="b">
                        <DrawerBottomPanel><span>Panel B</span></DrawerBottomPanel>
                        Page B
                    </DrawerPage>
                </Drawer>
            );
        };

        render(<Wrapper />);

        await waitFor(() => {
            expect(screen.getByText('Panel A')).toBeInTheDocument();
        });

        expect(screen.queryByText('Panel B')).not.toBeInTheDocument();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: FAIL — `DrawerBottomPanel` does not exist as a slot component

- [ ] **Step 3: Create DrawerBottomPanel component**

Create `src/stories/drawer/DrawerBottomPanel.tsx`:

```tsx
'use client';

import { useLayoutEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useIsPageActive } from './DrawerPageContext';
import { useDrawerSlotContext } from './DrawerSlotContext';

export type DrawerBottomPanelProps = {
    children: ReactNode;
    /** Control panel padding. @default true */
    padding?: boolean;
    /** 'replace' fully replaces the base bottomPanel. 'append' renders after the base. @default 'replace' */
    mode?: 'replace' | 'append';
    /** Render order for append mode. Lower = higher up. @default 0 */
    priority?: number;
};

export const DrawerBottomPanel = ({
    children,
    padding = true,
    mode = 'replace',
    priority = 0,
}: DrawerBottomPanelProps) => {
    const isActive = useIsPageActive();
    const slotContext = useDrawerSlotContext();
    const id = useId();

    useLayoutEffect(() => {
        if (!isActive || !slotContext) return;
        const unregister = slotContext.registerBottomPanel({ id, mode, priority });
        return unregister;
    }, [isActive, slotContext, id, mode, priority]);

    if (!isActive || !slotContext?.bottomPanelRef.current) {
        return null;
    }

    return createPortal(
        <div data-slot-mode={mode} data-slot-priority={priority} style={padding ? { padding: 20 } : undefined}>
            {children}
        </div>,
        slotContext.bottomPanelRef.current,
        `${id}-${priority}`,
    );
};
```

- [ ] **Step 4: Update Drawer.tsx bottom panel area to support slot ref**

In `src/stories/drawer/Drawer.tsx`, update the bottom panel rendering. The existing bottom panel section currently renders `bottomPanel` directly. Replace it with a structure that has a portal target ref and conditional fallback.

The bottom panel area needs to:
1. Always render the ref container `<div ref={slotContext.bottomPanelRef} />`
2. Show the base `bottomPanel` prop when: no replace slot is registered AND (no append slots OR append mode needs the base)
3. Hide the base when a replace slot is active

Replace the bottom panel section (starting around `{bottomPanel && (`) with:

```tsx
{(bottomPanel || slotContext.hasTitleSlot || slotContext.hasActionsSlot || slotContext.hasBottomPanelReplace || slotContext.bottomPanelAppendEntries.length > 0) && (
    <>
        <div
            tabIndex={-1}
            aria-hidden="true"
            className={clsx(
                styles.bottomPanelSpacer,
                { [styles.noPadding]: !bottomPanelPadding },
                overrides?.bottomPanelSpacer?.className,
            )}
        >
            {!slotContext.hasBottomPanelReplace && bottomPanel}
            <div ref={slotContext.bottomPanelRef} />
        </div>
        <div className={clsx(styles.bottomPanel, overrides?.bottomPanel?.className)}>
            <div className={styles.glassOpacity} />
            <div className={styles.glassBlend} />
            <div
                className={clsx(
                    styles.bottomPanelContent,
                    { [styles.noPadding]: !bottomPanelPadding },
                    overrides?.bottomPanelContent?.className,
                )}
            >
                {!slotContext.hasBottomPanelReplace && bottomPanel}
                <div ref={slotContext.bottomPanelRef} />
            </div>
        </div>
    </>
)}
```

Note: The bottom panel ref appears in both the spacer and the actual panel. The spacer keeps scroll position. Only the actual panel ref should receive portal content. Use separate refs: `bottomPanelSpacerRef` and `bottomPanelRef`. Update `DrawerSlotContext` accordingly, or use a single ref on the visible panel and replicate sizing via CSS.

The exact wiring here will require careful integration with the existing glass blur/spacer pattern. The implementer should preserve the existing visual behavior while adding the portal target.

- [ ] **Step 5: Run test to verify it passes**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: PASS

- [ ] **Step 6: Run full test suite**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/stories/drawer/DrawerBottomPanel.tsx src/stories/drawer/Drawer.tsx src/stories/drawer/Drawer.module.scss src/stories/drawer/Drawer.test.tsx
git commit -m "feat(drawer): add DrawerBottomPanel slot with mode and priority"
```

---

### Task 9: `onAfterClose` prop

**Files:**
- Modify: `src/stories/drawer/Drawer.tsx`
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
describe('onAfterClose', () => {
    it('calls onAfterClose after the drawer close animation completes', async () => {
        const onAfterClose = vi.fn();
        const onClose = vi.fn();

        const { rerender } = render(
            <Drawer isOpen={true} title="Test" onClose={onClose} onAfterClose={onAfterClose}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Close the drawer
        rerender(
            <Drawer isOpen={false} title="Test" onClose={onClose} onAfterClose={onAfterClose}>
                Content
            </Drawer>,
        );

        // onAfterClose should fire after transition completes
        await waitFor(() => {
            expect(onAfterClose).toHaveBeenCalledTimes(1);
        });
    });

    it('does not call onAfterClose on initial render when closed', () => {
        const onAfterClose = vi.fn();

        render(
            <Drawer isOpen={false} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                Content
            </Drawer>,
        );

        expect(onAfterClose).not.toHaveBeenCalled();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: FAIL — `onAfterClose` prop does not exist

- [ ] **Step 3: Add `onAfterClose` to DrawerProps and wire to Transition**

In `src/stories/drawer/Drawer.tsx`:

Add to `DrawerProps`:
```tsx
/**
 * Callback fired after the drawer's close animation completes.
 * Use this to reset forms, clear state, and clean up without visual glitches.
 */
onAfterClose?: () => void;
```

Add `onAfterClose` to the destructured props.

On the outer `<Transition show={isOpen}>`, add the `afterLeave` prop:
```tsx
<Transition show={isOpen} afterLeave={onAfterClose}>
```

Use a ref to track if the drawer has been opened at least once, to prevent `afterLeave` firing on initial render when `isOpen` starts as `false`:

```tsx
const hasBeenOpen = useRef(false);
useEffect(() => {
    if (isOpen) hasBeenOpen.current = true;
}, [isOpen]);

const handleAfterLeave = useCallback(() => {
    if (hasBeenOpen.current) {
        onAfterClose?.();
    }
}, [onAfterClose]);
```

Then: `<Transition show={isOpen} afterLeave={handleAfterLeave}>`

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test -- --run src/stories/drawer/Drawer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/stories/drawer/Drawer.tsx src/stories/drawer/Drawer.test.tsx
git commit -m "feat(drawer): add onAfterClose callback fired after exit animation"
```

---

### Task 10: Update exports and add Storybook stories

**Files:**
- Modify: `src/stories/drawer/index.ts`
- Modify: `src/stories/drawer/Drawer.stories.tsx`

- [ ] **Step 1: Update index.ts exports**

Replace `src/stories/drawer/index.ts`:

```tsx
export * from './Drawer';
export * from './DrawerPage';
export * from './DrawerTitle';
export * from './DrawerActions';
export * from './DrawerBottomPanel';
export { useDrawer } from './DrawerContext';
export { useDrawerPagination } from './DrawerPaginationContext';
export { useIsPageActive } from './DrawerPageContext';
```

- [ ] **Step 2: Add compound API story**

Add to `src/stories/drawer/Drawer.stories.tsx`:

```tsx
import { DrawerPage } from './DrawerPage';
import { DrawerTitle } from './DrawerTitle';
import { DrawerActions } from './DrawerActions';
import { DrawerBottomPanel } from './DrawerBottomPanel';
import { useDrawer, useDrawerPagination } from './index';

// ... after existing stories ...

export const CompoundAPI: Story = {
    args: {},
    render: function Render() {
        const [isOpen, setIsOpen] = useState(false);
        const pages = ['details', 'edit'] as const;
        const pagination = usePagination<typeof pages>('details');

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open compound drawer</Button>
                <Drawer
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    title="Fallback Title"
                    pagination={pagination}
                    onAfterClose={() => pagination.reset()}
                >
                    <DrawerPage id="details">
                        <DrawerTitle>Transaction Details</DrawerTitle>
                        <DrawerActions>
                            <Menu as="div">
                                <MenuButton>
                                    <Button kind="tertiary" shape="circle" startEnhancer={<Ellipsis size={20} />}>
                                        Action menu
                                    </Button>
                                </MenuButton>
                                <MenuItems position="right">
                                    <MenuItem as="button">Dispute</MenuItem>
                                </MenuItems>
                            </Menu>
                        </DrawerActions>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p>This is the details page with its own title and actions.</p>
                            <Button onClick={() => pagination.open('edit')}>Go to Edit</Button>
                        </div>
                        <DrawerBottomPanel>
                            <Button onClick={() => pagination.open('edit')}>Edit Transaction</Button>
                        </DrawerBottomPanel>
                    </DrawerPage>

                    <DrawerPage id="edit">
                        <DrawerTitle>Edit Transaction</DrawerTitle>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p>This is the edit page. The title bar changed!</p>
                            <NestedFormExample />
                        </div>
                    </DrawerPage>
                </Drawer>
            </>
        );
    },
};

/** Demonstrates deep nesting — DrawerBottomPanel works from any depth */
const NestedFormExample = () => {
    const { close } = useDrawer();
    const pagination = useDrawerPagination();
    const [saving, setSaving] = useState(false);

    return (
        <>
            <p>This form component uses useDrawer() and renders its own bottom panel.</p>
            <DrawerBottomPanel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button
                        loading={saving}
                        onClick={() => {
                            setSaving(true);
                            setTimeout(() => {
                                setSaving(false);
                                close();
                            }, 1000);
                        }}
                    >
                        Save Changes
                    </Button>
                    <Button kind="secondary" onClick={() => pagination?.back()}>
                        Back
                    </Button>
                </div>
            </DrawerBottomPanel>
        </>
    );
};

export const AppendModeBottomPanel: Story = {
    args: {},
    render: function Render() {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open append mode drawer</Button>
                <Drawer
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    title="Append Mode Demo"
                    bottomPanel={
                        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--pte-new-colors-borderMedium)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total</span>
                                <strong>$249.00</strong>
                            </div>
                        </div>
                    }
                    bottomPanelPadding={false}
                >
                    <p>The bottom panel has a base totals bar from the Drawer prop, and an appended action button from DrawerBottomPanel.</p>
                    <DrawerBottomPanel mode="append" priority={10} padding={false}>
                        <div style={{ padding: '8px 20px' }}>
                            <Callout>Free shipping on orders over $200</Callout>
                        </div>
                    </DrawerBottomPanel>
                    <DrawerBottomPanel mode="append" priority={20} padding={false}>
                        <div style={{ padding: '12px 20px' }}>
                            <Button style={{ width: '100%' }}>Confirm Order</Button>
                        </div>
                    </DrawerBottomPanel>
                </Drawer>
            </>
        );
    },
};
```

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: PASS

- [ ] **Step 4: Run lint**

Run: `bun run lint`
Expected: PASS (or only pre-existing warnings)

- [ ] **Step 5: Run full test suite**

Run: `bun run test`
Expected: All tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/stories/drawer/index.ts src/stories/drawer/Drawer.stories.tsx
git commit -m "feat(drawer): add compound API stories and update exports"
```

---

### Task 11: Final integration test and visual verification

**Files:**
- Test: `src/stories/drawer/Drawer.test.tsx`

- [ ] **Step 1: Add integration test combining all features**

Add to `src/stories/drawer/Drawer.test.tsx`:

```tsx
describe('Compound API integration', () => {
    it('full paginated drawer with all slot types', async () => {
        const onAfterClose = vi.fn();

        const PageBForm = () => {
            const { close } = useDrawer();
            const pagination = useDrawerPagination();
            return (
                <>
                    <span>Edit form content</span>
                    <DrawerBottomPanel>
                        <button type="button" onClick={close}>Save</button>
                    </DrawerBottomPanel>
                </>
            );
        };

        const Wrapper = () => {
            const [isOpen, setIsOpen] = useState(true);
            const pages = ['a', 'b'] as const;
            const pagination = usePagination<typeof pages>('a');
            return (
                <Drawer
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    onAfterClose={onAfterClose}
                    title="Fallback"
                    pagination={pagination}
                >
                    <DrawerPage id="a">
                        <DrawerTitle>Page A Title</DrawerTitle>
                        <DrawerActions><button type="button">Action A</button></DrawerActions>
                        <span>Page A content</span>
                        <DrawerBottomPanel>
                            <button type="button" onClick={() => pagination.open('b')}>Next</button>
                        </DrawerBottomPanel>
                    </DrawerPage>
                    <DrawerPage id="b">
                        <DrawerTitle>Page B Title</DrawerTitle>
                        <PageBForm />
                    </DrawerPage>
                </Drawer>
            );
        };

        const { user } = render(<Wrapper />);

        // Page A should be visible with its slots
        await waitFor(() => {
            expect(screen.getByText('Page A Title')).toBeInTheDocument();
            expect(screen.getByText('Action A')).toBeInTheDocument();
            expect(screen.getByText('Page A content')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeInTheDocument();
        });

        // Navigate to page B
        await user.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(screen.getByText('Page B Title')).toBeInTheDocument();
            expect(screen.getByText('Edit form content')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
        });

        // Page A slots should no longer be visible
        expect(screen.queryByText('Page A Title')).not.toBeInTheDocument();
        expect(screen.queryByText('Action A')).not.toBeInTheDocument();
    });

    it('backward compat: existing div key pattern still works', async () => {
        const Wrapper = () => {
            const pages = ['x', 'y'] as const;
            const pagination = usePagination<typeof pages>('x');
            return (
                <Drawer isOpen={true} title="Old Pattern" onClose={vi.fn()} pagination={pagination}>
                    <div key="x">Old page X</div>
                    <div key="y">Old page Y</div>
                </Drawer>
            );
        };

        render(<Wrapper />);

        await waitFor(() => {
            expect(screen.getByText('Old page X')).toBeInTheDocument();
        });
    });
});
```

- [ ] **Step 2: Run full test suite**

Run: `bun run test`
Expected: All tests PASS

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: PASS

- [ ] **Step 4: Run lint and fix**

Run: `bun run lint:fix`

- [ ] **Step 5: Commit**

```bash
git add src/stories/drawer/Drawer.test.tsx
git commit -m "test(drawer): add integration tests for compound API"
```

- [ ] **Step 6: Visual verification in Storybook**

Run: `bun run storybook`

Verify in the browser:
1. Existing stories still work (Default, Paginated, BottomPanel, etc.)
2. CompoundAPI story: title changes on page navigation, bottom panel changes, actions change
3. AppendModeBottomPanel story: base totals bar + callout + button render in correct order
4. Closing and reopening drawers works without visual glitches
