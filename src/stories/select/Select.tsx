/* eslint-disable prefer-arrow-callback,func-names */

'use client';

import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react';
import { forwardRef, useId } from 'react';
import { Listbox, RadioGroup, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import inputStyles from '../input/Input.module.scss';
import dropdownStyles from '../utility/Dropdown.module.scss';
import styles from './Select.module.scss';
import type { TextProps } from '../text';
import { Text } from '../text';
import type { InputProps } from '../input';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import { pget, theme } from '../theme';
import { Field } from '../field';
import { TextWhenString } from '../utility';

export type Option<T = Record<string, any>> = {
    id: string,
    node: ReactNode,
    disabled?: boolean,
    metadata?: T,
};
export type SelectProps<T = Record<string, any>> = {
    /**
     * The  {@link Option}s to render in the select box.
     *
     * Each option should have an id (`string`) and node ({@link ReactNode}) property at minimum. You can also pass in any other metadata through the `metadata` attribute.
     *
     * For type safety, you can pass in a type parameter to `SelectProps` component. This will be used as the type for the `metadata` property of each option.
     */
    options: Option<T>[];
    /**
     * The option ID to render as selected in the select box.
     *
     * This should exactly match one of the option IDs passed in the `options` prop. If `null`, no option will be selected.
     */
    value?: Option<T>['id'] | null;
    /**
     * The interaction handler for the Select.
     */
    onChange?: (value: Option<T>['id'] | null) => void | Promise<void>;
    /**
     * The visual variant of the Select. Listboxes will render as a dropdown menu, and radios will render as a radio group.
     * @default listbox
     */
    kind?: 'listbox' | 'radio';
    /**
     * Prop overrides for other rendered elements. Overrides for the input itself should be passed directly to the component.
     */
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        selectInput?: ComponentPropsWithoutRef<'button'>;
        optionsContainer?: ComponentPropsWithoutRef<'div'>;
        option?: ComponentPropsWithoutRef<'div'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
        startEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
        endEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
    }
} & Omit<InputProps, 'type' | 'overrides'>;

/**
 * A Select component is used to render a `select` box.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Select } from 'paris/select';
 * ```
 * @constructor
 */
export const Select = forwardRef(function <T = Record<string, any>>({
    options,
    value,
    onChange,
    label,
    status,
    hideLabel,
    description,
    hideDescription,
    placeholder,
    startEnhancer,
    endEnhancer,
    disabled,
    kind = 'listbox',
    overrides,
}: SelectProps<T>, ref: ForwardedRef<any>) {
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
            {kind === 'listbox' && (
                <Listbox
                    as="div"
                    ref={ref}
                    value={value}
                    onChange={onChange}
                >
                    <Listbox.Button
                        id={inputID}
                        {...overrides?.selectInput}
                        aria-disabled={disabled}
                        data-status={disabled ? 'disabled' : (status || 'default')}
                        className={clsx(
                            overrides?.selectInput?.className,
                            inputStyles.inputContainer,
                            styles.field,
                        )}
                    >
                        {!!startEnhancer && (
                            <div {...overrides?.startEnhancerContainer} className={clsx(inputStyles.enhancer, overrides?.startEnhancerContainer?.className)}>
                                {!!startEnhancer && (
                                    <MemoizedEnhancer
                                        enhancer={startEnhancer}
                                        size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                                    />
                                )}
                            </div>
                        )}
                        {options?.find((o) => o.id === value)?.node || placeholder || 'Select an option'}
                        {endEnhancer ? (
                            <div {...overrides?.endEnhancerContainer} className={clsx(inputStyles.enhancer, overrides?.endEnhancerContainer?.className)}>
                                {!!endEnhancer && (
                                    <MemoizedEnhancer
                                        enhancer={endEnhancer}
                                        size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                                    />
                                )}
                            </div>
                        ) : (
                            <FontAwesomeIcon className={inputStyles.enhancer} width="10px" icon={faChevronDown} />
                        )}
                    </Listbox.Button>
                    <Transition
                        enter={dropdownStyles.transition}
                        enterFrom={dropdownStyles.enterFrom}
                        enterTo={dropdownStyles.enterTo}
                        leave={dropdownStyles.transition}
                        leaveFrom={dropdownStyles.leaveFrom}
                        leaveTo={dropdownStyles.leaveTo}
                    >
                        <Listbox.Options
                            className={clsx(
                                overrides?.optionsContainer,
                                styles.options,
                            )}
                        >
                            {(options || []).map((option) => (
                                <Listbox.Option
                                    key={option.id}
                                    value={option.id}
                                    data-selected={option.id === value}
                                    className={clsx(
                                        overrides?.option,
                                        styles.option,
                                    )}
                                    disabled={option.disabled || false}
                                >
                                    {typeof option.node === 'string' ? (
                                        <Text as="span" kind="paragraphSmall">
                                            {option.node}
                                        </Text>
                                    ) : option.node}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </Listbox>
            )}
            {kind === 'radio' && (
                <RadioGroup ref={ref} as="div" className={styles.radioContainer} value={value} onChange={onChange}>
                    {options.map((option) => (
                        <RadioGroup.Option
                            as="div"
                            className={clsx(
                                styles.radioOption,
                            )}
                            key={option.id}
                            value={option.id}
                            disabled={option.disabled || false}
                        >
                            <div className={styles.radioCircle} />
                            <TextWhenString kind="paragraphXSmall">
                                {option.node}
                            </TextWhenString>
                        </RadioGroup.Option>
                    ))}
                </RadioGroup>
            )}
        </Field>
    );
});
