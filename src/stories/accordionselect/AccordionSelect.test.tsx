import { useState } from 'react';
import { render, screen, waitFor } from '../../test/render';
import type { AccordionSelectOption } from './AccordionSelect';
import { AccordionSelect } from './AccordionSelect';

const options: AccordionSelectOption[] = [
    { id: 'champagne', node: 'In an alleyway, drinking champagne' },
    { id: 'rooftop', node: 'On a rooftop, watching the sunset' },
    { id: 'garden', node: 'In a garden, under the stars' },
];

function ControlledAccordionSelect(props: Partial<React.ComponentProps<typeof AccordionSelect>>) {
    const [value, setValue] = useState<string | null>((props.value as string | null) ?? null);

    return (
        <AccordionSelect
            options={options}
            value={value}
            onChange={(opt) => {
                setValue(opt.id);
                props.onChange?.(opt);
            }}
            {...props}
        />
    );
}

describe('AccordionSelect', () => {
    it('renders with placeholder when no value is selected', () => {
        render(<AccordionSelect options={options} placeholder="Where were we?" />);
        expect(screen.getByText('Where were we?')).toBeInTheDocument();
    });

    it('renders default placeholder when none is provided', () => {
        render(<AccordionSelect options={options} />);
        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('displays the selected option in the header', () => {
        render(<AccordionSelect options={options} value="champagne" />);
        expect(screen.getByText('In an alleyway, drinking champagne')).toBeInTheDocument();
    });

    it('expands to show all options when header is clicked', async () => {
        const { user } = render(<AccordionSelect options={options} value="champagne" />);

        await user.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
            expect(screen.getByText('In a garden, under the stars')).toBeInTheDocument();
        });
    });

    it('calls onChange when an option is selected', async () => {
        const handleChange = vi.fn();
        const { user } = render(<ControlledAccordionSelect value="champagne" onChange={handleChange} />);

        await user.click(screen.getByRole('button', { name: /champagne/i }));

        await waitFor(() => {
            expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
        });

        await user.click(screen.getByText('On a rooftop, watching the sunset'));

        expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'rooftop', node: 'On a rooftop, watching the sunset' }),
        );
    });

    it('closes the accordion after selection when closeOnSelect is true (default)', async () => {
        const { user } = render(<ControlledAccordionSelect value="champagne" />);

        await user.click(screen.getByRole('button', { name: /champagne/i }));
        await waitFor(() => {
            expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
        });

        await user.click(screen.getByText('On a rooftop, watching the sunset'));

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /garden/i })).not.toBeInTheDocument();
        });
    });

    it('keeps the accordion open after selection when closeOnSelect is false', async () => {
        const { user } = render(<ControlledAccordionSelect value="champagne" closeOnSelect={false} />);

        await user.click(screen.getByRole('button', { name: /champagne/i }));
        await waitFor(() => {
            expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
        });

        await user.click(screen.getByText('On a rooftop, watching the sunset'));

        expect(screen.getByText('In a garden, under the stars')).toBeInTheDocument();
    });

    it('toggles open and closed on header click', async () => {
        const { user } = render(<AccordionSelect options={options} value="champagne" />);

        const header = screen.getByRole('button');

        // Open
        await user.click(header);
        await waitFor(() => {
            expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
        });

        // Close
        await user.click(header);
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
        });
    });

    it('supports keyboard interaction on the header (Enter)', async () => {
        const { user } = render(<AccordionSelect options={options} value="champagne" />);

        const header = screen.getByRole('button');
        header.focus();
        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
        });
    });

    it('supports keyboard interaction on the header (Space)', async () => {
        const { user } = render(<AccordionSelect options={options} value="champagne" />);

        const header = screen.getByRole('button');
        header.focus();
        await user.keyboard(' ');

        await waitFor(() => {
            expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
        });
    });

    it('renders disabled options as disabled buttons', async () => {
        const disabledOptions = [...options, { id: 'nowhere', node: 'Nowhere, it was all a dream', disabled: true }];
        const { user } = render(<AccordionSelect options={disabledOptions} value="champagne" />);

        await user.click(screen.getByRole('button', { name: /champagne/i }));

        await waitFor(() => {
            const disabledButton = screen.getByText('Nowhere, it was all a dream').closest('button');
            expect(disabledButton).toBeDisabled();
        });
    });

    it('calls onOpenChange when the accordion opens or closes', async () => {
        const handleOpenChange = vi.fn();
        const { user, container } = render(
            <AccordionSelect options={options} value="champagne" onOpenChange={handleOpenChange} />,
        );

        // Click the header (the div[role=button][tabindex=0]) to open
        const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
        await user.click(header);
        expect(handleOpenChange).toHaveBeenCalledWith(true);

        // Click the header again to close
        await user.click(header);
        expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('renders custom content via renderSelected', () => {
        render(
            <AccordionSelect
                options={options}
                value="champagne"
                renderSelected={(opt) => <span data-testid="custom-selected">{opt.id}</span>}
            />,
        );
        expect(screen.getByTestId('custom-selected')).toHaveTextContent('champagne');
    });

    it('renders custom content via renderOption', async () => {
        const { user } = render(
            <AccordionSelect
                options={options}
                value="champagne"
                renderOption={(opt, isSelected) => (
                    <span data-testid={`custom-opt-${opt.id}`}>
                        {opt.id} {isSelected ? '(selected)' : ''}
                    </span>
                )}
            />,
        );

        await user.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(screen.getByTestId('custom-opt-champagne')).toHaveTextContent('champagne (selected)');
            expect(screen.getByTestId('custom-opt-rooftop')).toHaveTextContent('rooftop');
        });
    });

    it('renders an action at the bottom of the dropdown', async () => {
        const { user } = render(
            <AccordionSelect options={options} value="champagne" action={<button type="button">Add new</button>} />,
        );

        await user.click(screen.getByRole('button', { name: /champagne/i }));

        await waitFor(() => {
            expect(screen.getByText('Add new')).toBeInTheDocument();
        });
    });

    it('renders a label in the header', () => {
        render(
            <AccordionSelect
                options={options}
                value="champagne"
                label={<span data-testid="header-label">Active</span>}
            />,
        );
        expect(screen.getByTestId('header-label')).toHaveTextContent('Active');
    });

    it('closes on outside click when closeOnClickOutside is true (default)', async () => {
        const { user } = render(
            <div>
                <AccordionSelect options={options} value="champagne" />
                <button type="button">Outside</button>
            </div>,
        );

        // Open
        await user.click(screen.getByRole('button', { name: /champagne/i }));
        await waitFor(() => {
            expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
        });

        // Click outside
        await user.click(screen.getByText('Outside'));
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
        });
    });

    it('respects controlled isOpen prop', () => {
        render(<AccordionSelect options={options} value="champagne" isOpen />);
        // When isOpen=true, dropdown content should be rendered
        expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
        expect(screen.getByText('In a garden, under the stars')).toBeInTheDocument();
    });
});
