'use client';

import type {
    ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode,
} from 'react';
import styles from './Button.module.scss';
import { Text } from '../text';

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
    startEnhancer?: (size: number) => ReactNode;
    /**
     * An icon or other element to render after the Button's text. A `size` argument is passed that should be used to determine the width & height of the content displayed.
     */
    endEnhancer?: (size: number) => ReactNode;
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
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled' | 'onClick'>;

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
    ...props
}) => (
    <button
        className={`${props.className} ${styles[kind || 'primary']} ${styles[shape || 'pill']} ${styles[size || 'large']} ${styles.button}`}
        type={type || 'button'}
        aria-details={children}
        onClick={onClick}
        {...props}
    >
        {!!startEnhancer && startEnhancer(size === 'large' ? 16 : 12)}
        <Text kind="labelXSmall">
            {children || 'Button'}
        </Text>
        {!!endEnhancer && endEnhancer(size === 'large' ? 16 : 12)}
    </button>
);
