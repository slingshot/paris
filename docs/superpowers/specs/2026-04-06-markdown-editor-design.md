# MarkdownEditor Component — Design Spec

## Overview

A WYSIWYG rich text editor for the Paris design system that outputs markdown. Built on Tiptap (ProseMirror), it pairs with the existing read-only `<Markdown>` component as its write counterpart. The editor renders content with Paris styling while maintaining a controlled `value`/`onChange` interface where the value is always a markdown string.

## Decisions

| Decision | Choice |
|---|---|
| Library | Tiptap (`@tiptap/react`, ProseMirror-based) |
| Editing mode | WYSIWYG — rich formatting visible, markdown output |
| Toolbar | Composable — `FixedToolbar` and `FloatingToolbar` shipped separately |
| State model | Controlled (`value`/`onChange` with markdown strings) |
| Features | Core markdown + GFM (tables, task lists, strikethrough) |
| Feature gating | `features` prop whitelists which formatting is available |
| Link UX | Inline Paris-styled popover with URL input |
| Read-only | Supported via `editable={false}` prop |

## Architecture

```
<MarkdownEditor value={md} onChange={setMd} features={[...]}>
  <FixedToolbar />        ← reads editor + features from React context
  <FloatingToolbar />     ← wraps Tiptap BubbleMenu, appears on selection
  {/* EditorContent rendered internally by MarkdownEditor */}
</MarkdownEditor>
```

`MarkdownEditor` is a compound component. It:
1. Creates a Tiptap editor via `useMarkdownEditor` hook
2. Wraps children in `MarkdownEditorContext.Provider` carrying `{ editor, features }`
3. Renders `<EditorContent>` internally after the children (toolbars)

Toolbars are composable children — the consuming app decides which to include and where.

## Feature System

```typescript
export const FEATURES = [
  'bold', 'italic', 'strikethrough',          // inline marks
  'heading', 'blockquote', 'horizontalRule',   // block nodes
  'bulletList', 'orderedList', 'taskList',     // lists
  'codeBlock', 'code',                         // code
  'link', 'image', 'table',                   // inserts
] as const;

export type MarkdownEditorFeature = (typeof FEATURES)[number];
```

A `buildExtensions(features)` function maps enabled features to Tiptap extensions. Disabled features are excluded — their toolbar buttons, keyboard shortcuts, and markdown input rules simply don't exist.

**Extension mapping:**
- `bold`, `italic`, `strikethrough`, `heading`, `blockquote`, `horizontalRule`, `bulletList`, `orderedList`, `codeBlock`, `code` → configured via `StarterKit.configure({ ... : false })`
- `taskList` → `@tiptap/extension-task-list` + `@tiptap/extension-task-item`
- `table` → `@tiptap/extension-table` + `-table-row` + `-table-cell` + `-table-header`
- `link` → `@tiptap/extension-link`
- `image` → `@tiptap/extension-image`
- Always included: `Document`, `Paragraph`, `Text`, `History`, `@tiptap/markdown`, `@tiptap/extension-placeholder`

## API Surface

### MarkdownEditorProps

```typescript
type MarkdownEditorProps = {
  value: string;                              // controlled markdown string
  onChange?: (value: string) => void;         // fires with markdown on every edit
  features?: MarkdownEditorFeature[];         // whitelist, defaults to ALL_FEATURES
  placeholder?: string;                       // placeholder text when empty
  size?: MarkdownSize;                        // body text size (paragraphSmall default)
  editable?: boolean;                         // default true
  autofocus?: boolean;                        // default false
  status?: 'default' | 'error' | 'success';  // visual border state
  className?: string;
  label?: ReactNode;                          // accessible label
  overrides?: {
    root?: ComponentPropsWithoutRef<'div'>;
    editorContainer?: ComponentPropsWithoutRef<'div'>;
    editorContent?: ComponentPropsWithoutRef<'div'>;
  };
  children?: ReactNode;                       // toolbar components go here
};
```

### FixedToolbarProps

```typescript
type FixedToolbarProps = {
  className?: string;
  overrides?: {
    root?: ComponentPropsWithoutRef<'div'>;
    group?: ComponentPropsWithoutRef<'div'>;
    separator?: ComponentPropsWithoutRef<'div'>;
  };
};
```

Renders button groups: **Inline marks** (B, I, S, code) | **Blocks** (H1-H3, blockquote, hr) | **Lists** (bullet, ordered, task) | **Inserts** (link, image, table). Only shows buttons for enabled features.

### FloatingToolbarProps

```typescript
type FloatingToolbarProps = {
  className?: string;
  overrides?: {
    root?: ComponentPropsWithoutRef<'div'>;
  };
};
```

Wraps Tiptap's `<BubbleMenu>`. Shows inline-only formatting (bold, italic, strikethrough, code, link) on text selection.

### ToolbarButtonProps

```typescript
type ToolbarButtonProps = {
  feature: MarkdownEditorFeature;
  command: (editor: Editor) => void;
  isActive?: boolean;
  children: ReactNode;
  tooltip?: string;
  overrides?: { button?: ComponentPropsWithoutRef<'button'> };
};
```

Uses `onMouseDown` (not `onClick`) to avoid stealing editor focus. Styled with Paris tokens for hover, active, and disabled states.

### Exports

```typescript
// paris/markdowneditor
export { MarkdownEditor, FixedToolbar, FloatingToolbar, ToolbarButton };
export { useMarkdownEditorContext };
export { ALL_FEATURES, FEATURES };
export type { MarkdownEditorProps, FixedToolbarProps, FloatingToolbarProps, ToolbarButtonProps, MarkdownEditorFeature };
```

## Consumer Usage Examples

