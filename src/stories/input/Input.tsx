'use client';

import { useId } from 'react';
import type { FC, ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';
import type { TextProps } from '../text';
import { Text } from '../text';
import type { Enhancer } from '../../types/Enhancer';
import { pget, theme } from '../theme';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';

export type InputProps = {
    /**
     * A label for the input field. This is required for accessibility, but can be visually hidden using the `hideLabel` prop.
     */
    label: string;
    /**
     * The status of the input field.
     * @default default
     */
    status?: 'default' | 'error' | 'success';
    /**
     * The input type. All HTML5 input types are supported, but some may require additional props to be set for full accessibility or aesthetic.
     * @default text
     */
    type?: 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';
    /**
     * Visually hide the label (while keeping it accessible to screen readers).
     * @default false
     */
    hideLabel?: boolean;
    /**
     * A description of the input field. Can be visually hidden using the `hideDescription` prop.
     */
    description?: string;
    /**
     * Visually hide the description while keeping it accessible to screen readers.
     * @default false
     */
    hideDescription?: boolean;
    /**
     * The placeholder for the input.
     */
    placeholder?: string;
    /**
     * An icon or other element to render before the Input element. A `{ size }` argument is passed that should be used to determine the width & height of the content displayed.
     */
    startEnhancer?: Enhancer;
    /**
     * An icon or other element to render after the Input element. A `{ size }` argument is passed that should be used to determine the width & height of the content displayed.
     */
    endEnhancer?: Enhancer;
    /**
     * Prop overrides for other rendered elements. Overrides for the input itself should be passed directly to the component.
     */
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
        startEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
        endEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
    }
} & ComponentPropsWithoutRef<'input'>;

/**
 * An `Input` is used to collect user input, such as text, numbers, or dates.
 *
 * > `overrides` available: `container`, `label`, `description`, `startEnhancerContainer`, `endEnhancerContainer`
 * @constructor
 */
export const Input: FC<InputProps> = ({ status, ...props }) => {
    const inputID = useId();
    return (
        // Disable a11y rules because the container doesn't need to be focusable for screen readers; the input itself should receive focus instead.
        // The container is only made clickable for usability purposes.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
            {...props.overrides?.container}
            className={clsx(
                props.overrides?.container?.className,
                styles.container,
            )}
            onClick={() => {
                if (typeof window !== 'undefined') {
                    const input = document.getElementById(inputID);
                    if (input) {
                        input.focus();
                    }
                }
            }}
        >
            <Text
                {...props.overrides?.label}
                as="label"
                kind="paragraphSmall"
                htmlFor={inputID}
                className={clsx(
                    styles.label,
                    { [styles.hidden]: props.hideLabel },
                )}
            >
                {props.label}
            </Text>
            <div className={styles.inputContainer} data-status={status}>
                {!!props.startEnhancer && (
                    <div {...props.overrides?.startEnhancerContainer} className={clsx(styles.enhancer, props.overrides?.startEnhancerContainer?.className)}>
                        {!!props.startEnhancer && (
                            <MemoizedEnhancer
                                enhancer={props.startEnhancer}
                                size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                            />
                        )}
                    </div>
                )}
                <input
                    {...props}
                    id={inputID}
                    type={props.type || 'text'}
                    aria-label={props.label}
                    aria-describedby={`${inputID}-description`}
                    className={clsx(
                        props.className,
                        styles.input,
                    )}
                />
                {!!props.endEnhancer && (
                    <div {...props.overrides?.endEnhancerContainer} className={clsx(styles.enhancer, props.overrides?.endEnhancerContainer?.className)}>
                        {!!props.endEnhancer && (
                            <MemoizedEnhancer
                                enhancer={props.endEnhancer}
                                size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                            />
                        )}
                    </div>
                )}
            </div>
            <Text
                id={`${inputID}-description`}
                {...props.overrides?.description}
                as="p"
                kind="paragraphXSmall"
                className={clsx(
                    styles.description,
                    { [styles.hidden]: !props.description || props.hideDescription },
                    props.overrides?.description?.className,
                )}
            >
                {props.description}
            </Text>
        </div>
    );
};
