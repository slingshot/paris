import { useState } from 'react';
import { render, screen, waitFor } from '../../test/render';
import type { ComboboxProps, Option } from './Combobox';
import { Combobox } from './Combobox';

const options: Option[] = [
    { id: '1', node: 'Mia Dolan' },
    { id: '2', node: 'Sebastian Wilder' },
    { id: '3', node: 'Amy Brandt' },
    { id: '4', node: 'Laura Wilder' },
];

function ControlledCombobox(props: Partial<ComboboxProps<Record<string, any>>>) {
    const [selected, setSelected] = useState<Option | null>((props.value as Option | null) ?? null);
    const [inputValue, setInputValue] = useState('');

    const currentOptions = props.options ?? options;
    const filteredOptions = currentOptions.filter((o) => {
        const text = typeof o.node === 'string' ? o.node : '';
        return text.toLowerCase().includes(inputValue.toLowerCase());
    });

    return (
        <Combobox
            placeholder="Search..."
            label="Share"
            {...props}
            options={filteredOptions}
            value={selected?.id === null ? { id: null, node: inputValue } : selected}
            onChange={(opt) => {
                setSelected(opt);
                props.onChange?.(opt);
            }}
            onInputChange={(v) => {
                setInputValue(v);
                props.onInputChange?.(v);
            }}
        />
    );
}

describe('Combobox', () => {
    it('renders with placeholder text', () => {
        render(<Combobox options={options} placeholder="Search..." />);
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders label and description', () => {
        render(<Combobox options={options} label="Share" description="Search for a friend." placeholder="Search..." />);
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Search for a friend.')).toBeInTheDocument();
    });

    it('shows options when input is focused', async () => {
        const { user } = render(<ControlledCombobox />);
        const input = screen.getByPlaceholderText('Search...');
        await user.click(input);

        await waitFor(() => {
            expect(screen.getByText('Mia Dolan')).toBeInTheDocument();
            expect(screen.getByText('Sebastian Wilder')).toBeInTheDocument();
        });
    });

    it('filters options as user types', async () => {
        const { user } = render(<ControlledCombobox />);
        const input = screen.getByPlaceholderText('Search...');

        await user.click(input);
        await user.type(input, 'wilder');

        await waitFor(() => {
            expect(screen.getByText('Sebastian Wilder')).toBeInTheDocument();
            expect(screen.getByText('Laura Wilder')).toBeInTheDocument();
            expect(screen.queryByText('Mia Dolan')).not.toBeInTheDocument();
            expect(screen.queryByText('Amy Brandt')).not.toBeInTheDocument();
        });
    });

    it('selects an option and calls onChange', async () => {
        const handleChange = vi.fn();
        const { user } = render(<ControlledCombobox onChange={handleChange} />);
        const input = screen.getByPlaceholderText('Search...');

        await user.click(input);
        await waitFor(() => {
            expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
        });

        await user.click(screen.getByText('Amy Brandt'));
        expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ id: '3', node: 'Amy Brandt' }));
    });

    it('calls onInputChange when the user types', async () => {
        const handleInputChange = vi.fn();
        const { user } = render(<ControlledCombobox onInputChange={handleInputChange} />);
        const input = screen.getByPlaceholderText('Search...');

        await user.click(input);
        await user.type(input, 'test');

        expect(handleInputChange).toHaveBeenCalled();
    });

    it('shows clear button when a value is selected', () => {
        const { container } = render(
            <Combobox options={options} value={{ id: '1', node: 'Mia Dolan' }} placeholder="Search..." />,
        );
        // The clear button uses shape="circle" which hides children text,
        // but sets aria-details="Clear"
        const clearButton = container.querySelector('button[aria-details="Clear"]');
        expect(clearButton).toBeInTheDocument();
    });

    it('clears selection when clear button is clicked', async () => {
        const handleChange = vi.fn();
        const { user, container } = render(
            <ControlledCombobox value={{ id: '1', node: 'Mia Dolan' }} onChange={handleChange} />,
        );

        const clearButton = container.querySelector('button[aria-details="Clear"]');
        expect(clearButton).toBeInTheDocument();
        await user.click(clearButton!);

        expect(handleChange).toHaveBeenCalledWith(null);
    });

    it('hides clear button when hideClearButton is true and node is string', () => {
        render(
            <Combobox
                options={options}
                value={{ id: '1', node: 'Mia Dolan' }}
                hideClearButton
                placeholder="Search..."
            />,
        );
        expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('applies disabled status data attribute', () => {
        render(<Combobox options={options} disabled placeholder="Search..." />);
        const input = screen.getByPlaceholderText('Search...');
        expect(input).toHaveAttribute('aria-disabled', 'true');
        expect(input).toHaveAttribute('data-status', 'disabled');
    });

    it('applies error status data attribute to input', () => {
        render(<Combobox options={options} status="error" placeholder="Search..." />);
        const input = screen.getByPlaceholderText('Search...');
        expect(input).toHaveAttribute('data-status', 'error');
    });

    it('shows custom value option when allowCustomValue is true', async () => {
        const { user } = render(<ControlledCombobox allowCustomValue customValueString='Add "%v"' />);
        const input = screen.getByPlaceholderText('Search...');

        await user.click(input);
        await user.type(input, 'New Artist');

        await waitFor(() => {
            expect(screen.getByText('Add "New Artist"')).toBeInTheDocument();
        });
    });
});
