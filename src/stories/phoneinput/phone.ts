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
export const sanitizePhoneText = (text: string): string => text.replace(/[^\d\s().+-]/g, '').replace(/(?!^)\+/g, '');

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
    // A partial/ambiguous E.164 (e.g. "+1415") parses to a truthy object with an
    // undefined country and a lossy national format ("415") — preserve the raw value instead.
    if (!parsed?.country) return { country: undefined, display: value };
    return { country: parsed.country, display: parsed.formatNational() };
};
