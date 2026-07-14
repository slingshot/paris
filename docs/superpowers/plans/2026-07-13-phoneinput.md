# PhoneInput Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `PhoneInput` component to Paris that combines a searchable country selector with a phone number input in one bordered field — display formats to localized national format on blur, `value`/`onChange` carry E.164.

**Architecture:** Follows the Select/Combobox internal pattern: compose `Field` + `Input.module.scss`'s `inputContainer` directly (never nest the public `Input`). Pure parsing/formatting logic lives in two helper modules (`countries.ts`, `phone.ts`) built on `libphonenumber-js/min`; the country dropdown is an internal `CountrySelect` component built on Headless UI `Popover` with manual listbox semantics.

**Tech Stack:** React 19, TypeScript 5, SCSS modules with `--pte-*` theme vars, Headless UI v2 (`Popover`), libphonenumber-js (`/min` entry), Vitest (jsdom `unit` project) + Testing Library, Storybook.

**Spec:** `docs/superpowers/specs/2026-07-13-phoneinput-design.md` (approved).

## Global Constraints

- Package manager/runtime: **Bun** (`bun add`, `bun run ...`).
- All phone logic imports from **`libphonenumber-js/min`** — never the root `libphonenumber-js` entry (root pulls larger metadata).
- Conventional commits enforced by commitlint (lefthook `commit-msg` hook). **Never add Claude attribution / Co-Authored-By lines to commits.**
- Lefthook pre-commit runs Biome + CSS var validation on staged files: run `bun run lint:fix` before every commit; only use CSS custom properties that already exist in the theme (all vars in this plan are copied from existing Paris SCSS).
- Components using hooks/handlers need `'use client'` as the first line.
- SCSS modules only — no inline styles (CSS custom properties passed via `style` for dropdown max-height follow the existing Select/Combobox precedent).
- Tests: `bun run test <path>` runs the jsdom `unit` Vitest project (globals enabled — `describe`/`it`/`vi` need no import). Shared render helper: `src/test/render.tsx` (returns `{ user }` from `userEvent.setup()`).
- Node 22 (full ICU): `Intl.DisplayNames` returns real English region names in tests.
- Do **not** `git add` unrelated pre-existing untracked files (`.design-sync/`, `.ds-sync/`, `ds-bundle/`, `index.d.ts`) — always stage explicit paths.

---

### Task 1: Dependency, scaffold, and package export

**Files:**
- Modify: `package.json` (dependency via `bun add`; `./phoneinput` export via generator)
- Modify: `bun.lock`
- Create (via scaffolder): `src/stories/phoneinput/PhoneInput.tsx`, `src/stories/phoneinput/PhoneInput.module.scss`, `src/stories/phoneinput/PhoneInput.stories.ts`, `src/stories/phoneinput/index.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `libphonenumber-js` available as a dependency; `src/stories/phoneinput/` directory with placeholder component; `package.json` exports map contains `./phoneinput`. Later tasks replace the placeholder files' contents.

- [ ] **Step 1: Add the dependency**

Run: `bun add libphonenumber-js`
Expected: `package.json` `dependencies` gains `"libphonenumber-js": "^1.x"`.

- [ ] **Step 2: Scaffold the component**

Run: `bun run create:component PhoneInput`
Expected: `✅  Component PhoneInput created!` and four files under `src/stories/phoneinput/`.

- [ ] **Step 3: Regenerate exports**

Run: `bun run generate:exports`
Then: `git diff package.json`
Expected: exports map contains:

```json
"./phoneinput": {
    "types": "./dist/stories/phoneinput/index.d.ts",
    "import": "./dist/stories/phoneinput/index.js"
},
```

- [ ] **Step 4: Verify typecheck passes**

Run: `bun run typecheck`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
bun run lint:fix
git add package.json bun.lock src/stories/phoneinput
git commit -m "chore: add libphonenumber-js and scaffold PhoneInput"
```

---

### Task 2: Country list helpers (`countries.ts`)

**Files:**
- Create: `src/stories/phoneinput/countries.ts`
- Test: `src/stories/phoneinput/countries.test.ts`

**Interfaces:**
- Consumes: `getCountries`, `getCountryCallingCode`, type `CountryCode` from `libphonenumber-js/min`.
- Produces (used by Tasks 4–5):
  - `type CountryEntry = { code: CountryCode; name: string; callingCode: string; flag: string }`
  - `getFlagEmoji(country: string): string`
  - `buildCountryList(options?: { countries?: CountryCode[]; priorityCountries?: CountryCode[]; locale?: string }): CountryEntry[]`
  - `filterCountries(list: CountryEntry[], query: string): CountryEntry[]`

- [ ] **Step 1: Write the failing tests**

Create `src/stories/phoneinput/countries.test.ts`:

```ts
import { buildCountryList, filterCountries, getFlagEmoji } from './countries';

describe('getFlagEmoji', () => {
    it('maps ISO codes onto regional indicator symbols', () => {
        expect(getFlagEmoji('US')).toBe('\u{1F1FA}\u{1F1F8}');
        expect(getFlagEmoji('gb')).toBe('\u{1F1EC}\u{1F1E7}');
    });
});

describe('buildCountryList', () => {
    it('builds entries with localized names, calling codes, and flags', () => {
        const list = buildCountryList({ locale: 'en' });
        const us = list.find((entry) => entry.code === 'US');
        expect(us).toEqual({
            code: 'US',
            name: 'United States',
            callingCode: '1',
            flag: '\u{1F1FA}\u{1F1F8}',
        });
        expect(list.length).toBeGreaterThan(200);
    });

    it('sorts by localized display name', () => {
        const list = buildCountryList({ locale: 'en' });
        const names = list.map((entry) => entry.name);
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')));
    });

    it('restricts to an allowlist when countries is provided', () => {
        const list = buildCountryList({ countries: ['US', 'CA'], locale: 'en' });
        expect(list.map((entry) => entry.code).sort()).toEqual(['CA', 'US']);
    });

    it('pins priority countries first, in the given order', () => {
        const list = buildCountryList({ priorityCountries: ['GB', 'IN'], locale: 'en' });
        expect(list[0].code).toBe('GB');
        expect(list[1].code).toBe('IN');
        // Not duplicated later in the list
        expect(list.filter((entry) => entry.code === 'GB')).toHaveLength(1);
    });
});

describe('filterCountries', () => {
    const list = buildCountryList({ locale: 'en' });

    it('returns the full list for an empty query', () => {
        expect(filterCountries(list, '')).toEqual(list);
        expect(filterCountries(list, '   ')).toEqual(list);
    });

    it('matches by partial country name, case-insensitively', () => {
        const results = filterCountries(list, 'germ');
        expect(results.map((entry) => entry.code)).toContain('DE');
    });

    it('matches by exact ISO code', () => {
        const results = filterCountries(list, 'us');
        expect(results.map((entry) => entry.code)).toContain('US');
    });

    it('matches by dial code with or without a leading +', () => {
        expect(filterCountries(list, '+49').map((entry) => entry.code)).toContain('DE');
        expect(filterCountries(list, '49').map((entry) => entry.code)).toContain('DE');
    });

    it('returns an empty array when nothing matches', () => {
        expect(filterCountries(list, 'zzzz')).toEqual([]);
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/stories/phoneinput/countries.test.ts`
Expected: FAIL — `Cannot find module './countries'` (or equivalent resolve error).

