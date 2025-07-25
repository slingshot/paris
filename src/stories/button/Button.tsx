'use client';

import type {
    CSSProperties, FC, HTMLAttributeAnchorTarget, HTMLAttributes, MouseEventHandler, ReactNode,
} from 'react';
import { useMemo } from 'react';
import type { ButtonProps as AriaButtonProps } from '@ariakit/react';
import { Button as AriaButton } from '@ariakit/react';
import clsx from 'clsx';
import fontColorContrast from 'font-color-contrast';
import type { CSSLength } from '@ssh/csstypes';
import styles from './Button.module.scss';
import { Text } from '../text';
import type { Enhancer } from '../../types/Enhancer';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import { pvar } from '../theme';
import { Spinner, NotificationDot } from '../icon';

const EnhancerSizes = {
    large: 13,
    medium: 12,
    small: 11,
    xs: 9,
};

export const CornerPresets = ['sharp', 'rounded', 'roundedXL'] as const;

export const ButtonThemes = {
    negative: {
        primary: pvar('new.colors.buttonBorderNegative'),
        secondary: pvar('new.colors.buttonFillHoverNegative'),
        primaryAlt: pvar('new.colors.contentNegative'),
        secondaryAlt: pvar('new.colors.backgroundNegativeStrong'),
    },
    positive: {
        primary: pvar('new.colors.contentPositive'),
        secondary: pvar('new.colors.backgroundPositive'),
        primaryAlt: pvar('new.colors.contentPositive'),
        secondaryAlt: pvar('new.colors.backgroundPositiveStrong'),
    },
    warning: {
        primary: pvar('new.colors.contentWarning'),
        secondary: pvar('new.colors.backgroundWarning'),
        primaryAlt: pvar('new.colors.contentWarning'),
        secondaryAlt: pvar('new.colors.backgroundWarningStrong'),
    },
} as const;

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
    size?: 'large' | 'medium' | 'small' | 'xs';
    /**
     * The shape of the Button.
     * @default pill
     */
    shape?: 'pill' | 'circle' | 'rectangle' | 'square';
    /**
     * The radius of the corners for the `rectangle` and `square` Button shapes. Either a preset or a valid {@link CSSLength} string.
     * `sharp` will have no rounding, `rounded` will have a slight rounding, and `roundedXL` will have a large rounding.
     * @see CornerPresets
     * @default rounded
     */
    corners?: typeof CornerPresets[number] | CSSLength;
    /**
     * A color to apply for the Button. Provide an object with `primary` and `secondary` properties to set the primary and hover colors.
     */
    colors?: {
    /** The primary color of the Button. Primary buttons will use this as the background color, and secondary/tertiary buttons will use it for the text and border. */
        primary: string;
        /**
         * The secondary color of the Button, used for hover/active states.
         */
        secondary: string;
    };
    /**
     * Preset themes for coloring the button. Overrides the `colors` prop.
     */
    theme?: keyof typeof ButtonThemes;
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
     * Displays a loading indicator inside the Button and disables user interaction.
     * @default false
     */
    loading?: boolean;
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
     *
     * This should be text. When Button shape is `circle` or `square`, the action description should still be passed here for screen readers.
     */
    children?: ReactNode | ReactNode[];
    /**
     * Displays a notification dot.
     */
    displayNotificationDot?: boolean;
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
    corners = 'rounded',
    colors,
    theme,
    type = 'button',
    startEnhancer,
    endEnhancer,
    onClick,
    children,
    disabled,
    loading,
    href,
    displayNotificationDot = false,
    style,
    ...props
}) => {
    const cornersIsPreset = useMemo(() => (CornerPresets as readonly string[]).includes(corners), [corners]);
    return (
        <AriaButton
            {...props}
            style={(theme || colors) ? {
                '--pte-new-colors-contentInversePrimary': fontColorContrast(theme ? ButtonThemes[theme].primary : colors?.primary || pvar('new.colors.contentPrimary')), // text for primary
                '--pte-new-colors-buttonFill': theme ? ButtonThemes[theme].primaryAlt : colors?.primary, // background for primary
                '--pte-new-colors-buttonFillHover': theme ? ButtonThemes[theme].secondaryAlt : colors?.secondary, // hover background for primary
                '--pte-new-colors-contentPrimary': theme ? ButtonThemes[theme].primary : colors?.primary, // text for secondary/tertiary
                '--pte-new-colors-buttonBorder': theme ? ButtonThemes[theme].primary : colors?.primary, // border for secondary/tertiary
                '--pte-new-colors-overlayMedium': theme ? ButtonThemes[theme].secondary : colors?.secondary, // hover background for secondary/tertiary
                borderRadius: !cornersIsPreset ? corners : '',
                ...style,
            } as CSSProperties : ({ borderRadius: !cornersIsPreset ? corners : '', ...style })}
            className={clsx(
                styles.button,
                styles[kind],
                styles[shape],
                styles[size],
                cornersIsPreset && styles[corners],
                props?.className,
            )}
            aria-disabled={disabled ?? false}
            type={type}
            aria-details={typeof children === 'string' ? children : undefined}
            onClick={!disabled && !href && !loading ? onClick : () => {}}
            disabled={false}
            {...href ? {
                render: (properties: HTMLAttributes<HTMLAnchorElement>) => (
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
            {!!(startEnhancer && !loading) && (
                <MemoizedEnhancer
                    enhancer={startEnhancer}
                    size={EnhancerSizes[size]}
                />
            )}
            {!['circle', 'square'].includes(shape) && (
                <Text kind="labelXSmall">
                    {!loading ? (
                        children || 'Button'
                    ) : (
                        <Spinner size={EnhancerSizes[size]} />
                    )}
                </Text>
            )}
            {!!(endEnhancer && !loading) && (
                <MemoizedEnhancer
                    enhancer={endEnhancer}
                    size={EnhancerSizes[size]}
                />
            )}
            {!!displayNotificationDot && (
                <div className="absolute top-0 right-0">
                    <NotificationDot size={8} />
                </div>
            )}
        </AriaButton>
    );
};
