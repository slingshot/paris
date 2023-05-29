import { useState } from 'react';

export type PaginationState<T extends string[] = string[]> = {
    /**
     * The current page key.
     */
    currentPage: T[number],

    /**
     * Open a page and add it to the history.
     * @param page - The page's unique key.
     */
    open: (page: T[number]) => void,

    /**
     * Check if the current page can go back.
     */
    canGoBack: () => boolean,

    /**
     * Go back to the previous page.
     *
     * If the current page is the first page, nothing happens.
     */
    back: () => void,

    /**
     * Check if the current page can go forward.
     */
    canGoForward: () => boolean,

    /**
     * Go forward to the next page.
     *
     * If there is no next page, nothing happens.
     */
    forward: () => void,

    /**
     * The page history.
     */
    history: T[number][],
};

/**
 * A hook to create a page history and navigate between pages.
 *
 * In TypeScript, you can pass in a string array to the generic type to explicitly define the page keys, which will add type safety and auto-completion for each method.
 *
 * @param initialPage - The initial page key.
 */
export const usePagination = <T extends string[] = string[]>(
    initialPage: T[number],
): PaginationState<T> => {
    // The current page.
    const [currentPage, setCurrentPage] = useState<T[number]>(initialPage);

    // The page history.
    const [history, setHistory] = useState<T[number][]>([initialPage]);

    const open = (page: T[number]): void => {
        // Do nothing if the page is already open.
        if (page === currentPage) {
            return;
        }

        // Open the page and add it to the history, removing all pages after it.
        const index = history.indexOf(currentPage);
        setCurrentPage(page);
        setHistory((hist) => hist.slice(0, index + 1).concat(page));
    };

    const canGoBack = (): boolean => {
        const index = history.indexOf(currentPage);
        return index > 0;
    };

    const back = (): void => {
        if (canGoBack()) {
            const index = history.indexOf(currentPage);
            setCurrentPage(history[index - 1]);
        }
    };

    const canGoForward = (): boolean => {
        const index = history.indexOf(currentPage);
        return index < history.length - 1;
    };

    const forward = (): void => {
        if (canGoForward()) {
            const index = history.indexOf(currentPage);
            setCurrentPage(history[index + 1]);
        }
    };

    return {
        currentPage,
        open,
        canGoBack,
        back,
        canGoForward,
        forward,
        history,
    } as PaginationState<T>;
};
