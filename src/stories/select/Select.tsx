'use client';

import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useId } from 'react';
import inputStyles from '../input/Input.module.scss';
import dropdownStyles from '../dropdown/Dropdown.module.scss';
import styles from './Select.module.scss';
import type { TextProps } from '../text';
import { Text } from '../text';
import type { InputProps } from '../input';
import { MemoizedEnhancer } from '../../helpers/renderEnhancer';
import { pget, theme } from '../theme';
import { Field } from '../field';

export type Option<T = Record<string, any>> = {
    id: string,
    node: ReactNode,
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
    value?: string | null;
    /**
     * The interaction handler for the Select.
     */
    onChange?: (value: string | null) => void | Promise<void>;
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
export function Select<T = Record<string, any>>({
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
    overrides,
}: SelectProps<T>) {
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
            <Listbox
                as="div"
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
        </Field>
    );
}
