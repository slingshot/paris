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
