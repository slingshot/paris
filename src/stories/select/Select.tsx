'use client';

import type { FC, ReactNode } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import inputStyles from '../input/Input.module.scss';
import dropdownStyles from '../dropdown/Dropdown.module.scss';
import styles from './Select.module.scss';
import { Text } from '../text';

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
};

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
}: SelectProps<T>) {
    return (
        <div className={styles.container}>
            <Listbox
                value={value}
                onChange={onChange}
            >
                <Listbox.Button
                    className={clsx(
                        inputStyles.inputContainer,
                        styles.field,
                    )}
                >
                    {options?.find((o) => o.id === value)?.node || 'Select an option'}
                    <FontAwesomeIcon className={inputStyles.enhancer} width="10px" icon={faChevronDown} />
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
                            styles.options,
                        )}
                    >
                        {(options || []).map((option) => (
                            <Listbox.Option
                                key={option.id}
                                value={option.id}
                                data-selected={option.id === value}
                                className={clsx(
                                    styles.option,
                                )}
                            >
                                {typeof option.node === 'string' ? (
                                    <Text as="span" kind="paragraphSmall">{option.node}</Text>
                                ) : option.node}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>
        </div>
    );
}
