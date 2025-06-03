'use client';

import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import {
    useMemo, useId, useState,
} from 'react';
import {
    Combobox as HCombobox, ComboboxInput, ComboboxOptions, ComboboxOption, Transition,
} from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import inputStyles from '../input/Input.module.scss';
import dropdownStyles from '../utility/Dropdown.module.scss';
import styles from '../select/Select.module.scss';
import type { TextProps } from '../text';
import { Text } from '../text';
import type { InputProps } from '../input';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import { pget, pvar, theme } from '../theme';
import type { FieldProps } from '../field';
import { Field } from '../field';
import type { ButtonProps } from '../button';
import { Button } from '../button';
import { TextWhenString } from '../utility';
import { Check, Icon } from '../icon';

export type Option<T extends Record<string, any> = Record<string, any>> = {
    id: string,
    node: ReactNode,
    metadata?: T,
    category?: string,
    suggested?: boolean,
} | {
    id: null,
    node: string,
    metadata?: T,
    category?: string,
    suggested?: boolean,
};

export type ComboboxProps<T extends Record<string, any>> = {
    /**
     * The  {@link Option}s to render in the select box.
     *
     * Each option should have an id (`string`) and node ({@link ReactNode}) property at minimum. You can also pass in any other metadata through the `metadata` attribute.
     *
     * If you want to use categories, you can pass in a `category` property to each option. This should match one of the IDs in the `categories` prop.
     *
     * If you want to have a suggested section up top, you can pass in a `suggested` property to each option. These options will be rendered both in a separate section in the dropdown, in addition to the main list of options. This is useful for showing frequently used options at the top of the list.
     *
     * For type safety, you can pass in a type parameter to `ComboboxProps`. This will be used as the type for the `metadata` property of each option.
     */
    options: Option<T>[];
    /**
     * The option to render as selected in the select box.
     *
     * If `null`, no option will be selected.
     */
    value?: Option<T> | null;
    /**
     * The interaction handler for the Combobox. This will be called when the user selects an option from the dropdown.
     *
     * @param option - The selected option, or `null` if the user has cleared the selection.
     */
    onChange?: (option: Option<T> | null) => void | Promise<void>;
    /**
     * The interaction handler for when the user types in the input. The input is controlled internally, but you can use this to update the input value in your own state.
     * @param value - The current value of the input.
     */
    onInputChange?: (value: string) => void | Promise<void>;
    /**
     * Whether to allow the user to create a custom value.
     *
     * If `true`, the user will be able to type in a custom value. This will be passed to the `onChange` handler as an option with an ID of `null` and a `node` value containing the user's input as a string.
     * @default false
     */
    allowCustomValue?: boolean;
    /**
     * Whether to show the custom value option in the dropdown. This is irrelevant if `allowCustomValue` is `false`.
     * @default true
     */
    showCustomValueOption?: boolean;
    /**
     * The text to use for the custom creation option. This should include a `%v` placeholder, which will be replaced with the user's input.
     *
     * For example, if the user types in `foo` and this is set to "New %v", the custom value option will be rendered as `New "foo"`.
     * @default Create "%v"...
     */
    customValueString?: string;
    /**
     * A function that will be called to create an {@link Option} based on the user's custom typed query value. This is useful for adding custom styling by  allowing you to pass a custom `Option.node` based on the value. This overrides the `customValueString` prop.
     * @param value
     */
    customValueToOption?: (value: string) => Option<T>;
    /**
     * Whether to hide the clear button when a value is selected. This will never be hidden if the selected option's node is not a strong, because there is no other way to clear the value as of now.
     */
    hideClearButton?: boolean;
    /**
     * The size of the options dropdown, in pixels.
     */
    maxHeight?: number;
    /**
     * Adds a bottom border to the dropdown options.
     * @default false
     */
    hasOptionBorder?: boolean;
    /**
     * Whether the dropdown should open immediately when focused, vs only after starting to type.
     * @default false
     */
    hideOptionsInitially?: boolean;
    /**
     * Optional categories that will appear as headings in the dropdown. Make sure your options have a `category` property that matches one of the category IDs.
     *
     * Each option should have an id (`string`) and node ({@link ReactNode}) property at minimum. You can also pass in any other metadata through the `metadata` attribute.
     *
     * For type safety, you can pass in a type parameter to `ComboboxProps`. This will be used as the type for the `metadata` property of each option.
     */
    categories?: Option<T>[];
    /**
     * When categories are displayed, this label will be used for options that do not belong to any category. If some categories are provided, this will default to "Other." If no categories are provided, this will display if there is a suggested section, which will default this label to "All."
     * @default "Other" | "All"
     */
    uncategorizedLabel?: string;
    /**
     * The label for the suggested options section. This will be rendered at the top of the dropdown if any options have the `suggested` property set to `true`.
     * @default "Suggested"
     */
    suggestedLabel?: string;
    /**
     * Whether to hide the suggested section at the top, only applicable if options have the `suggested` prop.
     * @default false
     */
    hideSuggested?: boolean;
    /**
     * Prop overrides for other rendered elements. Overrides for the input itself should be passed directly to the component.
     */
    overrides?: {
        field?: FieldProps;
        container?: ComponentPropsWithoutRef<'div'>;
        inputContainer?: ComponentPropsWithoutRef<'div'>;
        input?: ComponentPropsWithoutRef<'input'>;
        optionsContainer?: ComponentPropsWithoutRef<'ul'>;
        option?: ComponentPropsWithoutRef<'li'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
        startEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
        endEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
        clearButton?: ButtonProps;
    }
} & Omit<InputProps, 'type' | 'overrides'>;

