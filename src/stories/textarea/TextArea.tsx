import type { ComponentPropsWithoutRef, FC } from 'react';
import { useId } from 'react';
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
export const TextArea: FC<InputProps & ComponentPropsWithoutRef<'textarea'>> = ({
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
    const textareaID = useId();
    return (
        <Field
            htmlFor={textareaID}
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
                <textarea
                    {...props}
                    id={textareaID}
                    aria-label={typeof label === 'string' ? label : props['aria-label']}
                    aria-describedby={`${textareaID}-description`}
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
