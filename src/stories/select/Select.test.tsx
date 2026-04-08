import { useState } from 'react';
import { render, screen, waitFor } from '../../test/render';
import type { Option } from './Select';
import { Select } from './Select';

const options: Option[] = [
    { id: '1', node: 'Single' },
    { id: '2', node: 'EP' },
    { id: '3', node: 'Album (LP)' },
    { id: '4', node: 'Compilation' },
];

function ControlledSelect(props: Partial<React.ComponentProps<typeof Select>>) {
    const [value, setValue] = useState<string | null>((props.value as string | null) ?? null);
    return (
        <Select
            options={options}
            value={value}
            onChange={(v) => {
                setValue(v);
                (props.onChange as (v: string | null) => void)?.(v);
            }}
            {...props}
        />
    );
}

function ControlledMultiSelect(props: Partial<React.ComponentProps<typeof Select>> & { initialValue?: string[] }) {
    const [value, setValue] = useState<string[]>(props.initialValue ?? []);
    return (
        <Select
            options={options}
            value={value}
            onChange={(v) => {
                setValue(v as string[]);
                (props.onChange as (v: string[] | null) => void)?.(v as string[] | null);
            }}
            multiple
            {...props}
        />
    );
}

describe('Select', () => {
    describe('listbox kind (default)', () => {
        it('renders with placeholder text', () => {
            render(<Select options={options} placeholder="Pick one" />);
            expect(screen.getByText('Pick one')).toBeInTheDocument();
        });

        it('renders default placeholder when none provided', () => {
            render(<Select options={options} />);
            expect(screen.getByText('Select an option')).toBeInTheDocument();
        });

        it('renders label and description via Field wrapper', () => {
            render(<Select options={options} label="Release type" description="Choose a release type." />);
            expect(screen.getByText('Release type')).toBeInTheDocument();
            expect(screen.getByText('Choose a release type.')).toBeInTheDocument();
        });

        it('shows selected value text in the button', () => {
            render(<Select options={options} value="2" />);
            expect(screen.getByText('EP')).toBeInTheDocument();
        });

        it('opens the dropdown and displays options on click', async () => {
            const { user } = render(<ControlledSelect />);
            await user.click(screen.getByText('Select an option'));

            await waitFor(() => {
                expect(screen.getByText('Single')).toBeInTheDocument();
                expect(screen.getByText('EP')).toBeInTheDocument();
                expect(screen.getByText('Album (LP)')).toBeInTheDocument();
                expect(screen.getByText('Compilation')).toBeInTheDocument();
            });
        });

        it('selects an option and calls onChange', async () => {
            const handleChange = vi.fn();
            const { user } = render(<ControlledSelect onChange={handleChange} />);

            await user.click(screen.getByText('Select an option'));
            await waitFor(() => {
                expect(screen.getByText('EP')).toBeInTheDocument();
            });

            await user.click(screen.getByText('EP'));
            expect(handleChange).toHaveBeenCalledWith('2');
        });

        it('displays selected option text after selection', async () => {
            const { user } = render(<ControlledSelect />);

            await user.click(screen.getByText('Select an option'));
            await waitFor(() => {
                expect(screen.getByText('Album (LP)')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Album (LP)'));

            await waitFor(() => {
                const button = screen.getByRole('button', { expanded: false });
                expect(button).toHaveTextContent('Album (LP)');
            });
        });

        it('sets aria-disabled and status data attribute when disabled', () => {
            render(<Select options={options} disabled placeholder="Pick one" />);
            const button = screen.getByText('Pick one').closest('button');
            expect(button).toHaveAttribute('aria-disabled', 'true');
            expect(button).toHaveAttribute('data-status', 'disabled');
        });

        it('applies error status data attribute', () => {
            render(<Select options={options} status="error" placeholder="Pick one" />);
            const button = screen.getByText('Pick one').closest('button');
            expect(button).toHaveAttribute('data-status', 'error');
        });

        it('applies success status data attribute', () => {
            render(<Select options={options} status="success" placeholder="Pick one" />);
            const button = screen.getByText('Pick one').closest('button');
            expect(button).toHaveAttribute('data-status', 'success');
        });
    });

    describe('multi-select', () => {
        it('shows placeholder when no items selected', () => {
            render(<Select options={options} multiple value={[]} placeholder="Select items" />);
            expect(screen.getByText('Select items')).toBeInTheDocument();
        });

        it('shows single item text when one item selected', () => {
            render(<Select options={options} multiple value={['1']} />);
            expect(screen.getByText('Single')).toBeInTheDocument();
        });

        it('shows count when multiple items selected', () => {
            render(<Select options={options} multiple value={['1', '2']} />);
            expect(screen.getByText('2 items')).toBeInTheDocument();
        });

        it('shows "All" text when all items selected', () => {
            render(<Select options={options} multiple value={['1', '2', '3', '4']} />);
            expect(screen.getByText('All items')).toBeInTheDocument();
        });

        it('uses custom multipleItemsName', () => {
            render(<Select options={options} multiple value={['1', '2']} multipleItemsName="releases" />);
            expect(screen.getByText('2 releases')).toBeInTheDocument();
        });

        it('shows "All <custom>" when all selected with custom name', () => {
            render(<Select options={options} multiple value={['1', '2', '3', '4']} multipleItemsName="releases" />);
            expect(screen.getByText('All releases')).toBeInTheDocument();
        });

        it('calls onChange with updated array on selection', async () => {
            const handleChange = vi.fn();
            const { user } = render(<ControlledMultiSelect onChange={handleChange} />);

            await user.click(screen.getByText('Select an option'));
            await waitFor(() => {
                expect(screen.getByText('Single')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Single'));
            expect(handleChange).toHaveBeenCalled();
        });
    });

    describe('radio kind', () => {
        it('renders radio options', () => {
            render(<Select options={options} kind="radio" />);
            expect(screen.getByText('Single')).toBeInTheDocument();
            expect(screen.getByText('EP')).toBeInTheDocument();
            expect(screen.getByText('Album (LP)')).toBeInTheDocument();
            expect(screen.getByText('Compilation')).toBeInTheDocument();
        });

        it('renders with a radiogroup role', () => {
            render(<Select options={options} kind="radio" />);
            expect(screen.getByRole('radiogroup')).toBeInTheDocument();
        });

        it('renders radio items with radio role', () => {
            render(<Select options={options} kind="radio" />);
            const radios = screen.getAllByRole('radio');
            expect(radios).toHaveLength(4);
        });

        it('calls onChange when a radio option is clicked', async () => {
            const handleChange = vi.fn();
            const { user } = render(<ControlledSelect kind="radio" onChange={handleChange} />);

            await user.click(screen.getByText('EP'));
            expect(handleChange).toHaveBeenCalledWith('2');
        });
    });

    describe('card kind', () => {
        it('renders card options', () => {
            render(<Select options={options} kind="card" />);
            expect(screen.getByText('Single')).toBeInTheDocument();
            expect(screen.getByText('EP')).toBeInTheDocument();
        });

        it('calls onChange when a card option is clicked', async () => {
            const handleChange = vi.fn();
            const { user } = render(<ControlledSelect kind="card" onChange={handleChange} />);

            await user.click(screen.getByText('EP'));
            expect(handleChange).toHaveBeenCalledWith('2');
        });
    });

    describe('segmented kind', () => {
        it('renders segmented options', () => {
            render(<Select options={options} kind="segmented" />);
            expect(screen.getByText('Single')).toBeInTheDocument();
            expect(screen.getByText('EP')).toBeInTheDocument();
        });

        it('calls onChange when a segmented option is clicked', async () => {
            const handleChange = vi.fn();
            const { user } = render(<ControlledSelect kind="segmented" onChange={handleChange} />);

            await user.click(screen.getByText('EP'));
            expect(handleChange).toHaveBeenCalledWith('2');
        });
    });

    describe('uncontrolled mode', () => {
        it('renders with defaultValue', () => {
            render(<Select options={options} defaultValue="2" />);
            expect(screen.getByText('EP')).toBeInTheDocument();
        });

        it('renders with placeholder when no defaultValue', () => {
            render(<Select options={options} placeholder="Pick one" />);
            expect(screen.getByText('Pick one')).toBeInTheDocument();
        });

        it('updates selection without external state (listbox)', async () => {
            const { user } = render(<Select options={options} defaultValue={null} />);

            await user.click(screen.getByText('Select an option'));
            await waitFor(() => {
                expect(screen.getByText('EP')).toBeInTheDocument();
            });
            await user.click(screen.getByText('EP'));

            await waitFor(() => {
                const button = screen.getByRole('button', { expanded: false });
                expect(button).toHaveTextContent('EP');
            });
        });

        it('calls onChange in uncontrolled mode', async () => {
            const handleChange = vi.fn();
            const { user } = render(<Select options={options} defaultValue={null} onChange={handleChange} />);

            await user.click(screen.getByText('Select an option'));
            await waitFor(() => {
                expect(screen.getByText('EP')).toBeInTheDocument();
            });
            await user.click(screen.getByText('EP'));

            expect(handleChange).toHaveBeenCalledWith('2');
        });

        it('updates selection without external state (radio)', async () => {
            const { user } = render(<Select options={options} kind="radio" defaultValue={null} />);

            await user.click(screen.getByText('EP'));

            await waitFor(() => {
                const radio = screen.getByRole('radio', { name: 'EP' });
                expect(radio).toHaveAttribute('aria-checked', 'true');
            });
        });

        it('updates selection without external state (card)', async () => {
            const { user } = render(<Select options={options} kind="card" defaultValue={null} />);

            await user.click(screen.getByText('EP'));

            await waitFor(() => {
                const radio = screen.getByRole('radio', { name: 'EP' });
                expect(radio).toHaveAttribute('aria-checked', 'true');
            });
        });

        it('updates selection without external state (segmented)', async () => {
            const { user } = render(<Select options={options} kind="segmented" defaultValue={null} />);

            // Segmented defaults to first option when no value
            const firstRadio = screen.getByRole('radio', { name: 'Single' });
            expect(firstRadio).toHaveAttribute('aria-checked', 'true');

            await user.click(screen.getByText('EP'));

            await waitFor(() => {
                const radio = screen.getByRole('radio', { name: 'EP' });
                expect(radio).toHaveAttribute('aria-checked', 'true');
            });
        });
    });

    describe('onOpenChange', () => {
        it('calls onOpenChange when the listbox opens', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(
                <Select options={options} onOpenChange={handleOpenChange} placeholder="Pick one" />,
            );

            await user.click(screen.getByText('Pick one'));

            await waitFor(() => {
                expect(handleOpenChange).toHaveBeenCalledWith(true);
            });
        });

        it('calls onOpenChange when the listbox closes', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(<ControlledSelect onOpenChange={handleOpenChange} />);

            await user.click(screen.getByText('Select an option'));
            await waitFor(() => {
                expect(screen.getByText('EP')).toBeInTheDocument();
            });

            await user.click(screen.getByText('EP'));

            await waitFor(() => {
                expect(handleOpenChange).toHaveBeenCalledWith(false);
            });
        });
    });
});
