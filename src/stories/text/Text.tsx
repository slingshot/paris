import type { FC, HTMLProps, ReactNode } from 'react';
import { createElement } from 'react';
import clsx from 'clsx';
import styles from './Text.module.scss';
import typography from './Typography.module.css';
import type { LightTheme } from '../theme';

export type TextProps = {
    /**
     * The font class to use.
     * @default paragraphMedium
     */
    kind: keyof typeof LightTheme.typography.styles;
    /**
     * The HTML text tag to use.
     * @default span
     */
    as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'legend' | 'caption' | 'small';
    /** The contents of the Text element. */
    children: ReactNode;
} & HTMLProps<HTMLElement>;

/**
 * A `Text` component is used to render text with one of our theme formats.
 * @example ```tsx
 * <Text as="h1" format="headingLarge">Hello World!</Text>
 * ```
 * @constructor
 */
export const Text: FC<TextProps> = ({
    kind,
    as,
    children,
    ...props
}) => createElement(
    as || 'span',
    {
        ...props,
        className: clsx(
            props?.className,
            typography[kind],
            styles.text,
        ),
    },
    children,
);
