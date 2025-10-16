'use client';

import type { ComponentPropsWithoutRef, FC, ForwardedRef } from 'react';
import { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import styles from './Input.module.scss';
import type { TextProps } from '../text';
import type { Enhancer } from '../../types/Enhancer';
import { theme } from '../theme';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import type { FieldProps } from '../field';
import { Field } from '../field';

export type InputProps = {
    /**
     * This is required for accessibility. If the label is not a string, you should provide an `aria-label` prop directly to specify the text used for accessibility
     */
    label: React.ReactNode;
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
} & FieldProps;

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
export const Input: FC<InputProps & ComponentPropsWithoutRef<'input'>> = forwardRef(({
    label,
    status,
    type,
    hideLabel,
    description,
    hideDescription,
    descriptionPosition,
    startEnhancer,
    endEnhancer,
    disabled,
    overrides,
    ...props
}, ref: ForwardedRef<HTMLInputElement>) => {
    const inputID = useId();
    return (
        <Field
            htmlFor={inputID}
            label={label}
            hideLabel={hideLabel}
            description={description}
            hideDescription={hideDescription}
            disabled={disabled}
            descriptionPosition={descriptionPosition}
            overrides={{
                container: {
                    ...overrides?.container,
                    className: clsx(
                        // styles.fieldContainer,
                        overrides?.container?.className,
                    ),
                },
                label: overrides?.label,
                description: overrides?.description,
            }}
        >
            <div
                className={styles.inputContainer}
                // data-status={status}
                // data-disabled={disabled}
                data-status={disabled ? 'disabled' : (status || 'default')}
            >
                {!!startEnhancer && (
                    <div
                        {...overrides?.startEnhancerContainer}
                        className={clsx(styles.enhancer, overrides?.startEnhancerContainer?.className)}
                        data-status={disabled ? 'disabled' : (status || 'default')}
                    >
                        {!!startEnhancer && (
                            <MemoizedEnhancer
                                enhancer={startEnhancer}
                                size={parseInt(theme.typography.styles.paragraphSmall.fontSize, 10)}
                            />
                        )}
                    </div>
                )}
                <input
                    {...props}
                    id={inputID}
                    ref={ref}
                    type={type || 'text'}
                    aria-label={typeof label === 'string' ? label : props['aria-label']}
                    aria-describedby={`${inputID}-description`}
                    aria-disabled={disabled}
                    data-status={disabled ? 'disabled' : (status || 'default')}
                    readOnly={disabled}
                    className={clsx(
                        props.className,
                        styles.input,
                    )}
                />
                {!!endEnhancer && (
                    <div
                        {...overrides?.endEnhancerContainer}
                        className={clsx(styles.enhancer, overrides?.endEnhancerContainer?.className)}
                        data-status={disabled ? 'disabled' : (status || 'default')}
                    >
                        {!!endEnhancer && (
                            <MemoizedEnhancer
                                enhancer={endEnhancer}
                                size={parseInt(theme.typography.styles.paragraphSmall.fontSize, 10)}
                            />
                        )}
                    </div>
                )}
            </div>
        </Field>
    );
});
