'use client';

import { DialogPanel, DialogTitle, Dialog as HDialog, Transition, TransitionChild } from '@headlessui/react';
import type { CSSLength } from '@ssh/csstypes';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, FC, MouseEventHandler, PropsWithChildren, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
    type OverlayCloseDetails,
    type OverlayCloseReason,
    useOverlayCloseLifecycle,
} from '../../helpers/useOverlayCloseLifecycle';
import { Button } from '../button';
import { Close, Icon } from '../icon';
import { Text } from '../text';
import { RemoveFromDOM } from '../utility/RemoveFromDOM';
import { TextWhenString } from '../utility/TextWhenString';
import { VisuallyHidden } from '../utility/VisuallyHidden';
import styles from './Dialog.module.scss';

export const DialogWidthPresets = ['compact', 'default', 'large', 'full'] as const;

export { OverlayCloseReasons as DialogCloseReasons } from '../../helpers/useOverlayCloseLifecycle';

/** Why a dialog close was requested. @see OverlayCloseReason */
export type DialogCloseReason = OverlayCloseReason;

export type DialogCloseDetails = OverlayCloseDetails;

/** Exit animation: `normal` (200ms) plus the panel's `fast` (100ms) delay, per Dialog.module.scss. */
const EXIT_ANIMATION_MS = 300;

export type DialogProps = {
    /**
     * The dialog's open state.
     */
    isOpen?: boolean;
    /**
     * A callback that will be called when the dialog requests to close, with the reason for the request.
     *
     * The Dialog is fully controlled — it stays open until `isOpen` becomes `false` — so a consumer blocks
     * a close simply by not acting on the request. Prefer answering a blocked request with visible UI (a
     * "discard changes?" confirmation) rather than letting Escape silently do nothing.
     *
     * @param value {boolean} - The new open state of the dialog.
     * @param details {DialogCloseDetails} - Why the close was requested.
     */
    onClose?: (value: boolean, details: DialogCloseDetails) => void | Promise<void>;
    /**
     * Teardown callback, stamped with the reason the dialog closed. Use it to reset forms and clear state
     * without visual glitches, and branch on `details.reason` to keep state across incidental dismissals.
     *
     * Runs exactly once per completed close. It fires after the exit animation where possible, and is
     * otherwise flushed when the dialog reopens, when it unmounts, or by a duration-based fallback — an
     * interrupted or skipped exit animation delays teardown, it never silently drops it.
     */
    onAfterClose?: (details: DialogCloseDetails) => void;
    /**
     * The title of the dialog. Required for accessibility, but can be hidden with the `hideTitle` prop.
     *
     * If a string is passed, it will be wrapped in a {@link Text} component with `headingXSmall` styling.
     */
    title: ReactNode;
    /**
     * Whether the title should be hidden. If `true`, the title will be visually hidden but still accessible to screen readers.
     *
     * If you're hiding the title to add a custom header, you can also hide the close button and render your own by using the `hideCloseButton` prop.
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
     * The width of the dialog. Either a preset or a valid {@link CSSLength} string.
     *
     * @see DialogWidthPresets
     * @default 'default'
     */
    width?: (typeof DialogWidthPresets)[number] | CSSLength;
    /**
     * The height of the dialog.
     *
     * @default 'content'
     */
    height?: 'content' | 'full';
    /**
     * Whether the dialog can be moved with mouse dragging.
     *
     * @default true
     */
    draggable?: boolean;
    /**
     * The dialog's appearance styling. `simple` is a simple white dialog with a border. `glass` is a glassmorphic dialog with a blurred background.
     *
     * @default 'simple'
     */
    appearance?: 'simple' | 'glass';
    /**
     * The overlay style for the dialog. `grey` is a simple grey overlay. `blur` is a blurred overlay.
     *
     * @default 'blur'
     */
    overlayStyle?: 'grey' | 'blur';
    /**
     * Optional overrides for props of each dialog component.
     *
     * Valid keys are: `root`, `overlayContainer`, `overlay`, `panelContainer`, `panel`, `panelHeader`, `panelTitle`, `panelCloseButton`.
     */
    overrides?: {
        /** The root element containing all elements */
        root?: ComponentPropsWithoutRef<'div'>;
        /** The container for the backdrop overlay */
        overlayContainer?: ComponentPropsWithoutRef<'div'>;
        /** The backdrop overlay */
        overlay?: ComponentPropsWithoutRef<'div'>;
        /** The container for the dialog panel */
        panelContainer?: ComponentPropsWithoutRef<'div'>;
        /** The dialog panel */
        panel?: ComponentPropsWithoutRef<'div'>;
        /** The header of the dialog panel, which contains the title and close button */
        panelHeader?: ComponentPropsWithoutRef<'div'>;
        /** The title within the dialog panel */
        panelTitle?: ComponentPropsWithoutRef<'h1'>;
        /** The close button within the dialog panel */
        panelCloseButton?: ComponentPropsWithoutRef<'button'>;
    };
};

