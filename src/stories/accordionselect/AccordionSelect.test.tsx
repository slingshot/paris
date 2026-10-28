import { useState } from 'react';
import { render, screen, waitFor, within } from '../../test/render';
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
            onChange={(id, opt) => {
                setValue(id);
                props.onChange?.(id, opt);
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
        // Option text also appears in the collapsed-but-mounted dropdown list, so scope to the header
        expect(within(screen.getByRole('button')).getByText('In an alleyway, drinking champagne')).toBeInTheDocument();
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
            'rooftop',
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

    describe('field spread compatibility', () => {
        it('forwards name, id, and data-* attributes to the header', () => {
            const { container } = render(
                <AccordionSelect
                    options={options}
                    value="champagne"
                    name="location"
                    id="location-field"
                    data-testid="header"
                />,
            );

            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            expect(header).toHaveAttribute('name', 'location');
            expect(header).toHaveAttribute('id', 'location-field');
            expect(header).toHaveAttribute('data-testid', 'header');
        });

        it('calls onBlur when the header loses focus', async () => {
            const handleBlur = vi.fn();
            const { user, container } = render(
                <div>
                    <AccordionSelect options={options} value="champagne" onBlur={handleBlur} />
                    <button type="button">Outside</button>
                </div>,
            );

            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            header.focus();
            await user.click(screen.getByText('Outside'));

            expect(handleBlur).toHaveBeenCalled();
        });

        it('still toggles when a consumer passes its own onClick', async () => {
            const handleClick = vi.fn();
            const { user, container } = render(
                <AccordionSelect options={options} value="champagne" onClick={handleClick} />,
            );

            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            await user.click(header);

            expect(handleClick).toHaveBeenCalled();
            await waitFor(() => {
                expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
            });
        });

        it('lets a consumer onClick veto the toggle with preventDefault', async () => {
            const { user, container } = render(
                <AccordionSelect options={options} value="champagne" onClick={(e) => e.preventDefault()} />,
            );

            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            await user.click(header);

            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
        });

        it('lets a consumer onKeyDown veto the toggle with preventDefault (Enter)', async () => {
            const { user, container } = render(
                <AccordionSelect options={options} value="champagne" onKeyDown={(e) => e.preventDefault()} />,
            );

            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            header.focus();
            await user.keyboard('{Enter}');

            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
        });

        it('lets a consumer onKeyDown veto the toggle with preventDefault (Space)', async () => {
            const { user, container } = render(
                <AccordionSelect options={options} value="champagne" onKeyDown={(e) => e.preventDefault()} />,
            );

            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            header.focus();
            await user.keyboard(' ');

            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
        });
    });

    describe('disabled', () => {
        it('marks the header aria-disabled, sets the root status, and keeps the header focusable', () => {
            render(<AccordionSelect options={options} value="champagne" disabled />);

            const header = screen.getByRole('button');
            expect(header).toHaveAttribute('aria-disabled', 'true');
            expect(header).toHaveAttribute('tabindex', '0');
            expect(header.parentElement).toHaveAttribute('data-status', 'disabled');

            header.focus();
            expect(header).toHaveFocus();
        });

        it('overrides status="error" with disabled', () => {
            render(<AccordionSelect options={options} value="champagne" status="error" disabled />);

            expect(screen.getByRole('button').parentElement).toHaveAttribute('data-status', 'disabled');
        });

        it('still shows the selected option in the header', () => {
            render(<AccordionSelect options={options} value="champagne" disabled />);

            expect(
                within(screen.getByRole('button')).getByText('In an alleyway, drinking champagne'),
            ).toBeInTheDocument();
        });

        it('does not open on click', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(
                <AccordionSelect options={options} value="champagne" disabled onOpenChange={handleOpenChange} />,
            );

            await user.click(screen.getByRole('button'));

            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
            expect(handleOpenChange).not.toHaveBeenCalled();
        });

        it('does not open on Enter', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(
                <AccordionSelect options={options} value="champagne" disabled onOpenChange={handleOpenChange} />,
            );

            screen.getByRole('button').focus();
            await user.keyboard('{Enter}');

            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
            expect(handleOpenChange).not.toHaveBeenCalled();
        });

        it('does not open on Space', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(
                <AccordionSelect options={options} value="champagne" disabled onOpenChange={handleOpenChange} />,
            );

            screen.getByRole('button').focus();
            await user.keyboard(' ');

            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
            expect(handleOpenChange).not.toHaveBeenCalled();
        });

        it('renders closed when controlled isOpen is true, and ignores outside clicks', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(
                <div>
                    <AccordionSelect
                        options={options}
                        value="champagne"
                        isOpen
                        disabled
                        onOpenChange={handleOpenChange}
                    />
                    <button type="button">Outside</button>
                </div>,
            );

            const rooftop = screen.getByText('On a rooftop, watching the sunset');
            expect(rooftop.closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true');
            expect(rooftop.closest('button')).toBeDisabled();

            await user.click(screen.getByText('Outside'));

            expect(handleOpenChange).not.toHaveBeenCalled();
        });

        it('restores the uncontrolled open state when re-enabled', async () => {
            const { user, rerender } = render(<AccordionSelect options={options} value="champagne" />);

            await user.click(screen.getByRole('button'));
            expect(screen.getByRole('button', { name: /rooftop/i })).toBeInTheDocument();

            rerender(<AccordionSelect options={options} value="champagne" disabled />);
            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();

            rerender(<AccordionSelect options={options} value="champagne" />);
            expect(screen.getByRole('button', { name: /rooftop/i })).toBeInTheDocument();
        });

        it('still calls a consumer onClick', async () => {
            const handleClick = vi.fn();
            const { user } = render(
                <AccordionSelect options={options} value="champagne" disabled onClick={handleClick} />,
            );

            await user.click(screen.getByRole('button'));

            expect(handleClick).toHaveBeenCalled();
            expect(screen.queryByRole('button', { name: /rooftop/i })).not.toBeInTheDocument();
        });

        it('renders no chevron or header end when there is no label', () => {
            render(<AccordionSelect options={options} value="champagne" disabled />);

            const header = screen.getByRole('button');
            expect(header.querySelector('svg')).not.toBeInTheDocument();
            expect(header.children).toHaveLength(1);
        });

        it('renders the chevron when enabled', () => {
            render(<AccordionSelect options={options} value="champagne" />);

            const header = screen.getByRole('button');
            expect(header.querySelector('svg')).toBeInTheDocument();
            expect(header.children).toHaveLength(2);
        });

        it('still renders a label without a chevron', () => {
            render(
                <AccordionSelect
                    options={options}
                    value="champagne"
                    disabled
                    label={<span data-testid="header-label">Active</span>}
                />,
            );

            const header = screen.getByRole('button');
            expect(within(header).getByTestId('header-label')).toHaveTextContent('Active');
            expect(header.querySelector('svg')).not.toBeInTheDocument();
        });

        it('still renders a label of 0', () => {
            render(<AccordionSelect options={options} value="champagne" disabled label={0} />);

            const header = screen.getByRole('button');
            expect(within(header).getByText('0')).toBeInTheDocument();
            expect(header.querySelector('svg')).not.toBeInTheDocument();
        });

        it('keeps options disabled when overrides.option sets disabled to false', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <AccordionSelect
                    options={options}
                    value="champagne"
                    disabled
                    onChange={handleChange}
                    overrides={{ option: { disabled: false } }}
                />,
            );

            const rooftop = screen.getByText('On a rooftop, watching the sunset').closest('button');
            expect(rooftop).toBeDisabled();
            expect(rooftop).toHaveAttribute('tabindex', '-1');

            await user.click(rooftop as HTMLElement);

            expect(handleChange).not.toHaveBeenCalled();
        });

        it('keeps aria-disabled true when a consumer passes aria-disabled={false}', () => {
            render(<AccordionSelect options={options} value="champagne" disabled aria-disabled={false} />);

            expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
        });

        it('passes a consumer aria-disabled through when enabled', () => {
            render(<AccordionSelect options={options} value="champagne" aria-disabled />);

            expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
        });
    });

    describe('uncontrolled selection', () => {
        it('renders with defaultValue', () => {
            render(<AccordionSelect options={options} defaultValue="champagne" />);
            expect(
                within(screen.getByRole('button')).getByText('In an alleyway, drinking champagne'),
            ).toBeInTheDocument();
        });

        it('renders with placeholder when no defaultValue', () => {
            render(<AccordionSelect options={options} placeholder="Where were we?" />);
            expect(screen.getByText('Where were we?')).toBeInTheDocument();
        });

        it('updates selection without external state', async () => {
            const { user, container } = render(<AccordionSelect options={options} defaultValue="champagne" />);

            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            await user.click(header);

            await waitFor(() => {
                expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
            });

            await user.click(screen.getByText('On a rooftop, watching the sunset'));

            await waitFor(() => {
                expect(header).toHaveTextContent('On a rooftop, watching the sunset');
            });
        });

        it('calls onChange in uncontrolled mode', async () => {
            const handleChange = vi.fn();
            const { user, container } = render(
                <AccordionSelect options={options} defaultValue="champagne" onChange={handleChange} />,
            );

            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            await user.click(header);

            await waitFor(() => {
                expect(screen.getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
            });

            await user.click(screen.getByText('On a rooftop, watching the sunset'));

            expect(handleChange).toHaveBeenCalledWith('rooftop', expect.objectContaining({ id: 'rooftop' }));
        });

        it('renders disabled option as selected when defaultValue points to it', async () => {
            const disabledOptions = [
                ...options,
                { id: 'nowhere', node: 'Nowhere, it was all a dream', disabled: true },
            ];
            const { user, container } = render(<AccordionSelect options={disabledOptions} defaultValue="nowhere" />);

            // Header shows the disabled option's text
            const allMatches = screen.getAllByText('Nowhere, it was all a dream');
            expect(allMatches.length).toBeGreaterThanOrEqual(1);

            // Open and verify the option button is disabled
            const header = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement;
            await user.click(header);

            await waitFor(() => {
                // Find the option button (not the header text)
                const optionButtons = container.querySelectorAll('button[data-selected]');
                const disabledButton = Array.from(optionButtons).find((btn) => btn.textContent?.includes('Nowhere'));
                expect(disabledButton).toBeTruthy();
                expect(disabledButton).toBeDisabled();
                expect(disabledButton).toHaveAttribute('data-selected', 'true');
            });
        });
    });
});
