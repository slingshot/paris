---
"paris": minor
---

Round out programmatic focus (`setFocus`) and per-field error state across form components, building on the new `forwardRef` support:

- `Checkbox` and `AccordionSelect` gain a `status?: 'default' | 'error'` prop that renders an invalid treatment (e.g. for a required field), matching `Input`/`Select`.
- `Select`'s `radio`/`card`/`segmented` kinds are now focusable (the group receives `tabIndex={-1}`), so `setFocus` works for them — previously only the `listbox` kind was.
- `Combobox` keeps a focusable target for its forwarded `ref` even when the selected option's `node` is a non-string element (previously the ref went `null` and `setFocus` no-oped).
- `MarkdownEditor` exposes an imperative handle via `ref` (`MarkdownEditorHandle` with `focus()`), so consumers can focus the editor without reaching into Tiptap internals.
- `Drawer` adds an `onPageEntered(pageID)` callback that fires once a paginated page's content has mounted and its enter transition completed, so consumers can focus a field on a newly-navigated page deterministically instead of polling animation frames.
