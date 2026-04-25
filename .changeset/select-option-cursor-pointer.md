---
'paris': patch
---

fix(select): add `cursor: pointer` to listbox options so iOS Safari synthesizes a click after tap. Without it, tapping a `Select` option on mobile would not close the listbox or fire `onChange`.
