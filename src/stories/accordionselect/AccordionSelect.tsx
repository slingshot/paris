'use client';

import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode, RefAttributes } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { useControllableState } from '../../helpers/useControllableState';
import { Check, ChevronRight, Icon } from '../icon';
import { TextWhenString } from '../utility';
import styles from './AccordionSelect.module.scss';

export type AccordionSelectOption<T extends Record<string, unknown> = Record<string, unknown>> = {
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

export type AccordionSelectProps<T extends Record<string, unknown> = Record<string, unknown>> = {
    /**
     * The list of selectable options.
     */
    options: AccordionSelectOption<T>[];
    /**
     * The currently selected option ID.
     */
    value?: string | null;
    /**
     * The initial selected option ID for uncontrolled mode. If `value` is provided, this is ignored.
     */
    defaultValue?: string | null;
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
const AccordionSelectInner = <T extends Record<string, unknown> = Record<string, unknown>>(
    {
        options,
        value,
        defaultValue,
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
    }: AccordionSelectProps<T>,
    ref: ForwardedRef<HTMLDivElement>,
): ReactNode => {
    const [open, setOpen] = useControllableState({
        value: controlledOpen,
        defaultValue: false,
        onChange: onOpenChange,
    });
    const rootRef = useRef<HTMLDivElement>(null);

    const [resolvedValue, setResolvedValue] = useControllableState<string | null>({
        value,
        defaultValue,
        onChange: (id) => {
            const option = options.find((o) => o.id === id);
            if (option) onChange?.(option);
        },
    });

    const selectedOption = options.find((o) => o.id === resolvedValue);

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
        headerContent = renderSelected ? renderSelected(selectedOption) : selectedOption.node;
    }

    return (
        <div
            ref={rootRef}
            {...overrides?.root}
            className={clsx(styles.root, open && styles.open, overrides?.root?.className)}
        >
            <div
                ref={ref}
                {...overrides?.header}
                className={clsx(styles.header, open && styles.open, overrides?.header?.className)}
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
                    <Icon icon={ChevronRight} size={16} className={clsx(styles.chevron, open && styles.open)} />
                </div>
            </div>

            {/*
             * Collapse animation uses the CSS grid-rows trick (`1fr` → `0fr`) instead
             * of animating `height: auto`. JS-driven height-auto animations (e.g.
             * framer-motion) flash an intermediate layout state on open/close that
             * causes scrollable ancestors to clamp `scrollTop` to 0 in the first
             * paint frame — visible as an instant scroll snap before the animation
             * starts. The grid-rows approach keeps the layout stable across the
             * entire transition.
             */}
            <div
                {...overrides?.dropdown}
                aria-hidden={!open}
                className={clsx(styles.dropdown, open && styles.open, overrides?.dropdown?.className)}
            >
                <div
                    {...overrides?.dropdownContent}
                    className={clsx(styles.dropdownContent, overrides?.dropdownContent?.className)}
                >
                    {options.map((option) => {
                        const isOptionSelected = option.id === resolvedValue;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                disabled={option.disabled || !open}
                                tabIndex={open ? undefined : -1}
                                data-selected={isOptionSelected}
                                {...overrides?.option}
                                className={clsx(styles.option, overrides?.option?.className)}
                                onClick={() => {
                                    setResolvedValue(option.id);
                                    if (closeOnSelect) setOpen(false);
                                }}
                            >
                                <div className={styles.optionContent}>
                                    {renderOption ? (
                                        renderOption(option, isOptionSelected)
                                    ) : (
                                        <TextWhenString kind="paragraphXSmall" weight="medium">
                                            {option.node}
                                        </TextWhenString>
                                    )}
                                </div>
                                {isOptionSelected && <Icon icon={Check} size={13} className={styles.check} />}
                            </button>
                        );
                    })}
                    {action}
                </div>
            </div>
        </div>
    );
};

/**
 * `forwardRef` erases the generic type parameter, so cast the result back to a generic function
 * type. This keeps `<AccordionSelect<MyMeta> />` working (typing `onChange`/`renderOption` with
 * `AccordionSelectOption<MyMeta>`) while still forwarding the ref to the header element.
 */
export const AccordionSelect = forwardRef(AccordionSelectInner) as unknown as (<
    T extends Record<string, unknown> = Record<string, unknown>,
>(
    props: AccordionSelectProps<T> & RefAttributes<HTMLDivElement>,
) => ReactNode) & { displayName?: string };

AccordionSelect.displayName = 'AccordionSelect';
