# Enhanced Drawer and Pagination APIs

## Overview

This PR introduces comprehensive enhancements to the Drawer and Pagination components, adding powerful new APIs that dramatically improve developer experience for multi-step drawer flows, eliminate prop drilling, and provide a clean, type-safe declarative syntax.

## New Features

### 1. **`DrawerPage` Component - Clean, Declarative Page Configuration** ⭐ NEW

The cleanest way to build paginated drawers - each page is a self-contained component with its own configuration:

```tsx
const pages = ['account', 'security', 'billing'] as const;
const pagination = usePagination<typeof pages>('account');

<Drawer pagination={pagination} title="Settings">
  <DrawerPage
    id="account"
    title="Account Settings"
    bottomPanel={<Button onClick={() => pagination.open('security')}>Next</Button>}
  >
    <h3>Account Information</h3>
    <Input label="Name" />
    <Input label="Email" />
  </DrawerPage>

  <DrawerPage
    id="security"
    title="Security Settings"
    bottomPanel={<Button>Save</Button>}
  >
    <h3>Password & Authentication</h3>
    <Input label="Current Password" type="password" />
  </DrawerPage>
</Drawer>
```

**Benefits:**
- ✅ **Type-safe**: `id` prop must match pagination page IDs
- ✅ **Co-located**: Page configuration lives with its content
- ✅ **Clean syntax**: No separate configuration object
- ✅ **Composable**: Works with `DrawerBottomPanelPortal` for dynamic content
- ✅ **Backward compatible**: Can be mixed with `pageConfig` prop

### 2. **`pageConfig` API - Declarative Per-Page Configuration**

Configure drawer properties on a per-page basis without conditional logic:

```tsx
<Drawer
  pagination={pagination}
  pageConfig={{
    details: {
      title: 'View Details',
      bottomPanel: <Button onClick={() => pagination.open('edit')}>Edit</Button>,
    },
    edit: {
      title: 'Edit Information',
      bottomPanel: <Button onClick={() => pagination.open('confirm')}>Continue</Button>,
    },
  }}
>
  <div key="details">...</div>
  <div key="edit">...</div>
</Drawer>
```

**Benefits:**
- ✅ Clean, declarative API
- ✅ Eliminates conditional logic in parent component
- ✅ Clear mapping between pages and their configurations
- ✅ Configure `title`, `bottomPanel`, and `additionalActions` per page

### 3. **`DrawerBottomPanelPortal` - Content Injection Without Prop Drilling**

Allow child components to control their own bottom panel content:

```tsx
// Separate component file - no prop drilling needed!
const EditUserForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { close } = useDrawer();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await saveUser();
    close();
  };

  return (
    <>
      <div className="form-fields">
        <Input label="Name" />
        <Input label="Email" />
      </div>

      <DrawerBottomPanelPortal>
        <Button onClick={handleSubmit} loading={isSubmitting}>
          Save Changes
        </Button>
      </DrawerBottomPanelPortal>
    </>
  );
};

// In parent component
<Drawer pagination={pagination}>
  <DrawerPage id="edit"><EditUserForm /></DrawerPage>
  <DrawerPage id="review"><ReviewForm /></DrawerPage>
</Drawer>
```

**Benefits:**
- ✅ Co-locate bottom panel actions with page content
- ✅ Perfect for components defined in separate files
- ✅ Automatic page-active detection in paginated drawers
- ✅ Supports `replace`, `append`, `prepend` modes

### 4. **Context Hooks - Access Drawer State Anywhere**

New hooks for accessing drawer and pagination state without prop drilling:

```tsx
// useDrawer() - Close drawer or check if it's open
const MyComponent = () => {
  const { close, isOpen } = useDrawer();
  return <Button onClick={close}>Done</Button>;
};

// usePaginationContext() - Navigate between pages
const FormStep = () => {
  const pagination = usePaginationContext();
  return <Button onClick={() => pagination.open('review')}>Next</Button>;
};

// useDrawerBottomPanel() - Imperative control (advanced)
const DynamicForm = () => {
  const { setBottomPanel } = useDrawerBottomPanel();
  useEffect(() => {
    if (isDirty) {
      setBottomPanel(<Button>Save Changes</Button>);
    } else {
      setBottomPanel(<Button>Close</Button>);
    }
  }, [isDirty]);
};
```

## Critical Bug Fixes

### **Pagination Rendering Bug** 🐛
**Problem:** Pages beyond the first page wouldn't render when navigating
**Root Cause:** `loadedPage` state was only initialized and never updated when `pagination.currentPage` changed
**Solution:** Added `useEffect` to sync `loadedPage` with `pagination.currentPage`

```tsx
useEffect(() => {
  if (pagination?.currentPage) {
    setLoadedPage(pagination.currentPage);
  }
}, [pagination?.currentPage]);
```

