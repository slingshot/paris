import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getCloseButton, render, screen, waitFor } from '../../test/render';
import { usePagination } from '../pagination';
import { Drawer } from './Drawer';
import { DrawerActions } from './DrawerActions';
import { DrawerBottomPanel } from './DrawerBottomPanel';
import { useDrawer } from './DrawerContext';
import { DrawerPage } from './DrawerPage';
import { DrawerPageProvider, useIsPageActive } from './DrawerPageContext';
import { useDrawerPagination } from './DrawerPaginationContext';
import { DrawerProgressBar } from './DrawerProgressBar';
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
            expect(getCloseButton('Close drawer')).toBeInTheDocument();
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

        expect(getCloseButton('Close drawer')).not.toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', async () => {
        const onClose = vi.fn();
        const { user } = render(
            <Drawer isOpen={true} title="Test Drawer" onClose={onClose}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(getCloseButton('Close drawer')).toBeInTheDocument();
        });

        const closeButton = getCloseButton('Close drawer')!;
        await user.click(closeButton);

        expect(onClose).toHaveBeenCalledWith(false, { reason: 'close-press' });
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

    it('renders a bottom panel via DrawerBottomPanel', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                Content
                <DrawerBottomPanel>
                    <button type="button">Save</button>
                </DrawerBottomPanel>
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getAllByText('Save').length).toBeGreaterThan(0);
        });
    });

    it('reserves scroll padding for the bottom panel so scrolls stop clear of it', async () => {
        const offsetHeight = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(120);

        render(
            <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                Content
                <DrawerBottomPanel>
                    <button type="button">Save</button>
                </DrawerBottomPanel>
            </Drawer>,
        );

        await waitFor(() => {
            const content = document.querySelector<HTMLElement>('.content');
            expect(content?.style.scrollPaddingBottom).toBe('120px');
        });

        offsetHeight.mockRestore();
    });

    describe('keeping a focused field visible when geometry changes', () => {
        /** Swaps in a ResizeObserver whose callbacks can be fired on demand, since jsdom never resizes. */
        function captureResizeObservers() {
            // A disconnected observer must drop its callback, or an effect re-run leaves a stale
            // one behind and every fire is counted twice.
            const callbacks = new Set<ResizeObserverCallback>();
            const original = globalThis.ResizeObserver;
            class CapturingResizeObserver {
                private readonly callback: ResizeObserverCallback;
                constructor(callback: ResizeObserverCallback) {
                    this.callback = callback;
                    callbacks.add(callback);
                }
                observe() {}
                unobserve() {}
                disconnect() {
                    callbacks.delete(this.callback);
                }
            }
            globalThis.ResizeObserver = CapturingResizeObserver as unknown as typeof ResizeObserver;
            return {
                fireAll: () => {
                    for (const callback of [...callbacks]) {
                        callback([], {} as ResizeObserver);
                    }
                },
                restore: () => {
                    globalThis.ResizeObserver = original;
                },
            };
        }

        /** jsdom reports every rect as zero, so place the pieces by hand. */
        function stubRects({ focusedBottom }: { focusedBottom: number }) {
            const rect = (top: number, bottom: number) =>
                ({ top, bottom, left: 0, right: 0, width: 0, height: bottom - top }) as DOMRect;
            const content = document.querySelector<HTMLElement>('.content');
            const bottomPanel = document.querySelector<HTMLElement>('.bottomPanel');
            const focused = document.activeElement as HTMLElement;
            if (!content || !bottomPanel) throw new Error('drawer did not render its scroll container');
            content.getBoundingClientRect = () => rect(0, 400);
            bottomPanel.getBoundingClientRect = () => rect(300, 400);
            focused.getBoundingClientRect = () => rect(focusedBottom - 28, focusedBottom);
            return content;
        }

        it('scrolls a focused field back into view when the panel grows over it', async () => {
            const observers = captureResizeObservers();
            try {
                const { user } = render(
                    <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                        <input aria-label="Amount" />
                        <DrawerBottomPanel>
                            <button type="button">Save</button>
                        </DrawerBottomPanel>
                    </Drawer>,
                );

                await waitFor(() => {
                    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
                });
                await user.click(screen.getByLabelText('Amount'));

                // Panel top is 300; the field now ends at 360, so 60px of it sits underneath.
                const content = stubRects({ focusedBottom: 360 });
                content.scrollTop = 0;
                observers.fireAll();

                expect(content.scrollTop).toBe(60);
            } finally {
                observers.restore();
            }
        });

        it('leaves a focused field alone when it is already clear of the panel', async () => {
            const observers = captureResizeObservers();
            try {
                const { user } = render(
                    <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                        <input aria-label="Amount" />
                        <DrawerBottomPanel>
                            <button type="button">Save</button>
                        </DrawerBottomPanel>
                    </Drawer>,
                );

                await waitFor(() => {
                    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
                });
                await user.click(screen.getByLabelText('Amount'));

                const content = stubRects({ focusedBottom: 200 });
                content.scrollTop = 25;
                observers.fireAll();

                expect(content.scrollTop).toBe(25);
            } finally {
                observers.restore();
            }
        });

        it('does not scroll when focus is outside the drawer content', async () => {
            const observers = captureResizeObservers();
            try {
                render(
                    <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                        <input aria-label="Amount" />
                        <DrawerBottomPanel>
                            <button type="button">Save</button>
                        </DrawerBottomPanel>
                    </Drawer>,
                );

                await waitFor(() => {
                    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
                });

                const outside = document.createElement('input');
                document.body.appendChild(outside);
                outside.focus();

                const content = document.querySelector<HTMLElement>('.content');
                if (!content) throw new Error('drawer did not render its scroll container');
                content.scrollTop = 0;
                observers.fireAll();

                expect(content.scrollTop).toBe(0);
                outside.remove();
            } finally {
                observers.restore();
            }
        });
    });

    it('leaves scroll padding unset when there is no bottom panel', async () => {
        render(
            <Drawer isOpen={true} title="Test Drawer" onClose={vi.fn()}>
                Content
            </Drawer>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const content = document.querySelector<HTMLElement>('.content');
        expect(content?.style.scrollPaddingBottom).toBe('');
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

            expect(onClose).toHaveBeenCalledWith(false, { reason: 'imperative' });
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
            const Wrapper = () => {
                const pages = ['step1'] as const;
                const pagination = usePagination<typeof pages>('step1');
                return (
                    <Drawer isOpen={true} title="Paginated Drawer" onClose={vi.fn()} pagination={pagination}>
                        <DrawerPage id="step1">
                            <PaginationConsumer />
                        </DrawerPage>
                    </Drawer>
                );
            };

            render(<Wrapper />);

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

            // Fallback title stays in DOM (visually hidden) for aria-labelledby
            expect(screen.getByText('Fallback Title')).toBeInTheDocument();
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

    describe('onAfterClose', () => {
        it('calls onAfterClose after the drawer close animation completes', async () => {
            const onAfterClose = vi.fn();
            const onClose = vi.fn();

            const { rerender } = render(
                <Drawer isOpen={true} title="Test" onClose={onClose} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            rerender(
                <Drawer isOpen={false} title="Test" onClose={onClose} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(onAfterClose).toHaveBeenCalledTimes(1);
            });
        });

        it('does not call onAfterClose on initial render when closed', () => {
            const onAfterClose = vi.fn();

            render(
                <Drawer isOpen={false} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            expect(onAfterClose).not.toHaveBeenCalled();
        });

        it('stamps onAfterClose with the reason the drawer closed', async () => {
            const onAfterClose = vi.fn();
            const onClose = vi.fn();

            const { user, rerender } = render(
                <Drawer isOpen={true} title="Test" onClose={onClose} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(getCloseButton('Close drawer')).toBeInTheDocument();
            });

            await user.click(getCloseButton('Close drawer')!);
            rerender(
                <Drawer isOpen={false} title="Test" onClose={onClose} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(onAfterClose).toHaveBeenCalledWith({ reason: 'close-press' });
            });
        });

        it('reports an imperative reason when isOpen is flipped without a dismissal gesture', async () => {
            const onAfterClose = vi.fn();

            const { rerender } = render(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            rerender(
                <Drawer isOpen={false} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(onAfterClose).toHaveBeenCalledWith({ reason: 'imperative' });
            });
        });

        it('flushes a pending teardown when the drawer reopens before the exit completes', async () => {
            const onAfterClose = vi.fn();

            const { rerender } = render(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            rerender(
                <Drawer isOpen={false} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );
            rerender(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            expect(onAfterClose).toHaveBeenCalledTimes(1);
        });

        it('flushes a pending teardown when the drawer unmounts mid-exit', async () => {
            const onAfterClose = vi.fn();

            const { rerender, unmount } = render(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            rerender(
                <Drawer isOpen={false} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );
            unmount();

            expect(onAfterClose).toHaveBeenCalledTimes(1);
        });

        it('calls onAfterClose exactly once across every flush path', async () => {
            const onAfterClose = vi.fn();

            const { rerender, unmount } = render(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            rerender(
                <Drawer isOpen={false} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(onAfterClose).toHaveBeenCalledTimes(1);
            });

            unmount();
            expect(onAfterClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('close reasons', () => {
        it('reports an escape-key reason when Escape dismisses the drawer', async () => {
            const onClose = vi.fn();
            const { user } = render(
                <Drawer isOpen={true} title="Test" onClose={onClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            await user.keyboard('{Escape}');

            await waitFor(() => {
                expect(onClose).toHaveBeenCalledWith(false, { reason: 'escape-key' });
            });
        });

        it('reports a backdrop-press reason when a press outside the panel dismisses the drawer', async () => {
            const onClose = vi.fn();
            const { user } = render(
                <Drawer isOpen={true} title="Test" onClose={onClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            await user.click(document.body);

            await waitFor(() => {
                expect(onClose).toHaveBeenCalledWith(false, { reason: 'backdrop-press' });
            });
        });

        it('stays open when the consumer ignores a close request', async () => {
            const onClose = vi.fn();
            const { user } = render(
                <Drawer isOpen={true} title="Test" onClose={onClose}>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            await user.keyboard('{Escape}');

            expect(onClose).toHaveBeenCalled();
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('does not attribute an ignored dismissal gesture to a later imperative close', async () => {
            vi.useFakeTimers({ shouldAdvanceTime: true });
            try {
                const onAfterClose = vi.fn();
                const { user, rerender } = render(
                    <Drawer isOpen={true} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                        Content
                    </Drawer>,
                );

                await waitFor(() => {
                    expect(screen.getByRole('dialog')).toBeInTheDocument();
                });

                await user.keyboard('{Escape}');
                await vi.advanceTimersByTimeAsync(1000);

                rerender(
                    <Drawer isOpen={false} title="Test" onClose={vi.fn()} onAfterClose={onAfterClose}>
                        Content
                    </Drawer>,
                );

                await waitFor(() => {
                    expect(onAfterClose).toHaveBeenCalledWith({ reason: 'imperative' });
                });
            } finally {
                vi.useRealTimers();
            }
        });
    });

    describe('DrawerBottomPanel', () => {
        it('renders bottom panel content via slot component', async () => {
            render(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()}>
                    <DrawerBottomPanel>
                        <button type="button">Slot Panel</button>
                    </DrawerBottomPanel>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByText('Slot Panel')).toBeInTheDocument();
            });
        });

        it('renders multiple append-mode bottom panels', async () => {
            render(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()}>
                    <DrawerBottomPanel mode="append">
                        <span>First Panel</span>
                    </DrawerBottomPanel>
                    <DrawerBottomPanel mode="append">
                        <span>Second Panel</span>
                    </DrawerBottomPanel>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                expect(screen.getByText('First Panel')).toBeInTheDocument();
                expect(screen.getByText('Second Panel')).toBeInTheDocument();
            });
        });

        it('orders multiple append slots by priority', async () => {
            render(
                <Drawer isOpen={true} title="Test" onClose={vi.fn()}>
                    <DrawerBottomPanel mode="append" priority={20}>
                        <span data-testid="p20">Priority 20</span>
                    </DrawerBottomPanel>
                    <DrawerBottomPanel mode="append" priority={10}>
                        <span data-testid="p10">Priority 10</span>
                    </DrawerBottomPanel>
                    Content
                </Drawer>,
            );

            await waitFor(() => {
                const p10 = screen.getByTestId('p10');
                const p20 = screen.getByTestId('p20');
                // CSS order controls visual ordering — lower priority = visually higher
                const p10Order = Number((p10.parentElement as HTMLElement).style.order);
                const p20Order = Number((p20.parentElement as HTMLElement).style.order);
                expect(p10Order).toBeLessThan(p20Order);
            });
        });

        it('only shows active page bottom panel in paginated drawer', async () => {
            const Wrapper = () => {
                const pages = ['a', 'b'] as const;
                const pagination = usePagination<typeof pages>('a');
                return (
                    <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                        <DrawerPage id="a">
                            <DrawerBottomPanel>
                                <span>Panel A</span>
                            </DrawerBottomPanel>
                            Page A
                        </DrawerPage>
                        <DrawerPage id="b">
                            <DrawerBottomPanel>
                                <span>Panel B</span>
                            </DrawerBottomPanel>
                            Page B
                        </DrawerPage>
                    </Drawer>
                );
            };

            render(<Wrapper />);

            await waitFor(() => {
                expect(screen.getByText('Panel A')).toBeInTheDocument();
            });

            expect(screen.queryByText('Panel B')).not.toBeInTheDocument();
        });
    });

    describe('DrawerProgressBar', () => {
        it('renders progress bar with auto-calculated value from pagination', async () => {
            const Wrapper = () => {
                const pages = ['a', 'b', 'c'] as const;
                const pagination = usePagination<typeof pages>('b');
                return (
                    <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination} progressBar>
                        <DrawerPage id="a">Page A</DrawerPage>
                        <DrawerPage id="b">Page B</DrawerPage>
                        <DrawerPage id="c">Page C</DrawerPage>
                    </Drawer>
                );
            };

            render(<Wrapper />);

            await waitFor(() => {
                const bar = screen.getByRole('progressbar');
                expect(bar).toBeInTheDocument();
                // Page 'b' is index 1, so (1+1)/3 * 100 ≈ 67
                expect(bar).toHaveAttribute('aria-valuenow', '67');
            });
        });

        it('renders progress bar with explicit value override', async () => {
            const Wrapper = () => {
                const pages = ['a', 'b'] as const;
                const pagination = usePagination<typeof pages>('a');
                return (
                    <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                        <DrawerPage id="a">Page A</DrawerPage>
                        <DrawerPage id="b">Page B</DrawerPage>
                        <DrawerProgressBar value={42} />
                    </Drawer>
                );
            };

            render(<Wrapper />);

            await waitFor(() => {
                const bar = screen.getByRole('progressbar');
                expect(bar).toBeInTheDocument();
                expect(bar).toHaveAttribute('aria-valuenow', '42');
            });
        });

        it('clamps explicit value to 0–100 range', async () => {
            const Wrapper = () => {
                const pages = ['a'] as const;
                const pagination = usePagination<typeof pages>('a');
                return (
                    <Drawer isOpen={true} title="Test" onClose={vi.fn()} pagination={pagination}>
                        <DrawerPage id="a">Page A</DrawerPage>
                        <DrawerProgressBar value={150} />
                    </Drawer>
                );
            };

            render(<Wrapper />);

            await waitFor(() => {
                const bar = screen.getByRole('progressbar');
                expect(bar).toHaveAttribute('aria-valuenow', '100');
            });
        });
    });
});
