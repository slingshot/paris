# Drawer Compound Component API & Pagination Enhancement

**Date:** 2026-04-07
**Status:** Approved
**Scope:** `paris/drawer`, `paris/pagination`

## Problem

The current Drawer API forces paginated drawers into awkward patterns:

1. **Conditional title/bottomPanel soup** — every paginated drawer uses ternaries on `pagination.currentPage` to switch titles and bottomPanels, creating 100-200 line conditional blocks (e.g., `CreatePaymentDrawer` at 540 lines).
2. **Hacky DOM-based portals** — the consumer codebase (bejeweled) has reinvented a portal pattern 4 separate times using `document.querySelectorAll('.magicClassName')` + `createPortal` to inject bottomPanel content from deeply nested child components.
3. **Prop drilling** — `onClose` and `pagination` state get drilled through multiple component layers since child components need to close the drawer or navigate pages.
4. **Semantic-less page wrappers** — pages are `<div key="pageName">`, which can't carry configuration.

## Solution

A compound component API with slot components, context hooks, and `DrawerPage` wrappers. Inspired by Radix/Headless UI patterns.

## Public API

### Components

#### `<Drawer<T>>`
Accepts an optional generic `T` (same type as `usePagination<T>`) that flows type safety to `DrawerPage` children. All existing props remain unchanged.

#### `<DrawerPage id={T[number]} lazy?: boolean>`
Replaces `<div key="pageName">`. Wraps page content and provides page-level context. The `id` prop is type-checked against the pagination's page list when a generic is provided.

When `lazy` is `true`, the page defers its first mount until it becomes active, then stays mounted afterward. Default is `false` (mount immediately, matching current behavior).

#### `<DrawerTitle>`
Slot component. Renders its children into the Drawer's title bar when the parent page is active. String children are wrapped in `TextWhenString` with `paragraphSmall` / `medium` styling (matching current behavior). Falls back to Drawer's `title` prop when no `DrawerTitle` is present on the active page.

Uses `createPortal` to a ref on the Drawer's title container, preserving the React tree.

#### `<DrawerActions>`
Slot component. Renders into the additional actions area next to the close button. Falls back to Drawer's `additionalActions` prop.

Uses `createPortal` to a ref on the Drawer's actions container, preserving the React tree.

#### `<DrawerBottomPanel padding?: boolean>`
Slot component. Renders into the bottom panel area. Works at any nesting depth — a deeply nested form component can control the bottom panel without prop drilling. Accepts `padding` prop (default `true`) to control panel padding. Falls back to Drawer's `bottomPanel` prop.

Uses `createPortal` to a ref on the Drawer's bottom panel container, preserving the React tree. This is critical: it keeps slot content as a DOM descendant of any wrapping `<form>`, so `react-hook-form` context, native form submission, and `type="submit"` buttons all work correctly.

### Hooks

#### `useDrawer(): { close: () => void, isOpen: boolean }`
Access drawer state from any child component. Eliminates prop drilling of `onClose`.

#### `useDrawerPagination(): PaginationState | null`
Access pagination state from any child component. Returns `null` when used outside a paginated Drawer. Eliminates prop drilling of `pagination`.

#### `useIsPageActive(): boolean`
Returns whether the current `DrawerPage` is the active page. Useful for gating effects in pages that stay mounted.

### Example Usage

```tsx
const pages = ['details', 'edit'] as const;
const pagination = usePagination<typeof pages>('details');

<Drawer<typeof pages> isOpen={isOpen} onClose={setIsOpen} title="Transaction" pagination={pagination}>
  <DrawerPage id="details">
    <DrawerTitle>Transaction Details</DrawerTitle>
    <DrawerActions>
      <Menu>...</Menu>
    </DrawerActions>
    <TransactionSummary />
    <DrawerBottomPanel>
      <Button onClick={() => pagination.open('edit')}>Edit</Button>
    </DrawerBottomPanel>
  </DrawerPage>

  <DrawerPage id="edit">
    <DrawerTitle>Edit Transaction</DrawerTitle>
    <EditForm />  {/* EditForm can use <DrawerBottomPanel> internally */}
  </DrawerPage>
</Drawer>
```

### Deep Nesting Example

