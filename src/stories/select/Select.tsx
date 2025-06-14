/* eslint-disable prefer-arrow-callback,func-names */

'use client';

import type {
    CSSProperties, ComponentPropsWithoutRef, ForwardedRef, ReactNode,
} from 'react';
import { forwardRef, useId } from 'react';
import {
    Listbox, ListboxButton, ListboxOptions, ListboxOption, RadioGroup, Radio, Transition,
} from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
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
import { Check, Icon } from '../icon';

export type Option<T = Record<string, any>> = {
    id: string,
    node: ReactNode,
    disabled?: boolean,
    metadata?: T,
};
export type CommonSelectProps<T = Record<string, any>> = {
    /**
     * The  {@link Option}s to render in the select box.
     *
     * Each option should have an id (`string`) and node ({@link ReactNode}) property at minimum. You can also pass in any other metadata through the `metadata` attribute.
     *
     * For type safety, you can pass in a type parameter to `SelectProps` component. This will be used as the type for the `metadata` property of each option.
     */
    options: Option<T>[];
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
     * Controls the height of the segment control. Only applicable to kind="segmented".
     * @default compact
     */
    segmentedHeight?: 'compact' | 'tall';
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

export type SingleSelectProps<T = Record<string, any>> = {
    /**
     * The option ID to render as selected in the select box.
     *
     * This should exactly match the option IDs passed in the `options` prop. If `null`, no option will be selected.
     */
    value?: Option<T>['id'] | null;
    /**
     * The interaction handler for the Select.
     */
    onChange?: (value: Option<T>['id'] | null) => void | Promise<void>;
    /**
     * The visual variant of the Select. `listbox` will render as a dropdown menu, `radio` will render as a radio group, `card` will render as selectable cards, and `segmented` will render as a segmented control.
     * @default listbox
     */
    kind?: 'listbox' | 'radio' | 'card' | 'segmented';
    multiple?: false;
    multipleItemsName?: never;
} & CommonSelectProps;

export type MultiSelectProps<T = Record<string, any>> = {
    /**
     * Controls the text of the Multiselect button when multiple items selected, such as "All ___" or "2 ___"
     * @default items
     */
    multipleItemsName?: string;
    /**
     * The visual variant of the Select. For multiselect, only `listbox` is supported.
     * @default listbox
     */
    kind?: 'listbox',
    /**
     * Converts the single select into a multiselect.
     */
    multiple: true;
    /**
     * For multiselect, should be a string[] that matches the option IDs passed in the `options` prop. If `null`, no option will be selected.
     */
    value?: Option<T>['id'][] | null;
    /**
     * The interaction handler for the Select.
     */
    onChange?: (value: Option<T>['id'][] | null) => void | Promise<void>;
} & CommonSelectProps;

type SelectProps<T = Record<string, any>> =
    | (SingleSelectProps<T>)
    | (MultiSelectProps<T>);

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
    descriptionPosition,
    placeholder,
    startEnhancer,
    endEnhancer,
    disabled,
    kind = 'listbox',
    maxHeight = 320,
    hasOptionBorder = false,
    multiple = false,
    multipleItemsName,
    segmentedHeight = 'compact',
    overrides,
}: SelectProps<T>, ref: ForwardedRef<any>) {
    const inputID = useId();
    const multiItems = multipleItemsName || 'items';
    const buttonText = () => {
        if (!value || value.length === 0) {
            return placeholder || 'Select an option';
        } if (!multiple) {
            return options?.find((o) => o.id === value)?.node;
        } if (value && value.length === 1) {
            return options?.find((o) => o.id === value[0])?.node;
        } if (value.length === options.length) {
            return `All ${multiItems}`;
        }
        return `${value.length} ${multiItems}`;
    };
    return (
        <Field
            htmlFor={inputID}
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
            {kind === 'listbox' && (
                <Listbox
                    as="div"
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    multiple={multiple}
                >
                    <ListboxButton
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
                    </ListboxButton>
                    <Transition
                        as="div"
                        className={dropdownStyles.transitionContainer}
                        enter={dropdownStyles.transition}
                        enterFrom={dropdownStyles.enterFrom}
                        enterTo={dropdownStyles.enterTo}
                        leave={dropdownStyles.transition}
                        leaveFrom={dropdownStyles.leaveFrom}
                        leaveTo={dropdownStyles.leaveTo}
                    >
                        <ListboxOptions
                            className={clsx(
                                overrides?.optionsContainer,
                                styles.options,
                            )}
                            style={{
                                '--options-maxHeight': `${maxHeight}px`,
                            } as CSSProperties}
                        >
                            {(options || []).map((option) => (
                                <ListboxOption
                                    key={option.id}
                                    value={option.id}
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
                                    <Icon icon={Check} size={12} className={styles.check} />
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Transition>
                </Listbox>
            )}
            {kind === 'radio' && (
                <RadioGroup ref={ref} as="div" className={styles.radioContainer} value={value} onChange={onChange}>
                    {options.map((option) => (
                        <Radio
                            as="div"
                            className={clsx(
                                styles.radioOption,
                            )}
                            key={option.id}
                            value={option.id}
                            disabled={option.disabled || false}
                            data-status={disabled ? 'disabled' : (status || 'default')}
                        >
                            <div className={styles.radioCircle} />
                            <TextWhenString kind="paragraphXSmall">
                                {option.node}
                            </TextWhenString>
                        </Radio>
                    ))}
                </RadioGroup>
            )}
            {kind === 'card' && (
                <RadioGroup ref={ref} as="div" className={styles.cardContainer} value={value} onChange={onChange}>
                    {options.map((option) => (
                        <Radio
                            as="div"
                            className={clsx(
                                styles.cardOption,
                            )}
                            key={option.id}
                            value={option.id}
                            disabled={option.disabled || false}
                            data-status={disabled ? 'disabled' : (status || 'default')}
                        >
                            <div className={clsx(styles.cardSurface, typeof option.node === 'string' && styles.text)}>
                                <TextWhenString kind="paragraphSmall">
                                    {option.node}
                                </TextWhenString>
                            </div>
                        </Radio>
                    ))}
                </RadioGroup>
            )}
            {kind === 'segmented' && (
                <RadioGroup ref={ref} as="div" className={styles.segmentedContainer} value={value || options[0].id} onChange={onChange}>
                    {options.map((option) => (
                        <Radio
                            as="div"
                            className={clsx(
                                styles.segmentedOption,
                                styles[segmentedHeight],
                            )}
                            key={option.id}
                            value={option.id}
                            disabled={option.disabled || false}
                            data-status={disabled ? 'disabled' : (status || 'default')}
                        >
                            {(option.id === value || (!value && option.id === options[0].id)) && (
                                <motion.div
                                    className={styles.segmentedBackground}
                                    layoutId={`${inputID}-segmented-selected`}
                                    transition={{
                                        ease: [0.42, 0.0, 0.58, 1.0],
                                        duration: 0.25,
                                    }}
                                />
                            )}
                            <TextWhenString kind="paragraphXSmall" weight="medium" className={styles.segmentedText}>
                                {option.node}
                            </TextWhenString>
                        </Radio>
                    ))}
                </RadioGroup>
            )}
        </Field>
    );
});
