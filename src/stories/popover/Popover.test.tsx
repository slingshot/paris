import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/render';
import { Popover } from './Popover';

describe('Popover', () => {
    it('renders the trigger element', () => {
        render(
            <Popover trigger={<button type="button">Open Popover</button>}>
                <p>Popover content</p>
            </Popover>,
        );

        expect(screen.getByText('Open Popover')).toBeInTheDocument();
    });

    it('does not show popover content initially', () => {
        render(
            <Popover trigger={<button type="button">Open Popover</button>}>
                <p>Popover content</p>
            </Popover>,
        );

        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });

    it('shows popover content when the trigger is clicked', async () => {
        const { user } = render(
            <Popover trigger={<button type="button">Open Popover</button>}>
                <p>Popover content</p>
            </Popover>,
        );

        await user.click(screen.getByText('Open Popover'));

        await waitFor(() => {
            expect(screen.getByText('Popover content')).toBeInTheDocument();
        });
    });

    it('hides popover content when the trigger is clicked again', async () => {
        const { user } = render(
            <Popover trigger={<button type="button">Open Popover</button>}>
                <p>Popover content</p>
            </Popover>,
        );

        await user.click(screen.getByText('Open Popover'));

        await waitFor(() => {
            expect(screen.getByText('Popover content')).toBeInTheDocument();
        });

        await user.click(screen.getByText('Open Popover'));

        await waitFor(() => {
            expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
        });
    });

    it('supports controlled isOpen state', () => {
        render(
            <Popover trigger={<button type="button">Open Popover</button>} isOpen={true} setIsOpen={vi.fn()}>
                <p>Controlled content</p>
            </Popover>,
        );

        expect(screen.getByText('Controlled content')).toBeInTheDocument();
    });

    it('does not show content when controlled isOpen is false', () => {
        render(
            <Popover trigger={<button type="button">Open Popover</button>} isOpen={false} setIsOpen={vi.fn()}>
                <p>Controlled content</p>
            </Popover>,
        );

        expect(screen.queryByText('Controlled content')).not.toBeInTheDocument();
    });

    it('calls setIsOpen when trigger is clicked in controlled mode', async () => {
        const setIsOpen = vi.fn();
        const { user } = render(
            <Popover trigger={<button type="button">Open Popover</button>} isOpen={false} setIsOpen={setIsOpen}>
                <p>Controlled content</p>
            </Popover>,
        );

        await user.click(screen.getByText('Open Popover'));

        expect(setIsOpen).toHaveBeenCalledWith(true);
    });

    it('renders children content inside the popover', async () => {
        const { user } = render(
            <Popover trigger={<button type="button">Open Popover</button>}>
                <div>
                    <h3>Title</h3>
                    <p>Description text</p>
                </div>
            </Popover>,
        );

        await user.click(screen.getByText('Open Popover'));

        await waitFor(() => {
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description text')).toBeInTheDocument();
        });
    });

    it('renders with custom positions', async () => {
        const { user } = render(
            <Popover trigger={<button type="button">Open Popover</button>} positions={['top', 'bottom']}>
                <p>Positioned content</p>
            </Popover>,
        );

        await user.click(screen.getByText('Open Popover'));

        await waitFor(() => {
            expect(screen.getByText('Positioned content')).toBeInTheDocument();
        });
    });

    it('renders with custom alignment', async () => {
        const { user } = render(
            <Popover trigger={<button type="button">Open Popover</button>} align="center">
                <p>Aligned content</p>
            </Popover>,
        );

        await user.click(screen.getByText('Open Popover'));

        await waitFor(() => {
            expect(screen.getByText('Aligned content')).toBeInTheDocument();
        });
    });

    it('renders with custom padding', async () => {
        const { user } = render(
            <Popover trigger={<button type="button">Open Popover</button>} padding={16}>
                <p>Padded content</p>
            </Popover>,
        );

        await user.click(screen.getByText('Open Popover'));

        await waitFor(() => {
            expect(screen.getByText('Padded content')).toBeInTheDocument();
        });
    });
});
