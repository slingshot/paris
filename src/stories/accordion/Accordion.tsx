'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { useState } from 'react';
import { renderEnhancer } from '../../helpers/renderEnhancer';
import type { Enhancer } from '../../types/Enhancer';
import { ChevronRight, Icon } from '../icon';
import { TextWhenString } from '../utility';
import styles from './Accordion.module.scss';

export type AccordionProps = {
    /** The title of the Accordion. */
    title?: ReactNode;
    /**
     * The style of the Accordion.
     * @default default
     */
    kind?: 'default' | 'card';
    /**
     * The size of the Accordion. Only affects kind="card".
     * @default small
     */
    size?: 'small' | 'large';
    /**
     * Overrides the toggle icon. Accepts any icon (an `Icon` element or a render
     * function `({ size }) => ReactNode`). When set, it replaces the default
     * plus/chevron and rotates on open/close like the built-in chevron.
     */
    icon?: Enhancer;
    /** Whether the Accordion is open. If provided, the Accordion will be a controlled component. */
    isOpen?: boolean;
    /** A handler for when the Accordion state changes. */
    onOpenChange?: (open: boolean) => void | Promise<void>;
    /** The collapsible contents of the Accordion. */
    children?: ReactNode;
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        titleContainer?: ComponentPropsWithoutRef<'div'>;
        dropdownContainer?: ComponentPropsWithoutRef<'div'>;
        dropdownContent?: ComponentPropsWithoutRef<'div'>;
    };
};

/**
 * A Accordion component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Accordion } from 'paris/accordion';
 * ```
 * @constructor
 */
export const Accordion: FC<AccordionProps> = ({
    title,
    kind = 'default',
    size = 'small',
    icon,
    isOpen,
    onOpenChange,
    children,
    overrides,
}) => {
    const [openState, setOpenState] = useState(isOpen ?? false);

    // Determine if component is controlled or uncontrolled
    const isControlled = isOpen !== undefined;
    const open = isControlled ? isOpen : openState;

    // Unified toggle handler that works for both controlled and uncontrolled modes
    const handleToggle = () => {
        const newOpen = !open;

        // Update internal state only if uncontrolled
        if (!isControlled) {
            setOpenState(newOpen);
        }

        // Always call the callback if provided
        onOpenChange?.(newOpen);
    };

    return (
        <div
            {...overrides?.container}
            className={clsx(styles[kind], open && styles.open, overrides?.container?.className)}
        >
            <div
                onClick={handleToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle();
                    }
                }}
                role="button"
                tabIndex={0}
                {...overrides?.titleContainer}
                data-state={open ? 'open' : 'closed'}
                className={clsx(overrides?.titleContainer?.className, styles.title, styles[size], open && styles.open)}
            >
                <TextWhenString kind="paragraphSmall" weight="medium">
                    {title}
                </TextWhenString>
                {icon ? (
                    <span className={clsx(styles.toggleIcon, open && styles.open)}>{renderEnhancer(icon, 16)}</span>
                ) : kind === 'default' ? (
                    <div className={styles.plusIcon}>
                        <FontAwesomeIcon icon={faPlus} className={clsx(open && styles.open)} />
                    </div>
                ) : (
                    <Icon icon={ChevronRight} size={16} className={clsx(styles.chevron, open && styles.open)} />
                )}
            </div>
            {/*
             * Collapse uses the CSS grid-rows trick (`1fr` → `0fr`) instead of
             * animating `height: auto` via JS. JS height-auto animations flash an
             * intermediate layout state on open/close that causes scrollable
             * ancestors to clamp `scrollTop` to 0 in the first paint frame — a
             * visible scroll-snap before the animation starts.
             */}
            <div
                aria-hidden={!open}
                {...overrides?.dropdownContainer}
                className={clsx(styles.dropdown, open && styles.open, overrides?.dropdownContainer?.className)}
            >
                {/*
                 * dropdownClip is the grid item. It owns `min-height: 0` and
                 * `overflow: hidden` so the parent's `grid-template-rows: 0fr`
                 * can fully collapse to 0 height. Padding/background-color
                 * stay on .dropdownContent (one level deeper) so they don't
                 * extend the grid item's box when closed.
                 */}
                <div className={styles.dropdownClip}>
                    <div
                        {...overrides?.dropdownContent}
                        className={clsx(styles.dropdownContent, styles[size], overrides?.dropdownContent?.className)}
                    >
                        <TextWhenString kind="paragraphXSmall">{children}</TextWhenString>
                    </div>
                </div>
            </div>
        </div>
    );
};
