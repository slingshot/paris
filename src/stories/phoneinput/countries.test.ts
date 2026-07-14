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
