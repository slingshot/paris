import { describe, expect, it, vi } from 'vitest';
import { getCloseButton, render, screen, waitFor } from '../../test/render';
import { Drawer } from './Drawer';

describe('Drawer', () => {
    it('renders when isOpen is true', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                Drawer content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('does not render when isOpen is false', () => {
        render(
            <Drawer isOpen={false} title="Test Drawer" onClose={vi.fn()}>
                Drawer content
            </Drawer>,
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders children content', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                <p>Hello from Drawer</p>
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('Hello from Drawer')).toBeInTheDocument();
        });
    });

    it('renders the title', async () => {
        render(
            <Drawer isOpen={true} title="My Drawer Title" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('My Drawer Title')).toBeInTheDocument();
        });
    });

    it('visually hides title when hideTitle is true but keeps it accessible', async () => {
        render(
            <Drawer isOpen={true} title="Hidden Title" hideTitle={true} onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('Hidden Title')).toBeInTheDocument();
        });
    });

    it('renders the close button by default', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(getCloseButton()).toBeInTheDocument();
        });
    });

    it('hides the close button when hideCloseButton is true', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" hideCloseButton={true} onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        expect(getCloseButton()).not.toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', async () => {
        const onClose = vi.fn();
        const { user } = render(
            <Drawer isOpen={true} title="Test Drawer" onClose={onClose}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(getCloseButton()).toBeInTheDocument();
        });

        const closeButton = getCloseButton()!;
        await user.click(closeButton);

        expect(onClose).toHaveBeenCalledWith(false);
    });

    it('renders with from="left"', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" from="left" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('renders with from="right" (default)', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" from="right" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('renders with from="top"', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" from="top" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('renders with from="bottom"', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" from="bottom" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('renders a bottom panel', async () => {
        render(
            <Drawer
                isOpen={true}
                title="Test Drawer"
                onClose={vi.fn()}
                bottomPanel={<button type="button">Save</button>}
            >
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getAllByText('Save').length).toBeGreaterThan(0);
        });
    });

    it('renders additional actions', async () => {
        render(
            <Drawer
                isOpen={true}
                title="Test Drawer"
                onClose={vi.fn()}
                additionalActions={<button type="button">Action</button>}
            >
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });

    it('renders with blur overlay style', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" overlayStyle="blur" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('does not render when isOpen transitions from true to false', async () => {
        const { rerender } = render(
            <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        rerender(
            <Drawer isOpen={false} title="Test Drawer" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('accepts size presets', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" size="full" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('accepts custom size as CSSLength', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" size="500px" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('renders a ReactNode title', async () => {
        render(
            <Drawer isOpen={true} title={<span data-testid="custom-title">Custom Title</span>} onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('custom-title')).toBeInTheDocument();
        });
    });
});
