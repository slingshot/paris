import { useEffect, useRef } from 'react';

/**
 * A renderless component that fires a callback when an `open` boolean changes.
 * Designed to sit inside a Headless UI render-prop child to bridge
 * the library's internal open state to a consumer-facing `onOpenChange` callback.
 *
 * Does not fire on the initial mount — only on subsequent changes.
 */
export function OpenChangeEffect({ open, onOpenChange }: { open: boolean; onOpenChange?: (open: boolean) => void }) {
    const previousOpen = useRef(open);

    useEffect(() => {
        if (previousOpen.current !== open) {
            previousOpen.current = open;
            onOpenChange?.(open);
        }
    }, [open, onOpenChange]);

    return null;
}
