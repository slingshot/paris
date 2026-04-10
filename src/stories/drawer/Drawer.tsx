'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import type { CSSLength } from '@ssh/csstypes';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import {
    Children,
    type ComponentPropsWithoutRef,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Button } from '../button';
import { ChevronLeft, ChevronRight, Close, Icon } from '../icon';
import type { PaginationState } from '../pagination';
import { Text } from '../text';
import { RemoveFromDOM } from '../utility/RemoveFromDOM';
import { TextWhenString } from '../utility/TextWhenString';
import { VisuallyHidden } from '../utility/VisuallyHidden';
import styles from './Drawer.module.scss';
import { DrawerProvider } from './DrawerContext';
import { type DrawerPageProps, isDrawerPageElement } from './DrawerPage';
import { DrawerPageProvider } from './DrawerPageContext';
import { DrawerPaginationProvider } from './DrawerPaginationContext';
import { DrawerProgressBar, type DrawerProgressBarStyleProps } from './DrawerProgressBar';
import { DrawerSlotProvider, useDrawerSlotContext } from './DrawerSlotContext';

export const DrawerSizePresets = ['content', 'default', 'full', 'fullWithMargin', 'fullOnMobile'] as const;

export type DrawerPageTransition = 'none' | 'crossfade' | 'slide';

/** Extract the page ID from a child element (DrawerPage or legacy div-with-key). */
const getChildPageID = (child: ReactNode): string | null => {
    if (isDrawerPageElement(child)) return (child as React.ReactElement<DrawerPageProps>).props.id;
    if (child != null && typeof child === 'object' && 'key' in child) return child.key as string;
    return null;
};

export type DrawerProps<T extends string[] | readonly string[] = string[]> = {
    /**
     * The dialog's open state.
     */
    isOpen?: boolean;
    /**
     * A callback that will be called when the user closes the drawer by clicking the close button or the backdrop overlay.
     *
     * @param value {boolean} - The new open state of the dialog.
     */
    onClose?: (value: boolean) => void | Promise<void>;
    /**
     * The title of the drawer. Required for accessibility, but can be hidden with the `hideTitle` prop.
     *
     * If pagination is enabled, the title should instead describe the entire drawer, not any single page. The title will be visually hidden on all pages.
     *
     * If a string is passed, it will be wrapped in a {@link Text} component with `headingXSmall` styling.
     */
    title: ReactNode;
    /**
     * Whether the title should be hidden. If `true`, the title will be visually hidden but still accessible to screen readers.
     *
     * If you're hiding the title to add a custom header, you may also want to hide the close button and render your own by using the `hideCloseButton` prop.
     *
     * @default false
     */
    hideTitle?: boolean;
    /**
     * Whether the close button should be hidden. This will entirely remove the close button from the DOM, so you should provide your own way to close the dialog.
     *
     * @default false
     */
    hideCloseButton?: boolean;
    /**
     * An optional area that will be rendered at the top of the Drawer next to the title. This is useful for adding actions to the Drawer. Recommended to use {@link Menu} for an action menu.
     */
    additionalActions?: ReactNode;
    /**
     * The direction from which the Drawer will appear.
     */
    from?: 'left' | 'right' | 'top' | 'bottom';
    /**
     * The size of the Drawer, either a preset or a valid {@link CSSLength} string.
     *
     * `default` is the default size (360px), with a margin until the screen hits 370px.
     * `fullOnMobile` uses the default size (360px) until the mobile breakpoint (480px), where it then fills the viewport.
     * `full` is the size of the viewport.
     * `fullWithMargin` is the size of the viewport, minus the panel container's padding.
     * `content` is the size of the Drawer's content.
     *
     * @see DrawerSizePresets
     * @default 'default'
     */
    size?: (typeof DrawerSizePresets)[number] | CSSLength;
    /**
     * An optional pagination state. If provided, each child of the Drawer will be rendered in its own page, and the Drawer will contain back and next buttons that will be used to navigate between pages.
     *
     * The state should be created using the {@link usePagination} hook and the entire state should be passed to the Drawer. For example:
     * ```tsx
     * const pagination = usePagination<['step1', 'step2', 'step3']>();
     * // ...
     * <Drawer pagination={pagination}>
     *     <DrawerPage id="step1">Step 1</DrawerPage>
     *     <DrawerPage id="step2">Step 2</DrawerPage>
     *     <DrawerPage id="step3">Step 3</DrawerPage>
     * </Drawer>
     *```
     *
     * @see {@link PaginationState} for more information on the pagination state and available methods
     * @see {@link usePagination} for more information on how to create the pagination state
     * @default false
     */
    pagination?: PaginationState<T>;
    /**
     * The page transition animation style for paginated drawers.
     *
     * - `'none'` — instant page switch
     * - `'crossfade'` — opacity crossfade between pages (default)
     * - `'slide'` — direction-aware horizontal slide (Framer Motion)
     *
     * @default 'crossfade'
     */
    pageTransition?: DrawerPageTransition;
    /**
     * Show a progress bar at the top of the bottom panel. Requires `pagination` to be set.
     * The bar auto-fills based on the current page position.
     *
     * Pass `true` for defaults, or an object with `fill`, `track`, and `height` overrides.
     *
     * For explicit percentage control, use `<DrawerProgressBar value={75} />` directly instead.
     *
     * @default false
     */
    progressBar?: boolean | DrawerProgressBarStyleProps;
    /**
     * Callback fired after the drawer's close animation completes.
     * Use this to reset forms, clear state, and clean up without visual glitches.
     */
    onAfterClose?: () => void;
    /**
     * The overlay style of the Drawer, either 'grey' or 'blur'.
     *
     * @default 'grey'
     */
    overlayStyle?: 'grey' | 'blur';
    /** The contents of the Drawer. */
    children?: ReactNode | ReactNode[];

    /** Prop overrides for other rendered elements. Overrides for the input itself should be passed directly to the component. */
    overrides?: {
        dialog?: ComponentPropsWithoutRef<'div'>;
        overlay?: ComponentPropsWithoutRef<'div'>;
        panelContainer?: ComponentPropsWithoutRef<'div'>;
        panel?: ComponentPropsWithoutRef<'div'>;
        titleBar?: ComponentPropsWithoutRef<'div'>;
        titleArea?: ComponentPropsWithoutRef<'div'>;
        titleBarButtons?: ComponentPropsWithoutRef<'div'>;
        content?: ComponentPropsWithoutRef<'div'>;
        contentChildren?: ComponentPropsWithoutRef<'div'>;
        contentChildrenChildren?: ComponentPropsWithoutRef<'div'>;
        bottomPanelSpacer?: ComponentPropsWithoutRef<'div'>;
        bottomPanel?: ComponentPropsWithoutRef<'div'>;
        bottomPanelContent?: ComponentPropsWithoutRef<'div'>;
    };
};

