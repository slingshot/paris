'use client';

import type { ReactNode } from 'react';
import {
    useEffect,
    useRef, Fragment, useMemo, useState,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import type { CSSLength } from '@ssh/csstypes';
import styles from './Drawer.module.scss';
import { Text } from '../text';
import { VisuallyHidden } from '../utility/VisuallyHidden';
import { TextWhenString } from '../utility/TextWhenString';
import { Button } from '../button';
import { RemoveFromDOM } from '../utility/RemoveFromDOM';
import type { PaginationState } from '../pagination';
import {
    ChevronLeft, ChevronRight, Close, Icon,
} from '../icon';
import { useResizeObserver } from '../../helpers/useResizeObserver';

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
     * ```tsx```
     * ```const pagination = usePagination<['step1', 'step2', 'step3']>();```
     * ```// ...```
     * ```<Drawer pagination={pagination}>```
     *     ```<div key="step1">Step 1</div>```
     *     ```<div key="step2">Step 2</div>```
     *     ```<div key="step3">Step 3</div>```
     * ```</Drawer>```
     *
     *
     * @see {@link PaginationState} for more information on the pagination state and available methods
     * @see {@link usePagination} for more information on how to create the pagination state
     * @default false
     */
    pagination?: PaginationState<T>;
    /**
     * The overlay style of the Drawer, either 'greyed' or 'blur'.
     *
     * @default 'blur'
     */
    overlayStyle?: 'greyed' | 'blur';
    /** The contents of the Drawer. */
    children?: ReactNode | ReactNode[];
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
    overlayStyle = 'greyed',
    additionalActions,
    children,
}: DrawerProps<T>) => {
    // Check if the drawer is on the x-axis.
    const xAxisDrawer = useMemo(() => ['left', 'right'].includes(from), [from]);

    // Check if the size is a preset.
    const sizeIsPreset = useMemo(() => (DrawerSizePresets as readonly string[]).includes(size), [size]);

    // Check if pagination is enabled.
    const isPaginated = useMemo(() => Boolean(pagination), [pagination]);

    const hasAdditionalActions = useMemo(() => Boolean(additionalActions), [additionalActions]);

    const [loadedPage, setLoadedPage] = useState<string | null>(pagination?.history[0] || null);

    // const bottomPanelRef = useRef<HTMLDivElement>(null);
    // const { width = 0, height = 0 } = useResizeObserver({
    //     ref: bottomPanelRef,
    //     box: 'border-box',
    // });
    //
    // useEffect(() => {
    //     console.log(bottomPanelRef.current);
    // }, [bottomPanelRef.current]);

    // Decide what children to render.
    const currentChild: ReactNode = useMemo(() => {
        // If no children are provided, render nothing.
        if (!children) {
            return (<></>);
        }

        // If pagination is enabled, and multiple children are provided, render the currently active child by matching its key against `pagination.currentPage`.
        if (pagination && Array.isArray(children) && children.length > 0) {
            const found = children.find((child) => {
                if (!(child && typeof child === 'object' && 'key' in child)) {
                    console.warn('Drawer: Pagination is enabled, but the following child is missing a `key` prop. Pagination will likely not work as expected and this child will never be rendered.', child);
                    return false;
                }
                return child.key === pagination.currentPage;
            });
            if (found) {
                return found;
            }
        }

        // As a fallback, render all children.
        return children;
    }, [children, pagination]);

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className={clsx(
                    styles.root,
                )}
                onClose={onClose}
            >
                <div
                    className={clsx(
                        overlayStyle === 'blur' && styles.overlayBlurContainer,
                        overlayStyle === 'greyed' && styles.overlayGreyedContainer,
                    )}
                >
                    <Transition.Child
                        as={Fragment}
                        enter={styles.enter}
                        enterFrom={styles.enterFrom}
                        enterTo={styles.enterTo}
                        leave={styles.leave}
                        leaveFrom={styles.leaveFrom}
                        leaveTo={styles.leaveTo}
                    >
                        <Dialog.Overlay
                            className={clsx(
                                styles.overlay,
                                overlayStyle === 'blur' && styles.overlayBlur,
                                overlayStyle === 'greyed' && styles.overlayGreyed,
                            )}
                        />
                    </Transition.Child>
                </div>

                <div
                    className={clsx(
                        styles.panelContainer,
                        styles[`from-${from}`],
                        { [styles[`size-${size}`]]: sizeIsPreset },
                    )}
                    style={!sizeIsPreset ? {
                        [xAxisDrawer ? 'width' : 'height']: size,
                    } : {}}
                >
                    <Transition.Child
                        as={Fragment}
                        enter={styles.enter}
                        enterFrom={styles.enterFrom}
                        enterTo={styles.enterTo}
                        leave={styles.leave}
                        leaveFrom={styles.leaveFrom}
                        leaveTo={styles.leaveTo}
                    >
                        <Dialog.Panel
                            className={clsx(
                                styles.panel,
                                styles[`from-${from}`],
                            )}
                        >
                            {/* Dialog title bar */}
                            <div className={styles.titleBar}>
                                <div
                                    className={clsx(
                                        styles.titleArea,
                                    )}
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
                                        <Dialog.Title as="h2" className={styles.titleTextContainer}>
                                            <TextWhenString kind="paragraphSmall" weight="medium">
                                                {title}
                                            </TextWhenString>
                                        </Dialog.Title>
                                    </VisuallyHidden>
                                </div>
                                <div className={styles.titleBarButtons}>
                                    {/* Action Menu */}
                                    <RemoveFromDOM when={!hasAdditionalActions}>
                                        {additionalActions}
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

                            <div className={styles.content}>
                                <div className={styles.contentChildren}>
                                    {(isPaginated && Array.isArray(children)) ? children.map((child) => (child && typeof child === 'object' && 'key' in child) && (
                                        <Transition
                                            show={child.key === pagination?.currentPage && loadedPage === child.key}
                                            key={`transition_${child.key}`}
                                            as="div"
                                            enter={styles.paginationEnter}
                                            enterFrom={styles.enterFromOpacity}
                                            enterTo={styles.enterToOpacity}
                                            leave={styles.paginationLeave}
                                            leaveFrom={styles.leaveFromOpacity}
                                            leaveTo={styles.leaveToOpacity}
                                            afterLeave={() => {
                                                setLoadedPage(pagination?.currentPage || null);
                                            }}
                                        >
                                            {child}
                                        </Transition>
                                    )) : children}
                                </div>
                                {bottomPanel && (
                                    <>
                                        <div tabIndex={-1} aria-hidden="true" className={styles.bottomPanelSpacer}>
                                            {bottomPanel}
                                        </div>
                                        <div className={styles.bottomPanel}>
                                            <div className={styles.glassOpacity} />
                                            <div className={styles.glassBlend} />
                                            <div className={styles.bottomPanelContent}>
                                                {bottomPanel}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
