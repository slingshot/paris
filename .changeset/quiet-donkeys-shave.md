---
'paris': patch
---

Reserve scroll padding under a `Drawer`'s bottom panel, so a field scrolled into view is never left sitting beneath it.

The bottom panel is absolutely positioned over the bottom of the scroll container, so the browser — which scrolls a focused element only minimally into view — could stop with that element under the panel. `Drawer` now mirrors the panel height it already measures for the content spacer onto `scroll-padding-bottom` of the scroll container, so every browser-performed scroll (focus, Tab, `scrollIntoView`) stops clear of the panel.

This makes `react-hook-form`'s `shouldFocusError` land on a visible field with no consumer changes, and needs no DOM measurement at the call site.
