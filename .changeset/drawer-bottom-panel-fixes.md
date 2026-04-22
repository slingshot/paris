---
"paris": patch
---

Fix two issues with `DrawerBottomPanel` slots:

- **Border on the wrong slot when panels mount out of priority order.** Separator between portaled slots used an adjacent-sibling selector on the container, which keys off DOM source order while visual ordering is driven by CSS `order` via the `priority` prop. When slots mounted in non-priority order (e.g. one gated on async data), the border landed on the wrong slot. Borders are now applied per slot item so they travel with the element regardless of layout order.
- **Spacer didn't recompute when a slot registered after initial mount.** The bottom panel's content spacer only observed the outer panel element on initial attach, so late-registering slots (conditional on async data) left the spacer too short and hid scrollable content behind the panel. The effect now re-observes on entry changes, reads `offsetHeight` for an accurate border-box measurement, takes an explicit initial measurement, and observes individual slot items as a safety net.
