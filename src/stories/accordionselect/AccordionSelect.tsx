'use client';

import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import {
    useCallback, useEffect, useRef, useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { Check, ChevronRight, Icon } from '../icon';
import { TextWhenString } from '../utility';
import styles from './AccordionSelect.module.scss';

export type AccordionSelectOption<T = Record<string, unknown>> = {
    /**
     * A unique identifier for the option.
     */
    id: string;
    /**
     * The content to render for this option.
     */
    node: ReactNode;
    /**
     * Whether this option is disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * Optional metadata associated with the option.
     */
    metadata?: T;
};

export type AccordionSelectProps<T = Record<string, unknown>> = {
    /**
     * The list of selectable options.
     */
    options: AccordionSelectOption<T>[];
    /**
     * The currently selected option ID.
     */
    value?: string | null;
    /**
     * Called when the user selects an option.
     */
    onChange?: (option: AccordionSelectOption<T>) => void;
    /**
     * Custom content to render as the header when an option is selected.
     * Receives the selected option. If not provided, the option's `node` is used.
     */
    renderSelected?: (option: AccordionSelectOption<T>) => ReactNode;
    /**
     * Custom content to render for each option in the dropdown.
     * Receives the option and whether it's selected. If not provided, the option's `node` is used.
     */
    renderOption?: (option: AccordionSelectOption<T>, isSelected: boolean) => ReactNode;
    /**
     * Placeholder to show when no option is selected.
     * @default 'Select an option'
     */
    placeholder?: ReactNode;
    /**
     * Whether the accordion is open. If provided, the component becomes controlled.
     */
    isOpen?: boolean;
    /**
     * Called when the open state changes.
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Whether to close the accordion when an option is selected.
     * @default true
     */
    closeOnSelect?: boolean;
    /**
     * Whether to close the accordion when clicking outside.
     * @default true
     */
    closeOnClickOutside?: boolean;
    /**
     * Optional action to render at the bottom of the options list (e.g. "Add new" button).
     */
    action?: ReactNode;
    /**
     * Optional label to display on the header (e.g. a Tag).
     */
    label?: ReactNode;
    /**
     * Optional overrides for nested components.
     */
    overrides?: {
        root?: ComponentPropsWithoutRef<'div'>;
        header?: ComponentPropsWithoutRef<'div'>;
        dropdown?: ComponentPropsWithoutRef<'div'>;
        dropdownContent?: ComponentPropsWithoutRef<'div'>;
        option?: ComponentPropsWithoutRef<'button'>;
    };
};

/**
 * An AccordionSelect component. Displays the selected option in a card header that expands to reveal all options.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { AccordionSelect } from 'paris/accordionselect';
 * ```
 * @constructor
 */
export const AccordionSelect: FC<AccordionSelectProps> = ({
    options,
    value,
    onChange,
    renderSelected,
    renderOption,
    placeholder = 'Select an option',
    isOpen: controlledOpen,
    onOpenChange,
    closeOnSelect = true,
    closeOnClickOutside = true,
    action,
    label,
    overrides,
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen ?? internalOpen;
    const rootRef = useRef<HTMLDivElement>(null);

    const setOpen = useCallback((nextOpen: boolean) => {
        setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
    }, [onOpenChange]);

    const selectedOption = options.find((o) => o.id === value);

    useEffect(() => {
        if (!closeOnClickOutside || !open) {
            return () => {};
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeOnClickOutside, open, setOpen]);

    let headerContent: ReactNode = placeholder;
    if (selectedOption) {
        headerContent = renderSelected
            ? renderSelected(selectedOption)
            : selectedOption.node;
    }

    return (
        <div
            ref={rootRef}
            {...overrides?.root}
            className={clsx(
                styles.root,
                open && styles.open,
                overrides?.root?.className,
            )}
        >
            <div
                {...overrides?.header}
                className={clsx(
                    styles.header,
                    open && styles.open,
                    overrides?.header?.className,
                )}
                onClick={() => setOpen(!open)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen(!open);
                    }
                }}
                role="button"
                tabIndex={0}
            >
                <div className={styles.headerContent}>
                    <TextWhenString kind="paragraphSmall" weight="medium">
                        {headerContent}
                    </TextWhenString>
                </div>
                <div className={styles.headerEnd}>
                    {label}
                    <Icon
                        icon={ChevronRight}
                        size={16}
                        className={clsx(styles.chevron, open && styles.open)}
                    />
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.87, 0, 0.13, 1],
                        }}
                        className={clsx(
                            styles.dropdown,
                            overrides?.dropdown?.className,
                        )}
                    >
                        <div
                            {...overrides?.dropdownContent}
                            className={clsx(
                                styles.dropdownContent,
                                overrides?.dropdownContent?.className,
                            )}
                        >
                            {options.map((option) => {
                                const isOptionSelected = option.id === value;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        disabled={option.disabled}
                                        data-selected={isOptionSelected}
                                        {...overrides?.option}
                                        className={clsx(
                                            styles.option,
                                            overrides?.option?.className,
                                        )}
                                        onClick={() => {
                                            onChange?.(option);
                                            if (closeOnSelect) setOpen(false);
                                        }}
                                    >
                                        <div className={styles.optionContent}>
                                            {renderOption
                                                ? renderOption(option, isOptionSelected)
                                                : (
                                                    <TextWhenString kind="paragraphXSmall" weight="medium">
                                                        {option.node}
                                                    </TextWhenString>
                                                )}
                                        </div>
                                        {isOptionSelected && (
                                            <Icon icon={Check} size={13} />
                                        )}
                                    </button>
                                );
                            })}
                            {action}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
