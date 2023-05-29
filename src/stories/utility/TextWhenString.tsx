import type { PropsWithChildren } from 'react';
import { memo } from 'react';
import type { TextProps } from '../text';
import { Text } from '../text';

/**
 * A memoized component that renders its children as a {@link Text} component if `children` is just a string.
 */
export const TextWhenString = memo<PropsWithChildren<TextProps>>(({
    children,
    ...props
}) => {
    if (typeof children === 'string') {
        return (
            <Text
                {...props}
            >
                {children}
            </Text>
        );
    }

    return (
        <>
            {children}
        </>
    );
});
