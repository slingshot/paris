'use client';
import { Switch } from '@headlessui/react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { forwardRef, useId } from 'react';
import { useControllableState } from '../../helpers/useControllableState';
import { Check, Icon } from '../icon';
import { TextWhenString, VisuallyHidden } from '../utility';
import styles from './Checkbox.module.scss';

type CheckboxOwnProps = {
    /** The visual style of the Checkbox. `default` is a standard checkbox with a label next to it, `surface` is a clickable card that displays a check when selected, `panel` is a clickable card with the checkbox aligned right, `switch` is a switch toggle.  */
    kind?: 'default' | 'surface' | 'panel' | 'switch';
    /** The checked state for controlled mode. Takes precedence over `value`. */
    checked?: boolean;
    /**
     * An alias for `checked`, so a form library's field object can be spread directly
     * (e.g. `<Checkbox {...field} />` with `react-hook-form`). Ignored when `checked` is set.
     */
    value?: boolean;
    /** Called with the new checked state whenever the Checkbox is toggled. */
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    /**
     * The validation status of the Checkbox. `error` renders an invalid treatment (e.g. for a
     * required checkbox that hasn't been checked). Follows the `Input`/`Select` pattern.
     * @default 'default'
     */
    status?: 'default' | 'error';
    /**
     * Whether to hide the label text of the Checkbox. Does not apply to `kind="surface"` because there would be nothing visible.
     *
     * @default false
     */
    hideLabel?: boolean;
    /** The initial checked state for uncontrolled mode. If `checked` is provided, this is ignored. */
    defaultChecked?: boolean;
    /** The contents of the Checkbox. */
    children?: ReactNode | ReactNode[];
};

export type CheckboxProps = CheckboxOwnProps &
    Omit<React.ComponentPropsWithoutRef<'button'>, keyof CheckboxOwnProps | 'defaultValue' | 'type'>;

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
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
    (
        {
            kind = 'default',
            checked,
            value,
            defaultChecked,
            onChange,
            disabled,
            status = 'default',
            hideLabel = false,
            children,
            className,
            style,
            id,
            ...props
        },
        ref,
    ) => {
        const generatedID = useId();
        const inputID = id ?? generatedID;
        const [resolvedChecked, setResolvedChecked] = useControllableState<boolean>({
            value: checked ?? value,
            defaultValue: defaultChecked,
            onChange,
        });
        return (
            <label
                htmlFor={inputID}
                style={style}
                className={clsx(
                    styles.container,
                    disabled && styles.disabled,
                    className,
                    resolvedChecked && styles.checked,
                )}
            >
                {(kind === 'default' || kind === 'surface' || kind === 'panel') && (
                    <RadixCheckbox.Root
                        {...props}
                        ref={ref}
                        id={inputID}
                        className={clsx(styles.root, styles[kind])}
                        checked={resolvedChecked}
                        onCheckedChange={(v) => setResolvedChecked(v === 'indeterminate' ? true : v)}
                        disabled={disabled}
                        data-disabled={disabled || undefined}
                        data-status={status}
                        aria-details={typeof children === 'string' ? children : undefined}
                    >
                        {(kind === 'surface' || kind === 'panel') && (
                            <TextWhenString kind="paragraphXSmall">{children}</TextWhenString>
                        )}
                        {kind === 'panel' && <div className={styles.box} />}
                        <RadixCheckbox.Indicator className={styles.indicator}>
                            {(kind === 'default' || kind === 'panel') && (
                                <svg
                                    width={14}
                                    height={14}
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        className={styles.checkSvg}
                                        data-disabled={disabled || undefined}
                                        d="M0.333374 0.333252V13.6666H13.6667V0.333252H0.333374ZM6.00004 10.3999L2.26672 6.66658L3.66671 5.26658L5.93339 7.53325L10.2 3.26658L11.6001 4.66659L6.00004 10.3999Z"
                                    />
                                </svg>
                            )}
                            {kind === 'surface' && (
                                <Icon
                                    icon={Check}
                                    size={12.8}
                                    data-disabled={disabled || undefined}
                                    className={styles.checkIcon}
                                />
                            )}
                        </RadixCheckbox.Indicator>
                    </RadixCheckbox.Root>
                )}
                {kind === 'switch' && (
                    <Switch
                        {...props}
                        ref={ref}
                        checked={resolvedChecked}
                        onChange={setResolvedChecked}
                        className={styles.switchContainer}
                        disabled={disabled}
                        data-disabled={disabled || undefined}
                        data-status={status}
                        id={inputID}
                        aria-details={typeof children === 'string' ? children : undefined}
                    >
                        <span aria-hidden="true" className={clsx(styles.knob, resolvedChecked && styles.knobChecked)} />
                    </Switch>
                )}
                {(kind === 'default' || kind === 'switch') && !hideLabel && (
                    <TextWhenString kind="paragraphXSmall">{children}</TextWhenString>
                )}
                {hideLabel && <VisuallyHidden>{children}</VisuallyHidden>}
            </label>
        );
    },
);

Checkbox.displayName = 'Checkbox';
