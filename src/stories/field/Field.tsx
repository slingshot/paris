import React, { type ComponentPropsWithoutRef, type FC, type PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from '../input/Input.module.scss';
import type { TextProps } from '../text';
import { Text } from '../text';

export type FieldProps = {
    /**
     * The ID of the child input.
     */
    htmlFor?: string;
    /**
     * A label for the field. Can be visually hidden using the `hideLabel` prop.
     */
    label?: React.ReactNode;
    /**
     * Visually hide the label (while keeping it accessible to screen readers).
     * @default false
     */
    hideLabel?: boolean;
    /**
     * A description of the field. Can be visually hidden using the `hideDescription` prop.
     */
    description?: React.ReactNode;
    /**
     * Visually hide the description while keeping it accessible to screen readers.
     * @default false
     */
    hideDescription?: boolean;
    /**
     * Disables the field, disallowing user interaction.
     */
    disabled?: boolean;
    /**
     * Position of the description relative to the children/input.
     * @default 'bottom'
     */
    descriptionPosition?: 'top' | 'bottom';
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
        labelContainer?: ComponentPropsWithoutRef<'div'>;
    }
};

/**
* A Field component wraps a form input component with an accessible label and description.
*
* <hr />
*
* To use this component, import it as follows:
*
* ```js
* import { Field } from 'paris/field';
* ```
* @constructor
*/
export const Field: FC<PropsWithChildren<FieldProps>> = ({
    htmlFor,
    disabled,
    descriptionPosition = 'bottom',
    children,
    // className,
    ...props
}) => {
    const label = typeof props.label === 'string'
        ? (
            <Text
                {...props.overrides?.label}
                as="label"
                kind="paragraphSmall"
                htmlFor={htmlFor}
                className={clsx(
                    styles.label,
                    { [styles.hidden]: props.hideLabel },
                )}
            >
                {props.label}
            </Text>
        )
        : (
            <label htmlFor={htmlFor} className={clsx({ [styles.hidden]: props.hideLabel })}>
                {props.label}
            </label>
        );

    const description = typeof props.description === 'string'
        ? (
            <Text
                id={`${htmlFor}-description`}
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
        )
        : (
            <div
                id={`${htmlFor}-description`}
                className={clsx({ [styles.hidden]: !props.description || props.hideDescription })}
            >
                {props.description}
            </div>
        );

    return (
        // Disable a11y rules because the container doesn't need to be focusable for screen readers; the input itself should receive focus instead.
        // The container is only made clickable for usability purposes.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
            {...props.overrides?.container}
            className={clsx(
                props.overrides?.container?.className,
                styles.container,
                // className,
            )}
            onClick={(e) => {
                if (typeof window !== 'undefined' && htmlFor) {
                    const input = document.getElementById(htmlFor);
                    if (input && !disabled) {
                        if (input.tagName === 'BUTTON') input.click();
                        else input.focus();
                    }
                }
            }}
        >
            {descriptionPosition === 'top' ? (
                <div
                    {...props.overrides?.labelContainer}
                    className={clsx(
                        styles.labelContainer,
                        props.overrides?.labelContainer?.className,
                    )}
                >
                    {label}
                    {description}
                </div>
            ) : label}
            {children}
            {descriptionPosition === 'bottom' ? description : <></>}
        </div>
    );
};
