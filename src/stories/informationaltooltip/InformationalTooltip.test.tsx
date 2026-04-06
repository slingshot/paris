import { render, screen, waitFor } from '../../test/render';
import { InformationalTooltip } from './InformationalTooltip';

// Mock pget to return a valid CSS time value for animation duration
vi.mock('../theme', () => ({
    pvar: (path: string) => `var(--pte-${path.replace(/\./g, '-')})`,
    pget: () => '100ms',
}));

/**
 * Radix Tooltip duplicates content inside a visually-hidden `role="tooltip"` span
 * for screen readers. This helper queries the *visible* tooltip content element,
 * excluding the hidden aria-describedby clone.
 */
function getVisibleTooltipContent(): HTMLElement | null {
    const wrapper = document.querySelector('[data-radix-popper-content-wrapper]');
    if (!wrapper) return null;
    // The direct child with data-side is the visible tooltip content
    return wrapper.querySelector(':scope > [data-side]');
}

describe('InformationalTooltip', () => {
    it('renders the default trigger icon', () => {
        render(<InformationalTooltip>Tooltip content</InformationalTooltip>);
        const trigger = screen.getByRole('button');
        expect(trigger).toBeInTheDocument();
    });

    it('renders a custom trigger', () => {
        render(
            <InformationalTooltip trigger={<span data-testid="custom-trigger">?</span>}>
                Tooltip body
            </InformationalTooltip>,
        );
        expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    });

    it('shows tooltip content on hover', async () => {
        const { user } = render(<InformationalTooltip>Hover content</InformationalTooltip>);

        const trigger = screen.getByRole('button');
        await user.hover(trigger);

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveTextContent('Hover content');
        });
    });

    it('does not show tooltip when closed', () => {
        render(<InformationalTooltip>Hidden content</InformationalTooltip>);
        expect(getVisibleTooltipContent()).not.toBeInTheDocument();
    });

    it('renders with a heading when provided', async () => {
        const { user } = render(<InformationalTooltip heading="Info Title">Body text</InformationalTooltip>);

        const trigger = screen.getByRole('button');
        await user.hover(trigger);

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            expect(tooltip).toHaveTextContent('Info Title');
            expect(tooltip).toHaveTextContent('Body text');
        });
    });

    it('does not render heading when heading is null', async () => {
        const { user } = render(<InformationalTooltip heading={null}>Only body</InformationalTooltip>);

        const trigger = screen.getByRole('button');
        await user.hover(trigger);

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            expect(tooltip).toHaveTextContent('Only body');
        });

        const headingEl = getVisibleTooltipContent()?.querySelector('[class*="heading"]');
        expect(headingEl).toBeNull();
    });

    it('opens on click by default', async () => {
        const { user } = render(<InformationalTooltip>Click content</InformationalTooltip>);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveTextContent('Click content');
        });
    });

    it('does not open on click when disableClick is true', async () => {
        const { user } = render(<InformationalTooltip disableClick>No click</InformationalTooltip>);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        expect(getVisibleTooltipContent()).not.toBeInTheDocument();
    });

    it('renders open by default when defaultOpen is true', async () => {
        render(<InformationalTooltip defaultOpen>Default open content</InformationalTooltip>);

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveTextContent('Default open content');
        });
    });

    it('applies the medium size class', async () => {
        const { user } = render(<InformationalTooltip size="medium">Medium tip</InformationalTooltip>);

        const trigger = screen.getByRole('button');
        await user.hover(trigger);

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            expect(tooltip).toHaveClass('medium');
        });
    });

    it('applies the large size class by default', async () => {
        const { user } = render(<InformationalTooltip>Large tip</InformationalTooltip>);

        const trigger = screen.getByRole('button');
        await user.hover(trigger);

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            expect(tooltip).toHaveClass('large');
        });
    });

    it('accepts override props for the tooltip element', async () => {
        render(
            <InformationalTooltip
                defaultOpen
                overrides={{
                    tooltip: { 'data-testid': 'overridden-tooltip' } as any,
                }}
            >
                Overridden
            </InformationalTooltip>,
        );

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            expect(tooltip).toHaveAttribute('data-testid', 'overridden-tooltip');
        });
    });

    it('accepts override props for the heading element', async () => {
        render(
            <InformationalTooltip
                defaultOpen
                heading="Title"
                overrides={{
                    heading: { 'data-testid': 'overridden-heading' },
                }}
            >
                Body
            </InformationalTooltip>,
        );

        await waitFor(() => {
            const tooltip = getVisibleTooltipContent();
            // Query only direct children to avoid the duplicated aria-describedby copy
            const heading = tooltip?.querySelector(':scope > [data-testid="overridden-heading"]');
            expect(heading).toBeInTheDocument();
        });
    });
});
