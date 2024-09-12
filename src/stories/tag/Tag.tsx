import type {
    ComponentPropsWithoutRef, FC, ReactElement, ReactNode,
} from 'react';
import clsx from 'clsx';
import styles from './Tag.module.scss';
import typography from '../text/Typography.module.css';
import { RemoveFromDOM } from '../utility';
import { Icon, Check } from '../icon';

export type TagProps = {
    /** The size of the Tag. */
    size?: 'normal' | 'compact' | 'small';
    /** The kind of Tag. */
    kind?: 'default' | 'secondary' | 'positive' | 'warning' | 'negative' | 'new' | 'void' | 'draft';
    /** The color level of Tag background, applies to the colored states of `positive`, `warning`, and `negative`. */
    colorLevel?: 'light' | 'medium' | 'strong';
    /** An icon to display in the size: `small` variant of the Tag. For best results, use an SVG icon with fill set to `currentColor`. */
    icon?: ReactElement;
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
    colorLevel,
    icon,
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
        data-status={colorLevel}
    >
        {size !== 'small' && (
            <div>
                {children}
            </div>
        )}
        {size === 'small' && (
            <div className={styles.icon}>
                <RemoveFromDOM when={!!icon}>
                    <Icon icon={Check} size={12} />
                </RemoveFromDOM>
                <RemoveFromDOM when={!icon}>
                    {icon}
                </RemoveFromDOM>
            </div>

        )}
    </div>
);
