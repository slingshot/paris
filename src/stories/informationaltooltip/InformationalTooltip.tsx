import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { HTMLMotionProps } from 'motion/react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './InformationalTooltip.module.scss';
import { TextWhenString } from '../utility';
import { Icon, Info } from '../icon';
import { pvar, pget } from '../theme';

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
     * Whether the tooltip should be open by default.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * By default, tooltip opens on hover and on click (for mobile support). If you want to disable the click event, set this to true.
     * @default false
     */
    disableClick?: boolean;
    /**
     * Optional overrides for props of each tooltip element.
     *
     * Valid keys are: `tooltip`, `heading`.
     */
    overrides?: {
        /** The main tooltip element  */
        tooltip?: HTMLMotionProps<'div'>,
        /** The heading element */
        heading?: ComponentPropsWithoutRef<'div'>,
    }
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
    children,
    side = 'bottom',
    sideOffset = 6,
    align = 'start',
    defaultOpen = false,
    disableClick = false,
    overrides,
}) => {
    const [isOpen, setOpen] = useState(defaultOpen);

    /**
     * Converts a CSS time value string to milliseconds
     * @param timeValue - The CSS time value (e.g. '100ms', '0.5s')
     * @returns The time value in milliseconds
     * @throws Error if the time value format is invalid
     */
    const parseCSSTime = (timeValue: string): number => {
        // Match the value and unit
        const match = timeValue.match(/^([\d.]+)(ms|s)$/);

        if (!match) {
            console.warn('Invalid CSS time format. Expected formats: "100ms", "0.5s"');
            return 0;
        }

        const [, value, unit] = match;
        const numValue = parseFloat(value);

        // Convert to milliseconds based on the unit
        return unit === 's' ? numValue * 1000 : numValue;
    };

    return (
        <RadixTooltip.Provider
            delayDuration={parseCSSTime(pget('new.animations.duration.normal'))}
        >
            <RadixTooltip.Root
                open={isOpen}
                onOpenChange={setOpen}
            >
                <RadixTooltip.Trigger
                    onClick={() => {
                        if (!disableClick) {
                            setOpen(!isOpen);
                        }
                    }}
                >
                    {!trigger ? (
                        <Icon icon={Info} size={14} className={styles.icon} style={{ color: pvar('new.colors.contentSecondary') }} />
                    ) : (
                        <>
                            {trigger}
                        </>
                    )}
                </RadixTooltip.Trigger>
                <AnimatePresence>
                    {isOpen && (
                        <RadixTooltip.Portal forceMount>
                            <RadixTooltip.Content
                                side={side}
                                sideOffset={sideOffset}
                                align={align}
                                asChild
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 3 }}
                                    transition={{ duration: parseCSSTime(pget('new.animations.duration.normal')) / 1000 }}
                                    {...overrides?.tooltip}
                                    className={clsx(styles.tooltip, styles[size], overrides?.tooltip?.className)}
                                >
                                    {heading && (
                                        <div
                                            {...overrides?.heading}
                                            className={clsx(styles.heading, overrides?.heading?.className)}
                                        >
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
                    )}
                </AnimatePresence>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};
