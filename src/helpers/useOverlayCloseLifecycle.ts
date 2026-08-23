'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export const OverlayCloseReasons = ['close-press', 'escape-key', 'backdrop-press', 'imperative'] as const;

/**
 * Why an overlay close was requested.
 *
 * - `close-press` — the built-in close (X) button
 * - `escape-key` — the Escape key
 * - `backdrop-press` — a pointer press outside the panel
 * - `imperative` — the consumer set `isOpen` to `false` itself, or closed it from context
 */
export type OverlayCloseReason = (typeof OverlayCloseReasons)[number];

export type OverlayCloseDetails = {
    reason: OverlayCloseReason;
};

/** A dismissal gesture only explains a close that follows it near-immediately. */
const GESTURE_ATTRIBUTION_MS = 500;

/** Headless UI's `afterLeave` is unreliable for nested transitions, so teardown gets a time-based backstop. */
const TEARDOWN_FALLBACK_BUFFER_MS = 250;

type UseOverlayCloseLifecycleOptions = {
    isOpen: boolean;
    /** Class marking the overlay's panel, used to tell an inside press from a backdrop press. */
    panelClassName: string;
    /** How long the exit animation runs, including any delay. */
    exitAnimationMS: number;
    onClose: (value: boolean, details: OverlayCloseDetails) => void | Promise<void>;
    onAfterClose?: (details: OverlayCloseDetails) => void;
};

type OverlayCloseLifecycle = {
    /** Pass to Headless UI's `Dialog.onClose`, which fires for Escape and outside presses without saying which. */
    handleDismiss: () => void;
    /** Request a close with an explicit reason, e.g. from the built-in close button. */
    requestClose: (reason: OverlayCloseReason) => void;
    /** Pass to the `Transition`'s `afterLeave`. */
    handleAfterLeave: () => void;
};

/**
 * Attributes a reason to every overlay close, and guarantees `onAfterClose` runs exactly once per
 * completed close.
 *
 * Headless UI reports Escape and backdrop presses through a single argument-less callback, so the
 * reason is recovered from the gesture that immediately preceded the close. Teardown prefers the exit
 * animation's `afterLeave`, but also flushes on reopen, on unmount, and on a duration-based timer, so an
 * interrupted or skipped exit animation delays teardown rather than silently dropping it.
 */
export function useOverlayCloseLifecycle({
    isOpen,
    panelClassName,
    exitAnimationMS,
    onClose,
    onAfterClose,
}: UseOverlayCloseLifecycleOptions): OverlayCloseLifecycle {
    const onAfterCloseRef = useRef(onAfterClose);
    onAfterCloseRef.current = onAfterClose;

    const gestureRef = useRef<{ reason: OverlayCloseReason; at: number } | null>(null);
    const pendingCloseRef = useRef<OverlayCloseDetails | null>(null);
    const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const takeGestureReason = useCallback((): OverlayCloseReason => {
        const gesture = gestureRef.current;
        gestureRef.current = null;
        if (!gesture || Date.now() - gesture.at > GESTURE_ATTRIBUTION_MS) return 'imperative';
        return gesture.reason;
    }, []);

    const requestClose = useCallback(
        (reason: OverlayCloseReason) => {
            gestureRef.current = { reason, at: Date.now() };
            void onClose(false, { reason });
        },
        [onClose],
    );

    const handleDismiss = useCallback(() => requestClose(takeGestureReason()), [requestClose, takeGestureReason]);

    const flushPendingClose = useCallback(() => {
        const pending = pendingCloseRef.current;
        if (!pending) return;
        pendingCloseRef.current = null;
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
        onAfterCloseRef.current?.(pending);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const recordGesture = (reason: OverlayCloseReason) => {
            gestureRef.current = { reason, at: Date.now() };
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') recordGesture('escape-key');
        };
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Element | null;
            if (!target?.closest(`.${panelClassName}`)) recordGesture('backdrop-press');
        };
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('pointerdown', onPointerDown, true);
        return () => {
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('pointerdown', onPointerDown, true);
        };
    }, [isOpen, panelClassName]);

    const hasBeenOpen = useRef(false);
    useLayoutEffect(() => {
        if (isOpen) {
            flushPendingClose();
            hasBeenOpen.current = true;
            return;
        }
        if (!hasBeenOpen.current) return;
        hasBeenOpen.current = false;
        pendingCloseRef.current = { reason: takeGestureReason() };
        fallbackTimerRef.current = setTimeout(flushPendingClose, exitAnimationMS + TEARDOWN_FALLBACK_BUFFER_MS);
    }, [isOpen, exitAnimationMS, flushPendingClose, takeGestureReason]);

    useEffect(() => () => flushPendingClose(), [flushPendingClose]);

    const handleAfterLeave = useCallback(() => flushPendingClose(), [flushPendingClose]);

    return { handleDismiss, requestClose, handleAfterLeave };
}
