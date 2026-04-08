import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getCloseButton, render, screen, waitFor } from '../../test/render';
import { usePagination } from '../pagination';
import { Drawer } from './Drawer';
import { DrawerActions } from './DrawerActions';
import { useDrawer } from './DrawerContext';
import { DrawerPage } from './DrawerPage';
import { DrawerPageProvider, useIsPageActive } from './DrawerPageContext';
import { useDrawerPagination } from './DrawerPaginationContext';
import { DrawerTitle } from './DrawerTitle';

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

    describe('useDrawer', () => {
        function DrawerConsumer() {
            const { close, isOpen } = useDrawer();
            return (
                <div>
                    <span data-testid="is-open">{String(isOpen)}</span>
                    <button type="button" onClick={close}>
                        Close via context
                    </button>
                </div>
            );
        }

        it('provides isOpen and close to children', async () => {
            render(
                <Drawer isOpen={true} title="Context Drawer" onClose={vi.fn()}>
                    <DrawerConsumer />
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('is-open')).toHaveTextContent('true');
            });
        });

        it('calls onClose(false) when close is invoked from context', async () => {
            const onClose = vi.fn();
            const { user } = render(
                <Drawer isOpen={true} title="Context Drawer" onClose={onClose}>
                    <DrawerConsumer />
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByText('Close via context')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Close via context'));

            expect(onClose).toHaveBeenCalledWith(false);
        });

        it('throws when useDrawer is used outside of a Drawer', () => {
            // Suppress React error boundary console output
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            expect(() => render(<DrawerConsumer />)).toThrow('useDrawer must be used within a Drawer component');
            consoleSpy.mockRestore();
        });
    });

    describe('useDrawerPagination', () => {
        function PaginationConsumer() {
            const pagination = useDrawerPagination();
            return (
                <div>
                    <span data-testid="pagination-value">{pagination ? pagination.currentPage : 'null'}</span>
                </div>
            );
        }

        it('provides pagination state to children in a paginated drawer', async () => {
            const paginationState = {
                currentPage: 'step1',
                open: vi.fn(),
                canGoBack: () => false,
                back: vi.fn(),
                canGoForward: () => true,
                forward: vi.fn(),
                history: ['step1'],
                reset: vi.fn(),
            };

            render(
                <Drawer isOpen={true} title="Paginated Drawer" onClose={vi.fn()} pagination={paginationState}>
                    <PaginationConsumer key="step1" />
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('pagination-value')).toHaveTextContent('step1');
            });
        });

        it('returns null when no pagination is provided', async () => {
            render(
                <Drawer isOpen={true} title="Non-paginated Drawer" onClose={vi.fn()}>
                    <PaginationConsumer />
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('pagination-value')).toHaveTextContent('null');
            });
        });
    });

    describe('useIsPageActive', () => {
        it('returns true when page is active', () => {
            const { result } = renderHook(() => useIsPageActive(), {
                wrapper: ({ children }) => (
                    <DrawerPageProvider isActive={true} pageID="page1">
                        {children}
                    </DrawerPageProvider>
                ),
            });

            expect(result.current).toBe(true);
        });

        it('returns false when page is not active', () => {
            const { result } = renderHook(() => useIsPageActive(), {
                wrapper: ({ children }) => (
                    <DrawerPageProvider isActive={false} pageID="page1">
                        {children}
                    </DrawerPageProvider>
                ),
            });

            expect(result.current).toBe(false);
        });

        it('returns true when used outside DrawerPageProvider', () => {
            const { result } = renderHook(() => useIsPageActive());

            expect(result.current).toBe(true);
        });
    });

    describe('DrawerTitle', () => {
        it('overrides the drawer title prop', async () => {
            render(
                <Drawer isOpen={true} title="Fallback Title" onClose={vi.fn()}>
                    <DrawerTitle>Custom Title</DrawerTitle>
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByText('Custom Title')).toBeInTheDocument();
            });

            expect(screen.queryByText('Fallback Title')).not.toBeInTheDocument();
        });

        it('shows fallback title when no DrawerTitle is used', async () => {
            render(
                <Drawer isOpen={true} title="Fallback Title" onClose={vi.fn()}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByText('Fallback Title')).toBeInTheDocument();
            });
        });

        it('only shows active page DrawerTitle in paginated drawer', async () => {
            const Wrapper = () => {
                const pages = ['a', 'b'] as const;
                const pagination = usePagination<typeof pages>('a');
                return (
                    <Drawer isOpen={true} title="Fallback" onClose={vi.fn()} pagination={pagination}>
                        <DrawerPage id="a">
                            <DrawerTitle>Title A</DrawerTitle>
                            Page A
                        </DrawerPage>
                        <DrawerPage id="b">
                            <DrawerTitle>Title B</DrawerTitle>
                            Page B
                        </DrawerPage>
                    </Drawer>
                );
            };

            render(<Wrapper />);

            await waitFor(() => {
                expect(screen.getByText('Title A')).toBeInTheDocument();
            });

            expect(screen.queryByText('Title B')).not.toBeInTheDocument();
        });
    });

    describe('DrawerActions', () => {
        it('renders actions via slot component', async () => {
            render(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()}>
                    <DrawerActions>
                        <button type="button">Slot Action</button>
                    </DrawerActions>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByText('Slot Action')).toBeInTheDocument();
            });
        });

        it('falls back to additionalActions prop when no DrawerActions slot', async () => {
            render(
                <Drawer
                    isOpen={true}
                    title="Test"
                    onClose={vi.fn()}
                    additionalActions={<button type="button">Prop Action</button>}
                >
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByText('Prop Action')).toBeInTheDocument();
            });
        });
    });

    describe('DrawerPage', () => {
        it('renders children inside a paginated drawer', async () => {
            const Wrapper = () => {
                const pages = ['a', 'b'] as const;
                const pagination = usePagination<typeof pages>('a');
                return (
                    <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                        <DrawerPage id="a">Page A Content</DrawerPage>
                        <DrawerPage id="b">Page B Content</DrawerPage>
                    </Drawer>
                );
            };

            render(<Wrapper />);

            await waitFor(() => {
                expect(screen.getByText('Page A Content')).toBeInTheDocument();
            });
        });

        it('does not render lazy page until it becomes active', async () => {
            const LazyChild = () => <span data-testid="lazy-content">Lazy Loaded</span>;

            const Wrapper = () => {
                const pages = ['a', 'b'] as const;
                const pagination = usePagination<typeof pages>('a');
                return (
                    <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                        <DrawerPage id="a">
                            <button type="button" onClick={() => pagination.open('b')}>
                                Go to B
                            </button>
                        </DrawerPage>
                        <DrawerPage id="b" lazy>
                            <LazyChild />
                        </DrawerPage>
                    </Drawer>
                );
            };

            const { user } = render(<Wrapper />);

            await waitFor(() => {
                expect(screen.getByText('Go to B')).toBeInTheDocument();
            });

            expect(screen.queryByTestId('lazy-content')).not.toBeInTheDocument();

            await user.click(screen.getByText('Go to B'));

            await waitFor(() => {
                expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
            });
        });
    });
});
