---
"paris": patch
---

Form inputs now forward a `ref` to their focusable element, so form libraries (e.g. react-hook-form's `field.ref` / `setFocus`) can focus a field when it's invalid:

- `Combobox` → its `<input>` (also fixes `Input`'s type annotation, which was `FC` and hid the forwarded `ref`).
- `Checkbox` → the underlying checkbox / switch control.
- `CodeInput` → the first digit cell.
- `AccordionSelect` → its header trigger.
- `Select` (listbox) → its `ListboxButton` (the focusable trigger) instead of the wrapping `Listbox` div.
