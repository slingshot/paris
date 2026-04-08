'use client';

import { clsx } from 'clsx';
import { type ReactNode, useId, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Drawer.module.scss';
import { useIsPageActive } from './DrawerPageContext';
import { useDrawerSlotContext } from './DrawerSlotContext';

export type DrawerBottomPanelProps = {
    children: ReactNode;
    /** Additional class name for the slot wrapper. Use to override default padding or add custom styles. */
    className?: string;
    /** 'replace' fully replaces the base bottomPanel. 'append' renders after the base. @default 'replace' */
    mode?: 'replace' | 'append';
    /** Render order for append mode. Lower = higher up. @default 0 */
    priority?: number;
};

export const DrawerBottomPanel = ({ children, className, mode = 'replace', priority = 0 }: DrawerBottomPanelProps) => {
    const isActive = useIsPageActive();
    const slotContext = useDrawerSlotContext();
    const id = useId();

    const registerBottomPanel = slotContext?.registerBottomPanel;

    useLayoutEffect(() => {
        if (!isActive || !registerBottomPanel) return;
        const unregister = registerBottomPanel({ id, mode, priority });
        return unregister;
    }, [isActive, registerBottomPanel, id, mode, priority]);

    if (!isActive || !slotContext?.isBottomPanelMounted || !slotContext.bottomPanelRef.current) {
        return null;
    }

    return createPortal(
        <div
            data-slot-mode={mode}
            data-slot-priority={priority}
            className={clsx(styles.bottomPanelContent, className)}
            style={{ order: priority }}
        >
            {children}
        </div>,
        slotContext.bottomPanelRef.current,
        `${id}-${priority}`,
    );
};
