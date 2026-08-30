'use client';

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Combobox as HCombobox,
} from '@headlessui/react';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, CSSProperties, FocusEventHandler, MouseEvent, ReactNode, Ref } from 'react';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { OpenChangeEffect } from '../../helpers/OpenChangeEffect';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import { useControllableState } from '../../helpers/useControllableState';
import type { ButtonProps } from '../button';
import { Button } from '../button';
import type { FieldProps } from '../field';
import { Field } from '../field';
import type { InputProps } from '../input';
import inputStyles from '../input/Input.module.scss';
import styles from '../select/Select.module.scss';
import type { TextProps } from '../text';
import { Text } from '../text';
import { pget, theme } from '../theme';
import { TextWhenString } from '../utility';

export type Option<T extends Record<string, unknown> = Record<string, unknown>, Id extends string = string> =
    | {
          id: Id;
          node: ReactNode;
          metadata?: T;
      }
    | {
          id: null;
          node: string;
          metadata?: T;
      };

/**
 * The field value of a `Combobox`: an option `id`, or — when `allowCustomValue` is set — whatever
 * text the user typed. The `string & {}` member admits that free text without collapsing a literal
 * `Id` union, so literal ids keep their narrowing and autocomplete.
 */
export type ComboboxValue<Id extends string = string> = Id | (string & {}) | null;

/**
 * An {@link Option} standing in for a custom typed value. Its `id` is `null`, which is what marks
 * the option as custom and keeps the typed text — not an id — as the field value.
 */
export type CustomOption<T extends Record<string, unknown> = Record<string, unknown>> = Extract<
    Option<T>,
    { id: null }
>;

