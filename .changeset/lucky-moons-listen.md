---
'paris': patch
---

Restore the `maxHeight` cap on the `Select` and `Combobox` dropdowns. Headless UI's anchoring writes an inline `max-height: min(var(--anchor-max-height, 100vh), <available space>)` on the portaled panel, which won over the class-based cap — so the dropdowns grew to the available viewport height instead of `maxHeight`, most visibly on mobile, where a long list filled the screen. `maxHeight` now travels as `--anchor-max-height`, the variable that inline value reads, and the panel is capped at the smaller of `maxHeight` and the space available.
