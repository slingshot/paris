# PhoneInput Component — Design

**Date:** 2026-07-13
**Status:** Approved

## Summary

A `PhoneInput` component for Paris that combines a searchable country selector with a phone number input in a single bordered field. The display value is sanitized while typing and reformatted to localized (national) formatting on blur, while `value`/`onChange` always carry the number in E.164 format (`+14155552671`) — ready to drop into form state.

## Goals

- Single field UX: country picker (emoji flag + dial code) embedded at the left edge of the input, one `Field` label/description wrapper, one border.
- E.164 in, E.164 out: controlled `value` and `onChange` use E.164 strings; consumers never parse display formatting.
- Localized display: national formatting (e.g. `(415) 555-2671` for US, `020 7946 0958` for GB) applied on blur; no cursor-jumping reformatting mid-typing.
- Fits Paris conventions: `Field` wrapper, `Input.module.scss` container styles, `overrides` pattern, `status` error support, ref forwarding for react-hook-form `setFocus`.

## Non-goals

- Extension/short-code support (libphonenumber extensions are out of scope for v1).
- As-you-type display reformatting (explicitly avoided; blur-only sanitization).
- SVG flag assets (emoji flags chosen; see Trade-offs).

## Dependencies

- **`libphonenumber-js`** (new dependency) — always imported from `libphonenumber-js/min` (~65 kB metadata) for parsing, validation, `AsYouType`, national formatting, `getCountries()`, `getCountryCallingCode()`.
- **Country names**: `Intl.DisplayNames(locale, { type: 'region' })` — built into all supported runtimes, zero data cost, localizes automatically.
- **Flags**: emoji strings computed from the ISO code (each letter mapped to its regional-indicator codepoint, `A` → U+1F1E6). Zero dependency.

## Files

`src/stories/phoneinput/` (scaffolded via `bun run create:component PhoneInput`):

- `PhoneInput.tsx` — implementation (`'use client'`)
- `PhoneInput.module.scss` — styles (theme vars via `pvar`, `data-status` variants)
- `PhoneInput.stories.ts` — Storybook stories
- `PhoneInput.test.tsx` — unit tests
- `index.ts` — exports

Then `bun run generate:exports` to add the `paris/phoneinput` entry. Update `AGENTS.md` / `public/llms.txt` component lists.

## Public API

```ts
import type { CountryCode } from 'libphonenumber-js/min';

export type PhoneInputChangeMeta = {
    /** ISO region detected from the number, or the currently selected country. */
    country: CountryCode | undefined;
    /** Full libphonenumber validation result for the current value. */
    isValid: boolean;
    /** The national-format digits as currently entered (no calling code). */
    nationalValue: string;
};

export type PhoneInputProps = {
    /** E.164 value for controlled mode (e.g. "+14155552671"). `null`/`""` = empty. */
    value?: string | null;
    /** Initial E.164 value for uncontrolled mode. Ignored when `value` is provided. */
    defaultValue?: string | null;
    /** Fires on every input or country change with the best-effort E.164 value (or `null` when empty/unparseable) plus metadata. */
    onChange?: (value: string | null, meta: PhoneInputChangeMeta) => void | Promise<void>;
    /** Country selected when no value dictates one. @default 'US' */
    defaultCountry?: CountryCode;
    /** Restrict the selectable country list. @default all regions from getCountries() */
    countries?: CountryCode[];
    /** Countries pinned to the top of the dropdown, in order. */
    priorityCountries?: CountryCode[];
    /** Fires when the selected country changes (via dropdown or +prefix detection). */
    onCountryChange?: (country: CountryCode) => void;
    /** @default 'default' */
    status?: 'default' | 'error' | 'success';
    /** BCP 47 locale for country display names. @default the runtime locale */
    locale?: string;
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        countryButton?: ComponentPropsWithoutRef<'button'>;
        searchInput?: ComponentPropsWithoutRef<'input'>;
        optionsContainer?: ComponentPropsWithoutRef<'div'>;
        option?: ComponentPropsWithoutRef<'div'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
    };
} & FieldProps & Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'type'>;
```

- `ref` is forwarded to the tel `<input>` element (react-hook-form `setFocus` convention; the input stays mounted at all times).
- Not generic: there is no consumer-supplied option list, so the `Option<T, Id>` generic pattern from Select/Combobox does not apply.
- The native input receives `type="tel"` and `autoComplete="tel"` by default (overridable); pasted autofill values in international format are parsed and re-derive the country.

## Internal architecture

Follows the Select/Combobox internal pattern: compose `Field` + `Input.module.scss`'s `inputContainer` directly (do **not** nest the public `Input` component).

```
<Field label description htmlFor={inputId}>
  <div className={inputStyles.inputContainer} data-status=...>
    <CountryPicker />        // button trigger + dropdown, inside the field border
    <div separator />        // 1px hairline between picker and input
    <input type="tel" ... /> // the phone number input, ref target
  </div>
</Field>
```

### State model

