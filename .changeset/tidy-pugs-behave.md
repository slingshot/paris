---
'paris': minor
---

Make `Checkbox` work with a bare form-field spread — `<Checkbox {...field} />` inside a `react-hook-form` `Controller` now needs no `checked={field.value}` adapter.

- `value` is a new boolean alias for `checked`. When `checked` is omitted, `value` drives the checked state; `checked` wins when both are set. `defaultChecked` still covers uncontrolled mode.
- **Breaking:** rest props now spread onto the control — the Radix checkbox button for `default`/`surface`/`panel`, the Headless UI switch for `switch` — instead of the wrapping `<label>`. `className` and `style` still apply to the label, since they position the component as a whole. Anything else that was previously landing on the label (`title`, `data-*`, event handlers) now lands on the control, which is what makes `onBlur` fire on the focusable element and `data-*` hooks address it.
- `name` reaches the primitive, so both kinds render a hidden checkbox input for native form participation (Radix does this when the control is inside a `<form>`; Headless UI does it whenever `name` is set). `name` is therefore not a DOM attribute on the button itself.
- An explicit `id` is now used for the control and the label's `htmlFor` instead of being dropped onto the label; without one, the generated id is used as before.
- `disabled` now reaches the primitives, so a disabled checkbox or switch is non-interactive and excluded from form submission — previously it only styled the component and the control stayed toggleable. The `data-disabled` styling attribute follows the primitives' presence convention (present when disabled, absent otherwise).
- `onChange` is typed `(checked: boolean) => void`. The component has no indeterminate state — `checked` has always been a plain boolean — so Radix's `'indeterminate'` is normalized away rather than surfaced. Handlers already written to accept `boolean | 'indeterminate'` stay assignable.
