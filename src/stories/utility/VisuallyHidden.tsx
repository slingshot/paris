import type { PropsWithChildren } from 'react';
import { memo } from 'react';
import { VisuallyHidden as AriaVisuallyHidden } from '@ariakit/react';

/**
 * A memoized component that visually hides its children, but keeps them accessible to screen readers.
 *
 * Specify the `when` prop to conditionally render the children normally.
 */
export const VisuallyHidden = memo<PropsWithChildren<{
    /**
     * An optional condition that determines whether the children should be hidden. If `false`, the children will be rendered normally.
     * @default true
     */
    when?: boolean;
}>>(({
    when = true,
    children,
}) => (when ? (
    <AriaVisuallyHidden>
        {children}
    </AriaVisuallyHidden>
) : (
    <>{children}</>
)));