/**
 * A Combobox component is used to render a searchable select.
 *
 * When the selected option node is a string, the combobox will act like an input even when an option is selected, allowing users to edit the selected option directly in order to pick a new one. To circumvent this and make selected options non-editable, pass nodes that are `Text` components instead.
 *
 * When `allowCustomValue` is `true`, a custom value option will be added to the dropdown. This option's text can be customized by passing a value for `customValueString`, where `%v` within the string is the user's input. You can provide an entirely custom node through `renderCustomValueOption`. By default, `onChange` will be called for every input change when custom values are allowed.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Combobox } from 'paris/combobox';
 * ```
 * @constructor
 */
export function Combobox<T extends Record<string, any> = Record<string, any>>({
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
    onInputChange,
    allowCustomValue,
    showCustomValueOption = true,
    customValueString = 'Create "%v"',
    customValueToOption,
    hideClearButton = false,
    maxHeight = 320,
    hasOptionBorder = false,
    hideOptionsInitially = false,
    categories,
    uncategorizedLabel,
    suggestedLabel = 'Suggested',
    hideSuggested = false,
    overrides,
}: ComboboxProps<T>) {
    const inputID = useId();
    const [selectedID, setSelectedID] = useState<string | null>(value?.id || null);
    const [query, setQuery] = useState('');

    const optionsWithCustomValue = useMemo(() => ([
        ...((allowCustomValue && customValueToOption) ? [
            customValueToOption(query),
        ] : []),
        ...options,
    ]), [allowCustomValue, customValueToOption, options, query]);

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
            {...(overrides?.field ?? {})}
        >
            <HCombobox
                as="div"
                immediate={!hideOptionsInitially}
                value={selectedID}
                onChange={(id) => {
                    if (onChange) {
                        const sel = optionsWithCustomValue.find((o) => o.id === id);
                        if (sel) {
                            onChange(sel);
                            setSelectedID(sel.id);
                        } else if (id) {
                            onChange({
                                id: null,
                                node: id,
                            });
                        }
                    }
                }}
            >
                <div
                    data-status={disabled ? 'disabled' : (status || 'default')}
                    {...overrides?.inputContainer}
                    className={clsx(
                        overrides?.inputContainer?.className,
                        inputStyles.inputContainer,
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
                    <div className={styles.content}>
                        {(value?.node && typeof value.node !== 'string') ? value.node : (
                            <ComboboxInput
                                id={inputID}
                                {...overrides?.input}
                                placeholder={placeholder}
                                // value={query}
                                displayValue={() => value?.node as string}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (onInputChange) onInputChange(e.target.value);
                                    if (overrides?.input?.onChange) overrides.input.onChange(e);
                                    if (allowCustomValue && e.target.value) {
                                        onChange?.(customValueToOption?.(e.target.value) || {
                                            id: null,
                                            node: e.target.value,
                                        });
                                    }
                                }}
                                aria-disabled={disabled}
                                data-status={disabled ? 'disabled' : (status || 'default')}
                                className={clsx(
                                    overrides?.input?.className,
                                    inputStyles.input,
                                    styles.field,
                                )}
                            />
                        )}
                    </div>

                    {(!!value && (!hideClearButton || typeof value.node !== 'string')) && (
                        <Button
                            size="xs"
                            shape="circle"
                            startEnhancer={<FontAwesomeIcon icon={faClose} fontSize="10px" />}
                            onClick={() => {
                                if (onChange) {
                                    onChange(null);
                                }
                                setSelectedID(null);
                            }}
                            {...overrides?.clearButton}
                        >
                            Clear
                        </Button>
                    )}
                    {!!endEnhancer && (
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
                    )}
                </div>
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
                    <ComboboxOptions
                        as="ul"
                        {...overrides?.optionsContainer}
                        className={clsx(
                            overrides?.optionsContainer?.className,
                            styles.options,
                        )}
                        style={{
                            '--options-maxHeight': `${maxHeight}px`,
                            ...overrides?.optionsContainer?.style,
                        } as CSSProperties}
                    >
                        {(allowCustomValue && showCustomValueOption && !customValueToOption && query.length > 0) && (
                            <ComboboxOption
                                as="li"
                                value={query}
                                data-selected={false}
                                className={clsx(
                                    overrides?.option?.className,
                                    styles.option,
                                )}
                                {...overrides?.option}
                            >
                                <Text as="span" kind="paragraphSmall">
                                    {customValueString.replace('%v', query)}
                                </Text>
                            </ComboboxOption>
                        )}
                        {(optionsWithCustomValue || []).reduce((acc, option) => {
                            if (!hideSuggested && option.suggested) {
                                if (acc.length === 0) {
                                    acc.push(
                                        <div className={styles.category} key={`category-${suggestedLabel}`}>
                                            <TextWhenString as="span" kind="paragraphXSmall" color={pvar('new.colors.contentTertiary')}>
                                                {suggestedLabel}
                                            </TextWhenString>
                                        </div>,
                                    );
                                }
                                acc.push(
                                    <ComboboxOption
                                        as="li"
                                        key={`${option.id}-suggested`}
                                        value={option.id}
                                        {...overrides?.option}
                                        className={clsx(
                                            overrides?.option?.className,
                                            styles.option,
                                            styles.optionCategory,
                                            hasOptionBorder && styles.optionBorder,
                                        )}
                                    >
                                        <TextWhenString as="span" kind="paragraphSmall">
                                            {option.node}
                                        </TextWhenString>
                                        <Icon icon={Check} size={12} className={styles.check} />
                                    </ComboboxOption>,
                                );
                            }
                            return acc;
                        }, [] as any[]) || []}
                        {(categories && categories.length > 0) && (
                            categories.map((category) => (
                                <>
                                    {(optionsWithCustomValue || []).reduce((acc, option) => {
                                        if (option.category === category.id) {
                                            if (acc.length === 0) {
                                                acc.push(
                                                    <div className={styles.category} key={`category-${category.id}`}>
                                                        <TextWhenString as="span" kind="paragraphXSmall" color={pvar('new.colors.contentTertiary')}>
                                                            {category.node}
                                                        </TextWhenString>
                                                    </div>,
                                                );
                                            }
                                            acc.push(
                                                <ComboboxOption
                                                    as="li"
                                                    key={option.id}
                                                    value={option.id}
                                                    {...overrides?.option}
                                                    className={clsx(
                                                        overrides?.option?.className,
                                                        styles.option,
                                                        styles.optionCategory,
                                                        hasOptionBorder && styles.optionBorder,
                                                    )}
                                                >
                                                    <TextWhenString as="span" kind="paragraphSmall">
                                                        {option.node}
                                                    </TextWhenString>
                                                    <Icon icon={Check} size={12} className={styles.check} />
                                                </ComboboxOption>,
                                            );
                                        }
                                        return acc;
                                    }, [] as any[]) || []}
                                </>
                            ))
                        )}
                        {(optionsWithCustomValue || []).reduce((acc, option) => {
                            if (!option.category || !categories?.find((c) => c.id === option.category)) {
                                if (acc.length === 0 && (categories || options.find((o) => o.suggested))) {
                                    acc.push(
                                        <div className={styles.category} key="uncategorized-heading">
                                            <TextWhenString as="span" kind="paragraphXSmall" color={pvar('new.colors.contentTertiary')}>
                                                {uncategorizedLabel || categories ? 'Other' : 'All'}
                                            </TextWhenString>
                                        </div>,
                                    );
                                }
                                acc.push(
                                    <ComboboxOption
                                        as="li"
                                        key={option.id}
                                        value={option.id}
                                        {...overrides?.option}
                                        className={clsx(
                                            overrides?.option?.className,
                                            styles.option,
                                            (categories || options.find((o) => o.suggested)) && styles.optionCategory,
                                            hasOptionBorder && styles.optionBorder,
                                        )}
                                    >
                                        <TextWhenString as="span" kind="paragraphSmall">
                                            {option.node}
                                        </TextWhenString>
                                        <Icon icon={Check} size={12} className={styles.check} />
                                    </ComboboxOption>,
                                );
                            }
                            return acc;
                        }, [] as any[]) || []}
                    </ComboboxOptions>
                </Transition>
            </HCombobox>
        </Field>
    );
}
