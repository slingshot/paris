---
"paris": patch
---

Restore keyboard and programmatic focus for `Select`'s `radio`, `card`, and `segmented` kinds. Headless UI consumes `RadioGroup`'s `tabIndex` prop as the group's roving tabindex rather than applying it to the rendered element, so the `tabIndex={-1}` Paris passed was assigned to the option that should be the group's tab stop — taking these kinds out of the document tab order entirely and leaving the forwarded ref on an element that could never hold focus (`react-hook-form`'s `setFocus` silently no-opped). The prop is gone, and the forwarded ref now lands on the option holding the roving tab stop: the selected option, or the first enabled one when nothing is selected.