```tsx
// In a separate file — no prop drilling needed
const EditForm = () => {
  const { close } = useDrawer();
  const pagination = useDrawerPagination();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <Input label="Name" />
      <Input label="Email" />

      <DrawerBottomPanel>
        <Button loading={isSubmitting} onClick={handleSubmit}>Save</Button>
      </DrawerBottomPanel>
    </>
  );
};
```

### Lazy Page Example

```tsx
<DrawerPage id="dispute" lazy>
  {/* DisputeForm is not mounted until user navigates to "dispute" page */}
  {/* Once mounted, stays mounted to preserve state */}
  <DisputeForm />
</DrawerPage>
```

## Internal Architecture

### Slot Rendering via createPortal

Slot components (`DrawerTitle`, `DrawerActions`, `DrawerBottomPanel`) use `createPortal` to render into ref-targeted containers in the Drawer's DOM. This approach:

- **Preserves the React component tree** — slot content remains a logical child of its declaring component, so React context (including `react-hook-form`, Redux, etc.) flows through correctly.
- **Keeps DOM form ancestry** — a `<DrawerBottomPanel>` inside a `<form>` portals its content into the Drawer's bottom panel container, but the React tree still treats it as inside the form. Buttons with `type="submit"`, `form.formState`, and native form submission all work.
- **No SSR concern** — Drawers are `'use client'` components, so `createPortal` is always available.

The Drawer renders empty container `<div>`s with refs for each slot:
```tsx
<div ref={titleSlotRef} />    {/* DrawerTitle portals here */}
<div ref={actionsSlotRef} />  {/* DrawerActions portals here */}
<div ref={bottomPanelSlotRef} /> {/* DrawerBottomPanel portals here */}
```

When no slot component is active, the Drawer falls back to rendering its direct props (`title`, `bottomPanel`, `additionalActions`) into those containers.

### Context Layers

1. **`DrawerContext`** — provided by `<Drawer>`, exposes `{ close, isOpen }`.
2. **`DrawerPaginationContext`** — provided by `<Drawer>` when `pagination` prop is present, exposes the full `PaginationState`.
3. **`DrawerSlotContext`** — provided by `<Drawer>`, holds refs to slot containers (`titleSlotRef`, `actionsSlotRef`, `bottomPanelSlotRef`) and registration functions. Slot components register/unregister via `useLayoutEffect` so the Drawer knows whether to render fallback props or leave the container for portal content.
4. **`DrawerPageContext`** — provided per-page, exposes `{ isActive, pageID }`. Slot components check `isActive` before portaling — inactive pages don't render slot content.

### Render Tree

```
Drawer
  DrawerContext.Provider            (close, isOpen)
  DrawerPaginationContext.Provider  (pagination state)
  DrawerSlotContext.Provider        (slot refs + registration)
  
  Title Bar
    <div ref={titleSlotRef} />     <- DrawerTitle portals here when active
    {!hasTitleSlot && props.title}  <- fallback when no slot registered
  Actions Area
    <div ref={actionsSlotRef} />
    {!hasActionsSlot && props.additionalActions}
  
  Content Area
    DrawerPageContext.Provider { isActive: true, pageID: "details" }
      <DrawerPage id="details"> children
    DrawerPageContext.Provider { isActive: false, pageID: "edit" }
      <DrawerPage id="edit"> children (kept mounted, hidden via Transition)

  Bottom Panel
    <div ref={bottomPanelSlotRef} />
    {!hasBottomPanelSlot && props.bottomPanel}
```

### Effect Timing

All slot registration and portal setup uses `useLayoutEffect` (not `useEffect`) to ensure slot content is populated before the browser paints. This prevents visible flashes when switching between pages or when slot content replaces fallback props.

### Page Mounting Strategy

Pages stay mounted (`unmount={false}` on HeadlessUI `Transition`) but are visually hidden via opacity/display. This preserves form state when navigating between pages.

**Lazy pages:** When `<DrawerPage lazy>` is set, the page defers its first mount until it becomes the active page. Once mounted, it stays mounted (preserving state). This prevents effects in inactive pages from firing before the user navigates there.

**`useIsPageActive()` hook:** Consumers can use this to gate effects on inactive pages that are mounted eagerly:

