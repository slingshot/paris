---
'paris': minor
---

Make `Select` usable with a bare `react-hook-form` field spread.

`name`, `id`, `onBlur`, and `data-*` props are now accepted and forwarded to the element that holds focus for the current `kind` — the trigger button for `listbox`, the option holding the roving tab stop for `radio`/`card`/`segmented`. `name` renders as a DOM attribute (so `document.querySelector('[name="..."]')` finds the control), `onBlur` fires when focus leaves that element, and a provided `id` also becomes the label's `htmlFor` target. Previously all four were silently dropped.

**Breaking — `Select` `onChange`:** it now receives the selected option's `id` first and the full `Option<T>` second (`ids` then `Option<T>[]` for multi-select); both arguments are `null` when the selection is cleared. `value`/`defaultValue` are unchanged (still id-based). Migrate by dropping the `option.id` unwrapping:

```tsx
// before
<Select options={opts} onChange={(option) => setValue(option?.id ?? null)} />
// after
<Select options={opts} onChange={setValue} />
// or, when you need the metadata
<Select options={opts} onChange={(id, option) => setValue(id, option?.metadata)} />
```

Together these let a `react-hook-form` field drive the component with no adapter, since react-hook-form takes a non-event first argument as the field value:

```tsx
<Controller
    name="releaseType"
    control={control}
    render={({ field }) => <Select {...field} options={opts} label="Release type" />}
/>
```
