---
"paris": minor
---

Option-based components are now genuinely generic over their `metadata` type, and their callbacks are typed accordingly.

**Breaking — `Select` `onChange`:** it now receives the full selected `Option<T>` (single) or `Option<T>[]` (multiple) — including typed `metadata` — instead of the option `id` string(s). `value`/`defaultValue` are unchanged (still id-based). Migrate by reading `option.id`:

```tsx
// before
<Select options={opts} onChange={(id) => setValue(id)} />
// after
<Select options={opts} onChange={(option) => setValue(option?.id ?? null)} />
```

Also in this release (non-breaking):

- `Select` and `AccordionSelect` now preserve their generic type parameter, so `<Select<MyMeta> />` / `<AccordionSelect<MyMeta> />` correctly type `options`, `onChange`, and the render callbacks. (Previously the parameter was silently erased by `forwardRef`, and `Select`'s `options` never received the type at all.)
- `Tabs` is now generic over an optional per-tab `id`; `onTabChange(index, id)` receives that typed id as a second argument.
- `Option`/`AccordionSelectOption` metadata now defaults to `Record<string, unknown>` (was `Record<string, any>`).
- `Menu` dropdowns no longer paint a stray drop shadow when rendered with no items (matches the same fix on `Select`).
