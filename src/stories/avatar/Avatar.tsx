import type { CSSProperties, FC, ReactNode } from 'react';
import type { CSSLength } from '@ssh/csstypes';
import styles from './Avatar.module.scss';
import { pvar } from '../theme';

export type AvatarProps = {
    frameColor?: string;
    width?: CSSLength;
    /** The contents of the Avatar. */
    children?: ReactNode;
};

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
}) => (
    <div
        style={{
            width,
            '--frame-color': frameColor,
        } as CSSProperties}
        className={styles.content}
    >
        {children}
    </div>
);