/**
 * Drawers are panels that slide in from the edge of the screen to reveal additional content.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Drawer } from 'paris/drawer';
 * ```
 * @constructor
 */
export const Drawer = <T extends string[] | readonly string[] = string[]>(props: DrawerProps<T>) => {
    const { isOpen = false, onClose = () => {}, onAfterClose } = props;

    const handleClose = useCallback(() => onClose(false), [onClose]);

    const hasBeenOpen = useRef(false);
    useEffect(() => {
        if (isOpen) hasBeenOpen.current = true;
    }, [isOpen]);

    const handleAfterLeave = useCallback(() => {
        if (hasBeenOpen.current) {
            onAfterClose?.();
        }
    }, [onAfterClose]);

    return (
        <Transition show={isOpen} afterLeave={handleAfterLeave}>
            <Dialog
                as="div"
                className={clsx(styles.root, props.overrides?.dialog?.className)}
                onClose={onClose}
                {...props.overrides?.dialog}
                role="dialog"
            >
                <DrawerProvider close={handleClose} isOpen={isOpen}>
                    <DrawerPaginationProvider pagination={props.pagination ?? null}>
                        <DrawerSlotProvider>
                            <DrawerInner {...props} />
                        </DrawerSlotProvider>
                    </DrawerPaginationProvider>
                </DrawerProvider>
            </Dialog>
        </Transition>
    );
};

