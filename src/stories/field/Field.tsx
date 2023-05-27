import type { FC, PropsWithChildren, ComponentPropsWithoutRef } from 'react';
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
    label?: string;
    /**
     * Visually hide the label (while keeping it accessible to screen readers).
     * @default false
     */
    hideLabel?: boolean;
    /**
     * A description of the field. Can be visually hidden using the `hideDescription` prop.
     */
    description?: string;
    /**
     * Visually hide the description while keeping it accessible to screen readers.
     * @default false
     */
    hideDescription?: boolean;
    /**
     * Disables the field, disallowing user interaction.
     */
    disabled?: boolean;
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
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
    children,
    ...props
}) => (
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
            e.preventDefault();
            if (typeof window !== 'undefined' && htmlFor) {
                const input = document.getElementById(htmlFor);
                if (input && !disabled) {
                    if (input.tagName === 'BUTTON') input.click();
                    else input.focus();
                }
            }
        }}
    >
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
        {children}
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
    </div>
);
