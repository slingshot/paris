---
"paris": patch
---

Fix scroll snap when collapsing `Accordion` and `AccordionSelect` inside a scrollable parent.

When the dropdown was opened, the user scrolled past it, and then closed it,
the scrollable ancestor would instantly snap to the position it would occupy
once the dropdown was fully closed — while the visual collapse animation was
still running. The cause was framer-motion's `height: 'auto' → 0` exit
animation thrashing the layout in the first paint frame, which the browser
responded to by clamping `scrollTop`.

The collapse animation now uses the CSS grid-rows trick (`grid-template-rows:
1fr` → `0fr`) instead. Layout stays stable across the entire transition, so
`scrollTop` clamps smoothly in step with the animation. Duration and easing
match the previous behavior (800ms, `cubic-bezier(0.87, 0, 0.13, 1)`).

One small behavior change: collapsed content remains in the DOM (it was
previously unmounted by `AnimatePresence`). The container is marked
`aria-hidden` when closed and option buttons receive `tabIndex={-1}`, so
screen readers and keyboard navigation continue to skip hidden content.
