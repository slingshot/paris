import type { FC, ReactNode } from 'react';
import clsx from 'clsx';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import styles from './InformationalTooltip.module.scss';
import { TextWhenString } from '../utility';
import { Icon, Info } from '../icon';

export type InformationalTooltipProps = {
    /**
     * The size of the tooltip.
     *
     * @default 'large'
     */
    size?: 'medium' | 'large';
    /** The element that toggles the tooltip. If none provided, it will default to an info icon */
    trigger?: ReactNode;
    /** The heading text in the tooltip. If null, the heading will be hidden. */
    heading?: string | null;
    /** The heading icon in the tooltip. If undefined, will show info icon. If pass in an element, it will display in the heading. If set to null, will hide icon. */
    headingIcon?: ReactNode | null | undefined;
    /** The contents of the tooltip. */
    children?: ReactNode;
    /**
     * The side of the trigger that will render the tooltip, though is able to move to avoid collisions.
     *
     * @default 'bottom'
     */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /**
     * Distance in pixels from the trigger
     *
     * @default '6'
     */
    sideOffset?: number;
    /**
     * The alignment against the trigger, if there are no collisions
     *
     * @default 'start'
     */
    align?: 'start' | 'center' | 'end';
    /**
     * The tooltip's open state.
     */
    open?: boolean;
    /**
     * Event handler called when the open state of the tooltip changes.
     *
     * @param value {boolean} - The new open state of the tooltip.
     */
    onOpenChange?: (value: boolean) => void | Promise<void>;
};

/**
 * An InformationalTooltip component, based on [`radix-ui/react-tooltip`](https://www.radix-ui.com/primitives/docs/components/tooltip).
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { InformationalTooltip } from 'paris/informationaltooltip';
 * ```
 * @constructor
 */
export const InformationalTooltip: FC<InformationalTooltipProps> = ({
    size = 'large',
    trigger,
    heading,
    headingIcon,
    children,
    side = 'bottom',
    sideOffset = 6,
    align = 'start',
    open,
    onOpenChange,
}) => (
    <RadixTooltip.Provider
        delayDuration={150}
    >
        <RadixTooltip.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <RadixTooltip.Trigger>
                {!trigger ? (
                    <Icon icon={Info} size={14} className={styles.icon} />
                ) : (
                    <>
                        {trigger}
                    </>
                )}
            </RadixTooltip.Trigger>
            <RadixTooltip.Portal>
                <RadixTooltip.Content
                    side={side}
                    sideOffset={sideOffset}
                    align={align}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={clsx(styles.tooltip, styles[size])}
                    >
                        {heading && (
                            <div className={styles.heading}>
                                {headingIcon === null ? null : headingIcon || (
                                    <Icon icon={Info} size={14} className={styles.icon} />
                                )}
                                <TextWhenString as="p" kind="paragraphXSmall" weight="medium">
                                    {heading}
                                </TextWhenString>
                            </div>
                        )}
                        <TextWhenString as="p" kind="paragraphXSmall">
                            {children}
                        </TextWhenString>
                    </motion.div>
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    </RadixTooltip.Provider>
);