- [ ] **Step 3: Write the implementation**

Create `src/stories/phoneinput/countries.ts`:

```ts
import type { CountryCode } from 'libphonenumber-js/min';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/min';

export type CountryEntry = {
    /** ISO 3166-1 alpha-2 region code (e.g. "US"). */
    code: CountryCode;
    /** Localized display name (e.g. "United States"). */
    name: string;
    /** Country calling code without the leading + (e.g. "1"). */
    callingCode: string;
    /** Emoji flag computed from the region code (e.g. "🇺🇸"). */
    flag: string;
};

/**
 * Converts an ISO 3166-1 alpha-2 region code into its emoji flag by mapping each
 * letter onto the Regional Indicator Symbol block (A → U+1F1E6). Note: Windows
 * ships no flag emoji font, so these render as letter pairs ("US") there.
 */
export const getFlagEmoji = (country: string): string =>
    String.fromCodePoint(...[...country.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));

const displayNamesFor = (locale?: string): Intl.DisplayNames | undefined => {
    try {
        return new Intl.DisplayNames(locale ? [locale] : undefined, { type: 'region' });
    } catch {
        return undefined;
    }
};

/**
 * Builds the selectable country list for {@link PhoneInput}: optionally
 * restricted to `countries`, with `priorityCountries` pinned first (in the
 * given order) and the rest sorted by localized display name.
 */
export const buildCountryList = (options?: {
    countries?: CountryCode[];
    priorityCountries?: CountryCode[];
    locale?: string;
}): CountryEntry[] => {
    const { countries, priorityCountries = [], locale } = options ?? {};
    const displayNames = displayNamesFor(locale);
    const allowed = countries ? getCountries().filter((code) => countries.includes(code)) : getCountries();
    const entries = allowed.map((code) => ({
        code,
        name: displayNames?.of(code) ?? code,
        callingCode: getCountryCallingCode(code),
        flag: getFlagEmoji(code),
    }));
    const priority = priorityCountries
        .map((code) => entries.find((entry) => entry.code === code))
        .filter((entry): entry is CountryEntry => Boolean(entry));
    const rest = entries
        .filter((entry) => !priorityCountries.includes(entry.code))
        .sort((a, b) => a.name.localeCompare(b.name, locale));
    return [...priority, ...rest];
};

/**
 * Filters a country list by localized name (substring), exact ISO code, or
 * dial code prefix (with or without a leading +).
 */
export const filterCountries = (list: CountryEntry[], query: string): CountryEntry[] => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    const dialQuery = q.replace(/^\+/, '');
    const isDialQuery = dialQuery.length > 0 && /^\d+$/.test(dialQuery);
    return list.filter(
        (entry) =>
            entry.name.toLowerCase().includes(q) ||
            entry.code.toLowerCase() === q ||
            (isDialQuery && entry.callingCode.startsWith(dialQuery)),
    );
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test src/stories/phoneinput/countries.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```bash
bun run lint:fix
git add src/stories/phoneinput/countries.ts src/stories/phoneinput/countries.test.ts
git commit -m "feat: add country list helpers for PhoneInput"
```

---

### Task 3: Phone value helpers (`phone.ts`)

**Files:**
- Create: `src/stories/phoneinput/phone.ts`
- Test: `src/stories/phoneinput/phone.test.ts`

**Interfaces:**
- Consumes: `AsYouType`, `parsePhoneNumberFromString`, type `CountryCode` from `libphonenumber-js/min`.
- Produces (used by Task 5):
  - `type DerivedPhoneValue = { e164: string | null; country: CountryCode | undefined; isValid: boolean; nationalValue: string }`
  - `sanitizePhoneText(text: string): string`
  - `derivePhoneValue(text: string, country: CountryCode): DerivedPhoneValue`
  - `formatDisplayValue(text: string, country: CountryCode): string` — blur formatting
  - `formatNationalDigits(nationalDigits: string, country: CountryCode): string` — country-switch display
  - `parseE164(value: string): { country: CountryCode | undefined; display: string }` — controlled-value reconciliation

- [ ] **Step 1: Write the failing tests**

Create `src/stories/phoneinput/phone.test.ts`:

```ts
import { derivePhoneValue, formatDisplayValue, formatNationalDigits, parseE164, sanitizePhoneText } from './phone';

describe('sanitizePhoneText', () => {
    it('strips characters a phone number cannot contain', () => {
        expect(sanitizePhoneText('abc415!@#')).toBe('415');
        expect(sanitizePhoneText('(415) 555-2671')).toBe('(415) 555-2671');
    });

    it('keeps + only in the leading position', () => {
        expect(sanitizePhoneText('+1 (415) 555-2671')).toBe('+1 (415) 555-2671');
        expect(sanitizePhoneText('44+20')).toBe('4420');
    });
});

describe('derivePhoneValue', () => {
    it('derives full E.164 with validity for a complete national number', () => {
        expect(derivePhoneValue('4155552671', 'US')).toEqual({
            e164: '+14155552671',
            country: 'US',
            isValid: true,
            nationalValue: '4155552671',
        });
    });

    it('derives best-effort partial E.164 while typing', () => {
        const partial = derivePhoneValue('4155', 'US');
        expect(partial.e164).toBe('+14155');
        expect(partial.isValid).toBe(false);
    });

    it('detects the country from a + prefix, overriding the selected country', () => {
        const result = derivePhoneValue('+442079460958', 'US');
        expect(result.country).toBe('GB');
        expect(result.e164).toBe('+442079460958');
        expect(result.isValid).toBe(true);
    });

    it('returns null E.164 for empty input', () => {
        expect(derivePhoneValue('', 'US')).toEqual({
            e164: null,
            country: 'US',
            isValid: false,
            nationalValue: '',
        });
    });

    it('ignores formatting punctuation in the text', () => {
        expect(derivePhoneValue('(415) 555-2671', 'US').e164).toBe('+14155552671');
    });
});

describe('formatDisplayValue', () => {
    it('formats a complete number nationally for the selected country', () => {
        expect(formatDisplayValue('4155552671', 'US')).toBe('(415) 555-2671');
        expect(formatDisplayValue('+442079460958', 'GB')).toBe('020 7946 0958');
    });

    it('formats internationally when the number belongs to another region', () => {
        // Canadian NANPA number while US is selected
        expect(formatDisplayValue('+12045551234', 'US')).toBe('+1 204 555 1234');
    });

    it('leaves unparseable partial input as sanitized text', () => {
        expect(formatDisplayValue('415555', 'US')).toBe('415555');
    });
});

