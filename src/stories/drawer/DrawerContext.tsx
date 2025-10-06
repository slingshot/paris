'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

/**
 * Context value provided by DrawerProvider.
 */
export interface DrawerContextValue {
    /**
     * Whether the drawer is currently open.
     */
    isOpen: boolean;
    /**
     * Close the drawer. Calls the onClose callback passed to the Drawer component.
     */
    close: () => void;
}

/**
 * Context for drawer state, allowing child components to access drawer controls
 * without prop drilling.
 */
const DrawerContext = createContext<DrawerContextValue | null>(null);

export type DrawerProviderProps = {
    /**
     * The drawer context value.
     */
    value: DrawerContextValue;
    /**
     * Child components that can access drawer controls via {@link useDrawer}.
     */
    children: ReactNode;
};

/**
 * Provider for drawer context. Used internally by the Drawer component.
 *
 * @internal
 */
export const DrawerProvider = ({ value, children }: DrawerProviderProps) => (
    <DrawerContext.Provider value={value}>
        {children}
    </DrawerContext.Provider>
);

/**
 * Access drawer state from any child component within a Drawer.
 * Throws error if used outside a Drawer.
 *
 * This hook allows child components to close the drawer or check its open state
 * without requiring callbacks to be passed through props.
 *
 * @example
 * ```tsx
 * const SuccessMessage = () => {
 *   const { close, isOpen } = useDrawer();
 *
 *   const handleDone = () => {
 *     // Perform actions
 *     close();
 *   };
 *
 *   return <Button onClick={handleDone}>Done</Button>;
 * };
 * ```
 *
 * @throws Error if used outside a Drawer component
 * @returns The drawer context value
 */
export const useDrawer = (): DrawerContextValue => {
    const context = useContext(DrawerContext);

    if (!context) {
        throw new Error('useDrawer must be used within a Drawer component');
    }

    return context;
};
