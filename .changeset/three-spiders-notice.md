---
"paris": patch
---

Field's container `onClick` called `input.click()` even when the click originated from the button itself, causing a double toggle on touch devices. This broke Headless UI Select/Menu/Combobox on iOS Safari since HUI 2.2+ toggles on `onClick` for touch (unlike mouse, which toggles on `pointerDown`).
