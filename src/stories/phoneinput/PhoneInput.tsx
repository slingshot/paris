'use client';

import { clsx } from 'clsx';
import type { CountryCode } from 'libphonenumber-js/min';
import type { ChangeEvent, ComponentPropsWithoutRef, FocusEvent, ForwardedRef, ReactNode } from 'react';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FieldProps } from '../field';
import { Field } from '../field';
import inputStyles from '../input/Input.module.scss';
import type { TextProps } from '../text';
import { CountrySelect } from './CountrySelect';
import { buildCountryList } from './countries';
import styles from './PhoneInput.module.scss';
import { derivePhoneValue, formatDisplayValue, formatNationalDigits, parseE164, sanitizePhoneText } from './phone';

export type PhoneInputChangeMeta = {
    /** ISO region detected from the number (e.g. from a `+` prefix), falling back to the selected country. */
    country: CountryCode | undefined;
    /** Whether the current value is a fully valid phone number. Gate submissions on this. */
    isValid: boolean;
    /** The national (significant) digits as currently entered, without calling code or formatting. */
    nationalValue: string;
};

export type PhoneInputProps = {
    /**
     * This is required for accessibility. If the label is not a string, you should provide an `aria-label` prop directly to specify the text used for accessibility.
     */
    label: ReactNode;
    /**
     * The value in E.164 format (e.g. `"+14155552671"`) for controlled usage. `null`, `undefined`,
     * and `""` all render an empty input, so a `react-hook-form` field can be spread in directly.
     *
     * Passing the prop at all — even as `undefined` — puts the component in controlled mode.
     *
     * The displayed text is managed internally (sanitized while typing, formatted to national format on blur); only the E.164 value is controllable.
     */
    value?: string | null;
    /** The initial E.164 value for uncontrolled usage. Ignored when `value` is provided. */
    defaultValue?: string | null;
    /**
     * Fires on every input or country change. The first argument is the field value: the best-effort
     * E.164 string — partial while typing (e.g. `"+1415"`), `null` when empty — followed by metadata
     * for validation.
     */
    onChange?: (value: string | null, meta: PhoneInputChangeMeta) => void | Promise<void>;
    /**
     * The country selected when no value dictates one. Should be included in `countries` when an allowlist is provided.
     * @default 'US'
     */
    defaultCountry?: CountryCode;
    /** Restricts the selectable country list. Defaults to all regions known to libphonenumber. */
    countries?: CountryCode[];
    /**
     * Countries pinned to the top of the dropdown, in the given order.
     * @default [defaultCountry]
     */
    priorityCountries?: CountryCode[];
    /** Fires when the selected country changes, via the dropdown or a typed/pasted `+` prefix. */
    onCountryChange?: (country: CountryCode) => void;
    /**
     * The max height of the scrollable country list in the dropdown, in pixels.
     * @default 320
     */
    maxHeight?: number;
    /**
     * The status of the input field.
     * @default default
     */
    status?: 'default' | 'error' | 'success';
    /** BCP 47 locale for country display names in the dropdown. Defaults to the runtime locale. */
    locale?: string;
    /**
     * Prop overrides for other rendered elements. Overrides for the input itself should be passed directly to the component.
     */
    overrides?: {
        container?: ComponentPropsWithoutRef<'div'>;
        countryButton?: ComponentPropsWithoutRef<'button'>;
        searchInput?: ComponentPropsWithoutRef<'input'>;
        optionsContainer?: ComponentPropsWithoutRef<'div'>;
        option?: ComponentPropsWithoutRef<'li'>;
        label?: TextProps<'label'>;
        description?: TextProps<'p'>;
    };
} & FieldProps &
    Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'children'>;

