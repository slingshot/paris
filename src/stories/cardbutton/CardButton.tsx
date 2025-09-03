'use client';

import type {
    FC, HTMLAttributeAnchorTarget, MouseEventHandler, ReactNode,
} from 'react';
import type { ButtonProps as AriaButtonProps } from '@ariakit/react';
import { Button as AriaButton } from '@ariakit/react';
import clsx from 'clsx';
import styles from './CardButton.module.scss';
import { TextWhenString } from '../utility';

export type CardButtonProps = {
    /**
     * The visual variant of the CardButton. `raised` is the default variant with a drop shadow, `surface` is a variant with a border and overlay, `flat` is a variant with a border.
     *
     * @default "raised"
     */
    kind?: 'raised' | 'surface' | 'flat';
    /**
     * The status of the CardButton. `pending` adds a dashed border.
     *
     * @default "default"
     */
    status?: 'default' | 'pending';
    /**
     * Disables the Button, disallowing user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * The interaction handler for the Button.
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /**
     * Optionally, the Button can be rendered as an anchor element by passing an `href` prop. To use a Next.js Link component, use the `render` prop directly.
     */
    href?: string;
    /**
     * Optionally, the target of the anchor element can be specified (defaults to `_self`).
     */
    hreftarget?: HTMLAttributeAnchorTarget;
    /**
     * The contents of the Button.
     */
    children?: ReactNode | ReactNode[];
} & Omit<AriaButtonProps, 'children' | 'disabled' | 'onClick'>;

/**
 * A CardButton component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { CardButton } from 'paris/cardbutton';
 * ```
 * @constructor
 */
export const CardButton: FC<CardButtonProps> = ({
    kind = 'raised',
    status = 'default',
    type = 'button',
    onClick,
    children,
    disabled,
    href,
    ...props
}) => (
    <div className={styles.container}>
        <AriaButton
            {...props}
            className={clsx(
                styles.card,
                styles[kind],
                styles[status],
                typeof children === 'string' && styles.text,
                props?.className,
            )}
            aria-disabled={disabled ?? false}
            type={type}
            aria-details={typeof children === 'string' ? children : undefined}
            onClick={!disabled && !href ? onClick : () => {}}
            disabled={false}
            {...href ? {
                render: (properties) => (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a
                        {...properties}
                        href={href}
                        target={props.hreftarget ?? '_self'}
                        rel={props.hreftarget === '_self' ? undefined : 'noreferrer'}
                    />
                ),
            } : {}}
        >
            <TextWhenString kind="paragraphMedium">
                {children}
            </TextWhenString>
        </AriaButton>
    </div>
);
