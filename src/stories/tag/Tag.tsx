import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Tag.module.scss';
import typography from '../text/Typography.module.css';

export type TagProps = {
    /** The size of the Tag. */
    size?: 'normal' | 'compact';
    /** The kind of Tag. */
    kind?: 'default' | 'secondary' | 'positive' | 'warning' | 'negative' | 'new';
    /** The contents of the Tag. */
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/**
 * A Tag component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Tag } from 'paris/tag';
 * ```
 * @constructor
 */
export const Tag: FC<TagProps> = ({
    size = 'normal',
    kind = 'default',
    children,
    className,
}) => (
    <div
        className={clsx(
            styles.tag,
            styles[size],
            styles[kind],
            size === 'normal' && typography.labelXSmall,
            size === 'compact' && typography.labelXXSmall,
            className,
        )}
    >
        {children}
    </div>
);
