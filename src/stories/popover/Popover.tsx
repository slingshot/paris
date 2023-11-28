'use client';

import type {
    ComponentPropsWithoutRef, FC, ReactElement, ReactNode,
} from 'react';
import { forwardRef, useState } from 'react';
import type { PopoverProps as RTPopoverProps } from 'react-tiny-popover';
import { Popover as RTPopover } from 'react-tiny-popover';
import clsx from 'clsx';
import styles from './Popover.module.scss';
import typography from '../text/Typography.module.css';

// TODO(URGENT): Figure out how to properly handle accessibility; the popover content should capture focus for tabbing and clicking, and `esc` should allow closing the popover. Might be better to use Radix popover instead of react-tiny-popover?

export type PopoverProps = {
    /** The trigger element for the Popover. */
    trigger: ReactElement;
    /** Optionally, manage state for the Popover yourself by passing `isOpen` and `setIsOpen` props. */
    isOpen?: boolean;
    /** Optionally, manage state for the Popover yourself by passing `isOpen` and `setIsOpen` props. */
    setIsOpen?: (isOpen: boolean) => void;
    /** The contents of the Popover. */
    children?: ReactNode;
} & Omit<RTPopoverProps, 'content' | 'children' | 'isOpen'>;

interface TriggerProps extends ComponentPropsWithoutRef<'div'> {
    onClick: () => void;
}
const Trigger = forwardRef<HTMLDivElement, TriggerProps>((props, ref) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={styles.trigger} ref={ref} onClick={props.onClick}>
        {props.children}
    </div>
));

/**
 * A Popover component, based on [`react-tiny-popover`](https://github.com/alexkatz/react-tiny-popover). Refer to its docs for more information on positioning props.
 *
 * <hr />
 *
 * To use this component:
 *
 * ```js
 * import { Popover } from 'paris/popover';
 *
 * <Popover trigger={<button>Trigger</button>}>
 *    <p>Content</p>
 * </Popover>
 * ```
 * @constructor
 */
export const Popover: FC<PopoverProps> = ({
    trigger,
    children,
    padding,
    positions,
    align,
    isOpen,
    setIsOpen,
    ...props
}) => {
    const [open, setOpen] = useState(false);

    return (
        <RTPopover
            positions={positions || ['bottom', 'top', 'left', 'right']}
            align={align || 'start'}
            padding={padding || 8}
            isOpen={typeof isOpen === 'undefined' ? open : isOpen}
            containerClassName={clsx(typography.paragraphSmall, styles.content)}
            content={(
                <>
                    {children}
                </>
            )}
            onClickOutside={() => {
                setIsOpen?.(false);
                setOpen(false);
            }}
            {...props}
        >
            <Trigger
                onClick={() => {
                    setIsOpen?.(!isOpen);
                    setOpen((cur) => !cur);
                }}
            >
                {trigger}
            </Trigger>
        </RTPopover>
    );
};
