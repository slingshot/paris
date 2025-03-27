import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';
import { forwardRef, useId } from 'react';
import clsx from 'clsx';
import type { InputProps } from '../input';
import styles from '../input/Input.module.scss';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import { pget, theme } from '../theme';
import { Field } from '../field';

/**
 * A `textarea` input field.
 *
 * <hr />
 *
 * To use this component in your app, import it as follows:
 *
 * ```js
 * import { TextArea } from 'paris/textarea';
 * ```
 * @constructor
 */
export const TextArea = forwardRef<HTMLTextAreaElement, InputProps & ComponentPropsWithoutRef<'textarea'>>(({
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
    rows = 3,
    ...props
}, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const textareaID = useId();
    return (
        <Field
            htmlFor={textareaID}
            label={label}
            hideLabel={hideLabel}
            description={description}
            hideDescription={hideDescription}
            descriptionPosition={descriptionPosition}
            disabled={disabled}
            overrides={{
                container: overrides?.container,
                label: overrides?.label,
                description: overrides?.description,
            }}
        >
            <div
                className={styles.inputContainer}
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
                                size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                            />
                        )}
                    </div>
                )}
                <textarea
                    {...props}
                    id={textareaID}
                    ref={ref}
                    aria-label={typeof label === 'string' ? label : props['aria-label']}
                    aria-describedby={`${textareaID}-description`}
                    aria-disabled={disabled}
                    readOnly={disabled}
                    rows={rows}
                    data-status={disabled ? 'disabled' : (status || 'default')}
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
                                size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                            />
                        )}
                    </div>
                )}
            </div>
        </Field>
    );
});