/**
 * A `PhoneInput` collects phone numbers with a searchable country selector. The value is always
 * E.164 (`"+14155552671"`) — ready for form state — while the display is sanitized as the user
 * types and formatted to the country's national format on blur.
 *
 * > `overrides` available: `container`, `countryButton`, `searchInput`, `optionsContainer`, `option`, `label`, `description`
 *
 * <hr />
 *
 * To use the `PhoneInput` component, import it as follows:
 *
 * ```js
 * import { PhoneInput } from 'paris/phoneinput';
 * ```
 * @constructor
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    (allProps: PhoneInputProps, ref: ForwardedRef<HTMLInputElement>) => {
        const {
            label,
            value: valueProp,
            defaultValue,
            onChange,
            defaultCountry = 'US',
            countries,
            priorityCountries,
            onCountryChange,
            status,
            locale,
            maxHeight,
            hideLabel,
            description,
            hideDescription,
            descriptionPosition,
            disabled,
            overrides,
            onBlur,
            autoComplete,
            ...props
        } = allProps;

        // Presence of the prop — not its value — decides controlled mode, so a `react-hook-form`
        // field whose value is `undefined` before the first edit (or after a reset) still clears.
        const isControlled = 'value' in allProps;
        const value = valueProp || null;

        const inputID = useId();
        const innerRef = useRef<HTMLInputElement | null>(null);

        const countryList = useMemo(
            () => buildCountryList({ countries, priorityCountries: priorityCountries ?? [defaultCountry], locale }),
            [countries, priorityCountries, defaultCountry, locale],
        );
        const allowedCodes = useMemo(() => new Set(countryList.map((entry) => entry.code)), [countryList]);

        const initialValue = isControlled ? value : defaultValue || null;

        const [country, setCountry] = useState<CountryCode>(
            () => (initialValue ? parseE164(initialValue).country : undefined) ?? defaultCountry,
        );
        const [displayValue, setDisplayValue] = useState<string>(() =>
            initialValue ? parseE164(initialValue).display : '',
        );
        const lastEmittedE164 = useRef<string | null>(initialValue);

        // Sync external controlled-value updates (e.g. a form reset) without clobbering the
        // display mid-edit: only re-derive when the incoming value differs from what we emitted.
        useEffect(() => {
            if (!isControlled) return;
            if (value === lastEmittedE164.current) return;
            lastEmittedE164.current = value;
            if (!value) {
                setDisplayValue('');
                return;
            }
            const parsed = parseE164(value);
            if (parsed.country) setCountry(parsed.country);
            setDisplayValue(parsed.display);
        }, [value, isControlled]);

        const selectedEntry = countryList.find((entry) => entry.code === country) ?? countryList[0];

        const emitValue = (text: string, forCountry: CountryCode) => {
            const derived = derivePhoneValue(text, forCountry);
            lastEmittedE164.current = derived.e164;
            onChange?.(derived.e164, {
                country: derived.country,
                isValid: derived.isValid,
                nationalValue: derived.nationalValue,
            });
            return derived;
        };

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const sanitized = sanitizePhoneText(e.target.value);
            setDisplayValue(sanitized);
            const derived = emitValue(sanitized, country);
            // A typed/pasted "+<calling code>" overrides the selected country.
            if (
                sanitized.startsWith('+') &&
                derived.country &&
                derived.country !== country &&
                allowedCodes.has(derived.country)
            ) {
                setCountry(derived.country);
                onCountryChange?.(derived.country);
            }
        };

        const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
            if (displayValue) setDisplayValue(formatDisplayValue(displayValue, country));
            onBlur?.(e);
        };

        const handleCountrySelect = (next: CountryCode) => {
            if (next === country) return;
            setCountry(next);
            onCountryChange?.(next);
            const digits = derivePhoneValue(displayValue, country).nationalValue;
            const display = digits ? formatNationalDigits(digits, next) : '';
            setDisplayValue(display);
            emitValue(display, next);
        };

        const setInputRef = (node: HTMLInputElement | null) => {
            innerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        };

        const fieldStatus = disabled ? 'disabled' : status || 'default';

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
                <div className={clsx(inputStyles.inputContainer, styles.phoneContainer)} data-status={fieldStatus}>
                    <CountrySelect
                        countryList={countryList}
                        selected={selectedEntry}
                        onSelect={handleCountrySelect}
                        focusOnCloseRef={innerRef}
                        disabled={disabled}
                        status={status}
                        maxHeight={maxHeight}
                        overrides={{
                            countryButton: overrides?.countryButton,
                            searchInput: overrides?.searchInput,
                            optionsContainer: overrides?.optionsContainer,
                            option: overrides?.option,
                        }}
                    />
                    <div className={styles.divider} aria-hidden />
                    <div className={inputStyles.inputScaleWrapper}>
                        <input
                            {...props}
                            id={inputID}
                            ref={setInputRef}
                            type="tel"
                            autoComplete={autoComplete ?? 'tel'}
                            value={displayValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-label={typeof label === 'string' ? label : props['aria-label']}
                            aria-describedby={`${inputID}-description`}
                            aria-disabled={disabled}
                            data-status={fieldStatus}
                            readOnly={disabled}
                            className={clsx(props.className, inputStyles.input)}
                        />
                    </div>
                </div>
            </Field>
        );
    },
);