| State | Type | Purpose |
|---|---|---|
| `country` | `CountryCode` | Currently selected region (drives AsYouType + national formatting) |
| `displayValue` | `string` | Text shown in the tel input (user's sanitized keystrokes, or blur-formatted) |

The E.164 value itself is controllable via `useControllableState` (existing helper, same as Select/Combobox). `country` and `displayValue` are derived/internal; when the controlled `value` prop changes to something that doesn't match the internally-derived E.164 (e.g. form reset), country and display are re-derived by parsing the new E.164.

### Behavior

- **Typing**: keystrokes are sanitized to digits, spaces, dashes, parens, and a leading `+` only. The sanitized text is displayed as-is (no reformatting mid-typing). Each change runs the text through `new AsYouType(country)` → `getNumber()?.number` yields best-effort E.164 even for partial input → `onChange(e164 ?? null, meta)`.
- **`+`-prefix country detection**: when the typed/pasted text starts with `+` and `AsYouType.getCountry()` resolves a region, the selected country auto-switches (flag + dial code update, `onCountryChange` fires).
- **Blur**: parse the current text with `parsePhoneNumberFromString(text, country)`. If parsed: display becomes `formatNational()` when the number's region matches the selected country, otherwise `formatInternational()`. If unparseable: display keeps the sanitized raw text. Consumer `onBlur` fires afterward.
- **Country change via dropdown**: national digits are preserved, E.164 re-derived with the new calling code, display reformatted nationally for the new region, `onChange` + `onCountryChange` fire, focus returns to the tel input.
- **Empty**: `onChange(null, { country, isValid: false, nationalValue: '' })`.
- **Disabled**: same convention as Input (`readOnly` + `aria-disabled` + `data-status="disabled"`).

### Country picker dropdown

- Trigger: compact button inside the field's left edge showing emoji flag + `+{callingCode}` + chevron-down. `aria-label` of the form `"Country: United States (+1)"`.
- Panel: anchored dropdown (z-index token `dropdown`), reusing `Select.module.scss` option/dropdown styles where practical. Search input pinned at top; filters by country name (locale-aware via `Intl.DisplayNames`), ISO code, or dial code (`+49`, `49`). List rows: emoji flag, country name, muted dial code (`paragraphXSmall` secondary), check icon on the selected row.
- Ordering: `priorityCountries` first (given order), then remaining countries sorted by localized display name.
- Built with Headless UI Combobox in the "command palette" arrangement (button-only trigger; `ComboboxInput` rendered inside the panel). If Headless UI v2 focus management fights this arrangement, fallback is Headless UI Popover + manual filter/keyboard-nav (the option list is simple enough to manage manually).
- Emoji flags render via a `<span>` with an emoji-first font-family stack. On Windows (no flag emoji font) they degrade to ISO letters ("US") — accepted trade-off (see below).

## Accessibility

- One `Field` label tied to the tel input via `htmlFor`/`id` (`useId`), `aria-describedby` for the description — same as Input.
- Country button: `aria-label` announcing current country + calling code; `aria-haspopup="listbox"`, `aria-expanded`.
- Dropdown options announced as a listbox with option roles (Headless UI provides this).
- Error state: `data-status="error"` styling per repo convention; validity itself is the consumer's call (they receive `isValid` in meta and set `status`).

## Trade-offs / accepted risks

- **Emoji flags on Windows** render as ISO letter pairs ("US") since Windows ships no flag emoji font. Accepted for zero dependency cost; the dial code is always shown alongside, so the trigger remains meaningful.
- **`libphonenumber-js/min` metadata** (~65 kB min+gz) is a real but industry-standard cost; `/min` lacks "possible length only" edge precision of `/max`, which is fine for input formatting.
- **Best-effort E.164 while typing** means `onChange` emits partial numbers (e.g. `+1415`); consumers must gate submission on `meta.isValid`, documented in the component JSDoc and story.

## Testing

`PhoneInput.test.tsx` (mirrors Select/Combobox test style, @testing-library/react + user-event):

1. Typing `4155552671` with US selected fires `onChange` with progressive E.164, ending `+14155552671`, `isValid: true`.
2. Blur reformats display to `(415) 555-2671`; E.164 value unchanged.
3. Typing/pasting `+442079460958` auto-switches country to GB, `onCountryChange` fires, blur formats nationally for GB.
4. Dropdown: search "germ" → select Germany → dial code `+49`, existing national digits re-derived, `onChange` fires.
5. Priority countries appear first; `countries` allowlist restricts the list.
6. Empty/cleared input fires `onChange(null, ...)`.
7. Forwarded `ref.focus()` focuses the tel input.
8. `status="error"` renders `data-status="error"`; disabled renders read-only.
9. Controlled `value` change from outside re-derives country + display.

Storybook: default, controlled (with live E.164 + validity readout), error status, disabled, restricted country list, priority countries, GB default.

## Documentation updates

- `AGENTS.md` + `public/llms.txt`: add PhoneInput to component lists with API summary.
- `CLAUDE.md`: no architecture changes needed (component follows existing patterns); mention only if the emoji-flag or libphonenumber pattern becomes reusable.