```tsx
// Full-featured editor
<MarkdownEditor value={md} onChange={setMd} placeholder="Start writing...">
  <FixedToolbar />
  <FloatingToolbar />
</MarkdownEditor>

// Minimal comment box — only bold, italic, links
<MarkdownEditor value={comment} onChange={setComment} features={['bold', 'italic', 'link']}>
  <FloatingToolbar />
</MarkdownEditor>

// Read-only preview
<MarkdownEditor value={md} editable={false} />

// No toolbar — just markdown shortcuts and keyboard shortcuts
<MarkdownEditor value={md} onChange={setMd} />
```

## Controlled State Data Flow

```
value (markdown string)
  → useEffect: editor.commands.setContent(value, 'markdown', { emitUpdate: false })
      ↕ circular update guard (compare value vs editor.getMarkdown())
  ← onUpdate callback: onChange(editor.getMarkdown())
```

- `@tiptap/markdown` provides `editor.getMarkdown()` and `contentType: 'markdown'`
- A ref tracks the last `onChange` value to prevent circular updates
- `emitUpdate: false` when syncing external value prevents re-triggering `onUpdate`
- `immediatelyRender: false` passed to `useEditor` for Next.js SSR safety

## Link Popover

When the link button is clicked (or Cmd+K), an inline popover appears below the selected text:
- URL text input
- "Open in new tab" checkbox
- Apply / Remove link buttons
- Uses a custom popover positioned with Tiptap's floating UI, styled with Paris tokens
- `surfacePrimary` background, `shallowPopup` shadow, Paris border radius

## Keyboard & Markdown Shortcuts

Built into Tiptap extensions (automatically gated by `features` prop):

| Shortcut | Action |
|---|---|
| `Cmd+B` | Bold |
| `Cmd+I` | Italic |
| `Cmd+Shift+X` | Strikethrough |
| `Cmd+E` | Inline code |
| `Cmd+Shift+7` | Ordered list |
| `Cmd+Shift+8` | Bullet list |
| `Cmd+Z` / `Cmd+Shift+Z` | Undo / Redo |

Markdown input rules: `# ` → h1, `> ` → blockquote, `- ` → bullet list, `1. ` → ordered list, `---` → hr, `` ``` `` → code block, `**text**` → bold, `*text*` → italic, `~~text~~` → strikethrough, `` `text` `` → inline code.

## Styling

### Editor Content Area

Mirrors the existing `Markdown.module.scss` visual output by targeting Tiptap's raw HTML elements (`h1`, `p`, `strong`, `blockquote`, `ul`, `ol`, `code`, `pre`, `table`, etc.) within a `.editorContent` scope. Uses the same Paris tokens (`--pte-new-colors-*`, `--pte-new-typography-*`, `--pte-borders-*`).

Additional editor-specific styles:
- Cursor and selection highlight
- Focus ring on the container
- Placeholder text via `.is-editor-empty:first-child::before`
- Task list items via `[data-type="taskList"]` / `[data-type="taskItem"]`

### Editor Container

Follows the Input/TextArea pattern:
- Background: `inputFill`
- Border: `inputFill` default → `inputBorderFocus` on focus-within
- Border-radius: `rectangle` token
- Supports `[data-status="error"]` / `[data-status="success"]`

### Toolbar Styles

**FixedToolbar**: Horizontal flex row, `backgroundPrimary`, border-bottom separator. Button groups separated by 1px `borderSubtle` divider.

**FloatingToolbar**: `surfacePrimary` background, `shallowPopup` shadow, `dropdown` border, `rounded` border-radius.

**ToolbarButton**: 28×28px, 6px border-radius, transparent default. Hover: `backgroundSecondary`. Active: `backgroundAccentSubtle` + `contentAccent` color. Disabled: `contentDisabled`.

## File Structure

```
src/stories/markdowneditor/
  ├── index.ts
  ├── features.ts
  ├── MarkdownEditorContext.tsx
  ├── useMarkdownEditor.ts
  ├── MarkdownEditor.tsx
  ├── MarkdownEditor.module.scss
  ├── FixedToolbar.tsx
  ├── FixedToolbar.module.scss
  ├── FloatingToolbar.tsx
  ├── FloatingToolbar.module.scss
  ├── ToolbarButton.tsx
  ├── ToolbarButton.module.scss
  ├── LinkPopover.tsx
  ├── LinkPopover.module.scss
  └── MarkdownEditor.stories.ts
```

## Dependencies

```
@tiptap/react
@tiptap/starter-kit
@tiptap/markdown
@tiptap/extension-task-list
@tiptap/extension-task-item
@tiptap/extension-table
@tiptap/extension-table-row
@tiptap/extension-table-cell
@tiptap/extension-table-header
@tiptap/extension-link
@tiptap/extension-image
@tiptap/extension-placeholder
```

## Implementation Phases

1. **Foundation** — `features.ts`, `MarkdownEditorContext.tsx`, `useMarkdownEditor.ts`
2. **Core component** — `MarkdownEditor.tsx` + `MarkdownEditor.module.scss` (editor content styled to match existing Markdown component)
3. **Toolbar shared** — `ToolbarButton.tsx` + styles
4. **FixedToolbar** — grouped buttons with separators
5. **FloatingToolbar** — BubbleMenu wrapper with inline marks
6. **LinkPopover** — inline URL input popover
7. **Stories** — default, floating-only, both toolbars, limited features, read-only, error/success states

## Known Challenges

- **Markdown round-trip fidelity**: Markdown → ProseMirror → Markdown may normalize formatting (trailing whitespace, list indentation). This is inherent to Tiptap's approach.
- **Table editing UX**: v1 supports table creation and basic editing. Advanced operations (merge cells, resize columns) deferred.
- **SSR**: `useEditor` returns `null` on the server. `immediatelyRender: false` and null guards handle this.
