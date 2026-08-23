import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useOverlayCloseLifecycle } from './useOverlayCloseLifecycle';

const setup = (onAfterClose: (details: { reason: string }) => void, onClose = vi.fn()) =>
    renderHook(
        ({ isOpen }) =>
            useOverlayCloseLifecycle({ isOpen, panelClassName: 'panel', exitAnimationMS: 400, onClose, onAfterClose }),
        {
            initialProps: { isOpen: true },
        },
    );

describe('useOverlayCloseLifecycle', () => {
    it('flushes teardown on a timer when the exit animation never reports completion', () => {
        vi.useFakeTimers();
        try {
            const onAfterClose = vi.fn();
            const { rerender } = setup(onAfterClose);

            rerender({ isOpen: false });
            expect(onAfterClose).not.toHaveBeenCalled();

            act(() => {
                vi.advanceTimersByTime(650);
            });

            expect(onAfterClose).toHaveBeenCalledExactlyOnceWith({ reason: 'imperative' });
        } finally {
            vi.useRealTimers();
        }
    });

    it('does not fire teardown again when afterLeave arrives after the timer already flushed', () => {
        vi.useFakeTimers();
        try {
            const onAfterClose = vi.fn();
            const { result, rerender } = setup(onAfterClose);

            rerender({ isOpen: false });
            act(() => {
                vi.advanceTimersByTime(650);
            });
            act(() => {
                result.current.handleAfterLeave();
            });

            expect(onAfterClose).toHaveBeenCalledTimes(1);
        } finally {
            vi.useRealTimers();
        }
    });

    it('cancels the fallback timer once afterLeave has flushed teardown', () => {
        vi.useFakeTimers();
        try {
            const onAfterClose = vi.fn();
            const { result, rerender } = setup(onAfterClose);

            rerender({ isOpen: false });
            act(() => {
                result.current.handleAfterLeave();
            });
            act(() => {
                vi.advanceTimersByTime(650);
            });

            expect(onAfterClose).toHaveBeenCalledTimes(1);
        } finally {
            vi.useRealTimers();
        }
    });
});
