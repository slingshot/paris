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
import { Field } from '../field';

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
     * Disables the input, disallowing user interaction.
     */
    disabled?: boolean;
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
};

/**
 * An `Input` is used to collect user input, such as text, numbers, or dates.
 *
 * > `overrides` available: `container`, `label`, `description`, `startEnhancerContainer`, `endEnhancerContainer`
 *
 * <hr />
 *
 * To use the `Input` component, import it as follows:
 *
 * ```js
 * import { Input } from 'paris/input';
 * ```
 * @constructor
 */
export const Input: FC<InputProps & ComponentPropsWithoutRef<'input'>> = ({
    label,
    status,
    type,
    hideLabel,
    description,
    hideDescription,
    startEnhancer,
    endEnhancer,
    disabled,
    overrides,
    ...props
}) => {
    const inputID = useId();
    return (
        <Field
            htmlFor={inputID}
            label={label}
            hideLabel={hideLabel}
            description={description}
            hideDescription={hideDescription}
            disabled={disabled}
            overrides={{
                container: overrides?.container,
                label: overrides?.label,
                description: overrides?.description,
            }}
        >
            <div
                className={styles.inputContainer}
                data-status={status}
                data-disabled={disabled}
            >
                {!!startEnhancer && (
                    <div {...overrides?.startEnhancerContainer} className={clsx(styles.enhancer, overrides?.startEnhancerContainer?.className)}>
                        {!!startEnhancer && (
                            <MemoizedEnhancer
                                enhancer={startEnhancer}
                                size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                            />
                        )}
                    </div>
                )}
                <input
                    {...props}
                    id={inputID}
                    type={type || 'text'}
                    aria-label={label}
                    aria-describedby={`${inputID}-description`}
                    aria-disabled={disabled}
                    readOnly={disabled}
                    className={clsx(
                        props.className,
                        styles.input,
                    )}
                />
                {!!endEnhancer && (
                    <div {...overrides?.endEnhancerContainer} className={clsx(styles.enhancer, overrides?.endEnhancerContainer?.className)}>
                        {!!endEnhancer && (
                            <MemoizedEnhancer
                                enhancer={endEnhancer}
                                size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                            />
                        )}
                    </div>
                )}
            </div>
        </Field>
    );
};
