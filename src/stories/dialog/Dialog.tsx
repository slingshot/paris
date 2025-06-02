'use client';

import type {
    ComponentPropsWithoutRef, FC, MouseEventHandler, PropsWithChildren, ReactNode,
} from 'react';
import { useEffect, useState } from 'react';
import {
    Dialog as HDialog, DialogPanel, DialogTitle, Transition, TransitionChild,
} from '@headlessui/react';
import clsx from 'clsx';
import styles from './Dialog.module.scss';
import { Text } from '../text';
import { Button } from '../button';
import { TextWhenString } from '../utility/TextWhenString';
import { VisuallyHidden } from '../utility/VisuallyHidden';
import { RemoveFromDOM } from '../utility/RemoveFromDOM';
import { Close, Icon } from '../icon';

export type DialogProps = {
    /**
     * The dialog's open state.
     */
    isOpen?: boolean;
    /**
     * A callback that will be called when the user closes the dialog by clicking the close button or the backdrop overlay.
     * @param value {boolean} - The new open state of the dialog.
     */
    onClose?: (value: boolean) => void | Promise<void>;
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
     * The width of the dialog.
     *
     * @default 'default'
     */
    width?: 'compact' | 'default' | 'large' | 'full';
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
        root?: ComponentPropsWithoutRef<'div'>,
        /** The container for the backdrop overlay */
        overlayContainer?: ComponentPropsWithoutRef<'div'>,
        /** The backdrop overlay */
        overlay?: ComponentPropsWithoutRef<'div'>,
        /** The container for the dialog panel */
        panelContainer?: ComponentPropsWithoutRef<'div'>,
        /** The dialog panel */
        panel?: ComponentPropsWithoutRef<'div'>,
        /** The header of the dialog panel, which contains the title and close button */
        panelHeader?: ComponentPropsWithoutRef<'div'>,
        /** The title within the dialog panel */
        panelTitle?: ComponentPropsWithoutRef<'h1'>,
        /** The close button within the dialog panel */
        panelCloseButton?: ComponentPropsWithoutRef<'button'>,
    }
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
            setDragging(false);
            setPosition({ top: 0, left: 0 });
            setStartPosition({ x: 0, y: 0 });
        }
    }, [isOpen]);

    return (
        <Transition
            appear
            show={isOpen}
        >
            <HDialog
                as="div"
                onClose={onClose}
                {...overrides.root}
                className={clsx(
                    styles.root,
                    overrides.root?.className,
                )}
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
                    className={clsx(
                        styles.panelContainer,
                        overrides.panelContainer?.className,
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
                        <DialogPanel
                            {...overrides.panel}
                            className={clsx(
                                styles.panel,
                                styles[appearance],
                                styles[`w-${width}`],
                                styles[`h-${height}`],
                                overrides.panel?.className,
                            )}
                            style={{ top: `${position.top}px`, left: `${position.left}px` }}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            <VisuallyHidden when={hideTitle && hideCloseButton}>
                                <div
                                    {...overrides.panelHeader}
                                    className={clsx(
                                        styles.header,
                                        overrides.panelHeader?.className,
                                    )}
                                    style={(hideTitle && !hideCloseButton) || (!hideTitle && hideCloseButton) ? {
                                        marginBottom: '-16px',
                                    } : {}}
                                >
                                    <VisuallyHidden when={hideTitle}>
                                        <DialogTitle
                                            {...overrides.panelTitle}
                                            as="h1"
                                            className={clsx(
                                                styles.title,
                                                overrides.panelTitle?.className,
                                            )}
                                        >
                                            <TextWhenString
                                                kind="headingXSmall"
                                            >
                                                {title}
                                            </TextWhenString>
                                        </DialogTitle>
                                    </VisuallyHidden>
                                    <RemoveFromDOM when={hideCloseButton}>
                                        <div className={clsx(styles.closeButton)}>
                                            <Button
                                                kind="tertiary"
                                                shape="circle"
                                                onClick={() => onClose(false)}
                                                startEnhancer={(
                                                    <Icon size={20} icon={Close} />
                                                )}
                                                {...overrides.panelCloseButton}
                                                data-title-hidden={hideTitle}
                                                className={clsx(
                                                    overrides.panelCloseButton?.className,
                                                )}
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
