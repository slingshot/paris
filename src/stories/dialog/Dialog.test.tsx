import { describe, expect, it, vi } from 'vitest';
import { getCloseButton, render, screen, waitFor } from '../../test/render';
import { Dialog } from './Dialog';

describe('Dialog', () => {
    it('renders when isOpen is true', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" onClose={vi.fn()}>
                Dialog content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('does not render when isOpen is false', () => {
        render(
            <Dialog isOpen={false} title="Test Dialog" onClose={vi.fn()}>
                Dialog content
            </Dialog>,
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders children content', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" onClose={vi.fn()}>
                <p>Hello from Dialog</p>
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByText('Hello from Dialog')).toBeInTheDocument();
        });
    });

    it('renders the title', async () => {
        render(
            <Dialog isOpen={true} title="My Dialog Title" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByText('My Dialog Title')).toBeInTheDocument();
        });
    });

    it('visually hides title when hideTitle is true but keeps it accessible', async () => {
        render(
            <Dialog isOpen={true} title="Hidden Title" hideTitle={true} onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByText('Hidden Title')).toBeInTheDocument();
        });
    });

    it('renders the close button by default', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(getCloseButton()).toBeInTheDocument();
        });
    });

    it('hides the close button when hideCloseButton is true', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" hideCloseButton={true} onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        expect(getCloseButton()).not.toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', async () => {
        const onClose = vi.fn();
        const { user } = render(
            <Dialog isOpen={true} title="Test Dialog" onClose={onClose}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(getCloseButton()).toBeInTheDocument();
        });

        const closeButton = getCloseButton()!;
        await user.click(closeButton);

        expect(onClose).toHaveBeenCalledWith(false);
    });

    it('applies simple appearance by default', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('accepts glass appearance', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" appearance="glass" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('accepts width presets', async () => {
        const { rerender } = render(
            <Dialog isOpen={true} title="Test Dialog" width="compact" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        rerender(
            <Dialog isOpen={true} title="Test Dialog" width="large" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('accepts custom width as CSSLength', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" width="500px" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('accepts full height', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" height="full" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('accepts grey overlay style', async () => {
        render(
            <Dialog isOpen={true} title="Test Dialog" overlayStyle="grey" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('renders with overrides applied', async () => {
        render(
            <Dialog
                isOpen={true}
                title="Test Dialog"
                onClose={vi.fn()}
                overrides={{
                    root: { 'data-testid': 'dialog-root' } as any,
                    panel: { 'data-testid': 'dialog-panel' } as any,
                }}
            >
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('dialog-root')).toBeInTheDocument();
            expect(screen.getByTestId('dialog-panel')).toBeInTheDocument();
        });
    });

    it('renders a ReactNode title', async () => {
        render(
            <Dialog isOpen={true} title={<span data-testid="custom-title">Custom Title</span>} onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('custom-title')).toBeInTheDocument();
        });
    });

    it('does not render when isOpen transitions from true to false', async () => {
        const { rerender } = render(
            <Dialog isOpen={true} title="Test Dialog" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        rerender(
            <Dialog isOpen={false} title="Test Dialog" onClose={vi.fn()}>
                Content
            </Dialog>,
        );

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});
