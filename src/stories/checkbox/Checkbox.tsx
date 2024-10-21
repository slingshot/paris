import type { FC, ReactNode } from 'react';
import { useRef, useId } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';
import { pvar } from '../theme';
import { TextWhenString } from '../utility';
import { Check, Icon } from '../icon';

export type CheckboxProps = {
    /** The visual style of the Checkbox. `default` is a standard checkbox with a label next to it, `surface` is a clickable card that displays a check when selected.  */
    kind?: 'default' | 'surface'
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
    kind = 'default',
    checked,
    onChange,
    disabled,
    children,
    className,
    ...props
}) => {
    const inputID = useId();
    return (
        <label
            htmlFor={inputID}
            className={clsx(styles.container, disabled && styles.disabled, className, checked && styles.checked)}
            {...props}
        >
            <RadixCheckbox.Root
                id={inputID}
                className={clsx(styles.root, styles[kind])}
                checked={checked}
                onCheckedChange={onChange}
                data-disabled={disabled}
            >
                {kind === 'surface' && (
                    <TextWhenString kind="paragraphXSmall">
                        {children}
                    </TextWhenString>
                )}
                <RadixCheckbox.Indicator className={styles.indicator}>
                    {kind === 'default' && (
                        <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                className={styles.checkSvg}
                                data-disabled={disabled}
                                d="M0.333374 0.333252V13.6666H13.6667V0.333252H0.333374ZM6.00004 10.3999L2.26672 6.66658L3.66671 5.26658L5.93339 7.53325L10.2 3.26658L11.6001 4.66659L6.00004 10.3999Z"
                            />
                        </svg>
                    )}
                    {kind === 'surface' && (
                        <Icon
                            icon={Check}
                            size={12.8}
                            data-disabled={disabled}
                            className={styles.checkIcon}
                        />
                    )}
                </RadixCheckbox.Indicator>
            </RadixCheckbox.Root>
            {kind === 'default' && (
                <TextWhenString kind="paragraphXSmall">
                    {children}
                </TextWhenString>
            )}
        </label>
    );
};
