'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

/**
 * Context to track if the current drawer page is active.
 * Used internally for pagination to control portal behavior.
 * @internal
 */
const DrawerPageContext = createContext<boolean>(true);

export type DrawerPageProviderProps = {
    /**
     * Whether this page is currently active/visible.
     */
    isActive: boolean;
    /**
     * Child components.
     */
    children: ReactNode;
};

/**
 * Provider to indicate if a drawer page is currently active.
 * Used internally by Drawer for paginated content.
 * @internal
 */
export const DrawerPageProvider = ({ isActive, children }: DrawerPageProviderProps) => (
    <DrawerPageContext.Provider value={isActive}>
        {children}
    </DrawerPageContext.Provider>
);

/**
 * Hook to check if the current drawer page is active.
 * Returns true if not within a paginated drawer.
 * @internal
 */
export const useIsDrawerPageActive = (): boolean => useContext(DrawerPageContext);
