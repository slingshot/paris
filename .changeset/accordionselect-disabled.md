---
"paris": minor
---

Add a component-level `disabled` prop to `AccordionSelect` and align its styling with the Figma SELECT spec.

- `disabled` locks the picker: the selected option still shows, the dropdown renders closed even when `isOpen` is true, the chevron is hidden, the header drops its hover treatment, and the header stays focusable with `aria-disabled`. A `react-hook-form` `field.disabled` spread now locks it too, and `disabled` wins over `status="error"`.
- The header uses `10px 12px` padding, the dropdown content uses the `overlaySubtle` background, options use a 14px gap, `contentSecondary` text, and `contentPrimary` when selected.
- Disabled options now use `contentDisabled` text instead of `opacity: 0.4`, so consumers dim their own leading media (icons, avatars) on disabled rows.
