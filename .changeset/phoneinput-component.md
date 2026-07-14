---
"paris": minor
---

Add `PhoneInput`: a phone number input with a searchable country selector. `value`/`onChange` carry E.164 (`onChange` also receives `{ country, isValid, nationalValue }` metadata); the display is sanitized while typing and formatted to the country's national format on blur. Supports `defaultCountry`, `countries` allowlist, `priorityCountries`, `locale` for country names, `status="error"`, and ref forwarding for `react-hook-form` `setFocus`. Adds `libphonenumber-js` as a dependency.