describe('formatNationalDigits', () => {
    it('formats complete national digits with trunk prefix rules', () => {
        expect(formatNationalDigits('4155552671', 'US')).toBe('(415) 555-2671');
        expect(formatNationalDigits('2079460958', 'GB')).toBe('020 7946 0958');
    });

    it('keeps all digits for partial input', () => {
        const partial = formatNationalDigits('41555', 'US');
        expect(partial.replace(/\D/g, '')).toBe('41555');
    });
});

describe('parseE164', () => {
    it('derives country and national display from an E.164 string', () => {
        expect(parseE164('+14155552671')).toEqual({ country: 'US', display: '(415) 555-2671' });
        expect(parseE164('+442079460958')).toEqual({ country: 'GB', display: '020 7946 0958' });
    });

    it('falls back to the raw value when unparseable', () => {
        expect(parseE164('+1415')).toEqual({ country: undefined, display: '+1415' });
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/stories/phoneinput/phone.test.ts`
Expected: FAIL — `Cannot find module './phone'`.

- [ ] **Step 3: Write the implementation**

Create `src/stories/phoneinput/phone.ts`:

```ts
import type { CountryCode } from 'libphonenumber-js/min';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js/min';

export type DerivedPhoneValue = {
    /** Best-effort E.164 value (partial while typing, e.g. "+1415"), or null when no digits are present. */
    e164: string | null;
    /** Region detected from the text (e.g. a + prefix), falling back to the selected country. */
    country: CountryCode | undefined;
    /** Full libphonenumber validation result. */
    isValid: boolean;
    /** National (significant) digits, without calling code or formatting. */
    nationalValue: string;
};

/**
 * Strips characters a phone number can't contain. Digits, spaces, parens,
 * dashes, and dots survive; '+' survives only in the leading position.
 */
export const sanitizePhoneText = (text: string): string =>
    text.replace(/[^\d\s().+-]/g, '').replace(/(?!^)\+/g, '');

/**
 * Derives the E.164 value and metadata from free-form input text. Uses
 * AsYouType so partial input still yields a best-effort E.164.
 */
export const derivePhoneValue = (text: string, country: CountryCode): DerivedPhoneValue => {
    const formatter = new AsYouType(country);
    formatter.input(text);
    const number = formatter.getNumber();
    return {
        e164: number?.number ?? null,
        country: number?.country ?? (formatter.isInternational() ? undefined : country),
        isValid: number?.isValid() ?? false,
        nationalValue: number?.nationalNumber ?? text.replace(/\D/g, ''),
    };
};

/**
 * Formats input text for display after blur: national format when the number
 * belongs to the selected country, international format otherwise, and the
 * sanitized raw text when the number can't be parsed (e.g. too short).
 */
export const formatDisplayValue = (text: string, country: CountryCode): string => {
    const parsed = parsePhoneNumberFromString(text, country);
    if (!parsed) return sanitizePhoneText(text);
    return !parsed.country || parsed.country === country ? parsed.formatNational() : parsed.formatInternational();
};

/**
 * Formats national digits for a country, used when switching countries with
 * digits already entered. Complete numbers get full national formatting
 * (including trunk prefixes, e.g. GB's leading 0); partial numbers get
 * best-effort as-you-type grouping.
 */
export const formatNationalDigits = (nationalDigits: string, country: CountryCode): string => {
    const parsed = parsePhoneNumberFromString(nationalDigits, country);
    if (parsed) return parsed.formatNational();
    return new AsYouType(country).input(nationalDigits);
};

/**
 * Parses a stored E.164 value back into a selected country + display text,
 * used to initialize state and reconcile external controlled-value updates.
 */
export const parseE164 = (value: string): { country: CountryCode | undefined; display: string } => {
    const parsed = parsePhoneNumberFromString(value);
    if (!parsed) return { country: undefined, display: value };
    return { country: parsed.country, display: parsed.formatNational() };
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test src/stories/phoneinput/phone.test.ts`
Expected: PASS. If an exact-format assertion fails (e.g. `'020 7946 0958'`), check the actual output — libphonenumber's formatting is stable, so a mismatch means the helper (not the library) mishandled trunk prefixes; fix the helper, not the assertion, unless the actual output is a correctly formatted number in a trivially different grouping.

- [ ] **Step 5: Commit**

```bash
bun run lint:fix
git add src/stories/phoneinput/phone.ts src/stories/phoneinput/phone.test.ts
git commit -m "feat: add phone parsing and formatting helpers for PhoneInput"
```

---

### Task 4: Country picker dropdown (`CountrySelect` + styles)

**Files:**
- Create: `src/stories/phoneinput/CountrySelect.tsx`
- Modify: `src/stories/phoneinput/PhoneInput.module.scss` (replace scaffold content entirely)
- Test: `src/stories/phoneinput/CountrySelect.test.tsx`

**Interfaces:**
- Consumes: `CountryEntry`, `filterCountries`, `buildCountryList` (Task 2); `Popover`/`PopoverButton`/`PopoverPanel` from `@headlessui/react`; `OpenChangeEffect` from `src/helpers/OpenChangeEffect`; `Check`, `Icon` from `../icon`; `Text` from `../text`; `selectStyles` from `../select/Select.module.scss`.
- Produces (used by Task 5): internal component `CountrySelect: FC<CountrySelectProps>` with props `{ countryList: CountryEntry[]; selected: CountryEntry; onSelect: (country: CountryCode) => void; focusOnCloseRef?: RefObject<HTMLInputElement | null>; disabled?: boolean; status?: 'default' | 'error' | 'success'; overrides?: { countryButton?; searchInput?; optionsContainer?; option? } }`. Also all SCSS classes for Task 5 (`phoneContainer`, `divider`).

- [ ] **Step 1: Write the failing tests**

Create `src/stories/phoneinput/CountrySelect.test.tsx`:

```tsx
import { render, screen, waitFor } from '../../test/render';
import type { CountryEntry } from './countries';
import { buildCountryList } from './countries';
import { CountrySelect } from './CountrySelect';

const list = buildCountryList({ locale: 'en' });
const us = list.find((entry) => entry.code === 'US') as CountryEntry;

describe('CountrySelect', () => {
    it('renders the trigger with flag, calling code, and accessible name', () => {
        render(<CountrySelect countryList={list} selected={us} onSelect={vi.fn()} />);
        const trigger = screen.getByRole('button', { name: 'Country: United States (+1)' });
        expect(trigger).toHaveTextContent('\u{1F1FA}\u{1F1F8}');
        expect(trigger).toHaveTextContent('+1');
    });

    it('opens a searchable dropdown on click', async () => {
        const { user } = render(<CountrySelect countryList={list} selected={us} onSelect={vi.fn()} />);
        await user.click(screen.getByRole('button', { name: 'Country: United States (+1)' }));
        expect(await screen.findByRole('combobox', { name: 'Search countries' })).toBeInTheDocument();
        expect(screen.getByRole('listbox', { name: 'Countries' })).toBeInTheDocument();
    });

    it('marks the selected country and filters by name', async () => {
        const { user } = render(<CountrySelect countryList={list} selected={us} onSelect={vi.fn()} />);
        await user.click(screen.getByRole('button', { name: 'Country: United States (+1)' }));
        const search = await screen.findByRole('combobox', { name: 'Search countries' });

        expect(screen.getByRole('option', { name: /United States/ })).toHaveAttribute('aria-selected', 'true');

        await user.type(search, 'germ');
        const options = screen.getAllByRole('option');
        expect(options.map((option) => option.textContent)).toEqual(
            expect.arrayContaining([expect.stringContaining('Germany')]),
        );
        expect(screen.queryByRole('option', { name: /United States/ })).not.toBeInTheDocument();
    });

    it('filters by dial code', async () => {
        const { user } = render(<CountrySelect countryList={list} selected={us} onSelect={vi.fn()} />);
        await user.click(screen.getByRole('button', { name: 'Country: United States (+1)' }));
        const search = await screen.findByRole('combobox', { name: 'Search countries' });
        await user.type(search, '+49');
        expect(screen.getByRole('option', { name: /Germany/ })).toBeInTheDocument();
    });

    it('selects a country on click and closes the dropdown', async () => {
        const handleSelect = vi.fn();
        const { user } = render(<CountrySelect countryList={list} selected={us} onSelect={handleSelect} />);
        await user.click(screen.getByRole('button', { name: 'Country: United States (+1)' }));
        const search = await screen.findByRole('combobox', { name: 'Search countries' });
        await user.type(search, 'united king');
        await user.click(screen.getByRole('option', { name: /United Kingdom/ }));

        expect(handleSelect).toHaveBeenCalledWith('GB');
        await waitFor(() => {
            expect(screen.queryByRole('combobox', { name: 'Search countries' })).not.toBeInTheDocument();
        });
    });

    it('supports keyboard selection with arrow keys and Enter', async () => {
        const handleSelect = vi.fn();
        const { user } = render(<CountrySelect countryList={list} selected={us} onSelect={handleSelect} />);
        await user.click(screen.getByRole('button', { name: 'Country: United States (+1)' }));
        const search = await screen.findByRole('combobox', { name: 'Search countries' });
        await user.type(search, 'canad');
        await user.keyboard('{Enter}');
        expect(handleSelect).toHaveBeenCalledWith('CA');
    });

    it('shows an empty state when nothing matches', async () => {
        const { user } = render(<CountrySelect countryList={list} selected={us} onSelect={vi.fn()} />);
        await user.click(screen.getByRole('button', { name: 'Country: United States (+1)' }));
        const search = await screen.findByRole('combobox', { name: 'Search countries' });
        await user.type(search, 'zzzz');
        expect(screen.getByText('No countries found')).toBeInTheDocument();
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('does not open when disabled', async () => {
        const { user } = render(<CountrySelect countryList={list} selected={us} onSelect={vi.fn()} disabled />);
        const trigger = screen.getByRole('button', { name: 'Country: United States (+1)' });
        expect(trigger).toHaveAttribute('aria-disabled', 'true');
        await user.click(trigger);
        expect(screen.queryByRole('combobox', { name: 'Search countries' })).not.toBeInTheDocument();
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/stories/phoneinput/CountrySelect.test.tsx`
Expected: FAIL — `Cannot find module './CountrySelect'`.

- [ ] **Step 3: Replace the scaffolded SCSS**

Replace the entire content of `src/stories/phoneinput/PhoneInput.module.scss` with:

```scss
// Overrides on the base inputContainer: the country trigger supplies its own
// left padding, and the divider supplies the gap. Doubled selectors beat the
// equal-specificity base classes regardless of CSS order across module files.
.phoneContainer.phoneContainer {
    gap: 0;
    padding-left: 0;
}

.countrySelect {
    display: flex;
    align-self: stretch;
    flex-shrink: 0;
}

.countryButton {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;

    padding: 0 10px 0 13px;
    margin: 0;
    border: none;
    background: transparent;
    cursor: pointer;

    color: var(--pte-new-colors-contentPrimary);
    transition: var(--pte-animations-interaction);

    &:hover .chevron,
    &[data-open] .chevron {
        color: var(--pte-new-colors-contentPrimary);
    }

    &[aria-disabled="true"],
    &[data-status="disabled"] {
        pointer-events: none;

        &, & * {
            color: var(--pte-new-colors-contentDisabled);
        }
    }
}

.flag {
    font-size: 16px;
    line-height: 1;
}

.callingCode.callingCode {
    color: var(--pte-new-colors-contentSecondary);
}

.chevron {
    color: var(--pte-new-colors-contentTertiary);
    transition: var(--pte-animations-interaction);
}

.divider {
    align-self: stretch;
    flex-shrink: 0;
    width: 1px;
    margin: 5px 12px 5px 0;
    background-color: var(--pte-new-colors-borderMedium);
}

.countryOptions.countryOptions {
    width: 300px;
    padding: 0;
    isolation: isolate;
}

.searchContainer {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 10px 14px;
    background-color: var(--pte-new-colors-surfacePrimary);
    border-bottom: 0.5px solid var(--pte-new-colors-borderMedium);
}

.searchInput {
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background: transparent;

    color: var(--pte-new-colors-contentPrimary);
    font-size: var(--pte-typography-styles-paragraphSmall-fontSize);
    font-style: var(--pte-typography-styles-paragraphSmall-fontStyle);
    font-weight: var(--pte-typography-styles-paragraphSmall-fontWeight);
    letter-spacing: var(--pte-typography-styles-paragraphSmall-letterSpacing);
    line-height: var(--pte-typography-styles-paragraphSmall-lineHeight);

    &::placeholder {
        color: var(--pte-new-colors-contentTertiary);
    }
}

.countryList {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.countryOption.countryOption {
    justify-content: flex-start;
    cursor: pointer;
}

.countryName {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dialCode.dialCode {
    color: var(--pte-new-colors-contentTertiary);
}

.noResults {
    padding: 10px 14px;
    color: var(--pte-new-colors-contentTertiary);
}
```

- [ ] **Step 4: Write the component**

Create `src/stories/phoneinput/CountrySelect.tsx`:

```tsx
'use client';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { clsx } from 'clsx';
import type { CountryCode } from 'libphonenumber-js/min';
import type { ComponentPropsWithoutRef, CSSProperties, FC, RefObject } from 'react';
import { useId, useMemo, useState } from 'react';
import { OpenChangeEffect } from '../../helpers/OpenChangeEffect';
import { Check, Icon } from '../icon';
import selectStyles from '../select/Select.module.scss';
import { Text } from '../text';
import type { CountryEntry } from './countries';
import { filterCountries } from './countries';
import styles from './PhoneInput.module.scss';

export type CountrySelectProps = {
    /** The selectable countries, already allowlisted and priority-ordered. */
    countryList: CountryEntry[];
    /** The currently selected country entry. */
    selected: CountryEntry;
    onSelect: (country: CountryCode) => void;
    /** Element to focus when the dropdown closes after a selection (the tel input). */
    focusOnCloseRef?: RefObject<HTMLInputElement | null>;
    disabled?: boolean;
    status?: 'default' | 'error' | 'success';
    overrides?: {
        countryButton?: ComponentPropsWithoutRef<'button'>;
        searchInput?: ComponentPropsWithoutRef<'input'>;
        optionsContainer?: ComponentPropsWithoutRef<'div'>;
        option?: ComponentPropsWithoutRef<'li'>;
    };
};

/**
 * Internal country picker for PhoneInput: a compact flag + calling code
 * trigger that opens a searchable country dropdown. Keyboard navigation is
 * managed manually via aria-activedescendant on the search input, so options
 * themselves are never focused. Not exported from the package entry point.
 */
export const CountrySelect: FC<CountrySelectProps> = ({
    countryList,
    selected,
    onSelect,
    focusOnCloseRef,
    disabled,
    status,
    overrides,
}) => {
    const listboxId = useId();
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const filtered = useMemo(() => filterCountries(countryList, query), [countryList, query]);
    const dataStatus = disabled ? 'disabled' : status || 'default';

    return (
        <Popover className={styles.countrySelect}>
            {({ open, close }) => {
                const selectAndClose = (code: CountryCode) => {
                    onSelect(code);
                    close(focusOnCloseRef?.current ?? undefined);
                };
                return (
                    <>
                        <OpenChangeEffect
                            open={open}
                            onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                    setQuery('');
                                    setActiveIndex(0);
                                }
                            }}
                        />
                        <PopoverButton
                            {...overrides?.countryButton}
                            disabled={disabled}
                            aria-disabled={disabled}
                            data-status={dataStatus}
                            aria-label={`Country: ${selected.name} (+${selected.callingCode})`}
                            className={clsx(styles.countryButton, overrides?.countryButton?.className)}
                            onClick={(e) => {
                                // Stop the Field container's click handler from stealing focus to the tel input.
                                e.stopPropagation();
                                overrides?.countryButton?.onClick?.(e);
                            }}
                        >
                            <span className={styles.flag} aria-hidden>
                                {selected.flag}
                            </span>
                            <Text as="span" kind="paragraphSmall" className={styles.callingCode}>
                                +{selected.callingCode}
                            </Text>
                            <FontAwesomeIcon icon={faChevronDown} width="10px" className={styles.chevron} />
                        </PopoverButton>
                        <PopoverPanel
                            anchor={{ to: 'bottom start', gap: 9 }}
                            transition
                            {...overrides?.optionsContainer}
                            className={clsx(
                                selectStyles.options,
                                styles.countryOptions,
                                overrides?.optionsContainer?.className,
                            )}
                            style={
                                {
                                    '--options-maxHeight': '320px',
                                    ...overrides?.optionsContainer?.style,
                                } as CSSProperties
                            }
                        >
                            <div className={styles.searchContainer}>
                                <input
                                    // biome-ignore lint/a11y/noAutofocus: the search input is the dropdown's entry point; focusing it on open is the expected combobox behavior.
                                    autoFocus
                                    {...overrides?.searchInput}
                                    role="combobox"
                                    aria-expanded={open}
                                    aria-controls={listboxId}
                                    aria-activedescendant={
                                        filtered[activeIndex] ? `${listboxId}-${filtered[activeIndex].code}` : undefined
                                    }
                                    aria-label="Search countries"
                                    placeholder="Search countries"
                                    value={query}
                                    className={clsx(styles.searchInput, overrides?.searchInput?.className)}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setActiveIndex(0);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowDown') {
                                            e.preventDefault();
                                            setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
                                        } else if (e.key === 'ArrowUp') {
                                            e.preventDefault();
                                            setActiveIndex((index) => Math.max(index - 1, 0));
                                        } else if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const entry = filtered[activeIndex];
                                            if (entry) selectAndClose(entry.code);
                                        }
                                    }}
                                />
                            </div>
                            <ul role="listbox" id={listboxId} aria-label="Countries" className={styles.countryList}>
                                {filtered.map((entry, index) => (
                                    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection is handled by the search input via aria-activedescendant; options are never focused directly.
                                    <li
                                        key={entry.code}
                                        id={`${listboxId}-${entry.code}`}
                                        role="option"
                                        aria-selected={entry.code === selected.code}
                                        data-selected={entry.code === selected.code ? '' : undefined}
                                        data-active={index === activeIndex ? '' : undefined}
                                        {...overrides?.option}
                                        className={clsx(
                                            selectStyles.option,
                                            styles.countryOption,
                                            overrides?.option?.className,
                                        )}
                                        onPointerMove={() => setActiveIndex(index)}
                                        onClick={() => selectAndClose(entry.code)}
                                    >
                                        <span className={styles.flag} aria-hidden>
                                            {entry.flag}
                                        </span>
                                        <Text as="span" kind="paragraphSmall" className={styles.countryName}>
                                            {entry.name}
                                        </Text>
                                        <Text as="span" kind="paragraphXSmall" className={styles.dialCode}>
                                            +{entry.callingCode}
                                        </Text>
                                        <Icon icon={Check} size={12} className={selectStyles.check} />
                                    </li>
                                ))}
                                {filtered.length === 0 && (
                                    <li className={styles.noResults}>
                                        <Text as="span" kind="paragraphSmall">
                                            No countries found
                                        </Text>
                                    </li>
                                )}
                            </ul>
                        </PopoverPanel>
                    </>
                );
            }}
        </Popover>
    );
};
```

Notes for the implementer:
- Check `src/helpers/OpenChangeEffect.tsx` for the exact export/prop names before using (Select and Combobox both use `<OpenChangeEffect open={open} onOpenChange={...} />`).
- If Biome flags different a11y rule names than the `biome-ignore` comments above, update the comment to the reported rule — keep the justification text.
- If `close(element)` doesn't accept the ref target type, cast: `close(focusOnCloseRef?.current ?? undefined)` matches Headless UI v2's `close(focusableElement?)` signature.

- [ ] **Step 5: Run tests to verify they pass**

Run: `bun run test src/stories/phoneinput/CountrySelect.test.tsx`
Expected: PASS.

- [ ] **Step 6: Typecheck and commit**

```bash
bun run typecheck
bun run lint:fix
git add src/stories/phoneinput/CountrySelect.tsx src/stories/phoneinput/CountrySelect.test.tsx src/stories/phoneinput/PhoneInput.module.scss
git commit -m "feat: add searchable country dropdown for PhoneInput"
```

---

### Task 5: PhoneInput component, stories, and exports

**Files:**
- Modify: `src/stories/phoneinput/PhoneInput.tsx` (replace scaffold content entirely)
- Modify: `src/stories/phoneinput/PhoneInput.stories.ts` (replace scaffold content entirely)
- Modify: `src/stories/phoneinput/index.ts`
- Test: `src/stories/phoneinput/PhoneInput.test.tsx`

**Interfaces:**
- Consumes: `CountrySelect` (Task 4), `buildCountryList` + `CountryEntry` (Task 2), all `phone.ts` helpers (Task 3), `Field`/`FieldProps`, `inputStyles` from `../input/Input.module.scss`.
- Produces (public API from `paris/phoneinput`): `PhoneInput` (forwardRef to `HTMLInputElement`), `PhoneInputProps`, `PhoneInputChangeMeta`, re-exported type `CountryCode`.

- [ ] **Step 1: Write the failing tests**

Create `src/stories/phoneinput/PhoneInput.test.tsx`:

```tsx
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '../../test/render';
import { PhoneInput } from './PhoneInput';

describe('PhoneInput', () => {
    it('emits progressive E.164 while typing and keeps the display as typed', async () => {
        const handleChange = vi.fn();
        const { user } = render(<PhoneInput label="Phone" onChange={handleChange} />);
        const input = screen.getByLabelText('Phone');

        await user.type(input, '4155');
        expect(handleChange).toHaveBeenLastCalledWith('+14155', expect.objectContaining({ isValid: false }));
        expect(input).toHaveValue('4155');

        await user.type(input, '552671');
        expect(handleChange).toHaveBeenLastCalledWith(
            '+14155552671',
            expect.objectContaining({ country: 'US', isValid: true, nationalValue: '4155552671' }),
        );
        expect(input).toHaveValue('4155552671');
    });

    it('sanitizes disallowed characters while typing', async () => {
        const { user } = render(<PhoneInput label="Phone" />);
        const input = screen.getByLabelText('Phone');
        await user.type(input, '415abc!555');
        expect(input).toHaveValue('415555');
    });

    it('formats the display nationally on blur', async () => {
        const { user } = render(<PhoneInput label="Phone" />);
        const input = screen.getByLabelText('Phone');
        await user.type(input, '4155552671');
        await user.tab();
        expect(input).toHaveValue('(415) 555-2671');
    });

    it('leaves partial input unformatted on blur', async () => {
        const { user } = render(<PhoneInput label="Phone" />);
        const input = screen.getByLabelText('Phone');
        await user.type(input, '415555');
        await user.tab();
        expect(input).toHaveValue('415555');
    });

    it('switches country when an international number is typed', async () => {
        const handleCountryChange = vi.fn();
        const { user } = render(<PhoneInput label="Phone" onCountryChange={handleCountryChange} />);
        const input = screen.getByLabelText('Phone');

        await user.type(input, '+442079460958');
        expect(handleCountryChange).toHaveBeenCalledWith('GB');
        expect(screen.getByRole('button', { name: 'Country: United Kingdom (+44)' })).toBeInTheDocument();

        await user.tab();
        expect(input).toHaveValue('020 7946 0958');
    });

    it('re-derives E.164 from national digits when the country changes', async () => {
        const handleChange = vi.fn();
        const { user } = render(<PhoneInput label="Phone" onChange={handleChange} />);
        const input = screen.getByLabelText('Phone');
        await user.type(input, '2079460958');
        expect(handleChange).toHaveBeenLastCalledWith('+12079460958', expect.anything());

        await user.click(screen.getByRole('button', { name: 'Country: United States (+1)' }));
        const search = await screen.findByRole('combobox', { name: 'Search countries' });
        await user.type(search, 'united king');
        await user.click(screen.getByRole('option', { name: /United Kingdom/ }));

        expect(handleChange).toHaveBeenLastCalledWith(
            '+442079460958',
            expect.objectContaining({ country: 'GB', isValid: true }),
        );
        expect(input).toHaveValue('020 7946 0958');
        await waitFor(() => expect(input).toHaveFocus());
    });

    it('emits null when the input is cleared', async () => {
        const handleChange = vi.fn();
        const { user } = render(<PhoneInput label="Phone" defaultValue="+14155552671" onChange={handleChange} />);
        const input = screen.getByLabelText('Phone');
        await user.clear(input);
        expect(handleChange).toHaveBeenLastCalledWith(null, expect.objectContaining({ isValid: false }));
    });

    it('initializes country and display from defaultValue', () => {
        render(<PhoneInput label="Phone" defaultValue="+442079460958" />);
        expect(screen.getByLabelText('Phone')).toHaveValue('020 7946 0958');
        expect(screen.getByRole('button', { name: 'Country: United Kingdom (+44)' })).toBeInTheDocument();
    });

    it('re-derives display and country when a controlled value changes externally', async () => {
        function Harness() {
            const [value, setValue] = useState<string | null>('+14155552671');
            return (
                <>
                    <button type="button" onClick={() => setValue('+442079460958')}>
                        set-gb
                    </button>
                    <PhoneInput label="Phone" value={value} onChange={(next) => setValue(next)} />
                </>
            );
        }
        const { user } = render(<Harness />);
        expect(screen.getByLabelText('Phone')).toHaveValue('(415) 555-2671');

        await user.click(screen.getByText('set-gb'));
        expect(screen.getByLabelText('Phone')).toHaveValue('020 7946 0958');
        expect(screen.getByRole('button', { name: 'Country: United Kingdom (+44)' })).toBeInTheDocument();
    });

    it('respects the countries allowlist and priorityCountries ordering', async () => {
        const { user } = render(
            <PhoneInput label="Phone" countries={['US', 'CA', 'GB']} priorityCountries={['GB']} />,
        );
        await user.click(screen.getByRole('button', { name: 'Country: United States (+1)' }));
        await screen.findByRole('combobox', { name: 'Search countries' });
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent('United Kingdom');
    });

    it('forwards its ref to the tel input for setFocus', () => {
        const ref = createRef<HTMLInputElement>();
        render(<PhoneInput label="Phone" ref={ref} />);
        ref.current?.focus();
        expect(screen.getByLabelText('Phone')).toHaveFocus();
    });

    it('renders error status and disabled state', () => {
        const { rerender } = render(<PhoneInput label="Phone" status="error" />);
        expect(screen.getByLabelText('Phone')).toHaveAttribute('data-status', 'error');

        rerender(<PhoneInput label="Phone" disabled />);
        const input = screen.getByLabelText('Phone');
        expect(input).toHaveAttribute('readonly');
        expect(input).toHaveAttribute('data-status', 'disabled');
        expect(screen.getByRole('button', { name: 'Country: United States (+1)' })).toHaveAttribute(
            'aria-disabled',
            'true',
        );
    });

    it('renders label and description through Field', () => {
        render(<PhoneInput label="Phone" description="Include area code." />);
        expect(screen.getByText('Phone')).toBeInTheDocument();
        expect(screen.getByText('Include area code.')).toBeInTheDocument();
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/stories/phoneinput/PhoneInput.test.tsx`
Expected: FAIL — the scaffold `PhoneInput` has no `label`/`onChange` props (type errors and missing elements).

- [ ] **Step 3: Write the component**

Replace the entire content of `src/stories/phoneinput/PhoneInput.tsx` with:

```tsx
'use client';

import { clsx } from 'clsx';
import type { CountryCode } from 'libphonenumber-js/min';
import type { ChangeEvent, ComponentPropsWithoutRef, FocusEvent, ForwardedRef, ReactNode } from 'react';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FieldProps } from '../field';
import { Field } from '../field';
import inputStyles from '../input/Input.module.scss';
import type { TextProps } from '../text';
import { CountrySelect } from './CountrySelect';
import { buildCountryList } from './countries';
import { derivePhoneValue, formatDisplayValue, formatNationalDigits, parseE164, sanitizePhoneText } from './phone';
import styles from './PhoneInput.module.scss';

export type PhoneInputChangeMeta = {
    /** ISO region detected from the number (e.g. from a `+` prefix), falling back to the selected country. */
    country: CountryCode | undefined;
    /** Whether the current value is a fully valid phone number. Gate submissions on this. */
    isValid: boolean;
    /** The national (significant) digits as currently entered, without calling code or formatting. */
    nationalValue: string;
};

export type PhoneInputProps = {
    /**
     * This is required for accessibility. If the label is not a string, you should provide an `aria-label` prop directly to specify the text used for accessibility.
     */
    label: ReactNode;
    /**
     * The value in E.164 format (e.g. `"+14155552671"`) for controlled usage. `null` or `""` renders an empty input.
     *
     * The displayed text is managed internally (sanitized while typing, formatted to national format on blur); only the E.164 value is controllable.
     */
    value?: string | null;
    /** The initial E.164 value for uncontrolled usage. Ignored when `value` is provided. */
    defaultValue?: string | null;
    /**
     * Fires on every input or country change with the best-effort E.164 value — partial while typing (e.g. `"+1415"`), `null` when empty — plus metadata for validation.
     */
    onChange?: (value: string | null, meta: PhoneInputChangeMeta) => void | Promise<void>;
    /**
     * The country selected when no value dictates one. Should be included in `countries` when an allowlist is provided.
     * @default 'US'
     */
    defaultCountry?: CountryCode;
    /** Restricts the selectable country list. Defaults to all regions known to libphonenumber. */
    countries?: CountryCode[];
    /** Countries pinned to the top of the dropdown, in the given order. */
    priorityCountries?: CountryCode[];
    /** Fires when the selected country changes, via the dropdown or a typed/pasted `+` prefix. */
    onCountryChange?: (country: CountryCode) => void;
    /**
     * The status of the input field.
     * @default default
     */
    status?: 'default' | 'error' | 'success';
    /** BCP 47 locale for country display names in the dropdown. Defaults to the runtime locale. */
    locale?: string;
    /**
     * Prop overrides for other rendered elements. Overrides for the input itself should be passed directly to the component.
     */
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        countryButton?: ComponentPropsWithoutRef<'button'>;
        searchInput?: ComponentPropsWithoutRef<'input'>;
        optionsContainer?: ComponentPropsWithoutRef<'div'>;
        option?: ComponentPropsWithoutRef<'li'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
    };
} & FieldProps &
    Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'children'>;

/**
 * A `PhoneInput` collects phone numbers with a searchable country selector. The value is always
 * E.164 (`"+14155552671"`) — ready for form state — while the display is sanitized as the user
 * types and formatted to the country's national format on blur.
 *
 * > `overrides` available: `container`, `countryButton`, `searchInput`, `optionsContainer`, `option`, `label`, `description`
 *
 * <hr />
 *
 * To use the `PhoneInput` component, import it as follows:
 *
 * ```js
 * import { PhoneInput } from 'paris/phoneinput';
 * ```
 * @constructor
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        {
            label,
            value,
            defaultValue,
            onChange,
            defaultCountry = 'US',
            countries,
            priorityCountries,
            onCountryChange,
            status,
            locale,
            hideLabel,
            description,
            hideDescription,
            descriptionPosition,
            disabled,
            overrides,
            onBlur,
            autoComplete,
            ...props
        },
        ref: ForwardedRef<HTMLInputElement>,
    ) => {
        const inputID = useId();
        const innerRef = useRef<HTMLInputElement | null>(null);

        const countryList = useMemo(
            () => buildCountryList({ countries, priorityCountries, locale }),
            [countries, priorityCountries, locale],
        );
        const allowedCodes = useMemo(() => new Set(countryList.map((entry) => entry.code)), [countryList]);

        const [country, setCountry] = useState<CountryCode>(() => {
            const initial = value ?? defaultValue;
            return (initial ? parseE164(initial).country : undefined) ?? defaultCountry;
        });
        const [displayValue, setDisplayValue] = useState<string>(() => {
            const initial = value ?? defaultValue;
            return initial ? parseE164(initial).display : '';
        });
        const lastEmittedE164 = useRef<string | null>(value ?? defaultValue ?? null);

        // Sync external controlled-value updates (e.g. a form reset) without clobbering the
        // display mid-edit: only re-derive when the incoming value differs from what we emitted.
        useEffect(() => {
            if (value === undefined) return;
            const next = value ?? null;
            if (next === lastEmittedE164.current) return;
            lastEmittedE164.current = next;
            if (!next) {
                setDisplayValue('');
                return;
            }
            const parsed = parseE164(next);
            if (parsed.country) setCountry(parsed.country);
            setDisplayValue(parsed.display);
        }, [value]);

        const selectedEntry = countryList.find((entry) => entry.code === country) ?? countryList[0];

        const emitValue = (text: string, forCountry: CountryCode) => {
            const derived = derivePhoneValue(text, forCountry);
            lastEmittedE164.current = derived.e164;
            onChange?.(derived.e164, {
                country: derived.country,
                isValid: derived.isValid,
                nationalValue: derived.nationalValue,
            });
            return derived;
        };

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const sanitized = sanitizePhoneText(e.target.value);
            setDisplayValue(sanitized);
            const derived = emitValue(sanitized, country);
            // A typed/pasted "+<calling code>" overrides the selected country.
            if (
                sanitized.startsWith('+') &&
                derived.country &&
                derived.country !== country &&
                allowedCodes.has(derived.country)
            ) {
                setCountry(derived.country);
                onCountryChange?.(derived.country);
            }
        };

        const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
            if (displayValue) setDisplayValue(formatDisplayValue(displayValue, country));
            onBlur?.(e);
        };

        const handleCountrySelect = (next: CountryCode) => {
            if (next === country) return;
            setCountry(next);
            onCountryChange?.(next);
            const digits = derivePhoneValue(displayValue, country).nationalValue;
            const display = digits ? formatNationalDigits(digits, next) : '';
            setDisplayValue(display);
            emitValue(display, next);
        };

        const setInputRef = (node: HTMLInputElement | null) => {
            innerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        };

        const fieldStatus = disabled ? 'disabled' : status || 'default';

        return (
            <Field
                htmlFor={inputID}
                label={label}
                hideLabel={hideLabel}
                description={description}
                hideDescription={hideDescription}
                descriptionPosition={descriptionPosition}
                disabled={disabled}
                overrides={{
                    container: overrides?.container,
                    label: overrides?.label,
                    description: overrides?.description,
                }}
            >
                <div className={clsx(inputStyles.inputContainer, styles.phoneContainer)} data-status={fieldStatus}>
                    <CountrySelect
                        countryList={countryList}
                        selected={selectedEntry}
                        onSelect={handleCountrySelect}
                        focusOnCloseRef={innerRef}
                        disabled={disabled}
                        status={status}
                        overrides={{
                            countryButton: overrides?.countryButton,
                            searchInput: overrides?.searchInput,
                            optionsContainer: overrides?.optionsContainer,
                            option: overrides?.option,
                        }}
                    />
                    <div className={styles.divider} aria-hidden />
                    <div className={inputStyles.inputScaleWrapper}>
                        <input
                            {...props}
                            id={inputID}
                            ref={setInputRef}
                            type="tel"
                            autoComplete={autoComplete ?? 'tel'}
                            value={displayValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-label={typeof label === 'string' ? label : props['aria-label']}
                            aria-describedby={`${inputID}-description`}
                            aria-disabled={disabled}
                            data-status={fieldStatus}
                            readOnly={disabled}
                            className={clsx(props.className, inputStyles.input)}
                        />
                    </div>
                </div>
            </Field>
        );
    },
);
```

- [ ] **Step 4: Update the entry point**

Replace `src/stories/phoneinput/index.ts` with:

```ts
export * from './PhoneInput';
export type { CountryCode } from 'libphonenumber-js/min';
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `bun run test src/stories/phoneinput/PhoneInput.test.tsx`
Expected: PASS. If the focus-return assertion (`input` focused after country selection) fails, verify Headless UI's `close(element)` receives a non-null element — the ref must be read at close time (it is, via `focusOnCloseRef?.current`), not captured earlier.

- [ ] **Step 6: Replace the scaffolded stories**

Replace the entire content of `src/stories/phoneinput/PhoneInput.stories.ts` with:

```ts
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { createElement, useState } from 'react';
import type { PhoneInputChangeMeta, PhoneInputProps } from './PhoneInput';
import { PhoneInput } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
    title: 'Inputs/PhoneInput',
    component: PhoneInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
    args: {
        label: 'Phone number',
        description: 'Include your area code.',
        placeholder: '(555) 555-5555',
    },
};

// This file is .ts (no JSX), so the controlled demo composes with createElement.
function ControlledDemo(args: PhoneInputProps): ReactNode {
    const [value, setValue] = useState<string | null>(null);
    const [meta, setMeta] = useState<PhoneInputChangeMeta | null>(null);
    return createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        createElement(PhoneInput, {
            ...args,
            value,
            onChange: (next: string | null, changeMeta: PhoneInputChangeMeta) => {
                setValue(next);
                setMeta(changeMeta);
            },
        }),
        createElement('code', {}, `value: ${JSON.stringify(value)} · isValid: ${String(meta?.isValid ?? false)}`),
    );
}

export const Controlled: Story = {
    args: {
        label: 'Phone number',
        description: 'The E.164 value and validity are shown live below.',
    },
    render: (args) => createElement(ControlledDemo, args),
};

export const WithDefaultValue: Story = {
    args: {
        label: 'Phone number',
        defaultValue: '+14155552671',
    },
};

export const UnitedKingdomDefault: Story = {
    args: {
        label: 'Phone number',
        defaultCountry: 'GB',
    },
};

export const PriorityCountries: Story = {
    args: {
        label: 'Phone number',
        priorityCountries: ['US', 'GB', 'IN'],
        description: 'US, UK, and India are pinned to the top of the dropdown.',
    },
};

export const RestrictedCountries: Story = {
    args: {
        label: 'Phone number',
        countries: ['US', 'CA', 'MX'],
        description: 'Only North American numbers are accepted.',
    },
};

export const ErrorStatus: Story = {
    args: {
        label: 'Phone number',
        status: 'error',
        defaultValue: '+1415555',
        description: 'Enter a complete phone number.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Phone number',
        disabled: true,
        defaultValue: '+14155552671',
    },
};
```

- [ ] **Step 7: Full unit suite, typecheck, and visual check**

```bash
bun run test
bun run typecheck
```
Expected: both exit 0.

Then run `bun run storybook` and manually verify at `http://localhost:6006` (Inputs → PhoneInput): single bordered field, flag + dial code trigger with hairline divider, dropdown opens with search focused, national formatting on blur, error/disabled visuals. Stop the server after checking.

- [ ] **Step 8: Commit**

```bash
bun run lint:fix
git add src/stories/phoneinput
git commit -m "feat: add PhoneInput component with country select and E.164 output"
```

---

### Task 6: Documentation and final verification

**Files:**
- Modify: `AGENTS.md` (Form Inputs list, ~line 70)
- Modify: `public/llms.txt` (Forms list, ~line 63)
- Modify: `CLAUDE.md` (Field Wrapper pattern + Dependencies for UI Primitives)

**Interfaces:**
- Consumes: the shipped component (Task 5).
- Produces: updated docs; a fully verified build.

- [ ] **Step 1: Update AGENTS.md**

In the `### Form Inputs` list (after the `Combobox` line), add:

```markdown
- **PhoneInput** - Country select + phone number input; `value`/`onChange` are E.164, display formats to national format on blur
```

- [ ] **Step 2: Update public/llms.txt**

In the `### Forms` list (after the `Combobox` line), add:

```markdown
- PhoneInput - Country select + phone input; E.164 value, localized display formatting on blur
```

- [ ] **Step 3: Update CLAUDE.md**

1. In the **Field Wrapper** pattern line, change `(Input, Select, Combobox, TextArea)` to `(Input, Select, Combobox, TextArea, PhoneInput)`.
2. In **Dependencies for UI Primitives**, add:

```markdown
- `libphonenumber-js` (`/min` entry) - PhoneInput parsing, validation, and formatting
```

- [ ] **Step 4: Add a changeset**

This repo publishes via changesets (`bun run release`). Create `.changeset/phoneinput-component.md`:

```markdown
---
"paris": minor
---

Add `PhoneInput`: a phone number input with a searchable country selector. `value`/`onChange` carry E.164 (`onChange` also receives `{ country, isValid, nationalValue }` metadata); the display is sanitized while typing and formatted to the country's national format on blur. Supports `defaultCountry`, `countries` allowlist, `priorityCountries`, `locale` for country names, `status="error"`, and ref forwarding for `react-hook-form` `setFocus`. Adds `libphonenumber-js` as a dependency.
```

- [ ] **Step 5: Full verification**

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```
Expected: all exit 0; `dist/stories/phoneinput/` contains `index.js`, `index.d.ts`, and extracted CSS.

- [ ] **Step 6: Commit**

```bash
git add AGENTS.md public/llms.txt CLAUDE.md .changeset/phoneinput-component.md
git commit -m "docs: document PhoneInput component"
```
