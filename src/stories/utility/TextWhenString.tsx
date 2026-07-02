import type { FC, PropsWithChildren } from 'react';
import type { TextElement, TextProps } from '../text';
import { Text } from '../text';

/**
 * Renders its children as a {@link Text} component if `children` is just a string.
 */
export const TextWhenString: FC<PropsWithChildren<TextProps<TextElement>>> = ({ children, ...props }) => {
    if (typeof children === 'string' || typeof children === 'number') {
        return <Text {...props}>{children}</Text>;
    }

    return <>{children}</>;
};
