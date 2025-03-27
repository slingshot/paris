/* eslint-disable prefer-arrow-callback,func-names */

'use client';

import type {
    CSSProperties, ComponentPropsWithoutRef, ForwardedRef, ReactNode,
} from 'react';
import {
    useState,
    forwardRef, useId,
} from 'react';
import { Listbox, RadioGroup, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import inputStyles from '../input/Input.module.scss';
import dropdownStyles from '../utility/Dropdown.module.scss';
import styles from '../select/Select.module.scss';
import type { TextProps } from '../text';
import { Text } from '../text';
import type { InputProps } from '../input';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import { pget, theme } from '../theme';
import { Field } from '../field';
import { TextWhenString } from '../utility';
import { Check, Icon } from '../icon';

export type Option<T = Record<string, any>> = {
    id: string,
    node: ReactNode,
    disabled?: boolean,
    metadata?: T,
};
export type MultiSelectProps<T = Record<string, any>> = {
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
    value?: Option<T>['id'][] | null;
    /**
     * The interaction handler for the Select.
     */
    onChange?: (value: Option<T>['id'][] | null) => void | Promise<void>;
    /**
     * The size of the options dropdown, in pixels. Only applicable to kind="listbox".
     */
    maxHeight?: number;
    /**
     * Adds a bottom border to the dropdown options. Only applicable to kind="listbox".
     * @default false
     */
    hasOptionBorder?: boolean;
    /**
     * Controls the text of the Multiselect button when mutliple items selected
     * @default 'item'
     */
    itemsName?: string;

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
 * A Multiselect component is used to render a `select` listbox where you can choose multiple options.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { MultiSelect } from 'paris/multiselect';
 * ```
 * @constructor
 */
export const MultiSelect = forwardRef(function <T = Record<string, any>>({
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
    maxHeight = 320,
    hasOptionBorder = false,
    itemsName = 'items',
    overrides,
}: MultiSelectProps<T>, ref: ForwardedRef<any>) {
    const inputID = useId();
    const buttonText = () => {
        if (!value || value.length === 0) {
            return placeholder || 'Select an option';
        } if (value.length === 1) {
            return options?.find((o) => o.id === value[0])?.node;
        } if (value.length === options.length) {
            return `All ${itemsName} (${value.length})`;
        }
        return `Selected ${itemsName} (${value.length})`;
    };
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
            <Listbox
                as="div"
                ref={ref}
                value={value}
                onChange={onChange}
                multiple
            >
                <Listbox.Button
                    id={inputID}
                    {...overrides?.selectInput}
                    aria-disabled={disabled}
                    data-status={disabled ? 'disabled' : (status || 'default')}
                    className={clsx(
                        overrides?.selectInput?.className,
                        inputStyles.inputContainer,
                        styles.listboxButton,
                        styles.field,
                    )}
                >
                    {!!startEnhancer && (
                        <div
                            {...overrides?.startEnhancerContainer}
                            className={clsx(inputStyles.enhancer, overrides?.startEnhancerContainer?.className)}
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
                    {buttonText()}
                    {endEnhancer ? (
                        <div
                            {...overrides?.endEnhancerContainer}
                            className={clsx(inputStyles.enhancer, overrides?.endEnhancerContainer?.className)}
                            data-status={disabled ? 'disabled' : (status || 'default')}
                        >
                            {!!endEnhancer && (
                                <MemoizedEnhancer
                                    enhancer={endEnhancer}
                                    size={parseInt(pget('typography.styles.paragraphSmall.fontSize') || theme.typography.styles.paragraphSmall.fontSize, 10)}
                                />
                            )}
                        </div>
                    ) : (
                        <FontAwesomeIcon className={clsx(inputStyles.enhancer, styles.chevron)} data-status={disabled ? 'disabled' : (status || 'default')} width="10px" icon={faChevronDown} />
                    )}
                </Listbox.Button>
                <Transition
                    as="div"
                    enter={dropdownStyles.transition}
                    enterFrom={dropdownStyles.enterFrom}
                    enterTo={dropdownStyles.enterTo}
                    leave={dropdownStyles.transition}
                    leaveFrom={dropdownStyles.leaveFrom}
                    leaveTo={dropdownStyles.leaveTo}
                    className={styles.transitionContainer}
                >
                    <Listbox.Options
                        className={clsx(
                            overrides?.optionsContainer,
                            styles.options,
                        )}
                        style={{
                            '--options-maxHeight': `${maxHeight}px`,
                        } as CSSProperties}
                    >
                        {(options || []).map((option) => (
                            <Listbox.Option
                                key={option.id}
                                value={option.id}
                                data-selected={value && value.includes(option.id)}
                                className={clsx(
                                    overrides?.option,
                                    styles.option,
                                    hasOptionBorder && styles.optionBorder,
                                )}
                                disabled={option.disabled || false}
                            >
                                {typeof option.node === 'string' ? (
                                    <Text as="span" kind="paragraphSmall">
                                        {option.node}
                                    </Text>
                                ) : option.node}
                                {(value && value.includes(option.id)) && (
                                    <Icon icon={Check} size={12} />
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>
        </Field>
    );
});
