'use client';

import { type ReactNode, useId, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useIsPageActive } from './DrawerPageContext';
import { useDrawerSlotContext } from './DrawerSlotContext';

export type DrawerBottomPanelProps = {
    children: ReactNode;
    /** Control panel padding. @default true */
    padding?: boolean;
    /** 'replace' fully replaces the base bottomPanel. 'append' renders after the base. @default 'replace' */
    mode?: 'replace' | 'append';
    /** Render order for append mode. Lower = higher up. @default 0 */
    priority?: number;
};

export const DrawerBottomPanel = ({
    children,
    padding = true,
    mode = 'replace',
    priority = 0,
}: DrawerBottomPanelProps) => {
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
            style={{ order: priority, ...(padding ? { padding: 20 } : undefined) }}
        >
            {children}
        </div>,
        slotContext.bottomPanelRef.current,
        `${id}-${priority}`,
    );
};