/**
 * Dialogs are modal components that appear on top of the main content and require user interaction to dismiss.
 *
 * They render to a Portal, so they can be used anywhere in the DOM.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Dialog } from 'paris/dialog';
 * ```
 * @constructor
 */
export const Dialog: FC<PropsWithChildren<DialogProps>> = ({
    isOpen = false,
    onClose = () => {},
    onAfterClose,
    title,
    hideTitle = false,
    hideCloseButton = false,
    overrides = {},
    width = 'default',
    height = 'content',
    draggable = false,
    appearance = 'simple',
    overlayStyle = 'blur',
    children,
}) => {
    const { handleDismiss, requestClose, handleAfterLeave } = useOverlayCloseLifecycle({
        isOpen,
        panelClassName: styles.panel,
        exitAnimationMS: EXIT_ANIMATION_MS,
        onClose,
        onAfterClose,
    });

    const widthIsPreset = useMemo(() => (DialogWidthPresets as readonly string[]).includes(width), [width]);

    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        if (draggable) {
            setDragging(true);
            setStartPosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        if (draggable) {
            setDragging(false);
        }
    };

    const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
        if (dragging && draggable) {
            setPosition({
                top: position.top + (e.clientY - startPosition.y),
                left: position.left + (e.clientX - startPosition.x),
            });
            setStartPosition({ x: e.clientX, y: e.clientY });
        }
    };

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDragging(false);
            setPosition({ top: 0, left: 0 });
            setStartPosition({ x: 0, y: 0 });
        }
    }, [isOpen]);

    return (
        <Transition appear show={isOpen} afterLeave={handleAfterLeave}>
            <HDialog
                as="div"
                onClose={handleDismiss}
                {...overrides.root}
                className={clsx(styles.root, overrides.root?.className)}
                role="dialog"
            >
                <div
                    {...overrides.overlayContainer}
                    className={clsx(
                        overlayStyle === 'blur' && styles.overlayBlurContainer,
                        overlayStyle === 'grey' && styles.overlayGreyContainer,
                        overrides.overlayContainer?.className,
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
                            {...overrides.overlay}
                            className={clsx(
                                styles.overlay,
                                overlayStyle === 'blur' && styles.overlayBlur,
                                overlayStyle === 'grey' && styles.overlayGrey,
                                overrides.overlay?.className,
                            )}
                        />
                    </TransitionChild>
                </div>

                <div
                    {...overrides.panelContainer}
                    className={clsx(styles.panelContainer, overrides.panelContainer?.className)}
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
                            {...overrides.panel}
                            className={clsx(
                                styles.panel,
                                styles[appearance],
                                { [styles[`w-${width}`]]: widthIsPreset },
                                styles[`h-${height}`],
                                overrides.panel?.className,
                            )}
                            style={{
                                top: `${position.top}px`,
                                left: `${position.left}px`,
                                ...(!widthIsPreset ? { maxWidth: width } : {}),
                                ...overrides.panel?.style,
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            <VisuallyHidden when={hideTitle && hideCloseButton}>
                                <div
                                    {...overrides.panelHeader}
                                    className={clsx(styles.header, overrides.panelHeader?.className)}
                                    style={
                                        (hideTitle && !hideCloseButton) || (!hideTitle && hideCloseButton)
                                            ? {
                                                  marginBottom: '-16px',
                                              }
                                            : {}
                                    }
                                >
                                    <VisuallyHidden when={hideTitle}>
                                        <DialogTitle
                                            {...overrides.panelTitle}
                                            as="h1"
                                            className={clsx(styles.title, overrides.panelTitle?.className)}
                                        >
                                            <TextWhenString kind="headingXSmall">{title}</TextWhenString>
                                        </DialogTitle>
                                    </VisuallyHidden>
                                    <RemoveFromDOM when={hideCloseButton}>
                                        <div className={clsx(styles.closeButton)}>
                                            <Button
                                                kind="tertiary"
                                                shape="circle"
                                                onClick={() => requestClose('close-press')}
                                                startEnhancer={<Icon size={20} icon={Close} />}
                                                {...overrides.panelCloseButton}
                                                data-title-hidden={hideTitle}
                                                className={clsx(overrides.panelCloseButton?.className)}
                                            >
                                                Close dialog
                                            </Button>
                                        </div>
                                    </RemoveFromDOM>
                                </div>
                            </VisuallyHidden>
                            {children}
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </HDialog>
        </Transition>
    );
};
