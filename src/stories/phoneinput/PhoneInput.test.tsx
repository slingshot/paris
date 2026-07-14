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
        const { user } = render(<PhoneInput label="Phone" countries={['US', 'CA', 'GB']} priorityCountries={['GB']} />);
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
