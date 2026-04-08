'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useIsPageActive } from './DrawerPageContext';

export type DrawerPageProps<TPageID extends string = string> = {
    /** Unique identifier for this page. Must match a pagination page ID. */
    id: TPageID;
    /** Defer first mount until page becomes active. Once mounted, stays mounted. */
    lazy?: boolean;
    /** Page content. */
    children: ReactNode;
};

export const DrawerPage = <TPageID extends string = string>({ lazy = false, children }: DrawerPageProps<TPageID>) => {
    const isActive = useIsPageActive();
    const [hasBeenActive, setHasBeenActive] = useState(isActive);

    useEffect(() => {
        if (isActive && !hasBeenActive) {
            setHasBeenActive(true);
        }
    }, [isActive, hasBeenActive]);

    if (lazy && !hasBeenActive) {
        return null;
    }

    return <>{children}</>;
};

/** Type guard to check if a React element is a DrawerPage */
export const isDrawerPageElement = (element: unknown): element is React.ReactElement<DrawerPageProps> =>
    element != null &&
    typeof element === 'object' &&
    'type' in element &&
    (element as { type: unknown }).type === DrawerPage;
