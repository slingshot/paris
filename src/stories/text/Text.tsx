import type { ComponentProps, FC, ReactNode } from 'react';
import { createElement } from 'react';
import clsx from 'clsx';
import typography from './Typography.module.css';
import styles from './Text.module.scss';
import type { LightTheme } from '../theme';

export type TextElement = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'legend' | 'caption' | 'small';
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold' | 'lighter' | 'bolder' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';
export type FontStyle = 'normal' | 'italic' | 'oblique';

export type TextProps<T extends TextElement = 'span'> = {
    /**
     * The font class to use.
     * @default paragraphMedium
     */
    kind?: keyof typeof LightTheme.typography.styles;

    /**
     * The HTML text tag to use.
     * @default span
     */
    as?: T;

    /**
     * The font weight to apply.
     */
    weight?: FontWeight;

    /**
     * The font style to apply.
     */
    fontStyle?: FontStyle;

    /** The contents of the Text element. */
    children: ReactNode;
} & ComponentProps<T>;

/**
 * A `Text` component is used to render text with one of our theme formats.
 *
 * <hr />
 *
 * To use the `Text` component, import it as follows:
 *
 * ```tsx
 * import { Text } from 'paris/text';
 *
 * export const ExampleHeading: FC = () => (
 *     <Text as="h1" kind="headingLarge" weight="bold" fontStyle="italic">Hello World!</Text>
 * );
 * ```
 *
 * @example ```tsx
 * <Text as="h1" kind="headingLarge">Hello World!</Text>
 * ```
 * @constructor
 */
export function Text<T extends TextElement>({
    kind,
    as,
    weight,
    fontStyle,
    children,
    ...props
}: TextProps<T>): JSX.Element {
    return createElement(
        as || 'span',
        {
            ...props,
            className: clsx(
                styles.text,
                typography[kind || 'paragraphMedium'],
                weight && styles[`weight-${weight}`],
                fontStyle && styles[`fontStyle-${fontStyle}`],
                props?.className,
            ),
        },
        children,
    );
}
