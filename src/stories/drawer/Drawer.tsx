'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import type { CSSLength } from '@ssh/csstypes';
import { clsx } from 'clsx';
import {
    Children,
    type ComponentPropsWithoutRef,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
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
import { isDrawerPageElement } from './DrawerPage';
import { DrawerPageProvider } from './DrawerPageContext';
import { DrawerPaginationProvider } from './DrawerPaginationContext';
import { DrawerSlotProvider, useDrawerSlotContext } from './DrawerSlotContext';

export const DrawerSizePresets = ['content', 'default', 'full', 'fullWithMargin', 'fullOnMobile'] as const;

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
     * Whether the bottom panel should have default padding. Set to `false` for edge-to-edge content like dividers or multi-section layouts.
     *
     * @default true
     */
    bottomPanelPadding?: boolean;

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
    bottomPanel,
    bottomPanelPadding = true,
    from = 'right',
    size = 'default',
    pagination,
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

    const showBottomPanel = Boolean(bottomPanel) || (slotContext?.hasAnyBottomPanelSlot ?? false);
    const showBaseBottomPanel = Boolean(bottomPanel) && !slotContext?.hasBottomPanelReplace;

    const paginatedChildren = useMemo(() => {
        if (!isPaginated || !pagination || !children) {
            return null;
        }

        const childArray = Array.isArray(children) ? children : Children.toArray(children);

        return childArray.map((child) => {
            if (isDrawerPageElement(child)) {
                const pageID = child.props.id;
                const isActive = pagination.currentPage === pageID;
                return (
                    <DrawerPageProvider key={pageID} isActive={isActive} pageID={pageID}>
                        <Transition
                            show={isActive}
                            unmount={false}
                            as="div"
                            enter={styles.paginationEnter}
                            enterFrom={styles.enterFromOpacity}
                            enterTo={styles.enterToOpacity}
                            leave={styles.paginationLeave}
                            leaveFrom={styles.leaveFromOpacity}
                            leaveTo={styles.leaveToOpacity}
                            className={clsx(overrides?.contentChildrenChildren?.className)}
                        >
                            {child}
                        </Transition>
                    </DrawerPageProvider>
                );
            }

            // Legacy backward-compat: <div key="..."> children
            if (child && typeof child === 'object' && 'key' in child) {
                const pageID = child.key as string;
                const isActive = pagination.currentPage === pageID;
                return (
                    <DrawerPageProvider key={pageID} isActive={isActive} pageID={pageID}>
                        <Transition
                            show={isActive}
                            unmount={false}
                            as="div"
                            enter={styles.paginationEnter}
                            enterFrom={styles.enterFromOpacity}
                            enterTo={styles.enterToOpacity}
                            leave={styles.paginationLeave}
                            leaveFrom={styles.leaveFromOpacity}
                            leaveTo={styles.leaveToOpacity}
                            className={clsx(overrides?.contentChildrenChildren?.className)}
                        >
                            {child}
                        </Transition>
                    </DrawerPageProvider>
                );
            }

            return child;
        });
    }, [isPaginated, pagination, children, overrides?.contentChildrenChildren?.className]);

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
                                            Go to previous page in this modal
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
                                            Go to next page in this modal
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
                                        Close dialog
                                    </Button>
                                </RemoveFromDOM>
                            </div>
                        </div>

                        <div className={clsx(styles.content, overrides?.content?.className)}>
                            <div className={clsx(styles.contentChildren, overrides?.contentChildren?.className)}>
                                {isPaginated ? paginatedChildren : children}
                            </div>
                            {showBottomPanel && (
                                <>
                                    <div
                                        tabIndex={-1}
                                        aria-hidden="true"
                                        className={clsx(
                                            styles.bottomPanelSpacer,
                                            { [styles.noPadding]: !bottomPanelPadding },
                                            overrides?.bottomPanelSpacer?.className,
                                        )}
                                    >
                                        {showBaseBottomPanel && bottomPanel}
                                    </div>
                                    <div className={clsx(styles.bottomPanel, overrides?.bottomPanel?.className)}>
                                        <div className={styles.glassOpacity} />
                                        <div className={styles.glassBlend} />
                                        <div
                                            className={clsx(
                                                styles.bottomPanelContent,
                                                { [styles.noPadding]: !bottomPanelPadding },
                                                overrides?.bottomPanelContent?.className,
                                            )}
                                        >
                                            {slotContext && (
                                                <div
                                                    ref={slotContext.bottomPanelCallbackRef}
                                                    style={{ display: 'flex', flexDirection: 'column' }}
                                                />
                                            )}
                                            {showBaseBottomPanel && bottomPanel}
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
