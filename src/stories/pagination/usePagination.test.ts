import { act, renderHook } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
    it('initializes with the given initial page', () => {
        const { result } = renderHook(() => usePagination('page1'));

        expect(result.current.currentPage).toBe('page1');
    });

    it('initializes history with the initial page', () => {
        const { result } = renderHook(() => usePagination('page1'));

        expect(result.current.history).toEqual(['page1']);
    });

    it('cannot go back from the initial page', () => {
        const { result } = renderHook(() => usePagination('page1'));

        expect(result.current.canGoBack()).toBe(false);
    });

    it('cannot go forward from the initial page', () => {
        const { result } = renderHook(() => usePagination('page1'));

        expect(result.current.canGoForward()).toBe(false);
    });

    it('opens a new page and updates currentPage', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        expect(result.current.currentPage).toBe('page2');
    });

    it('adds opened page to history', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        expect(result.current.history).toEqual(['page1', 'page2']);
    });

    it('can go back after opening a new page', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        expect(result.current.canGoBack()).toBe(true);
    });

    it('goes back to the previous page', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        act(() => {
            result.current.back();
        });

        expect(result.current.currentPage).toBe('page1');
    });

    it('does nothing when going back on the first page', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.back();
        });

        expect(result.current.currentPage).toBe('page1');
    });

    it('can go forward after going back', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        act(() => {
            result.current.back();
        });

        expect(result.current.canGoForward()).toBe(true);
    });

    it('goes forward to the next page in history', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        act(() => {
            result.current.back();
        });

        act(() => {
            result.current.forward();
        });

        expect(result.current.currentPage).toBe('page2');
    });

    it('does nothing when going forward at the end of history', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.forward();
        });

        expect(result.current.currentPage).toBe('page1');
    });

    it('truncates forward history when opening a new page after going back', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        act(() => {
            result.current.open('page3');
        });

        act(() => {
            result.current.back();
        });

        // Now on page2, open page4 — page3 should be removed from history
        act(() => {
            result.current.open('page4');
        });

        expect(result.current.currentPage).toBe('page4');
        expect(result.current.history).toEqual(['page1', 'page2', 'page4']);
        expect(result.current.canGoForward()).toBe(false);
    });

    it('does not add duplicate page when opening the current page', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page1');
        });

        expect(result.current.history).toEqual(['page1']);
        expect(result.current.currentPage).toBe('page1');
    });

    it('resets to initial state', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        act(() => {
            result.current.open('page3');
        });

        act(() => {
            result.current.reset();
        });

        expect(result.current.currentPage).toBe('page1');
        expect(result.current.history).toEqual(['page1']);
        expect(result.current.canGoBack()).toBe(false);
        expect(result.current.canGoForward()).toBe(false);
    });

    it('supports navigating through multiple pages in sequence', () => {
        const { result } = renderHook(() => usePagination('page1'));

        act(() => {
            result.current.open('page2');
        });

        act(() => {
            result.current.open('page3');
        });

        act(() => {
            result.current.open('page4');
        });

        expect(result.current.history).toEqual(['page1', 'page2', 'page3', 'page4']);
        expect(result.current.currentPage).toBe('page4');

        act(() => {
            result.current.back();
        });

        act(() => {
            result.current.back();
        });

        expect(result.current.currentPage).toBe('page2');
        expect(result.current.canGoBack()).toBe(true);
        expect(result.current.canGoForward()).toBe(true);
    });

    it('supports typed page keys', () => {
        const pages = ['home', 'settings', 'profile'] as const;
        const { result } = renderHook(() => usePagination<typeof pages>('home'));

        act(() => {
            result.current.open('settings');
        });

        expect(result.current.currentPage).toBe('settings');

        act(() => {
            result.current.open('profile');
        });

        expect(result.current.history).toEqual(['home', 'settings', 'profile']);
    });

    it('back and forward are idempotent at boundaries', () => {
        const { result } = renderHook(() => usePagination('page1'));

        // Multiple backs at start should not throw or change state
        act(() => {
            result.current.back();
        });

        act(() => {
            result.current.back();
        });

        expect(result.current.currentPage).toBe('page1');

        act(() => {
            result.current.open('page2');
        });

        // Multiple forwards at end should not throw or change state
        act(() => {
            result.current.forward();
        });

        act(() => {
            result.current.forward();
        });

        expect(result.current.currentPage).toBe('page2');
    });
});
