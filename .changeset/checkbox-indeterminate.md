---
"paris": minor
---

Add an indeterminate state to `Checkbox`.

- `checked`, `value`, and `defaultChecked` accept `boolean | 'indeterminate'`; `onChange` still emits a boolean, and toggling from indeterminate emits `true`.
- The `default` and `panel` kinds render a dash glyph and the `surface` kind renders the new `Minus` icon; `kind="switch"` renders indeterminate as unchecked.
- Exports the `CheckedState` type from `paris/checkbox` and the `Minus` icon from `paris/icon`.
