'use client';

import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import {
    useMemo, useState, useCallback, useEffect,
} from 'react';
import {
    Dialog, DialogPanel, DialogTitle, Transition, TransitionChild,
} from '@headlessui/react';
import clsx from 'clsx';
import type { CSSLength } from '@ssh/csstypes';
import styles from './Drawer.module.scss';
import { Text } from '../text';
import { VisuallyHidden } from '../utility/VisuallyHidden';
import { TextWhenString } from '../utility/TextWhenString';
import { Button } from '../button';
import { RemoveFromDOM } from '../utility/RemoveFromDOM';
import type { PaginationState } from '../pagination';
import { PaginationProvider } from '../pagination/PaginationContext';
import {
    ChevronLeft, ChevronRight, Close, Icon,
} from '../icon';
import { useResizeObserver } from '../../helpers/useResizeObserver';
import { DrawerProvider } from './DrawerContext';
import { DrawerBottomPanelProvider, useDrawerBottomPanel } from './DrawerBottomPanelContext';
import { DrawerPageProvider } from './DrawerPageContext';

export const DrawerSizePresets = ['content', 'default', 'full', 'fullWithMargin', 'fullOnMobile'] as const;

/**
 * Inner component that renders drawer content and accesses bottom panel context.
 * Must be rendered within DrawerBottomPanelProvider.
 * @internal
 */
type DrawerContentProps<T extends string[] | readonly string[] = string[]> = {
    isPaginated: boolean;
    pagination?: PaginationState<T>;
    loadedPage: string | null;
    setLoadedPage: (page: string | null) => void;
    children: ReactNode;
    currentPageConfig?: {
        title?: ReactNode;
        bottomPanel?: ReactNode;
        additionalActions?: ReactNode;
    };
    bottomPanel?: ReactNode;
    resolvedTitle: ReactNode;
    resolvedAdditionalActions?: ReactNode;
    hasResolvedAdditionalActions: boolean;
    hideTitle: boolean;
    hideCloseButton: boolean;
    onClose: (open: false) => void;
    overrides?: DrawerProps<T>['overrides'];
};

