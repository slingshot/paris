'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';

export type DrawerContextValue = {
    close: () => void;
    isOpen: boolean;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawer(): DrawerContextValue {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawer must be used within a Drawer component');
    }
    return context;
}

export function DrawerProvider({
    close,
    isOpen,
    children,
}: {
    close: () => void;
    isOpen: boolean;
    children: ReactNode;
}) {
    const value = useMemo(() => ({ close, isOpen }), [close, isOpen]);
    return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}
