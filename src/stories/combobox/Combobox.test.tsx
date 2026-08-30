import { useState } from 'react';
import { render, screen, waitFor } from '../../test/render';
import type { ComboboxProps, ComboboxValue, Option } from './Combobox';
import { Combobox } from './Combobox';

const options: Option[] = [
    { id: '1', node: 'Mia Dolan' },
    { id: '2', node: 'Sebastian Wilder' },
    { id: '3', node: 'Amy Brandt' },
    { id: '4', node: 'Laura Wilder' },
];

/**
 * Stores exactly what `onChange` emits and feeds it straight back as `value`, the way a bare
 * `react-hook-form` `{...field}` spread does.
 */
function ControlledCombobox(props: Partial<ComboboxProps<Record<string, any>>>) {
    const [fieldValue, setFieldValue] = useState<ComboboxValue>(props.value ?? null);
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
            value={fieldValue}
            onChange={(value, opt) => {
                setFieldValue(value);
                props.onChange?.(value, opt);
            }}
            onInputChange={(v) => {
                setInputValue(v);
                props.onInputChange?.(v);
            }}
        />
    );
}

/** Stores the emitted value like a form field, and can drop its `options` the way an async list does. */
function AsyncOptionsCombobox({
    allowCustomValue,
    selectedOption,
}: {
    allowCustomValue?: boolean;
    selectedOption?: Option;
}) {
    const [fieldValue, setFieldValue] = useState<ComboboxValue>(null);
    const [visibleOptions, setVisibleOptions] = useState<Option[]>(options);

    return (
        <div>
            <Combobox
                label="Share"
                placeholder="Search..."
                options={visibleOptions}
                value={fieldValue}
                onChange={(value) => setFieldValue(value)}
                allowCustomValue={allowCustomValue}
                selectedOption={selectedOption}
            />
            <button type="button" onClick={() => setVisibleOptions([])}>
                drop-options
            </button>
            <button type="button" onClick={() => setFieldValue(null)}>
                reset
            </button>
            <button type="button" onClick={() => setFieldValue('other-id')}>
                switch-value
            </button>
        </div>
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

    // Headless UI writes an inline `max-height` on the anchored panel that only defers to
    // `--anchor-max-height`, so `maxHeight` has to travel as that variable.
    it('caps the dropdown height via --anchor-max-height', async () => {
        const { user } = render(<ControlledCombobox maxHeight={240} />);
        await user.click(screen.getByPlaceholderText('Search...'));

        const panel = await screen.findByRole('listbox');
        expect(panel.style.getPropertyValue('--anchor-max-height')).toBe('240px');
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
        expect(handleChange).toHaveBeenCalledWith('3', expect.objectContaining({ id: '3', node: 'Amy Brandt' }));
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
        const { container } = render(<Combobox options={options} value="1" placeholder="Search..." />);
        // The clear button uses shape="circle" which hides children text,
        // but sets aria-details="Clear"
        const clearButton = container.querySelector('button[aria-details="Clear"]');
        expect(clearButton).toBeInTheDocument();
    });

    it('clears selection when clear button is clicked', async () => {
        const handleChange = vi.fn();
        const { user, container } = render(<ControlledCombobox value="1" onChange={handleChange} />);

        const clearButton = container.querySelector('button[aria-details="Clear"]');
        expect(clearButton).toBeInTheDocument();
        await user.click(clearButton!);

        expect(handleChange).toHaveBeenCalledWith(null, null);
    });

    it('hides clear button when hideClearButton is true and node is string', () => {
        render(<Combobox options={options} value="1" hideClearButton placeholder="Search..." />);
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

    describe('field spread compatibility', () => {
        it('sets a top-level name on the input', () => {
            render(<Combobox options={options} name="artist" placeholder="Search..." />);
            expect(screen.getByPlaceholderText('Search...')).toHaveAttribute('name', 'artist');
        });

        it('lets overrides.input.name win over the top-level name', () => {
            render(
                <Combobox
                    options={options}
                    name="artist"
                    overrides={{ input: { name: 'override' } }}
                    placeholder="Search..."
                />,
            );
            expect(screen.getByPlaceholderText('Search...')).toHaveAttribute('name', 'override');
        });

        it('calls onBlur when the input loses focus', async () => {
            const handleBlur = vi.fn();
            const { user } = render(
                <>
                    <Combobox options={options} onBlur={handleBlur} placeholder="Search..." />
                    <button type="button">Outside</button>
                </>,
            );

            await user.click(screen.getByPlaceholderText('Search...'));
            await user.click(screen.getByText('Outside'));

            expect(handleBlur).toHaveBeenCalled();
        });

        it('round-trips a selected id through the stored field value', async () => {
            const { user } = render(<ControlledCombobox />);
            const input = screen.getByPlaceholderText('Search...');

            await user.click(input);
            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Amy Brandt'));

            await waitFor(() => {
                expect(screen.getByDisplayValue('Amy Brandt')).toBeInTheDocument();
            });
        });

        it('displays a stored id that arrives from outside', () => {
            render(<Combobox options={options} value="2" placeholder="Search..." />);
            expect(screen.getByDisplayValue('Sebastian Wilder')).toBeInTheDocument();
        });

        it('emits the typed text as the field value for a custom value', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <ControlledCombobox allowCustomValue onChange={handleChange} customValueString='Add "%v"' />,
            );

            await user.type(screen.getByPlaceholderText('Search...'), 'New Artist');

            expect(handleChange).toHaveBeenLastCalledWith('New Artist', expect.objectContaining({ id: null }));
            expect(screen.getByDisplayValue('New Artist')).toBeInTheDocument();
        });

        it('clears the field value when the custom text is deleted', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <ControlledCombobox allowCustomValue onChange={handleChange} customValueString='Add "%v"' />,
            );

            const input = screen.getByPlaceholderText('Search...');
            await user.type(input, 'New');
            expect(handleChange).toHaveBeenLastCalledWith('New', expect.objectContaining({ id: null }));

            await user.clear(input);

            expect(handleChange).toHaveBeenLastCalledWith(null, null);
            expect(screen.getByPlaceholderText('Search...')).toHaveValue('');
        });

        it('round-trips custom text picked from the dropdown', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <ControlledCombobox allowCustomValue onChange={handleChange} customValueString='Add "%v"' />,
            );

            await user.type(screen.getByPlaceholderText('Search...'), 'New Artist');
            await waitFor(() => {
                expect(screen.getByText('Add "New Artist"')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Add "New Artist"'));

            expect(handleChange).toHaveBeenLastCalledWith('New Artist', expect.objectContaining({ id: null }));
            expect(screen.getByDisplayValue('New Artist')).toBeInTheDocument();
        });
    });

    describe('resolving a value against async or filtered options', () => {
        it('keeps a picked option displayed after it leaves options', async () => {
            const { user } = render(<AsyncOptionsCombobox />);

            await user.click(screen.getByPlaceholderText('Search...'));
            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Amy Brandt'));
            expect(screen.getByDisplayValue('Amy Brandt')).toBeInTheDocument();

            await user.click(screen.getByText('drop-options'));

            expect(screen.getByDisplayValue('Amy Brandt')).toBeInTheDocument();
        });

        it('renders the cached option rather than raw-id custom text', async () => {
            const { user } = render(<AsyncOptionsCombobox allowCustomValue />);

            await user.click(screen.getByPlaceholderText('Search...'));
            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Amy Brandt'));
            await user.click(screen.getByText('drop-options'));

            expect(screen.getByDisplayValue('Amy Brandt')).toBeInTheDocument();
            expect(screen.queryByDisplayValue('3')).not.toBeInTheDocument();
        });

        it('prefers the cached option over selectedOption for the same id', async () => {
            const { user } = render(<AsyncOptionsCombobox selectedOption={{ id: '3', node: 'Stale Amy' }} />);

            await user.click(screen.getByPlaceholderText('Search...'));
            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Amy Brandt'));
            await user.click(screen.getByText('drop-options'));

            expect(screen.getByDisplayValue('Amy Brandt')).toBeInTheDocument();
            expect(screen.queryByDisplayValue('Stale Amy')).not.toBeInTheDocument();
        });

        it('renders selectedOption rather than custom text under allowCustomValue', () => {
            render(
                <Combobox
                    options={[]}
                    value="2"
                    allowCustomValue
                    selectedOption={{ id: '2', node: 'Sebastian Wilder' }}
                    placeholder="Search..."
                />,
            );
            expect(screen.getByDisplayValue('Sebastian Wilder')).toBeInTheDocument();
            expect(screen.queryByDisplayValue('2')).not.toBeInTheDocument();
        });

        it('does not apply the cache when the value changes to a different id', async () => {
            const { user } = render(<AsyncOptionsCombobox />);

            await user.click(screen.getByPlaceholderText('Search...'));
            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Amy Brandt'));
            await user.click(screen.getByText('drop-options'));
            await user.click(screen.getByText('switch-value'));

            expect(screen.queryByDisplayValue('Amy Brandt')).not.toBeInTheDocument();
        });

        it('drops the cached option once the value is reset', async () => {
            const { user } = render(<AsyncOptionsCombobox />);

            await user.click(screen.getByPlaceholderText('Search...'));
            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Amy Brandt'));
            await user.click(screen.getByText('drop-options'));
            await user.click(screen.getByText('reset'));

            expect(screen.getByPlaceholderText('Search...')).toHaveValue('');
        });

        it('falls back to selectedOption when options cannot resolve the value', () => {
            render(
                <Combobox
                    options={[]}
                    value="2"
                    selectedOption={{ id: '2', node: 'Sebastian Wilder' }}
                    placeholder="Search..."
                />,
            );
            expect(screen.getByDisplayValue('Sebastian Wilder')).toBeInTheDocument();
        });

        it('ignores a selectedOption whose id does not match the value', () => {
            render(
                <Combobox
                    options={[]}
                    value="2"
                    selectedOption={{ id: '9', node: 'Somebody Else' }}
                    placeholder="Search..."
                />,
            );
            expect(screen.getByPlaceholderText('Search...')).toHaveValue('');
        });

        it('prefers a matching option over selectedOption', () => {
            render(
                <Combobox
                    options={options}
                    value="2"
                    selectedOption={{ id: '2', node: 'Stale Name' }}
                    placeholder="Search..."
                />,
            );
            expect(screen.getByDisplayValue('Sebastian Wilder')).toBeInTheDocument();
        });
    });

    describe('uncontrolled mode', () => {
        it('renders with placeholder when no defaultValue', () => {
            render(<Combobox options={options} placeholder="Search..." />);
            expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
        });

        it('renders with defaultValue', () => {
            render(<Combobox options={options} defaultValue="1" placeholder="Search..." />);
            expect(screen.getByDisplayValue('Mia Dolan')).toBeInTheDocument();
        });

        it('selects an option without external state', async () => {
            const { user } = render(<Combobox options={options} defaultValue={null} placeholder="Search..." />);
            const input = screen.getByPlaceholderText('Search...');
            await user.click(input);

            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Amy Brandt'));

            await waitFor(() => {
                expect(screen.getByDisplayValue('Amy Brandt')).toBeInTheDocument();
            });
        });

        it('calls onChange in uncontrolled mode', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <Combobox options={options} defaultValue={null} onChange={handleChange} placeholder="Search..." />,
            );
            const input = screen.getByPlaceholderText('Search...');
            await user.click(input);

            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Amy Brandt'));
            expect(handleChange).toHaveBeenCalledWith('3', expect.objectContaining({ id: '3', node: 'Amy Brandt' }));
        });

        it('clears selection in uncontrolled mode', async () => {
            const { user, container } = render(<Combobox options={options} defaultValue="1" placeholder="Search..." />);

            expect(screen.getByDisplayValue('Mia Dolan')).toBeInTheDocument();

            const clearButton = container.querySelector('button[aria-details="Clear"]');
            expect(clearButton).toBeInTheDocument();
            await user.click(clearButton!);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
                expect(screen.queryByDisplayValue('Mia Dolan')).not.toBeInTheDocument();
            });
        });

        it('renders with defaultValue using non-string node', () => {
            const optionsWithNode = [
                { id: '1', node: <span data-testid="custom-node">Custom Mia</span> },
                { id: '2', node: 'Sebastian Wilder' },
            ];
            render(<Combobox options={optionsWithNode} defaultValue="1" placeholder="Search..." />);
            expect(screen.getByTestId('custom-node')).toBeInTheDocument();
        });
    });

    describe('onOpenChange', () => {
        it('calls onOpenChange when the dropdown opens', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(
                <Combobox options={options} onOpenChange={handleOpenChange} placeholder="Search..." />,
            );

            await user.click(screen.getByPlaceholderText('Search...'));

            await waitFor(() => {
                expect(handleOpenChange).toHaveBeenCalledWith(true);
            });
        });

        it('calls onOpenChange when the dropdown closes after selection', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(<ControlledCombobox onOpenChange={handleOpenChange} />);

            const input = screen.getByPlaceholderText('Search...');
            await user.click(input);

            await waitFor(() => {
                expect(screen.getByText('Amy Brandt')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Amy Brandt'));

            await waitFor(() => {
                expect(handleOpenChange).toHaveBeenCalledWith(false);
            });
        });
    });
});
