import type {
    ComponentPropsWithoutRef, CSSProperties, FC, ReactNode,
} from 'react';
import { useMemo } from 'react';
import type { CSSLength } from '@ssh/csstypes';
import clsx from 'clsx';
import styles from './Avatar.module.scss';
import { pvar } from '../theme';

export type AvatarProps = {
    frameColor?: string;
    /** The width of the Avatar, as a CSS length string or a number. If a number is provided, the assumed unit is pixels. */
    width?: CSSLength | number;
    /** The contents of the Avatar, usually an image element. */
    children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/**
 * An Avatar component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Avatar } from 'paris/avatar';
 * ```
 * @constructor
 */
export const Avatar: FC<AvatarProps> = ({
    frameColor = pvar('colors.borderOpaque'),
    width = 'fit-content',
    children,
    className,
    style,
    ...props
}) => {
    const widthMemoized = useMemo(() => (
        typeof width === 'number' ? `${width}px` : width
    ) as CSSProperties['width'], [width]);
    return (
        <div
            {...props}
            style={{
                width: widthMemoized,
                '--frame-color': frameColor,
                ...style,
            } as CSSProperties}
            className={clsx(styles.content, className)}
        >
            {children}
        </div>
    );
};