```tsx
const isActive = useIsPageActive();
useEffect(() => {
  if (!isActive) return;
  // fetch data, set up subscription, etc.
}, [isActive]);
```

### Slot Conflict Resolution

When multiple `<DrawerBottomPanel>` components exist in the same active page (e.g., one at page level and one inside a deeply nested child):

- **Last one wins** — the most recently registered slot component takes precedence. This matches the common pattern where a child component overrides the page-level default.
- **Dev warning** — in development, `console.warn` when two slot components of the same type are simultaneously active on the same page. This catches accidental conflicts without breaking anything.
- **Append mode** — intentionally deferred. No current use case. Easy to add later as a `mode="append"` prop if needed.

### Slot Priority (highest to lowest)

1. Active page's slot component via `createPortal` (`<DrawerTitle>`, `<DrawerBottomPanel>`, `<DrawerActions>`)
2. Drawer's direct props (`title`, `bottomPanel`, `additionalActions`)
3. Nothing (slot is empty/hidden)

## Edge Cases

### Non-paginated drawers with slot components
Slot components work without pagination. No `DrawerPage` needed — children are implicitly "always active."

```tsx
<Drawer isOpen={isOpen} onClose={setIsOpen} title="Simple Drawer">
  <DrawerTitle>Dynamic Title</DrawerTitle>
  <SomeContent />
  <DrawerBottomPanel>
    <Button>Save</Button>
  </DrawerBottomPanel>
</Drawer>
```

### `useDrawerPagination()` outside a paginated Drawer
Returns `null`. Consumers can conditionally use it.

### `<DrawerBottomPanel>` padding
Accepts `padding` prop (default `true`) to co-locate the padding concern with the content.

### Type safety on DrawerPage id
`Drawer` accepts a generic `T` matching the pagination type. `DrawerPage` `id` is typed as `T[number]`, providing autocomplete and compile-time error on typos:

```tsx
const pages = ['view', 'edit'] as const;
const pagination = usePagination<typeof pages>('view');

<Drawer<typeof pages> pagination={pagination}>
  <DrawerPage id="view">...</DrawerPage>   {/* OK */}
  <DrawerPage id="edit">...</DrawerPage>   {/* OK */}
  <DrawerPage id="viwe">...</DrawerPage>   {/* TypeScript error */}
</Drawer>
```

## Backward Compatibility

Full backward compatibility. Existing API works unchanged:

```tsx
<Drawer title="Transfer Out" pagination={pagination} bottomPanel={<Button>Submit</Button>}>
  <div key="step1">...</div>
  <div key="step2">...</div>
</Drawer>
```

The consumer (bejeweled) will upgrade all drawers at once.

## Exports from `paris/drawer`

```tsx
export { Drawer } from './Drawer';
export { DrawerPage } from './DrawerPage';
export { DrawerTitle } from './DrawerTitle';
export { DrawerActions } from './DrawerActions';
export { DrawerBottomPanel } from './DrawerBottomPanel';
export { useDrawer } from './DrawerContext';
export { useDrawerPagination } from './DrawerPaginationContext';
export { useIsPageActive } from './DrawerPageContext';
```

## New Files

- `src/stories/drawer/DrawerPage.tsx` — page wrapper component with lazy mount support
- `src/stories/drawer/DrawerTitle.tsx` — title slot component (createPortal-based)
- `src/stories/drawer/DrawerActions.tsx` — actions slot component (createPortal-based)
- `src/stories/drawer/DrawerBottomPanel.tsx` — bottom panel slot component (createPortal-based)
- `src/stories/drawer/DrawerContext.tsx` — drawer state context + `useDrawer` hook
- `src/stories/drawer/DrawerPaginationContext.tsx` — pagination context + `useDrawerPagination` hook
- `src/stories/drawer/DrawerSlotContext.tsx` — slot refs and registration context
- `src/stories/drawer/DrawerPageContext.tsx` — per-page active state context + `useIsPageActive` hook

## Modified Files

- `src/stories/drawer/Drawer.tsx` — wrap children in context providers, add slot ref containers, render `DrawerPage` children with page context
- `src/stories/drawer/Drawer.stories.tsx` — add stories demonstrating new API
- `src/stories/drawer/index.ts` — add new exports
