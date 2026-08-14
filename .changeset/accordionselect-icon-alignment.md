---
"paris": patch
---

Align `AccordionSelect`'s trailing icons on a shared 16px axis. The check icon is now 12.8px in a 1.6px-padded box (16px total), the chevron is padded to match, and the header's right padding accounts for the optical difference.

When rendering your own trailing icon in `renderOption` (e.g. a red `faCircleExclamation` on a disabled option, as in the `DisabledOptionWithIcon` story), size its box to a **16px total width** — icon size plus padding — so it lines up with the header chevron and the selected-option check. For a 12.8px glyph that means `padding: 1.5px 1.6px`.
