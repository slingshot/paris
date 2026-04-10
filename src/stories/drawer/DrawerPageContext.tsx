'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';

export type DrawerPageContextValue = {
    isActive: boolean;
    pageID: string;
};

const DrawerPageContext = createContext<DrawerPageContextValue | null>(null);

export function useDrawerPageContext(): DrawerPageContextValue | null {
    return useContext(DrawerPageContext);
}

export function useIsPageActive(): boolean {
    const context = useContext(DrawerPageContext);
    if (!context) {
        return true;
    }
    return context.isActive;
}

export function DrawerPageProvider({
    isActive,
    pageID,
    children,
}: {
    isActive: boolean;
    pageID: string;
    children: ReactNode;
}) {
    const value = useMemo(() => ({ isActive, pageID }), [isActive, pageID]);
    return <DrawerPageContext.Provider value={value}>{children}</DrawerPageContext.Provider>;
}
