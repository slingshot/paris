---
'paris': minor
---

Keep a `Drawer` field visible instead of letting the bottom panel hide it.

The bottom panel is absolutely positioned over the scroll container, so its band of the scrollport is occluded. The existing spacer stops content being clipped at maximum scroll, but does nothing about where a scroll comes to rest, or about geometry that changes after the fact. Two things now handle those:

- `scroll-padding-bottom` on the scroll container, mirrored from the panel height already measured for the spacer, so every browser-performed scroll (focus, Tab, `scrollIntoView`) stops clear of the panel. This covers a field that sits under the panel without needing a scroll at all — the browser considers it visible and would otherwise never move.
- A focused field is re-scrolled into view when geometry changes under it: the panel growing, or content above the field expanding. Browsers scroll on focus, not on resize, so an embedded widget that mounts at zero height and then expands would otherwise push the field it pushed out of sight and leave it there.

Both are internal — no API change, and nothing to wire up at the call site. `react-hook-form`'s `shouldFocusError` lands on a visible field for free.

Not covered: content inside a cross-origin iframe that animates its own height can still clamp the scroll container's `scrollTop`, the same failure `Accordion` and `AccordionSelect` avoid with the grid-rows technique, which is unavailable across an iframe boundary.
