'use client';

import type { ReactNode } from 'react';
import {
    createContext, useContext, useState, useCallback, useMemo,
} from 'react';

/**
 * Mode for how portal content should interact with existing bottom panel content.
 */
export type BottomPanelMode = 'replace' | 'append' | 'prepend';

/**
 * Portal content with its rendering mode.
 */
export interface PortalContent {
    content: ReactNode;
    mode: BottomPanelMode;
}

/**
 * Context value for bottom panel controls.
 */
export interface DrawerBottomPanelContextValue {
    /**
     * Current portal content, if any.
     */
    portalContent: PortalContent | null;
    /**
     * Set portal content with specified mode.
     */
    setPortalContent: (content: ReactNode | null, mode?: BottomPanelMode) => void;
}

/**
 * Context for drawer bottom panel portal system.
 */
const DrawerBottomPanelContext = createContext<DrawerBottomPanelContextValue | null>(null);

export type DrawerBottomPanelProviderProps = {
    children: ReactNode;
};

/**
 * Provider for drawer bottom panel portal system. Used internally by the Drawer component.
 *
 * @internal
 */
export const DrawerBottomPanelProvider = ({ children }: DrawerBottomPanelProviderProps) => {
    const [portalContent, setPortalContentState] = useState<PortalContent | null>(null);

    const setPortalContent = useCallback((content: ReactNode | null, mode: BottomPanelMode = 'replace') => {
        if (content === null) {
            setPortalContentState(null);
        } else {
            setPortalContentState({ content, mode });
        }
    }, []);

    const value: DrawerBottomPanelContextValue = useMemo(() => ({
        portalContent,
        setPortalContent,
    }), [portalContent, setPortalContent]);

    return (
        <DrawerBottomPanelContext.Provider value={value}>
            {children}
        </DrawerBottomPanelContext.Provider>
    );
};

/**
 * Access drawer bottom panel controls from any child component within a Drawer.
 * Throws error if used outside a Drawer.
 *
 * This hook provides imperative control over the drawer's bottom panel content,
 * useful for conditional logic or callback-based rendering.
 *
 * @example
 * ```tsx
 * const DynamicForm = () => {
 *   const { setPortalContent, clearPortalContent } = useDrawerBottomPanel();
 *   const [advanced, setAdvanced] = useState(false);
 *
 *   useEffect(() => {
 *     if (advanced) {
 *       setPortalContent(<AdvancedActions />);
 *     } else {
 *       setPortalContent(<BasicActions />);
 *     }
 *     return () => clearPortalContent();
 *   }, [advanced]);
 *
 *   return <form>...</form>;
 * };
 * ```
 *
 * @throws Error if used outside a Drawer component
 * @returns Controls for the bottom panel portal
 */
export const useDrawerBottomPanel = () => {
    const context = useContext(DrawerBottomPanelContext);

    if (!context) {
        throw new Error('useDrawerBottomPanel must be used within a Drawer component');
    }

    const clearPortalContent = useCallback(() => {
        context.setPortalContent(null);
    }, [context]);

    return {
        /**
         * Current portal content, if any.
         * @internal
         */
        portalContent: context.portalContent,
        /**
         * Set the bottom panel content, replacing any existing content.
         */
        setBottomPanel: useCallback((content: ReactNode) => {
            context.setPortalContent(content, 'replace');
        }, [context]),
        /**
         * Add content after existing bottom panel content.
         */
        appendBottomPanel: useCallback((content: ReactNode) => {
            context.setPortalContent(content, 'append');
        }, [context]),
        /**
         * Add content before existing bottom panel content.
         */
        prependBottomPanel: useCallback((content: ReactNode) => {
            context.setPortalContent(content, 'prepend');
        }, [context]),
        /**
         * Clear all portal-injected content.
         */
        clearBottomPanel: clearPortalContent,
        /**
         * Set portal content with specified mode (internal use).
         * @internal
         */
        setPortalContent: context.setPortalContent,
    };
};
