'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { PaginationState } from './usePagination';

/**
 * Context for pagination state, allowing child components to access pagination
 * controls without prop drilling.
 */
const PaginationContext = createContext<PaginationState<any> | null>(null);

export type PaginationProviderProps<T extends string[] | readonly string[] = string[]> = {
    /**
     * The pagination state from {@link usePagination}.
     */
    value: PaginationState<T>;
    /**
     * Child components that can access pagination via {@link usePaginationContext}.
     */
    children: ReactNode;
};

/**
 * Provider for pagination context. Automatically used by Drawer when pagination prop is passed.
 * Can also be used standalone for custom pagination implementations.
 *
 * @example
 * ```tsx
 * const pagination = usePagination(['step1', 'step2', 'step3'] as const, 'step1');
 *
 * <PaginationProvider value={pagination}>
 *   <YourComponent />
 * </PaginationProvider>
 * ```
 */
export const PaginationProvider = <T extends string[] | readonly string[] = string[]>({
    value,
    children,
}: PaginationProviderProps<T>) => (
    <PaginationContext.Provider value={value}>
        {children}
    </PaginationContext.Provider>
);

/**
 * Access pagination state from any child component within a PaginationProvider.
 * Returns null if not within a pagination context.
 *
 * This hook allows child components to navigate between pages without requiring
 * pagination callbacks to be passed through props.
 *
 * @example
 * ```tsx
 * const SaveForm = () => {
 *   const pagination = usePaginationContext<['form', 'review', 'complete']>();
 *
 *   const handleSave = async () => {
 *     await save();
 *     pagination?.open('review');
 *   };
 *
 *   return <Button onClick={handleSave}>Save and Continue</Button>;
 * };
 * ```
 *
 * @returns The pagination state, or null if not within a PaginationProvider
 */
export const usePaginationContext = <T extends string[] | readonly string[] = string[]>(): PaginationState<T> | null => useContext(PaginationContext) as PaginationState<T> | null;
