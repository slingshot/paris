import type { FC, ReactNode } from 'react';
import { useId } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';
import { pvar } from '../theme';

export type CheckboxProps = {
    checked?: boolean;
    onChange?: (checked: boolean | 'indeterminate') => void;
    disabled?: boolean;
    /** The contents of the Checkbox. */
    children?: ReactNode | ReactNode[];
} & Omit<React.ComponentPropsWithoutRef<'label'>, 'onChange' | 'children'>;

/**
* A Checkbox component.
*
* <hr />
*
* To use this component, import it as follows:
*
* ```js
* import { Checkbox } from 'paris/checkbox';
* ```
* @constructor
*/
export const Checkbox: FC<CheckboxProps> = ({
    checked,
    onChange,
    disabled,
    children,
    className,
    ...props
}) => {
    const inputID = useId();
    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        <label
            htmlFor={inputID}
            onClick={() => onChange?.(!checked)}
            className={clsx(styles.container, disabled && styles.disabled, className)}
            {...props}
        >
            <RadixCheckbox.Root
                id={inputID}
                className={styles.root}
                checked={checked}
                onCheckedChange={onChange}
                data-disabled={disabled}
            >
                <RadixCheckbox.Indicator className={styles.indicator}>
                    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.333374 0.333252V13.6666H13.6667V0.333252H0.333374ZM6.00004 10.3999L2.26672 6.66658L3.66671 5.26658L5.93339 7.53325L10.2 3.26658L11.6001 4.66659L6.00004 10.3999Z"
                            fill={pvar('colors.contentPrimary')}
                        />
                    </svg>
                </RadixCheckbox.Indicator>
            </RadixCheckbox.Root>
            {children}
        </label>
    );
};
