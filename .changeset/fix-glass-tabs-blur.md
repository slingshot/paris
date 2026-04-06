---
"paris": patch
---

fix(tabs): fix glass mode backdrop-filter blur and content bleed-through

Restructured glass tab bar from `position: absolute` to `position: sticky` with `backdrop-filter` applied directly on the sticky element. This fixes two bugs: content bleeding through the tab bar on scroll, and the blur effect never rendering due to compositing boundary conflicts. Removed the nested glass layer divs (glassContainer, glassOpacity, glassBlend) and padding-top hacks in favor of natural document flow. Uses `primaryThin` material for theme-aware frosted glass (white in light mode, dark in dark mode).
