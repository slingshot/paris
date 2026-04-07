---
"paris": patch
---

fix(select,combobox): use correct CSS variables for portaled dropdown width

Headless UI v2.2.x sets `--button-width` and `--input-width` on portaled options, not `--anchor-width`. This caused dropdowns to be content-sized (~110px) instead of matching their trigger element.
