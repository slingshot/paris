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

#### `<DrawerPage id={string}>`
Replaces `<div key="pageName">`. Wraps page content and provides page-level context.

#### `<DrawerTitle>`
Slot component. Renders its children into the Drawer's title bar when the parent page is active. String children are wrapped in `TextWhenString` with `paragraphSmall` / `medium` styling (matching current behavior). Falls back to Drawer's `title` prop when no `DrawerTitle` is present on the active page.

#### `<DrawerActions>`
Slot component. Renders into the additional actions area next to the close button. Falls back to Drawer's `additionalActions` prop.

#### `<DrawerBottomPanel padding?: boolean>`
Slot component. Renders into the bottom panel area. Works at any nesting depth — a deeply nested form component can control the bottom panel without prop drilling. Accepts `padding` prop (default `true`) to control panel padding. Falls back to Drawer's `bottomPanel` prop.

### Hooks

#### `useDrawer(): { close: () => void, isOpen: boolean }`
Access drawer state from any child component. Eliminates prop drilling of `onClose`.

#### `useDrawerPagination(): PaginationState | null`
Access pagination state from any child component. Returns `null` when used outside a paginated Drawer. Eliminates prop drilling of `pagination`.

### Example Usage

```tsx
const pages = ['details', 'edit'] as const;
const pagination = usePagination<typeof pages>('details');

<Drawer isOpen={isOpen} onClose={setIsOpen} title="Transaction" pagination={pagination}>
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

## Internal Architecture

### Context Layers

1. **`DrawerContext`** — provided by `<Drawer>`, exposes `{ close, isOpen }`.
2. **`DrawerPaginationContext`** — provided by `<Drawer>` when `pagination` prop is present, exposes the full `PaginationState`.
3. **`DrawerSlotContext`** — provided by `<Drawer>`, holds slot state: `{ setTitle, setBottomPanel, setActions }`. Slot components call these setters via `useEffect`, clear on unmount.
4. **`DrawerPageContext`** — provided per-page, exposes `{ isActive, pageID }`. Slot components check `isActive` before writing to slot context.

### Render Tree

```
Drawer
  DrawerContext.Provider          (close, isOpen)
  DrawerPaginationContext.Provider (pagination state)
  DrawerSlotContext.Provider       (slot setters + current slot values)
  
  Title Bar        <- reads slotContext.title ?? props.title
  Actions Area     <- reads slotContext.actions ?? props.additionalActions
  
  Content Area
    DrawerPageContext.Provider { isActive: true, pageID: "details" }
      <DrawerPage id="details"> children
    DrawerPageContext.Provider { isActive: false, pageID: "edit" }
      <DrawerPage id="edit"> children (kept mounted, hidden via Transition)

  Bottom Panel     <- reads slotContext.bottomPanel ?? props.bottomPanel
```

### Page Mounting Strategy

All pages stay mounted (`unmount={false}` on HeadlessUI `Transition`) but are visually hidden via opacity/display. This:
- Preserves form state when navigating between pages
- Prevents timing bugs where portals race with mount/unmount cycles
- Allows slot components to fire effects based on `isActive` changes

### Slot Conflict Resolution

When the active page changes:
1. The newly-active page's slot components detect `isActive` flipping to `true` and write to slot context
2. The previously-active page's slot components detect `isActive` flipping to `false` and clear their contributions
3. No race condition — driven by a single source of truth (`pagination.currentPage`)

### Slot Priority (highest to lowest)

1. Active page's slot component (`<DrawerTitle>`, `<DrawerBottomPanel>`, `<DrawerActions>`)
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

## Backward Compatibility

Full backward compatibility. Existing API works unchanged:

```tsx
<Drawer title="Transfer Out" pagination={pagination} bottomPanel={<Button>Submit</Button>}>
  <div key="step1">...</div>
  <div key="step2">...</div>
</Drawer>
```

Migration is incremental — drawers can be converted one at a time. The consumer (bejeweled) will upgrade everything at once.

## Exports from `paris/drawer`

```tsx
export { Drawer } from './Drawer';
export { DrawerPage } from './DrawerPage';
export { DrawerTitle } from './DrawerTitle';
export { DrawerActions } from './DrawerActions';
export { DrawerBottomPanel } from './DrawerBottomPanel';
export { useDrawer } from './DrawerContext';
export { useDrawerPagination } from './DrawerPaginationContext';
```

## New Files

- `src/stories/drawer/DrawerPage.tsx` — page wrapper component
- `src/stories/drawer/DrawerTitle.tsx` — title slot component
- `src/stories/drawer/DrawerActions.tsx` — actions slot component
- `src/stories/drawer/DrawerBottomPanel.tsx` — bottom panel slot component
- `src/stories/drawer/DrawerContext.tsx` — drawer state context + `useDrawer` hook
- `src/stories/drawer/DrawerPaginationContext.tsx` — pagination context + `useDrawerPagination` hook
- `src/stories/drawer/DrawerSlotContext.tsx` — slot state management context
- `src/stories/drawer/DrawerPageContext.tsx` — per-page active state context

## Modified Files

- `src/stories/drawer/Drawer.tsx` — wrap children in context providers, read slot values, render `DrawerPage` children
- `src/stories/drawer/Drawer.stories.tsx` — add stories demonstrating new API
- `src/stories/drawer/index.ts` — add new exports
