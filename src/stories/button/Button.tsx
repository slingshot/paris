'use client';

import type {
    FC, HTMLAttributeAnchorTarget, MouseEventHandler, ReactNode,
} from 'react';
import type { ButtonProps as AriaButtonProps } from '@ariakit/react';
import { Button as AriaButton } from '@ariakit/react';
import clsx from 'clsx';
import styles from './Button.module.scss';
import { Text } from '../text';
import type { Enhancer } from '../../types/Enhancer';
import { MemoizedEnhancer, renderEnhancer } from '../../helpers/renderEnhancer';

const EnhancerSizes = {
    large: 13,
    small: 11,
    xs: 9,
};

export type ButtonProps = {
    /**
     * The appearance of the Button.
     * @default primary
     */
    kind?: 'primary' | 'secondary' | 'tertiary';
    /**
     * The size of the Button.
     * @default large
     */
    size?: 'large' | 'small' | 'xs';
    /**
     * The shape of the Button.
     * @default pill
     */
    shape?: 'pill' | 'circle' | 'rectangle' | 'square' | 'rounded';
    /**
     * An icon or other element to render before the Button's text. A `size` argument is passed that should be used to determine the width & height of the content displayed.
     *
     * When Button shape is `circle` or `square`, this element will be the only visible content.
     */
    startEnhancer?: Enhancer;
    /**
     * An icon or other element to render after the Button's text. A `size` argument is passed that should be used to determine the width & height of the content displayed.
     */
    endEnhancer?: Enhancer;
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
    hrefTarget?: HTMLAttributeAnchorTarget;
    /**
     * The contents of the Button.
     *
     * This should be text. When Button shape is `circle` or `square`, the action description should still be passed here for screen readers.
     */
    children: ReactNode | ReactNode[];
} & Omit<AriaButtonProps, 'children' | 'disabled' | 'onClick'>;

/**
 * A `Button` is used to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.
 *
 * <hr />
 *
 * To use the `Button` component, import it as follows:
 *
 * ```js
 * import { Button } from 'paris/button';
 * ```
 *
 * @constructor
 */
export const Button: FC<ButtonProps> = ({
    kind = 'primary',
    size = 'large',
    shape = 'pill',
    type = 'button',
    startEnhancer,
    endEnhancer,
    onClick,
    children,
    disabled,
    href,
    ...props
}) => (
    <AriaButton
        {...props}
        className={clsx(
            styles.button,
            styles[kind],
            styles[shape],
            styles[size],
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
                    target={props.hrefTarget ?? '_self'}
                    rel={props.hrefTarget === '_self' ? undefined : 'noreferrer'}
                />
            ),
        } : {}}
    >
        {!!startEnhancer && (
            <MemoizedEnhancer
                enhancer={startEnhancer}
                size={EnhancerSizes[size]}
            />
        )}
        {!['circle', 'square'].includes(shape) && (
            <Text kind="labelXSmall">
                {children || 'Button'}
            </Text>
        )}
        {!!endEnhancer && (
            <MemoizedEnhancer
                enhancer={endEnhancer}
                size={EnhancerSizes[size]}
            />
        )}
    </AriaButton>
);
