import { render, screen, waitFor } from '../../test/render';
import { Accordion } from './Accordion';

describe('Accordion', () => {
    it('renders with a title', () => {
        render(<Accordion title="My Accordion" />);
        expect(screen.getByText('My Accordion')).toBeInTheDocument();
    });

    it('does not show children when collapsed', () => {
        render(<Accordion title="Title">Hidden content</Accordion>);
        expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('expands on click to reveal children', async () => {
        const { user } = render(<Accordion title="Title">Revealed content</Accordion>);
        await user.click(screen.getByRole('button'));
        expect(screen.getByText('Revealed content')).toBeInTheDocument();
    });

    it('collapses on second click', async () => {
        const { user } = render(<Accordion title="Title">Toggle content</Accordion>);
        const button = screen.getByRole('button');

        await user.click(button);
        expect(screen.getByText('Toggle content')).toBeInTheDocument();

        await user.click(button);
        // AnimatePresence exit animation may keep element mounted briefly
        await waitFor(() => {
            expect(screen.queryByText('Toggle content')).not.toBeInTheDocument();
        });
    });

    it('expands on Enter key', async () => {
        const { user } = render(<Accordion title="Title">Keyboard content</Accordion>);
        screen.getByRole('button').focus();
        await user.keyboard('{Enter}');
        expect(screen.getByText('Keyboard content')).toBeInTheDocument();
    });

    it('expands on Space key', async () => {
        const { user } = render(<Accordion title="Title">Space content</Accordion>);
        screen.getByRole('button').focus();
        await user.keyboard(' ');
        expect(screen.getByText('Space content')).toBeInTheDocument();
    });

    it('calls onOpenChange when toggled (uncontrolled)', async () => {
        const onChange = vi.fn();
        const { user } = render(
            <Accordion title="Title" onOpenChange={onChange}>
                Content
            </Accordion>,
        );
        await user.click(screen.getByRole('button'));
        expect(onChange).toHaveBeenCalledWith(true);

        await user.click(screen.getByRole('button'));
        expect(onChange).toHaveBeenCalledWith(false);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('works as a controlled component', async () => {
        const onChange = vi.fn();
        const { rerender, user } = render(
            <Accordion title="Title" isOpen={false} onOpenChange={onChange}>
                Controlled content
            </Accordion>,
        );

        expect(screen.queryByText('Controlled content')).not.toBeInTheDocument();

        // Open externally
        rerender(
            <Accordion title="Title" isOpen={true} onOpenChange={onChange}>
                Controlled content
            </Accordion>,
        );
        expect(screen.getByText('Controlled content')).toBeInTheDocument();

        // Click should call onOpenChange but not change state (controlled)
        await user.click(screen.getByRole('button'));
        expect(onChange).toHaveBeenCalledWith(false);
    });

    it('renders with kind="card"', () => {
        render(
            <Accordion title="Card Accordion" kind="card">
                Card content
            </Accordion>,
        );
        expect(screen.getByText('Card Accordion')).toBeInTheDocument();
    });

    it('renders with kind="default" by default', () => {
        const { container } = render(<Accordion title="Default" />);
        expect(container.firstElementChild).toHaveClass('default');
    });

    it('applies custom className via overrides', () => {
        const { container } = render(
            <Accordion title="Styled" overrides={{ container: { className: 'custom-class' } }}>
                Styled content
            </Accordion>,
        );
        expect(container.firstElementChild).toHaveClass('custom-class');
    });

    it('sets data-state attribute on the title container', () => {
        render(<Accordion title="Title">Content</Accordion>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-state', 'closed');
    });

    it('updates data-state to open when expanded', async () => {
        const { user } = render(<Accordion title="Title">Content</Accordion>);
        const button = screen.getByRole('button');
        await user.click(button);
        expect(button).toHaveAttribute('data-state', 'open');
    });

    it('renders with size="large" for card kind', () => {
        render(
            <Accordion title="Large Card" kind="card" size="large">
                Large content
            </Accordion>,
        );
        expect(screen.getByRole('button')).toHaveClass('large');
    });

    it('starts open when isOpen is true initially', () => {
        render(
            <Accordion title="Pre-opened" isOpen={true}>
                Visible from start
            </Accordion>,
        );
        expect(screen.getByText('Visible from start')).toBeInTheDocument();
    });
});
