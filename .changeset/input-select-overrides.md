---
"paris": minor
---

Expose overrides for every styled element of `Input` and `Select`.

- `Input`: adds `inputContainer`, `inputScaleWrapper`, and `labelContainer` overrides.
- `Select`: adds `labelContainer`, `chevron`, `optionCheck`, and per-kind overrides for the radio (`radioContainer`, `radioOption`, `radioCircle`), card (`cardContainer`, `cardOption`, `cardSurface`), and segmented (`segmentedContainer`, `segmentedOption`, `segmentedBackground`, `segmentedText`) variants.
- `Select`: the `optionsContainer` and `option` overrides are now spread onto their elements; previously the object was passed to `clsx`, so a `className` never applied.
- `Field`: a `className` on `overrides.label` is merged with the built-in label styles instead of being dropped, and a consumer `onClick` on `overrides.container` runs before the click-to-focus behaviour, which `preventDefault()` suppresses.
