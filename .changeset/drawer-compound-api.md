---
"paris": minor
---

Add compound component API for Drawer with paginated page transitions, progress bar, and slot components.

**New components:** `DrawerPage`, `DrawerTitle`, `DrawerActions`, `DrawerBottomPanel`, `DrawerProgressBar`

**New hooks:** `useDrawer()`, `useDrawerPagination()`, `useIsPageActive()`

**New Drawer props:**
- `pageTransition` — animated page transitions (`'none'` | `'crossfade'` | `'slide'`)
- `progressBar` — show an animated progress bar at the top of the bottom panel, with customizable `fill`, `track`, and `height`
- `onAfterClose` — callback fired after the drawer's exit animation completes

Slot components use `createPortal` to render into Drawer chrome (title bar, actions, bottom panel) from within page content, preserving React context (forms, state). Bottom panel slots support `mode="replace|append"` with priority ordering and automatic separator borders.

Fully backward compatible with existing `<div key="...">` pagination pattern.
