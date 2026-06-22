---
"paris": patch
---

Drawer: animate on first open when mounted already-open. Added `appear` to the Drawer's headlessui `Transition` so a conditionally-rendered Drawer whose first render is `show={true}` animates in instead of snapping open. Always-mounted Drawers are unaffected (they mount with `show={false}`, for which `appear` is a no-op).
