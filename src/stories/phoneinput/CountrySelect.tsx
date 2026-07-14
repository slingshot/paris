'use client';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { clsx } from 'clsx';
import type { CountryCode } from 'libphonenumber-js/min';
import type { ComponentPropsWithoutRef, CSSProperties, FC, RefObject } from 'react';
import { useId, useMemo, useState } from 'react';
import { OpenChangeEffect } from '../../helpers/OpenChangeEffect';
import { Check, Icon } from '../icon';
import selectStyles from '../select/Select.module.scss';
import { Text } from '../text';
import type { CountryEntry } from './countries';
import { filterCountries } from './countries';
import styles from './PhoneInput.module.scss';

export type CountrySelectProps = {
    /** The selectable countries, already allowlisted and priority-ordered. */
    countryList: CountryEntry[];
    /** The currently selected country entry. */
    selected: CountryEntry;
    onSelect: (country: CountryCode) => void;
    /** Element to focus when the dropdown closes after a selection (the tel input). */
    focusOnCloseRef?: RefObject<HTMLInputElement | null>;
    disabled?: boolean;
    status?: 'default' | 'error' | 'success';
    /**
     * The max height of the scrollable country list, in pixels.
     * @default 320
     */
    maxHeight?: number;
    overrides?: {
        countryButton?: ComponentPropsWithoutRef<'button'>;
        searchInput?: ComponentPropsWithoutRef<'input'>;
        optionsContainer?: ComponentPropsWithoutRef<'div'>;
        option?: ComponentPropsWithoutRef<'li'>;
    };
};

/**
 * Internal country picker for PhoneInput: a compact flag + calling code
 * trigger that opens a searchable country dropdown. Keyboard navigation is
 * managed manually via aria-activedescendant on the search input, so options
 * themselves are never focused. Not exported from the package entry point.
 */
export const CountrySelect: FC<CountrySelectProps> = ({
    countryList,
    selected,
    onSelect,
    focusOnCloseRef,
    disabled,
    status,
    maxHeight = 320,
    overrides,
}) => {
    const listboxId = useId();
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const filtered = useMemo(() => filterCountries(countryList, query), [countryList, query]);
    const dataStatus = disabled ? 'disabled' : status || 'default';

    return (
        <Popover className={styles.countrySelect}>
            {({ open, close }) => {
                const selectAndClose = (code: CountryCode) => {
                    onSelect(code);
                    close(focusOnCloseRef?.current ?? undefined);
                };
                return (
                    <>
                        <OpenChangeEffect
                            open={open}
                            onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                    setQuery('');
                                    setActiveIndex(0);
                                }
                            }}
                        />
                        <PopoverButton
                            {...overrides?.countryButton}
                            disabled={disabled}
                            aria-disabled={disabled}
                            data-status={dataStatus}
                            aria-label={`Country: ${selected.name} (+${selected.callingCode})`}
                            className={clsx(styles.countryButton, overrides?.countryButton?.className)}
                            onClick={(e) => {
                                // Stop the Field container's click handler from stealing focus to the tel input.
                                e.stopPropagation();
                                overrides?.countryButton?.onClick?.(e);
                            }}
                        >
                            <span className={styles.flag} aria-hidden>
                                {selected.flag}
                            </span>
                            <Text as="span" kind="paragraphSmall" className={styles.callingCode}>
                                +{selected.callingCode}
                            </Text>
                            <FontAwesomeIcon icon={faChevronDown} width="10px" className={styles.chevron} />
                        </PopoverButton>
                        <PopoverPanel
                            anchor={{ to: 'bottom start', gap: 9 }}
                            transition
                            {...overrides?.optionsContainer}
                            className={clsx(
                                selectStyles.options,
                                styles.countryOptions,
                                overrides?.optionsContainer?.className,
                            )}
                            style={
                                {
                                    // Consumed by .countryList (the scrollable <ul>), not the panel
                                    // itself: Headless UI's anchor logic writes an inline max-height
                                    // (available viewport space) on the panel that would win over any
                                    // class-based cap.
                                    '--options-maxHeight': `${maxHeight}px`,
                                    ...overrides?.optionsContainer?.style,
                                } as CSSProperties
                            }
                        >
                            <div className={styles.searchContainer}>
                                <input
                                    autoFocus
                                    {...overrides?.searchInput}
                                    role="combobox"
                                    aria-expanded={open}
                                    aria-controls={listboxId}
                                    aria-activedescendant={
                                        filtered[activeIndex] ? `${listboxId}-${filtered[activeIndex].code}` : undefined
                                    }
                                    aria-label="Search countries"
                                    placeholder="Search countries"
                                    value={query}
                                    className={clsx(styles.searchInput, overrides?.searchInput?.className)}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setActiveIndex(0);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowDown') {
                                            e.preventDefault();
                                            setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
                                        } else if (e.key === 'ArrowUp') {
                                            e.preventDefault();
                                            setActiveIndex((index) => Math.max(index - 1, 0));
                                        } else if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const entry = filtered[activeIndex];
                                            if (entry) selectAndClose(entry.code);
                                        }
                                    }}
                                />
                            </div>
                            {/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: the dropdown is a listbox; keyboard selection is handled by the search input via aria-activedescendant, so options are never focused directly. */}
                            <ul role="listbox" id={listboxId} aria-label="Countries" className={styles.countryList}>
                                {filtered.map((entry, index) => (
                                    // biome-ignore lint/a11y/useFocusableInteractive: options are never focused directly; keyboard selection runs through the search input's aria-activedescendant.
                                    <li
                                        key={entry.code}
                                        id={`${listboxId}-${entry.code}`}
                                        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: options are never focused directly; keyboard selection runs through the search input's aria-activedescendant.
                                        role="option"
                                        aria-selected={entry.code === selected.code}
                                        data-selected={entry.code === selected.code ? '' : undefined}
                                        data-active={index === activeIndex ? '' : undefined}
                                        {...overrides?.option}
                                        className={clsx(
                                            selectStyles.option,
                                            styles.countryOption,
                                            overrides?.option?.className,
                                        )}
                                        onPointerMove={() => setActiveIndex(index)}
                                        onClick={() => selectAndClose(entry.code)}
                                    >
                                        <span className={styles.flag} aria-hidden>
                                            {entry.flag}
                                        </span>
                                        <Text as="span" kind="paragraphSmall" className={styles.countryName}>
                                            {entry.name}
                                        </Text>
                                        <Text as="span" kind="paragraphXSmall" className={styles.dialCode}>
                                            +{entry.callingCode}
                                        </Text>
                                        <Icon icon={Check} size={12} className={selectStyles.check} />
                                    </li>
                                ))}
                                {filtered.length === 0 && (
                                    <li className={styles.noResults}>
                                        <Text as="span" kind="paragraphSmall">
                                            No countries found
                                        </Text>
                                    </li>
                                )}
                            </ul>
                        </PopoverPanel>
                    </>
                );
            }}
        </Popover>
    );
};