export type ComboboxProps<T extends Record<string, unknown>, Id extends string = string> = {
    /**
     * The  {@link Option}s to render in the select box.
     *
     * Each option should have an id (`string`) and node ({@link ReactNode}) property at minimum. You can also pass in any other metadata through the `metadata` attribute.
     *
     * For type safety, you can pass in a type parameter to `ComboboxProps`. This will be used as the type for the `metadata` property of each option.
     */
    options: Option<T, Id>[];
    /**
     * The id of the option to render as selected. With `allowCustomValue`, an id matching no option
     * is treated as custom text and displayed as typed.
     *
     * If `null`, no option will be selected.
     */
    value?: ComboboxValue<Id>;
    /**
     * The initial value for uncontrolled mode. If `value` is provided, this is ignored.
     */
    defaultValue?: ComboboxValue<Id>;
    /**
     * The option to display when `options` cannot resolve the current `value` — for async or
     * filtered option lists, such as a prefilled form whose options have not loaded yet.
     *
     * Ignored whenever `options` contains a match, and only consulted when its `id` equals the
     * current value, so it can never show a selection the value has moved away from.
     */
    selectedOption?: Option<T, Id>;
    /**
     * The interaction handler for the Combobox. This will be called when the user selects an option
     * from the dropdown, types a custom value, or clears the selection.
     *
     * @param value - The field value: the selected option's `id`, the typed text for a custom value, or `null` when the selection is cleared.
     * @param option - The selected option, or `null` when the selection is cleared.
     */
    onChange?: (value: ComboboxValue<Id>, option: Option<T, Id> | null) => void | Promise<void>;
    /**
     * The form field name, set on the underlying `<input>`.
     */
    name?: string;
    /**
     * Fires when the underlying `<input>` loses focus. Not called while a non-string selected node
     * replaces the input.
     */
    onBlur?: FocusEventHandler<HTMLInputElement>;
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
     * A function that will be called to create a {@link CustomOption} based on the user's custom typed query value. This lets you set the option's label text and `metadata` from the value. This overrides the `customValueString` prop.
     *
     * The returned option's `id` is always `null`: a custom value's field value is the text the user typed, not an id.
     * @param value
     */
    customValueToOption?: (value: string) => CustomOption<T>;
    /**
     * Called when the combobox dropdown opens or closes.
     */
    onOpenChange?: (open: boolean) => void;
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
     * Prop overrides for other rendered elements. Overrides for the input itself should be passed directly to the component.
     */
    overrides?: {
        field?: FieldProps;
        container?: ComponentPropsWithoutRef<'div'>;
        inputContainer?: ComponentPropsWithoutRef<'div'>;
        input?: ComponentPropsWithoutRef<'input'>;
        optionsContainer?: ComponentPropsWithoutRef<'ul'>;
        option?: ComponentPropsWithoutRef<'li'>;
        customValueOption?: ComponentPropsWithoutRef<'li'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
        startEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
        endEnhancerContainer?: ComponentPropsWithoutRef<'div'>;
        clearButton?: ButtonProps;
    };
    /**
     * Ref forwarded to the underlying combobox `<input>` element. Lets form libraries (e.g.
     * react-hook-form's `field.ref` / `setFocus`) focus the combobox when its field is invalid.
     */
    ref?: Ref<HTMLInputElement>;
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
export function Combobox<T extends Record<string, unknown> = Record<string, unknown>, Id extends string = string>({
    options,
    value,
    defaultValue,
    selectedOption,
    onChange,
    name,
    onBlur,
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
    onOpenChange,
    hideClearButton = false,
    maxHeight = 320,
    hasOptionBorder = false,
    hideOptionsInitially = false,
    overrides,
    ref,
}: ComboboxProps<T, Id>) {
    const inputID = useId();

    // The last option the user picked, so a selection survives `options` reloading or filtering.
    const lastSelectedRef = useRef<Option<T, Id> | null>(null);

    // Fallbacks are keyed by id — they resolve only the value they were recorded for, so a reset or
    // an externally changed value can never resurrect a stale selection.
    const optionForValue = useCallback(
        (next: ComboboxValue<Id>): Option<T, Id> | null => {
            if (next === null || next === undefined) return null;
            const match = options.find((o) => o.id === next);
            if (match) return match;
            if (lastSelectedRef.current?.id === next) return lastSelectedRef.current;
            if (selectedOption?.id === next) return selectedOption;
            if (!allowCustomValue) return null;
            return customValueToOption?.(next) ?? { id: null, node: next };
        },
        [options, selectedOption, allowCustomValue, customValueToOption],
    );

    const [resolvedID, setResolvedID] = useControllableState<ComboboxValue<Id>>({
        value,
        defaultValue,
        onChange: (next) => onChange?.(next ?? null, optionForValue(next)),
    });
    const resolvedValue = useMemo(() => optionForValue(resolvedID), [optionForValue, resolvedID]);
    const [query, setQuery] = useState('');
    const containerElRef = useRef<HTMLElement | null>(null);
    const inputElRef = useRef<HTMLElement | null>(null);
    const [anchorOffset, setAnchorOffset] = useState(0);

    const containerRef = useCallback((node: HTMLButtonElement | null) => {
        containerElRef.current = node;
    }, []);

    const inputRef = useCallback((node: HTMLInputElement | null) => {
        inputElRef.current = node;
    }, []);

    // The text input only renders when the selected node is a string/empty; a non-string node
    // (e.g. a <Text> element) replaces it, unmounting the input and nulling its ref. Forward the
    // external ref to whichever focusable element is currently mounted — the input, or the
    // always-mounted container — so react-hook-form's `setFocus` works in both states.
    const showInput = !(resolvedValue?.node && typeof resolvedValue.node !== 'string');
    useEffect(() => {
        if (!ref) return;
        const target = (showInput ? inputElRef.current : containerElRef.current) as HTMLInputElement | null;
        if (typeof ref === 'function') {
            ref(target);
        } else {
            ref.current = target;
        }
    }, [ref, showInput]);

    useLayoutEffect(() => {
        if (containerElRef.current && inputElRef.current) {
            const containerLeft = containerElRef.current.getBoundingClientRect().left;
            const inputLeft = inputElRef.current.getBoundingClientRect().left;
            setAnchorOffset(containerLeft - inputLeft);
        }
    }, [startEnhancer, resolvedValue]);

    const optionsWithCustomValue = useMemo(
        () => [...(allowCustomValue && customValueToOption ? [customValueToOption(query)] : []), ...options],
        [allowCustomValue, customValueToOption, options, query],
    );

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
                value={resolvedValue?.id ?? null}
                onChange={(id) => {
                    const sel = optionsWithCustomValue.find((o) => o.id === id);
                    // A custom option carries `id: null`; its field value is the text the user typed.
                    if (sel) {
                        if (sel.id !== null) lastSelectedRef.current = sel;
                        setResolvedID(sel.id ?? query);
                    } else if (id) {
                        setResolvedID(id);
                    }
                }}
            >
                {({ open }) => (
                    <>
                        <OpenChangeEffect open={open} onOpenChange={onOpenChange} />
                        <ComboboxButton
                            as="div"
                            ref={containerRef}
                            tabIndex={-1}
                            data-status={disabled ? 'disabled' : status || 'default'}
                            {...overrides?.inputContainer}
                            className={clsx(overrides?.inputContainer?.className, inputStyles.inputContainer)}
                        >
                            {!!startEnhancer && (
                                <div
                                    {...overrides?.startEnhancerContainer}
                                    className={clsx(inputStyles.enhancer, overrides?.startEnhancerContainer?.className)}
                                    data-status={disabled ? 'disabled' : status || 'default'}
                                >
                                    {!!startEnhancer && (
                                        <MemoizedEnhancer
                                            enhancer={startEnhancer}
                                            size={parseInt(
                                                pget('typography.styles.paragraphSmall.fontSize') ||
                                                    theme.typography.styles.paragraphSmall.fontSize,
                                                10,
                                            )}
                                        />
                                    )}
                                </div>
                            )}
                            <div className={styles.content}>
                                {resolvedValue?.node && typeof resolvedValue.node !== 'string' ? (
                                    resolvedValue.node
                                ) : (
                                    <ComboboxInput
                                        ref={inputRef}
                                        id={inputID}
                                        name={name}
                                        {...overrides?.input}
                                        placeholder={placeholder}
                                        // value={query}
                                        displayValue={() => resolvedValue?.node as string}
                                        onClick={(e: MouseEvent<HTMLInputElement>) => {
                                            e.stopPropagation();
                                            overrides?.input?.onClick?.(e);
                                        }}
                                        onKeyDown={(e) => {
                                            e.stopPropagation();
                                            overrides?.input?.onKeyDown?.(e);
                                        }}
                                        onBlur={(e) => {
                                            onBlur?.(e);
                                            overrides?.input?.onBlur?.(e);
                                        }}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            if (onInputChange) onInputChange(e.target.value);
                                            if (overrides?.input?.onChange) overrides.input.onChange(e);
                                            // Emptying the input clears the field value rather than
                                            // leaving the last custom text behind.
                                            if (allowCustomValue) {
                                                setResolvedID(e.target.value || null);
                                            }
                                        }}
                                        aria-disabled={disabled}
                                        data-status={disabled ? 'disabled' : status || 'default'}
                                        className={clsx(overrides?.input?.className, inputStyles.input, styles.field)}
                                    />
                                )}
                            </div>

                            {!!resolvedValue && (!hideClearButton || typeof resolvedValue.node !== 'string') && (
                                <Button
                                    size="xs"
                                    shape="circle"
                                    startEnhancer={<FontAwesomeIcon icon={faClose} fontSize="10px" />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setResolvedID(null);
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
                                    data-status={disabled ? 'disabled' : status || 'default'}
                                >
                                    {!!endEnhancer && (
                                        <MemoizedEnhancer
                                            enhancer={endEnhancer}
                                            size={parseInt(
                                                pget('typography.styles.paragraphSmall.fontSize') ||
                                                    theme.typography.styles.paragraphSmall.fontSize,
                                                10,
                                            )}
                                        />
                                    )}
                                </div>
                            )}
                        </ComboboxButton>
                        <ComboboxOptions
                            as="ul"
                            anchor={{
                                to: 'bottom start',
                                gap: 9,
                                offset: anchorOffset,
                            }}
                            transition
                            {...overrides?.optionsContainer}
                            className={clsx(overrides?.optionsContainer?.className, styles.options)}
                            style={
                                {
                                    // Headless UI's anchor logic writes an inline
                                    // `max-height: min(var(--anchor-max-height, 100vh), <available space>)`
                                    // on the panel, which wins over any class-based cap.
                                    '--anchor-max-height': `${maxHeight}px`,
                                    ...overrides?.optionsContainer?.style,
                                } as CSSProperties
                            }
                        >
                            {allowCustomValue && showCustomValueOption && !customValueToOption && query.length > 0 && (
                                <ComboboxOption
                                    as="li"
                                    value={query}
                                    data-selected={false}
                                    className={clsx(overrides?.customValueOption?.className, styles.option)}
                                    {...overrides?.customValueOption}
                                >
                                    <Text as="span" kind="paragraphSmall">
                                        {customValueString.replace('%v', query)}
                                    </Text>
                                </ComboboxOption>
                            )}
                            {(optionsWithCustomValue || []).map((option) => (
                                <ComboboxOption
                                    as="li"
                                    key={option.id}
                                    value={option.id}
                                    {...overrides?.option}
                                    className={clsx(
                                        overrides?.option?.className,
                                        styles.option,
                                        hasOptionBorder && styles.optionBorder,
                                    )}
                                >
                                    <TextWhenString as="span" kind="paragraphSmall">
                                        {option.node}
                                    </TextWhenString>
                                </ComboboxOption>
                            ))}
                        </ComboboxOptions>
                    </>
                )}
            </HCombobox>
        </Field>
    );
}
