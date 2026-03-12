---
"paris": patch
---

Fix input field width calculation broken by iOS Safari scale trick. Wraps input/textarea in a container div so the scale trick's `width: calc(100% / 0.875)` resolves correctly, fixing width issues with enhancers and textarea not filling containers.
