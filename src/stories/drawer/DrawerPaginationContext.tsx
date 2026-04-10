'use client';

import { createContext, type ReactNode, useContext } from 'react';
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
    return <DrawerPaginationContext.Provider value={pagination}>{children}</DrawerPaginationContext.Provider>;
}