/** Internal component that renders inside all providers so it can consume slot context. */
const DrawerInner = <T extends string[] | readonly string[] = string[]>({
    onClose = () => {},
    title,
    hideTitle = false,
    hideCloseButton = false,
    from = 'right',
    size = 'default',
    pagination,
    pageTransition = 'crossfade',
    progressBar,
    overlayStyle = 'grey',
    additionalActions,
    children,
    overrides,
}: DrawerProps<T>) => {
    const slotContext = useDrawerSlotContext();

    const xAxisDrawer = useMemo(() => ['left', 'right'].includes(from), [from]);
    const sizeIsPreset = useMemo(() => (DrawerSizePresets as readonly string[]).includes(size), [size]);
    const isPaginated = useMemo(() => Boolean(pagination), [pagination]);
    const hasAdditionalActions = useMemo(() => Boolean(additionalActions), [additionalActions]);

    const showBottomPanel = (slotContext?.hasAnyBottomPanelSlot ?? false) || (slotContext?.hasProgressBar ?? false);

    const [loadedPage, setLoadedPage] = useState<string | null>(pagination?.currentPage ?? null);

    const pageEntries = useMemo(() => {
        if (!isPaginated || !pagination || !children) return null;
        const childArray = Array.isArray(children) ? children : Children.toArray(children);
        return childArray
            .map((child) => ({ id: getChildPageID(child), child }))
            .filter((entry): entry is { id: string; child: ReactNode } => entry.id !== null);
    }, [isPaginated, pagination, children]);

    const activePageIndex = pageEntries?.findIndex((p) => p.id === pagination?.currentPage) ?? -1;

    const paginatedContent = useMemo(() => {
        if (!pageEntries || !pagination) return null;

        switch (pageTransition) {
            case 'none':
                return pageEntries.map((page) => {
                    const isActive = pagination.currentPage === page.id;
                    return (
                        <DrawerPageProvider key={page.id} isActive={isActive} pageID={page.id}>
                            <div
                                style={{ display: isActive ? undefined : 'none' }}
                                className={overrides?.contentChildrenChildren?.className}
                            >
                                {page.child}
                            </div>
                        </DrawerPageProvider>
                    );
                });

            case 'crossfade':
                return pageEntries.map((page) => {
                    const isActive = pagination.currentPage === page.id && loadedPage === page.id;
                    return (
                        <DrawerPageProvider key={page.id} isActive={isActive} pageID={page.id}>
                            <Transition
                                show={isActive}
                                as="div"
                                enter={styles.paginationEnter}
                                enterFrom={styles.enterFromOpacity}
                                enterTo={styles.enterToOpacity}
                                leave={styles.paginationLeave}
                                leaveFrom={styles.leaveFromOpacity}
                                leaveTo={styles.leaveToOpacity}
                                afterLeave={() => setLoadedPage(pagination.currentPage)}
                                className={overrides?.contentChildrenChildren?.className}
                            >
                                {page.child}
                            </Transition>
                        </DrawerPageProvider>
                    );
                });

            case 'slide':
                return (
                    <div className={clsx(styles.pageStack, styles.pageStackClip)}>
                        {pageEntries.map((page, i) => {
                            const isActive = pagination.currentPage === page.id;
                            const offset = (i - activePageIndex) * 100;
                            return (
                                <DrawerPageProvider key={page.id} isActive={isActive} pageID={page.id}>
                                    <motion.div
                                        initial={false}
                                        animate={{ x: `${offset}%` }}
                                        transition={{
                                            type: 'tween',
                                            duration: 0.3,
                                            ease: [0.32, 0.72, 0, 1],
                                        }}
                                        className={clsx(
                                            styles.pageStackItem,
                                            overrides?.contentChildrenChildren?.className,
                                        )}
                                        data-active={isActive}
                                    >
                                        {page.child}
                                    </motion.div>
                                </DrawerPageProvider>
                            );
                        })}
                    </div>
                );

            default: {
                const _exhaustive: never = pageTransition;
                return _exhaustive;
            }
        }
    }, [pageEntries, pagination, pageTransition, loadedPage, activePageIndex, overrides?.contentChildrenChildren?.className]);

    /** Non-page children (e.g. Drawer-level DrawerBottomPanel) that should render alongside paginated content. */
    const nonPageChildren = useMemo(() => {
        if (!isPaginated || !children) return null;
        const childArray = Array.isArray(children) ? children : Children.toArray(children);
        return childArray.filter((child) => getChildPageID(child) === null);
    }, [isPaginated, children]);

    return (
        <>
            <div
                className={clsx(
                    overlayStyle === 'blur' && styles.overlayBlurContainer,
                    overlayStyle === 'grey' && styles.overlayGreyContainer,
                    overrides?.overlay?.className,
                )}
            >
                <TransitionChild
                    enter={styles.enter}
                    enterFrom={styles.enterFrom}
                    enterTo={styles.enterTo}
                    leave={styles.leave}
                    leaveFrom={styles.leaveFrom}
                    leaveTo={styles.leaveTo}
                >
                    <div
                        className={clsx(
                            styles.overlay,
                            overlayStyle === 'blur' && styles.overlayBlur,
                            overlayStyle === 'grey' && styles.overlayGrey,
                        )}
                    />
                </TransitionChild>
            </div>

            <div
                className={clsx(
                    styles.panelContainer,
                    styles[`from-${from}`],
                    { [styles[`size-${size}`]]: sizeIsPreset },
                    overrides?.panelContainer?.className,
                )}
                style={
                    !sizeIsPreset
                        ? {
                              [xAxisDrawer ? 'width' : 'height']: size,
                              ...overrides?.panelContainer?.style,
                          }
                        : overrides?.panelContainer?.style
                }
                {...overrides?.panelContainer}
            >
                <TransitionChild
                    enter={styles.enter}
                    enterFrom={styles.enterFrom}
                    enterTo={styles.enterTo}
                    leave={styles.leave}
                    leaveFrom={styles.leaveFrom}
                    leaveTo={styles.leaveTo}
                >
                    <DialogPanel className={clsx(styles.panel, styles[`from-${from}`], overrides?.panel?.className)}>
                        {/* Dialog title bar */}
                        <div className={clsx(styles.titleBar, overrides?.titleBar?.className)}>
                            <div className={clsx(styles.titleArea, overrides?.titleArea?.className)}>
                                <RemoveFromDOM when={!isPaginated}>
                                    <div className={clsx(styles.paginationButtons)}>
                                        <Button
                                            className={clsx(styles.navButton)}
                                            size="medium"
                                            kind="tertiary"
                                            shape="circle"
                                            onClick={() => pagination?.back()}
                                            disabled={!pagination?.canGoBack()}
                                            startEnhancer={<Icon icon={ChevronLeft} size={16} />}
                                        >
                                            Go to previous page in this drawer
                                        </Button>
                                        <Button
                                            className={clsx(styles.navButton)}
                                            size="medium"
                                            kind="tertiary"
                                            shape="circle"
                                            onClick={() => pagination?.forward()}
                                            disabled={!pagination?.canGoForward()}
                                            startEnhancer={<Icon icon={ChevronRight} size={16} />}
                                        >
                                            Go to next page in this drawer
                                        </Button>
                                    </div>
                                </RemoveFromDOM>
                                {slotContext && <div ref={slotContext.titleRef} />}
                                {!slotContext?.hasTitleSlot && (
                                    <VisuallyHidden when={hideTitle}>
                                        <DialogTitle as="h2" className={styles.titleTextContainer}>
                                            <TextWhenString kind="paragraphSmall" weight="medium">
                                                {title}
                                            </TextWhenString>
                                        </DialogTitle>
                                    </VisuallyHidden>
                                )}
                            </div>
                            <div className={clsx(styles.titleBarButtons, overrides?.titleBarButtons?.className)}>
                                {slotContext && <div ref={slotContext.actionsRef} />}
                                {!slotContext?.hasActionsSlot && (
                                    <RemoveFromDOM when={!hasAdditionalActions}>{additionalActions}</RemoveFromDOM>
                                )}

                                {/* Close button */}
                                <RemoveFromDOM when={hideCloseButton}>
                                    <Button
                                        kind="tertiary"
                                        shape="circle"
                                        onClick={() => onClose(false)}
                                        startEnhancer={<Icon icon={Close} size={20} />}
                                        data-title-hidden={hideTitle}
                                        className={clsx(styles.closeButton)}
                                    >
                                        Close drawer
                                    </Button>
                                </RemoveFromDOM>
                            </div>
                        </div>

                        <div className={clsx(styles.content, overrides?.content?.className)}>
                            <div className={clsx(styles.contentChildren, overrides?.contentChildren?.className)}>
                                {isPaginated ? (
                                    <>
                                        {paginatedContent}
                                        {nonPageChildren}
                                        {progressBar && pageEntries && (
                                            <DrawerProgressBar
                                                steps={pageEntries.map((p) => p.id)}
                                                {...(typeof progressBar === 'object' ? progressBar : undefined)}
                                            />
                                        )}
                                    </>
                                ) : (
                                    children
                                )}
                            </div>
                            {showBottomPanel && (
                                <>
                                    <div
                                        tabIndex={-1}
                                        aria-hidden="true"
                                        className={clsx(
                                            styles.bottomPanelSpacer,
                                            styles.noPadding,
                                            overrides?.bottomPanelSpacer?.className,
                                        )}
                                    />
                                    <div className={clsx(styles.bottomPanel, overrides?.bottomPanel?.className)}>
                                        {slotContext && <div ref={slotContext.progressBarRef} />}
                                        <div className={styles.glassOpacity} />
                                        <div className={styles.glassBlend} />
                                        <div
                                            className={clsx(
                                                styles.bottomPanelContent,
                                                styles.noPadding,
                                                overrides?.bottomPanelContent?.className,
                                            )}
                                        >
                                            {slotContext && (
                                                <div
                                                    ref={slotContext.bottomPanelCallbackRef}
                                                    className={styles.bottomPanelSlots}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </>
    );
};
