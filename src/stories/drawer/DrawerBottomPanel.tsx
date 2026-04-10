'use client';

import { clsx } from 'clsx';
import { type ComponentPropsWithoutRef, type ReactNode, useId, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Drawer.module.scss';
import { useIsPageActive } from './DrawerPageContext';
import { useDrawerSlotContext } from './DrawerSlotContext';

export type DrawerBottomPanelProps = ComponentPropsWithoutRef<'div'> & {
    children: ReactNode;
    /** 'replace' fully replaces the base bottomPanel. 'append' renders after the base. @default 'replace' */
    mode?: 'replace' | 'append';
    /** Render order for append mode. Lower = higher up. @default 0 */
    priority?: number;
};

export const DrawerBottomPanel = ({
    children,
    className,
    mode = 'replace',
    priority = 0,
    style,
    ...rest
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
            className={clsx(styles.bottomPanelSlotItem, className)}
            style={{ order: priority, ...style }}
            {...rest}
        >
            {children}
        </div>,
        slotContext.bottomPanelRef.current,
        `${id}-${priority}`,
    );
};
