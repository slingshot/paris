'use client';

import type {
    FC, MouseEventHandler, ReactNode,
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
    small: 9,
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
    size?: 'large' | 'small';
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
     * The contents of the Button.
     *
     * This should be text. When Button shape is `circle` or `square`, the action description should still be passed here for screen readers.
     */
    children: string;
} & Omit<AriaButtonProps, 'children' | 'disabled' | 'onClick'>;

/**
 * A `Button` is used to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.
 *
 * @constructor
 */
export const Button: FC<ButtonProps> = ({
    kind,
    size,
    shape,
    type,
    startEnhancer,
    endEnhancer,
    onClick,
    children,
    disabled,
    ...props
}) => (
    <AriaButton
        {...props}
        className={clsx(
            styles.button,
            styles[kind || 'primary'],
            styles[shape || 'pill'],
            styles[size || 'large'],
            props?.className,
        )}
        aria-disabled={disabled ?? false}
        type={type || 'button'}
        aria-details={children}
        onClick={!disabled ? onClick : () => {}}
        disabled={false}
    >
        {!!startEnhancer && (
            <MemoizedEnhancer
                enhancer={startEnhancer}
                size={EnhancerSizes[size || 'large']}
            />
        )}
        <Text kind="labelXSmall">
            {children || 'Button'}
        </Text>
        {!!endEnhancer && (
            <MemoizedEnhancer
                enhancer={endEnhancer}
                size={EnhancerSizes[size || 'large']}
            />
        )}
    </AriaButton>
);
