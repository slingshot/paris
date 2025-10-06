---
"paris": minor
---

### pageConfig API
- Per-page configuration for title, bottomPanel, and additionalActions
- Declarative approach eliminates conditional logic in parent components
- Clean API for multi-step drawer flows

### DrawerBottomPanelPortal Component
- Portal system for child components to control bottom panel content
- Eliminates need for prop drilling for components in separate files
- Automatic page-active detection in paginated drawers
- Supports replace, append, prepend modes

### Context Providers
- useDrawer() - Access drawer controls from any child component
- usePaginationContext() - Access pagination state without prop drilling
- useDrawerBottomPanel() - Imperative bottom panel control
- useIsDrawerPageActive() - Internal page active tracking