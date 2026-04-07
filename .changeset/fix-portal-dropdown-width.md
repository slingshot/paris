---
"paris": patch
---

fix(select,combobox): fix portaled dropdown width and alignment

- Use correct CSS variables (`--button-width`, `--input-width`) for portaled dropdown width in Select and Combobox since Headless UI v2.2.x no longer sets `--anchor-width`
- Measure actual pixel offset between container and input to align Combobox dropdown with the input container, not the input element
- Prevent `ComboboxButton` wrapper from intercepting keyboard events (e.g. space key) meant for the input
