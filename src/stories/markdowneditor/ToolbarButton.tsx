'use client';

import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import styles from './ToolbarButton.module.scss';

export type ToolbarButtonProps = {
    /** Whether the button is currently active (e.g., bold is on). */
    isActive?: boolean;
    /** The action to perform when clicked. */
    onAction: () => void;
    /** Whether the button is disabled. */
    disabled?: boolean;
    /** Icon or label content. */
    children: ReactNode;
    /** Optional tooltip text. */
    tooltip?: string;
    /** Prop overrides for the button element. */
    overrides?: {
        button?: ComponentPropsWithoutRef<'button'>;
    };
};

/**
 * A toolbar button used in FixedToolbar and FloatingToolbar.
 * Uses onMouseDown instead of onClick to prevent stealing editor focus.
 */
export const ToolbarButton: FC<ToolbarButtonProps> = ({
    isActive = false,
    onAction,
    disabled = false,
    children,
    tooltip,
    overrides,
}) => {
    return (
        <button
            type="button"
            title={tooltip}
            disabled={disabled}
            data-active={isActive}
            {...overrides?.button}
            className={clsx(styles.button, overrides?.button?.className)}
            onMouseDown={(e) => {
                e.preventDefault();
                if (!disabled) onAction();
            }}
        >
            {children}
        </button>
    );
};
