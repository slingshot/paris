'use client';

import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { useId, useState } from 'react';
import { Combobox as HCombobox, Transition } from '@headlessui/react';
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
import { pget, theme } from '../theme';
import { Field } from '../field';
import { Button } from '../button';

export type Option<T extends Record<string, any> = Record<string, any>> = {
    id: string,
    node: ReactNode,
    metadata?: T,
} | {
    id: null,
    node: string,
    metadata?: T,
};

export type ComboboxProps<T extends Record<string, any>> = {
    /**
     * The  {@link Option}s to render in the select box.
     *
     * Each option should have an id (`string`) and node ({@link ReactNode}) property at minimum. You can also pass in any other metadata through the `metadata` attribute.
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
     * The text to use for the custom creation option. This should include a `%v` placeholder, which will be replaced with the user's input.
     *
     * For example, if the user types in `foo` and this is set to "New %v", the custom value option will be rendered as `New "foo"`.
     * @default Create "%v"...
     */
    customValueString?: string;
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
     * Prop overrides for other rendered elements. Overrides for the input itself should be passed directly to the component.
     */
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        input?: ComponentPropsWithoutRef<'input'>;
        optionsContainer?: ComponentPropsWithoutRef<'div'>;
        option?: ComponentPropsWithoutRef<'div'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
        startEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
        endEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
    }
} & Omit<InputProps, 'type' | 'overrides'>;

/**
 * A Combobox component is used to render a searchable select.
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
    placeholder,
    startEnhancer,
    endEnhancer,
    disabled,
    onInputChange,
    allowCustomValue,
    customValueString = 'Create "%v"',
    maxHeight = 320,
    hasOptionBorder = false,
    overrides,
}: ComboboxProps<T>) {
    const inputID = useId();
    const [selectedID, setSelectedID] = useState<string | null>(value?.id || null);
    const [query, setQuery] = useState('');

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
            <HCombobox
                as="div"
                value={selectedID}
                onChange={(id) => {
                    if (onChange) {
                        const sel = options.find((o) => o.id === id);
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
                    className={inputStyles.inputContainer}
                    data-status={disabled ? 'disabled' : (status || 'default')}
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
                        {value ? value.node : (
                            <HCombobox.Input
                                id={inputID}
                                {...overrides?.input}
                                placeholder={placeholder}
                                // value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (onInputChange) onInputChange(e.target.value);
                                    if (overrides?.input?.onChange) overrides.input.onChange(e);
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
                    {!!value && (
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
                    enter={dropdownStyles.transition}
                    enterFrom={dropdownStyles.enterFrom}
                    enterTo={dropdownStyles.enterTo}
                    leave={dropdownStyles.transition}
                    leaveFrom={dropdownStyles.leaveFrom}
                    leaveTo={dropdownStyles.leaveTo}
                >
                    <HCombobox.Options
                        className={clsx(
                            overrides?.optionsContainer,
                            styles.options,
                        )}
                        style={{
                            '--options-maxHeight': `${maxHeight}px`,
                        } as CSSProperties}
                    >
                        {(allowCustomValue && query.length > 0) && (
                            <HCombobox.Option
                                value={query}
                                data-selected={false}
                                className={clsx(
                                    overrides?.option,
                                    styles.option,
                                )}
                            >
                                <Text as="span" kind="paragraphSmall">
                                    {customValueString.replace('%v', query)}
                                </Text>
                            </HCombobox.Option>
                        )}
                        {(options || []).map((option) => (
                            <HCombobox.Option
                                key={option.id}
                                value={option.id}
                                data-selected={option.id === value}
                                className={clsx(
                                    overrides?.option,
                                    styles.option,
                                    hasOptionBorder && styles.optionBorder,
                                )}
                            >
                                {typeof option.node === 'string' ? (
                                    <Text as="span" kind="paragraphSmall">
                                        {option.node}
                                    </Text>
                                ) : option.node}
                            </HCombobox.Option>
                        ))}
                    </HCombobox.Options>
                </Transition>
            </HCombobox>
        </Field>
    );
}
