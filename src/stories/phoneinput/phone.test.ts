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
