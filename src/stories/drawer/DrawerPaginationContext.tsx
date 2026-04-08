'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { PaginationState } from '../pagination';

type AnyPaginationState = PaginationState<string[] | readonly string[]>;

const DrawerPaginationContext = createContext<AnyPaginationState | null>(null);

export function useDrawerPagination(): AnyPaginationState | null {
    return useContext(DrawerPaginationContext);
}

export function DrawerPaginationProvider({
    pagination,
    children,
}: {
    pagination: AnyPaginationState | null;
    children: ReactNode;
}) {
    const value = useMemo(() => pagination, [pagination]);
    return <DrawerPaginationContext.Provider value={value}>{children}</DrawerPaginationContext.Provider>;
}
