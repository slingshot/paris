'use client';

import { type ReactNode, useId, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useIsPageActive } from './DrawerPageContext';
import { useDrawerSlotContext } from './DrawerSlotContext';

export type DrawerActionsProps = {
    children: ReactNode;
};

export const DrawerActions = ({ children }: DrawerActionsProps) => {
    const isActive = useIsPageActive();
    const slotContext = useDrawerSlotContext();
    const id = useId();

    useLayoutEffect(() => {
        if (!isActive || !slotContext) return;
        const unregister = slotContext.registerActionsSlot();
        return unregister;
    }, [isActive, slotContext]);

    if (!isActive || !slotContext?.actionsRef.current) {
        return null;
    }

    return createPortal(children, slotContext.actionsRef.current, id);
};
