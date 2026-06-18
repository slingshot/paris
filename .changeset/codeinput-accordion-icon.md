---
"paris": minor
---

Add `CodeInput` and a custom toggle icon for `Accordion`:

- **New `CodeInput` component.** A segmented numeric code / one-time-PIN input — `length` single-digit cells (default 6) with auto-advance, paste-to-fill, backspace-retreat, and arrow-key navigation. Supports `error` status, `disabled`, and a `loading` state that locks input and sweeps a validating glare across the segments (clipped to the input bounds).
- **`Accordion` custom toggle icon.** New `icon` prop (an `Enhancer` — an icon element or `({ size }) => ReactNode`) overrides the default plus/chevron with any icon, rotating it on open/close. Default behavior is unchanged when `icon` is omitted.