const DrawerContent = <T extends string[] | readonly string[] = string[]>({
    isPaginated,
    pagination,
    loadedPage,
    setLoadedPage,
    children,
    currentPageConfig,
    bottomPanel,
    resolvedTitle,
    resolvedAdditionalActions,
    hasResolvedAdditionalActions,
    hideTitle,
    hideCloseButton,
    onClose,
    overrides,
}: DrawerContentProps<T>) => {
    const { portalContent } = useDrawerBottomPanel();

    // Resolve bottom panel content with priority:
    // 1. Portal content (highest priority)
    // 2. pageConfig bottom panel
    // 3. bottomPanel prop (fallback)
    const resolvedBottomPanel = useMemo(() => {
        if (portalContent) {
            // Portal content exists - handle based on mode
            const baseContent = currentPageConfig?.bottomPanel ?? bottomPanel;

            if (portalContent.mode === 'replace' || !baseContent) {
                return portalContent.content;
            }
            if (portalContent.mode === 'prepend') {
                return (
                    <>
                        {portalContent.content}
                        {baseContent}
                    </>
                );
            }
            if (portalContent.mode === 'append') {
                return (
                    <>
                        {baseContent}
                        {portalContent.content}
                    </>
                );
            }
        }

        // No portal content - use pageConfig or prop
        return currentPageConfig?.bottomPanel ?? bottomPanel;
    }, [portalContent, currentPageConfig, bottomPanel]);

    return (
        <>
            {/* Dialog title bar */}
            <div className={clsx(styles.titleBar, overrides?.titleBar?.className)}>
                <div
                    className={clsx(styles.titleArea, overrides?.titleArea?.className)}
                >
                    <RemoveFromDOM
                        // Hide when pagination is not enabled.
                        when={!isPaginated}
                    >
                        <div className={clsx(styles.paginationButtons)}>
                            <Button
                                className={clsx(
                                    styles.navButton,
                                )}
                                size="medium"
                                kind="tertiary"
                                shape="circle"
                                onClick={() => pagination?.back()}
                                disabled={!pagination?.canGoBack()}
                                startEnhancer={(
                                    <Icon icon={ChevronLeft} size={16} />
                                )}
                            >
                                Go to previous page in this modal
                            </Button>
                            <Button
                                className={clsx(
                                    styles.navButton,
                                )}
                                size="medium"
                                kind="tertiary"
                                shape="circle"
                                onClick={() => pagination?.forward()}
                                disabled={!pagination?.canGoForward()}
                                startEnhancer={(
                                    <Icon icon={ChevronRight} size={16} />
                                )}
                            >
                                Go to next page in this modal
                            </Button>
                        </div>
                    </RemoveFromDOM>
                    <VisuallyHidden
                        // Hide when requested, or when pagination is enabled (the title isn't relevant to any specific page).
                        when={hideTitle}
                    >
                        <DialogTitle as="h2" className={styles.titleTextContainer}>
                            <TextWhenString kind="paragraphSmall" weight="medium">
                                {resolvedTitle}
                            </TextWhenString>
                        </DialogTitle>
                    </VisuallyHidden>
                </div>
                <div className={clsx(styles.titleBarButtons, overrides?.titleBarButtons?.className)}>
                    {/* Action Menu */}
                    <RemoveFromDOM when={!hasResolvedAdditionalActions}>
                        {resolvedAdditionalActions}
                    </RemoveFromDOM>

                    {/* Close button */}
                    <RemoveFromDOM
                        // Hide when requested, or when pagination is enabled (the page navigation bar will render its own close button).
                        when={hideCloseButton}
                    >
                        <Button
                            kind="tertiary"
                            shape="circle"
                            onClick={() => onClose(false)}
                            startEnhancer={(
                                <Icon icon={Close} size={20} />
                            )}
                            data-title-hidden={hideTitle}
                            className={clsx(
                                styles.closeButton,
                            )}
                        >
                            Close dialog
                        </Button>
                    </RemoveFromDOM>
                </div>
            </div>

            <div className={clsx(styles.content, overrides?.content?.className)}>
                <div className={clsx(styles.contentChildren, overrides?.contentChildren?.className)}>
                    {(isPaginated && Array.isArray(children)) ? children.map((child) => {
                        if (!(child && typeof child === 'object' && 'key' in child)) {
                            return null;
                        }
                        const isActive = child.key === pagination?.currentPage && loadedPage === child.key;
                        return (
                            <Transition
                                show={isActive}
                                key={`transition_${child.key}`}
                                as="div"
                                unmount={false}
                                enter={styles.paginationEnter}
                                enterFrom={styles.enterFromOpacity}
                                enterTo={styles.enterToOpacity}
                                leave={styles.paginationLeave}
                                leaveFrom={styles.leaveFromOpacity}
                                leaveTo={styles.leaveToOpacity}
                                afterLeave={() => {
                                    setLoadedPage(pagination?.currentPage || null);
                                }}
                                className={clsx(overrides?.contentChildrenChildren?.className)}
                                style={{ display: isActive ? undefined : 'none' }}
                            >
                                <DrawerPageProvider isActive={isActive}>
                                    {child}
                                </DrawerPageProvider>
                            </Transition>
                        );
                    }) : children}
                </div>
                {resolvedBottomPanel && (
                    <>
                        <div tabIndex={-1} aria-hidden="true" className={clsx(styles.bottomPanelSpacer, overrides?.bottomPanelSpacer?.className)}>
                            {resolvedBottomPanel}
                        </div>
                        <div className={clsx(styles.bottomPanel, overrides?.bottomPanel?.className)}>
                            <div className={styles.glassOpacity} />
                            <div className={styles.glassBlend} />
                            <div className={clsx(styles.bottomPanelContent, overrides?.bottomPanelContent?.className)}>
                                {resolvedBottomPanel}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
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
     * When pagination is enabled, the title is always hidden regardless of this prop.
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
     * An optional panel that will be rendered at the bottom of the Drawer. This is useful for adding a footer to the Drawer with actions.
     */
    bottomPanel?: ReactNode;

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
    size?: typeof DrawerSizePresets[number] | CSSLength;
    /**
     * An optional pagination state. If provided, each child of the Drawer will be rendered in its own page, and the Drawer will contain back and next buttons that will be used to navigate between pages.
     *
     * The state should be created using the {@link usePagination} hook and the entire state should be passed to the Drawer. For example:
     * ```tsx
     * const pagination = usePagination<['step1', 'step2', 'step3']>();
     * // ...
     * <Drawer pagination={pagination}>
     *     <div key="step1">Step 1</div>
     *     <div key="step2">Step 2</div>
     *     <div key="step3">Step 3</div>
     * </Drawer>
     *```
     *
     * @see {@link PaginationState} for more information on the pagination state and available methods
     * @see {@link usePagination} for more information on how to create the pagination state
     * @default false
     */
    pagination?: PaginationState<T>;
    /**
     * Per-page configuration for title, bottomPanel, and additionalActions.
     * Only available when pagination is provided.
     *
     * Keys must match the pages in pagination state.
     * Falls back to root-level props if not specified.
     *
     * @example
     * ```tsx
     * <Drawer
     *   pagination={pagination}
     *   pageConfig={{
     *     step1: {
     *       title: 'Payment Details',
     *       bottomPanel: <Button>Next</Button>,
     *     },
     *     step2: {
     *       title: 'Review',
     *       bottomPanel: <Button>Submit</Button>,
     *     },
     *   }}
     * >
     *   <div key="step1">...</div>
     *   <div key="step2">...</div>
     * </Drawer>
     * ```
     */
    pageConfig?: Partial<Record<T[number], {
        title?: ReactNode;
        bottomPanel?: ReactNode;
        additionalActions?: ReactNode;
    }>>;
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
        contentChildrenChildren: ComponentPropsWithoutRef<'div'>;
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
export const Drawer = <T extends string[] | readonly string[] = string[]>({
    isOpen = false,
    onClose = () => {},
    title,
    hideTitle = false,
    hideCloseButton = false,
    bottomPanel,
    from = 'right',
    size = 'default',
    pagination,
    pageConfig,
    overlayStyle = 'grey',
    additionalActions,
    children,
    overrides,
}: DrawerProps<T>) => {
    // Check if the drawer is on the x-axis.
    const xAxisDrawer = useMemo(() => ['left', 'right'].includes(from), [from]);

    // Check if the size is a preset.
    const sizeIsPreset = useMemo(() => (DrawerSizePresets as readonly string[]).includes(size), [size]);

    // Check if pagination is enabled.
    const isPaginated = useMemo(() => Boolean(pagination), [pagination]);

    const hasAdditionalActions = useMemo(() => Boolean(additionalActions), [additionalActions]);

    const [loadedPage, setLoadedPage] = useState<string | null>(pagination?.history[0] || null);

    // Update loadedPage when pagination changes
    useEffect(() => {
        if (pagination?.currentPage) {
            setLoadedPage(pagination.currentPage);
        }
    }, [pagination?.currentPage]);

    // Get current page configuration
    const currentPageConfig = useMemo(() => {
        if (pagination && pageConfig) {
            return pageConfig[pagination.currentPage];
        }
        return undefined;
    }, [pagination, pageConfig]);

    // Resolve title based on pageConfig or fallback to prop
    const resolvedTitle = useMemo(
        () => currentPageConfig?.title ?? title,
        [currentPageConfig, title],
    );

    // Resolve additionalActions based on pageConfig or fallback to prop
    const resolvedAdditionalActions = useMemo(
        () => currentPageConfig?.additionalActions ?? additionalActions,
        [currentPageConfig, additionalActions],
    );

    const hasResolvedAdditionalActions = useMemo(
        () => Boolean(resolvedAdditionalActions),
        [resolvedAdditionalActions],
    );

    // Create drawer context value
    const drawerContextValue = useMemo(() => ({
        isOpen,
        close: () => onClose(false),
    }), [isOpen, onClose]);

    // const bottomPanelRef = useRef<HTMLDivElement>(null);
    // const { width = 0, height = 0 } = useResizeObserver({
    //     ref: bottomPanelRef,
    //     box: 'border-box',
    // });
    //
    // useEffect(() => {
    //     console.log(bottomPanelRef.current);
    // }, [bottomPanelRef.current]);

    // Wrap content with providers
    const wrappedContent = (content: ReactNode) => {
        let wrapped = content;

        // Wrap with bottom panel provider (always, even without pagination)
        wrapped = (
            <DrawerBottomPanelProvider>
                {wrapped}
            </DrawerBottomPanelProvider>
        );

        // Wrap with pagination provider if pagination is enabled
        if (pagination) {
            wrapped = (
                <PaginationProvider value={pagination}>
                    {wrapped}
                </PaginationProvider>
            );
        }

        // Wrap with drawer provider (always)
        wrapped = (
            <DrawerProvider value={drawerContextValue}>
                {wrapped}
            </DrawerProvider>
        );

        return wrapped;
    };

    return (
        <Transition show={isOpen}>
            <Dialog
                as="div"
                className={clsx(
                    styles.root,
                    overrides?.dialog?.className,
                )}
                onClose={onClose}
                {...overrides?.dialog}
                role="dialog"
            >
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
                    style={!sizeIsPreset ? {
                        [xAxisDrawer ? 'width' : 'height']: size,
                        ...overrides?.panelContainer?.style,
                    } : overrides?.panelContainer?.style}
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
                        <DialogPanel
                            className={clsx(
                                styles.panel,
                                styles[`from-${from}`],
                                overrides?.panel?.className,
                            )}
                        >
                            {wrappedContent(
                                <DrawerContent
                                    isPaginated={isPaginated}
                                    pagination={pagination}
                                    loadedPage={loadedPage}
                                    setLoadedPage={setLoadedPage}
                                    currentPageConfig={currentPageConfig}
                                    bottomPanel={bottomPanel}
                                    resolvedTitle={resolvedTitle}
                                    resolvedAdditionalActions={resolvedAdditionalActions}
                                    hasResolvedAdditionalActions={hasResolvedAdditionalActions}
                                    hideTitle={hideTitle}
                                    hideCloseButton={hideCloseButton}
                                    onClose={onClose}
                                    overrides={overrides}
                                >
                                    {children}
                                </DrawerContent>,
                            )}
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
