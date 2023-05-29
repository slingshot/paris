import type { PropsWithChildren } from 'react';
import { memo } from 'react';

/**
 * A memoized component that conditionally removes its children from the DOM if the `when` prop is `true`.
 */
export const RemoveFromDOM = memo<PropsWithChildren<{
    /**
     * An optional condition that determines whether the children should be removed from the DOM. If `true`, the children will be removed.
     * @default true
     */
    when: boolean;
}>>(
    ({ when, children }) => (when ? (<></>) : (
        <>
            {children}
        </>
    )),
);
