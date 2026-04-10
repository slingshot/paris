'use client';

import { type ReactNode, useId, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { TextWhenString } from '../utility/TextWhenString';
import { useIsPageActive } from './DrawerPageContext';
import { useDrawerSlotContext } from './DrawerSlotContext';

export type DrawerTitleProps = {
    children: ReactNode;
};

export const DrawerTitle = ({ children }: DrawerTitleProps) => {
    const isActive = useIsPageActive();
    const slotContext = useDrawerSlotContext();
    const id = useId();

    useLayoutEffect(() => {
        if (!isActive || !slotContext) return;
        const unregister = slotContext.registerTitleSlot();
        return unregister;
    }, [isActive, slotContext]);

    if (!isActive || !slotContext?.titleRef.current) {
        return null;
    }

    return createPortal(
        <TextWhenString kind="paragraphSmall" weight="medium">
            {children}
        </TextWhenString>,
        slotContext.titleRef.current,
        id,
    );
};