### **Portal Timing Issues in Pagination** 🐛
**Problem:** `DrawerBottomPanelPortal` content wouldn't render when navigating between pages
**Root Cause:**
- Components were unmounting and clearing portal content
- New page component would mount after portal was cleared
- Race condition between cleanup and new portal setup

**Solution:**
- Keep all pages mounted with `unmount={false}` on Transition component
- Created `DrawerPageContext` to track which page is currently active
- Portal only renders content when its page is visible
- Prevents multiple portals from fighting over shared state

### **Code Quality Improvements**
- Refactored `DrawerContent` from nested component to standalone (prevents React reconciliation issues)
- Fixed ESLint violations (arrow function bodies, context memoization, naming conventions)
- Improved type safety throughout

## Implementation Details

### How Page Active Tracking Works

```tsx
// Drawer wraps each paginated child in DrawerPageProvider
<Transition show={isActive} unmount={false}>
  <DrawerPageProvider isActive={isActive}>
    {child}
  </DrawerPageProvider>
</Transition>

// Portal automatically detects if it's on the active page
const DrawerBottomPanelPortal = ({ children }) => {
  const isPageActive = useIsDrawerPageActive();

  useEffect(() => {
    if (isPageActive) {
      setPortalContent(children);
    }
    return () => setPortalContent(null);
  }, [isPageActive, children]);
};
```

### Type Safety with DrawerPage

The `DrawerPage` component is fully type-safe when used with pagination:

```tsx
const pages = ['view', 'edit'] as const;
const pagination = usePagination<typeof pages>('view');

<Drawer pagination={pagination}>
  <DrawerPage id="view">...</DrawerPage>   {/* ✅ */}
  <DrawerPage id="edit">...</DrawerPage>   {/* ✅ */}
  <DrawerPage id="invalid">...</DrawerPage> {/* ❌ TypeScript error */}
</Drawer>
```

## New Files

- `DrawerPage.tsx` - Declarative page component with type-safe props
- `DrawerContext.tsx` - Drawer state context and provider
- `DrawerBottomPanelContext.tsx` - Bottom panel portal system
- `DrawerBottomPanelPortal.tsx` - Portal component for injecting content
- `DrawerPageContext.tsx` - Page active state tracking (internal)
- `PaginationContext.tsx` - Pagination state context

## Examples Added

Four comprehensive Storybook examples demonstrate the new APIs:

1. **WithPageConfig** - Declarative per-page configuration using `pageConfig` prop
2. **WithBottomPanelPortal** - Portal usage with form submission
3. **WithPaginationContext** - Multi-step wizard using context hooks
4. **WithDrawerPageComponent** ⭐ NEW - Clean declarative API using `<DrawerPage>`

## Breaking Changes

None - all changes are additive and backward compatible.

## API Comparison

### Before (Conditional Logic in Parent)
```tsx
<Drawer
  title={currentPage === 'edit' ? 'Edit User' : 'View User'}
  bottomPanel={
    currentPage === 'edit'
      ? <Button onClick={handleSave}>Save</Button>
      : <Button onClick={handleEdit}>Edit</Button>
  }
  pagination={pagination}
>
  <div key="view">...</div>
  <div key="edit">...</div>
</Drawer>
```

### After - Option 1: DrawerPage Component (Recommended)
```tsx
<Drawer pagination={pagination} title="User Management">
  <DrawerPage
    id="view"
    title="View User"
    bottomPanel={<Button onClick={handleEdit}>Edit</Button>}
  >
    ...
  </DrawerPage>

  <DrawerPage
    id="edit"
    title="Edit User"
    bottomPanel={<Button onClick={handleSave}>Save</Button>}
  >
    ...
  </DrawerPage>
</Drawer>
```

### After - Option 2: pageConfig Prop
```tsx
<Drawer
  pagination={pagination}
  title="User Management"
  pageConfig={{
    view: {
      title: 'View User',
      bottomPanel: <Button onClick={handleEdit}>Edit</Button>,
    },
    edit: {
      title: 'Edit User',
      bottomPanel: <Button onClick={handleSave}>Save</Button>,
    },
  }}
>
  <div key="view">...</div>
  <div key="edit">...</div>
</Drawer>
```

## Testing

- ✅ TypeScript compilation passes
- ✅ All linting rules satisfied (pre-existing errors in unrelated files remain)
- ✅ Storybook examples demonstrate all new features
- ✅ Backward compatibility maintained
- ✅ Type safety verified with pagination generics

## Statistics

- 11 files changed
- 1,200+ insertions, 150 deletions (approx)
- 4 new context providers
- 1 new component (`DrawerPage`)
- 4 comprehensive examples
