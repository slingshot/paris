---
'paris': minor
---

Make `PhoneInput`, `AccordionSelect`, and `Combobox` work with a bare `{...field}` spread from `react-hook-form`, so call sites no longer need adapter wrappers.

**Breaking — `Combobox` `value`, `defaultValue`, and `onChange`:** the combobox is now driven by the option `id` rather than by the option object, so what `onChange` emits can be stored and handed straight back as `value`. `onChange` receives that field value first and the full option second.

```tsx
// before
const [selected, setSelected] = useState<Option | null>(null);
<Combobox options={opts} value={selected} onChange={(option) => setSelected(option)} />

// after
const [selected, setSelected] = useState<string | null>(null);
<Combobox options={opts} value={selected} onChange={(value) => setSelected(value)} />
```

With `allowCustomValue`, the field value for a custom entry is the text the user typed, and a `value` matching no option is displayed as that custom text; emptying the input clears the field value. Option ids take precedence, so custom text that happens to equal a real option's `id` comes back as that option rather than as text. `(null, null)` is reserved for a cleared selection. Where you need the option itself (for its `metadata`, say), take the second argument: `onChange={(value, option) => …}`. The exported `ComboboxValue<Id>` type names this field value.

`customValueToOption` now returns the narrower `CustomOption<T>` — an option whose `id` is `null`. Returning a non-null id was never meaningful (it would have been read back as a reference to a real option) and is now a type error; set the option's label text and `metadata` from the typed value instead.

**Breaking — `AccordionSelect` `onChange`:** it now receives `(id, option)` instead of the option alone, matching `Combobox`. Both arguments are `null` when no option matches the new value. Migrate by taking the second argument when you need the option:

```tsx
// before
<AccordionSelect options={opts} onChange={(option) => setMeta(option.metadata)} />
// after
<AccordionSelect options={opts} onChange={(_id, option) => setMeta(option?.metadata)} />
```

Also in this release:

- **`PhoneInput`** treats `undefined` and `''` the same as `null` (no digits), and decides controlled mode by the presence of the `value` prop rather than by `value !== undefined`. A field whose value is `undefined` before the first edit — or that a form reset returns to `undefined` — now clears the input instead of silently switching to uncontrolled mode, so `value={field.value}` works without a `?? null`. `onChange`'s first argument is the field value (the best-effort E.164 string, `null` when empty); the validation metadata stays in the second argument. Uncontrolled usage with `defaultValue` is unchanged.
- **`AccordionSelect`** forwards its remaining props — `name`, `id`, `onBlur`, `data-*`, ARIA attributes — to the focusable header element that already receives the forwarded `ref`. `name` is rendered as a DOM attribute. Consumer `onClick`/`onKeyDown` handlers run before the built-in open/close behaviour rather than replacing it, and can suppress it by calling `preventDefault()`.
- **`Combobox`** accepts top-level `name` and `onBlur` props that land on the inner `<input>` (previously `name` was only reachable through `overrides.input.name`, and `onBlur` was unavailable). `overrides.input.name` still wins when both are given, and `onBlur` does not fire while a non-string selected node replaces the input.
