import type { ComponentPropsWithoutRef, FC } from 'react';
import { useId } from 'react';
import clsx from 'clsx';
import type { InputProps } from '../input';
import styles from '../input/Input.module.scss';
import { Text } from '../text';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import { pget, theme } from '../theme';

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
export const TextArea: FC<InputProps & ComponentPropsWithoutRef<'textarea'>> = ({ status, disabled, ...props }) => {
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
            onClick={(e) => {
                if (disabled) e.preventDefault();
                if (typeof window !== 'undefined') {
                    const input = document.getElementById(inputID);
                    if (input && !disabled) {
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
            <div
                className={styles.inputContainer}
                data-status={status}
                data-disabled={disabled}
            >
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
                <textarea
                    {...props}
                    id={inputID}
                    aria-label={props.label}
                    aria-describedby={`${inputID}-description`}
                    aria-disabled={disabled}
                    readOnly={disabled}
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
    // return (
    //     <div
    //         className={clsx(
    //             styles.inputContainer,
    //         )}
    //     >
    //         <textarea
    //             {...props}
    //         />
    //     </div>
    // );
};
