'use client';

import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import clsx from 'clsx';
import { CardButton } from '../cardbutton';
import { Text } from '../text';
import { pvar } from '../theme';
import styles from './SelectableCard.module.scss';

export type SelectableCardProps = {
    /**
     * The card's title.
     */
    title: ReactNode;
    /**
     * The card's description.
     */
    description: ReactNode;
    /**
     * The function to call when the card is selected.
     */
    onSelect: () => void;
    /**
     * Optional icon to display on the left of the title.
     */
    icon?: ReactNode;
    /**
     * Whether the card is selected.
     * @default false
     */
    isSelected?: boolean;
    /**
     * Whether the card is disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * Optional label to display on the right of the title (e.g. a Tag or badge).
     */
    label?: ReactNode;
    /**
     * Optional overrides for nested components.
     */
    overrides?: {
        root?: ComponentPropsWithoutRef<'button'>;
        iconContainer?: ComponentPropsWithoutRef<'div'>;
        content?: ComponentPropsWithoutRef<'div'>;
    };
};

/**
 * A SelectableCard component. A card that can be selected by the user, with an optional icon and label.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { SelectableCard } from 'paris/selectablecard';
 * ```
 * @constructor
 */
export const SelectableCard: FC<SelectableCardProps> = ({
    title,
    description,
    onSelect,
    icon,
    isSelected,
    disabled,
    label,
    overrides,
}) => (
    <CardButton
        onClick={onSelect}
        disabled={disabled}
        {...overrides?.root}
        className={clsx(
            styles.selectableCard,
            isSelected && styles.selected,
            overrides?.root?.className,
        )}
    >
        <div className={styles.layout}>
            {icon && (
                <div
                    {...overrides?.iconContainer}
                    className={clsx(styles.iconContainer, overrides?.iconContainer?.className)}
                >
                    {icon}
                </div>
            )}
            <div
                {...overrides?.content}
                className={clsx(styles.content, overrides?.content?.className)}
            >
                <div className={styles.titleRow}>
                    <Text kind="paragraphXSmall" weight="medium" className={styles.title}>
                        {title}
                    </Text>
                    {label}
                </div>
                <Text kind="paragraphXXSmall" weight="normal" color={pvar('new.colors.contentSecondary')}>
                    {description}
                </Text>
            </div>
        </div>
    </CardButton>
);
