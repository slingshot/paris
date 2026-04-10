'use client';

import { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Drawer.module.scss';
import { useDrawerPagination } from './DrawerPaginationContext';
import { useDrawerSlotContext } from './DrawerSlotContext';

export type DrawerProgressBarStyleProps = {
    /** Fill color. @default 'var(--pte-new-colors-contentPrimary)' */
    fill?: string;
    /** Track (unfilled) color. @default 'var(--pte-new-colors-borderMedium)' */
    track?: string;
    /** Bar height as a CSS value. @default '2px' */
    height?: string | number;
};

export type DrawerProgressBarProps = DrawerProgressBarStyleProps & {
    /** Page IDs in order. Determines fill percentage based on the current page. */
    steps?: readonly string[];
    /** Fill percentage (0–100). When provided, takes precedence over the auto-calculated value from `steps`. */
    value?: number;
};

export const DrawerProgressBar = ({ steps, value, fill, track, height }: DrawerProgressBarProps) => {
    const pagination = useDrawerPagination();
    const slotContext = useDrawerSlotContext();

    const registerProgressBar = slotContext?.registerProgressBar;
    useLayoutEffect(() => {
        if (!registerProgressBar) return;
        return registerProgressBar();
    }, [registerProgressBar]);

    let progress: number;
    if (value != null) {
        progress = Math.max(0, Math.min(100, value));
    } else if (steps && steps.length > 0 && pagination) {
        const activeIndex = steps.indexOf(pagination.currentPage);
        progress = ((activeIndex + 1) / steps.length) * 100;
    } else {
        progress = 0;
    }

    if (!slotContext?.progressBarRef.current) {
        return null;
    }

    return createPortal(
        <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuemin={0}
            aria-valuenow={Math.round(progress)}
            aria-valuemax={100}
            aria-label="Page progress"
            style={{
                ...(track && { background: track }),
                ...(height != null && { height: typeof height === 'number' ? `${height}px` : height }),
            }}
        >
            <div
                className={styles.progressBarFill}
                style={{
                    width: `${progress}%`,
                    ...(fill && { background: fill }),
                }}
            />
        </div>,
        slotContext.progressBarRef.current,
    );
};
