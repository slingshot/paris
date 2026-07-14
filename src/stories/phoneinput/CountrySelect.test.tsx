import { render, screen, waitFor } from '../../test/render';
import { CountrySelect } from './CountrySelect';
import type { CountryEntry } from './countries';
import { buildCountryList } from './countries';

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
