---
"paris": minor
---

Add controlled/uncontrolled hybrid state support to Select, Combobox, Checkbox, AccordionSelect, and Popover via a shared `useControllableState` hook. Components now accept a `defaultValue` (or `defaultChecked` for Checkbox) prop for uncontrolled usage while preserving full backwards compatibility with existing controlled APIs. Combobox internal dual-state bug is also fixed.
