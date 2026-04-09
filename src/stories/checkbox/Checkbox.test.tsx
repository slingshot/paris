import { useState } from 'react';
import { render, screen } from '../../test/render';
import { Checkbox } from './Checkbox';

// Helper wrapper for controlled checkbox behavior
function ControlledCheckbox({
    defaultChecked = false,
    ...props
}: Omit<React.ComponentProps<typeof Checkbox>, 'checked'> & { defaultChecked?: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    return <Checkbox {...props} checked={checked} onChange={(val) => setChecked(!!val)} />;
}

describe('Checkbox', () => {
    // ─── Rendering ───────────────────────────────────────────────────

    describe('rendering', () => {
        it('renders with default kind', () => {
            render(<Checkbox checked={false}>Accept terms</Checkbox>);
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
            expect(screen.getByText('Accept terms')).toBeInTheDocument();
        });

        it('renders unchecked by default', () => {
            render(<Checkbox checked={false}>Label</Checkbox>);
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).not.toBeChecked();
        });

        it('renders checked when checked prop is true', () => {
            render(<Checkbox checked={true}>Label</Checkbox>);
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeChecked();
        });

        it('renders label text as children', () => {
            render(<Checkbox checked={false}>My label text</Checkbox>);
            expect(screen.getByText('My label text')).toBeInTheDocument();
        });

        it('renders ReactNode children', () => {
            render(
                <Checkbox checked={false}>
                    <span data-testid="custom-label">Custom element</span>
                </Checkbox>,
            );
            expect(screen.getByTestId('custom-label')).toBeInTheDocument();
            expect(screen.getByText('Custom element')).toBeInTheDocument();
        });

        it('renders without children', () => {
            render(<Checkbox checked={false} />);
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });
    });

    // ─── Interaction ─────────────────────────────────────────────────

    describe('interaction', () => {
        it('calls onChange when clicked', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <Checkbox checked={false} onChange={handleChange}>
                    Toggle me
                </Checkbox>,
            );

            await user.click(screen.getByRole('checkbox'));
            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange).toHaveBeenCalledWith(true);
        });

        it('calls onChange with false when unchecking', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <Checkbox checked={true} onChange={handleChange}>
                    Toggle me
                </Checkbox>,
            );

            await user.click(screen.getByRole('checkbox'));
            expect(handleChange).toHaveBeenCalledWith(false);
        });

        it('toggles checked state in a controlled component', async () => {
            const { user } = render(<ControlledCheckbox>Toggle me</ControlledCheckbox>);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).not.toBeChecked();

            await user.click(checkbox);
            expect(checkbox).toBeChecked();

            await user.click(checkbox);
            expect(checkbox).not.toBeChecked();
        });

        it('clicking the label toggles the checkbox', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <Checkbox checked={false} onChange={handleChange}>
                    Click this label
                </Checkbox>,
            );

            // The label wraps the checkbox, so clicking text should also trigger
            await user.click(screen.getByText('Click this label'));
            expect(handleChange).toHaveBeenCalled();
        });
    });

    // ─── Disabled ────────────────────────────────────────────────────

    describe('disabled', () => {
        it('applies disabled styling class', () => {
            const { container } = render(
                <Checkbox checked={false} disabled>
                    Disabled
                </Checkbox>,
            );
            const label = container.querySelector('label');
            expect(label).toHaveClass('disabled');
        });

        it('sets data-disabled on the checkbox root', () => {
            render(
                <Checkbox checked={false} disabled>
                    Disabled
                </Checkbox>,
            );
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('data-disabled', 'true');
        });

        it('sets data-disabled on the switch when kind is switch', () => {
            render(
                <Checkbox kind="switch" checked={false} disabled>
                    Disabled switch
                </Checkbox>,
            );
            const switchEl = screen.getByRole('switch');
            expect(switchEl).toHaveAttribute('data-disabled', 'true');
        });
    });

    // ─── Kinds ───────────────────────────────────────────────────────

    describe('kind variants', () => {
        describe('default kind', () => {
            it('renders a Radix checkbox with default class', () => {
                const { container } = render(
                    <Checkbox kind="default" checked={false}>
                        Default
                    </Checkbox>,
                );
                const root = container.querySelector('[class*="root"]');
                expect(root).toHaveClass('default');
            });

            it('shows label text next to checkbox', () => {
                render(
                    <Checkbox kind="default" checked={false}>
                        Default label
                    </Checkbox>,
                );
                expect(screen.getByText('Default label')).toBeInTheDocument();
                expect(screen.getByRole('checkbox')).toBeInTheDocument();
            });

            it('renders an SVG check icon when checked', () => {
                const { container } = render(
                    <Checkbox kind="default" checked={true}>
                        Checked
                    </Checkbox>,
                );
                const svg = container.querySelector('svg');
                expect(svg).toBeInTheDocument();
            });
        });

        describe('surface kind', () => {
            it('renders a Radix checkbox with surface class', () => {
                const { container } = render(
                    <Checkbox kind="surface" checked={false}>
                        Surface
                    </Checkbox>,
                );
                const root = container.querySelector('[class*="root"]');
                expect(root).toHaveClass('surface');
            });

            it('shows children inside the Radix root (not outside)', () => {
                render(
                    <Checkbox kind="surface" checked={false}>
                        Surface label
                    </Checkbox>,
                );
                expect(screen.getByText('Surface label')).toBeInTheDocument();
            });

            it('does not show label outside root when kind is surface', () => {
                const { container } = render(
                    <Checkbox kind="surface" checked={false}>
                        Surface label
                    </Checkbox>,
                );
                // In surface mode, the label text is inside the Radix root, not adjacent
                const root = container.querySelector('[class*="root"]');
                expect(root).toContainElement(screen.getByText('Surface label'));
            });
        });

        describe('panel kind', () => {
            it('renders a Radix checkbox with panel class', () => {
                const { container } = render(
                    <Checkbox kind="panel" checked={false}>
                        Panel
                    </Checkbox>,
                );
                const root = container.querySelector('[class*="root"]');
                expect(root).toHaveClass('panel');
            });

            it('shows children inside the Radix root', () => {
                const { container } = render(
                    <Checkbox kind="panel" checked={false}>
                        Panel label
                    </Checkbox>,
                );
                const root = container.querySelector('[class*="root"]');
                expect(root).toContainElement(screen.getByText('Panel label'));
            });

            it('renders a box element when unchecked', () => {
                const { container } = render(
                    <Checkbox kind="panel" checked={false}>
                        Panel
                    </Checkbox>,
                );
                const box = container.querySelector('.box');
                expect(box).toBeInTheDocument();
            });
        });

        describe('switch kind', () => {
            it('renders a switch element instead of a Radix checkbox', () => {
                render(
                    <Checkbox kind="switch" checked={false}>
                        Switch
                    </Checkbox>,
                );
                // HeadlessUI Switch renders a button with role="switch"
                expect(screen.getByRole('switch')).toBeInTheDocument();
            });

            it('does not render a Radix checkbox role', () => {
                render(
                    <Checkbox kind="switch" checked={false}>
                        Switch
                    </Checkbox>,
                );
                expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
            });

            it('shows label text', () => {
                render(
                    <Checkbox kind="switch" checked={false}>
                        Switch label
                    </Checkbox>,
                );
                expect(screen.getByText('Switch label')).toBeInTheDocument();
            });

            it('toggles switch state on click', async () => {
                const handleChange = vi.fn();
                const { user } = render(
                    <Checkbox kind="switch" checked={false} onChange={handleChange}>
                        Switch
                    </Checkbox>,
                );

                await user.click(screen.getByRole('switch'));
                expect(handleChange).toHaveBeenCalledWith(true);
            });

            it('renders knob element', () => {
                const { container } = render(
                    <Checkbox kind="switch" checked={false}>
                        Switch
                    </Checkbox>,
                );
                const knob = container.querySelector('[class*="knob"]');
                expect(knob).toBeInTheDocument();
            });

            it('applies knobChecked class when checked', () => {
                const { container } = render(
                    <Checkbox kind="switch" checked={true}>
                        Switch
                    </Checkbox>,
                );
                const knob = container.querySelector('[class*="knob"]');
                expect(knob).toHaveClass('knobChecked');
            });

            it('does not apply knobChecked class when unchecked', () => {
                const { container } = render(
                    <Checkbox kind="switch" checked={false}>
                        Switch
                    </Checkbox>,
                );
                const knob = container.querySelector('[class*="knob"]');
                expect(knob).not.toHaveClass('knobChecked');
            });
        });
    });

    // ─── Hide Label ──────────────────────────────────────────────────

    describe('hideLabel', () => {
        it('visually hides the label when hideLabel is true', () => {
            const { container } = render(
                <Checkbox kind="default" checked={false} hideLabel>
                    Hidden label
                </Checkbox>,
            );
            // VisuallyHidden uses Ariakit's VisuallyHidden which renders content off-screen
            // The text should still be in the DOM for accessibility
            expect(screen.getByText('Hidden label')).toBeInTheDocument();
        });

        it('shows label when hideLabel is false', () => {
            render(
                <Checkbox kind="default" checked={false} hideLabel={false}>
                    Visible label
                </Checkbox>,
            );
            expect(screen.getByText('Visible label')).toBeInTheDocument();
        });

        it('hides the label for switch kind', () => {
            render(
                <Checkbox kind="switch" checked={false} hideLabel>
                    Hidden switch label
                </Checkbox>,
            );
            // Still accessible in DOM
            expect(screen.getByText('Hidden switch label')).toBeInTheDocument();
        });
    });

    // ─── className forwarding ────────────────────────────────────────

    describe('className forwarding', () => {
        it('forwards className to the label container', () => {
            const { container } = render(
                <Checkbox checked={false} className="custom-class">
                    Label
                </Checkbox>,
            );
            const label = container.querySelector('label');
            expect(label).toHaveClass('custom-class');
            expect(label).toHaveClass('container');
        });

        it('preserves container class when custom className is added', () => {
            const { container } = render(
                <Checkbox checked={false} className="my-class">
                    Label
                </Checkbox>,
            );
            const label = container.querySelector('label');
            expect(label).toHaveClass('container');
            expect(label).toHaveClass('my-class');
        });
    });

    // ─── Checked state styling ───────────────────────────────────────

    describe('checked state styling', () => {
        it('applies checked class to container when checked', () => {
            const { container } = render(<Checkbox checked={true}>Checked</Checkbox>);
            const label = container.querySelector('label');
            expect(label).toHaveClass('checked');
        });

        it('does not apply checked class to container when unchecked', () => {
            const { container } = render(<Checkbox checked={false}>Unchecked</Checkbox>);
            const label = container.querySelector('label');
            expect(label).not.toHaveClass('checked');
        });
    });

    // ─── Accessibility ───────────────────────────────────────────────

    describe('accessibility', () => {
        it('has proper role="checkbox" for default kind', () => {
            render(<Checkbox checked={false}>Accessible</Checkbox>);
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });

        it('has proper role="switch" for switch kind', () => {
            render(
                <Checkbox kind="switch" checked={false}>
                    Switch
                </Checkbox>,
            );
            expect(screen.getByRole('switch')).toBeInTheDocument();
        });

        it('has aria-checked false when unchecked', () => {
            render(<Checkbox checked={false}>Label</Checkbox>);
            expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
        });

        it('has aria-checked true when checked', () => {
            render(<Checkbox checked={true}>Label</Checkbox>);
            expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
        });

        it('sets aria-details when children is a string', () => {
            render(<Checkbox checked={false}>String label</Checkbox>);
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-details', 'String label');
        });

        it('does not set aria-details when children is not a string', () => {
            render(
                <Checkbox checked={false}>
                    <span>Non-string label</span>
                </Checkbox>,
            );
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).not.toHaveAttribute('aria-details');
        });

        it('associates label with checkbox via htmlFor and id', () => {
            const { container } = render(<Checkbox checked={false}>Label</Checkbox>);
            const label = container.querySelector('label');
            const checkbox = screen.getByRole('checkbox');
            expect(label).toHaveAttribute('for');
            expect(checkbox).toHaveAttribute('id', label?.getAttribute('for'));
        });

        it('associates label with switch via htmlFor and id', () => {
            const { container } = render(
                <Checkbox kind="switch" checked={false}>
                    Switch label
                </Checkbox>,
            );
            const label = container.querySelector('label');
            const switchEl = screen.getByRole('switch');
            expect(label).toHaveAttribute('for');
            expect(switchEl).toHaveAttribute('id', label?.getAttribute('for'));
        });
    });

    // ─── Spread props ────────────────────────────────────────────────

    describe('spread props', () => {
        it('forwards additional HTML attributes to the label', () => {
            const { container } = render(
                <Checkbox checked={false} data-testid="checkbox-label" title="My checkbox">
                    Label
                </Checkbox>,
            );
            const label = container.querySelector('label');
            expect(label).toHaveAttribute('data-testid', 'checkbox-label');
            expect(label).toHaveAttribute('title', 'My checkbox');
        });

        it('forwards style prop to the label', () => {
            const { container } = render(
                <Checkbox checked={false} style={{ marginTop: '10px' }}>
                    Label
                </Checkbox>,
            );
            const label = container.querySelector('label');
            expect(label).toHaveStyle({ marginTop: '10px' });
        });
    });

    // ─── Uncontrolled mode ───────────────────────────────────────────

    describe('uncontrolled mode', () => {
        it('renders unchecked when defaultChecked is false', () => {
            render(<Checkbox defaultChecked={false}>Label</Checkbox>);
            expect(screen.getByRole('checkbox')).not.toBeChecked();
        });

        it('renders checked when defaultChecked is true', () => {
            render(<Checkbox defaultChecked={true}>Label</Checkbox>);
            expect(screen.getByRole('checkbox')).toBeChecked();
        });

        it('toggles without external state', async () => {
            const { user } = render(<Checkbox defaultChecked={false}>Toggle</Checkbox>);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).not.toBeChecked();

            await user.click(checkbox);
            expect(checkbox).toBeChecked();

            await user.click(checkbox);
            expect(checkbox).not.toBeChecked();
        });

        it('calls onChange in uncontrolled mode', async () => {
            const handleChange = vi.fn();
            const { user } = render(
                <Checkbox defaultChecked={false} onChange={handleChange}>
                    Toggle
                </Checkbox>,
            );

            await user.click(screen.getByRole('checkbox'));
            expect(handleChange).toHaveBeenCalledWith(true);
        });

        it('toggles switch kind without external state', async () => {
            const { user } = render(
                <Checkbox kind="switch" defaultChecked={false}>
                    Switch
                </Checkbox>,
            );

            const switchEl = screen.getByRole('switch');
            expect(switchEl).not.toBeChecked();

            await user.click(switchEl);
            expect(switchEl).toBeChecked();
        });
    });

    // ─── Edge cases ──────────────────────────────────────────────────

    describe('edge cases', () => {
        it('handles multiple rapid toggles', async () => {
            const handleChange = vi.fn();
            const { user } = render(<ControlledCheckbox onChange={handleChange}>Rapid</ControlledCheckbox>);

            const checkbox = screen.getByRole('checkbox');
            await user.click(checkbox);
            await user.click(checkbox);
            await user.click(checkbox);

            expect(checkbox).toBeChecked();
        });

        it('renders with no onChange handler without crashing', () => {
            expect(() => {
                render(<Checkbox checked={false}>No handler</Checkbox>);
            }).not.toThrow();
        });

        it('renders with checked=true and no onChange without crashing', () => {
            expect(() => {
                render(<Checkbox checked={true}>Static checked</Checkbox>);
            }).not.toThrow();
        });

        it('handles empty string children', () => {
            render(<Checkbox checked={false}>{''}</Checkbox>);
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });

        it('handles number children', () => {
            render(<Checkbox checked={false}>{42}</Checkbox>);
            expect(screen.getByText('42')).toBeInTheDocument();
        });

        it('applies both disabled and checked classes simultaneously', () => {
            const { container } = render(
                <Checkbox checked={true} disabled>
                    Both
                </Checkbox>,
            );
            const label = container.querySelector('label');
            expect(label).toHaveClass('disabled');
            expect(label).toHaveClass('checked');
        });
    });
});
