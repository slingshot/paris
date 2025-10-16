'use client';

import type {
    ComponentPropsWithoutRef, FC, ReactElement, ReactNode,
} from 'react';
import { useMemo } from 'react';
import { clsx } from 'clsx';
import type { CSSLength } from '@ssh/csstypes';
import styles from './Tag.module.scss';
import typography from '../text/Typography.module.css';
import { Icon, Check } from '../icon';
import { VisuallyHidden } from '../utility';

export const CornerPresets = ['sharp', 'rounded', 'roundedXL'] as const;

export type TagProps = {
    /** The size of the Tag. */
    size?: 'normal' | 'compact';
    /** The shape of the Tag. `square` will display only the `icon`. */
    shape?: 'rectangle' | 'square';
    /**
     * The radius of the corners of the Tag. Either a preset or a valid {@link CSSLength} string.
     * `sharp` will have no rounding, `rounded` will have a slight rounding, and `roundedXL` will have a large rounding.
     * @see CornerPresets
     */
    corners?: typeof CornerPresets[number] | CSSLength;
    /** The kind of Tag. */
    kind?: 'default' | 'secondary' | 'positive' | 'warning' | 'negative' | 'new' | 'void' | 'draft';
    /** The color level of Tag background, applies to the colored states of `positive`, `warning`, and `negative`. */
    colorLevel?: 'light' | 'medium' | 'strong';
    /** An icon to display in the shape: `square` variant of the Tag. For best results, use an SVG icon with fill set to `currentColor`. */
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
    shape = 'rectangle',
    corners,
    kind = 'default',
    colorLevel,
    icon = <Icon icon={Check} size={12} />,
    children,
    className,
}) => {
    const cornersIsPreset = useMemo(() => (CornerPresets as readonly string[]).includes(corners as string), [corners]);
    return (
        <div
            className={clsx(
                styles.tag,
                styles[size],
                styles[kind],
                size === 'normal' && typography.labelXSmall,
                size === 'compact' && typography.labelXXSmall,
                styles[shape],
                !corners && size === 'normal' && styles.sharp,
                !corners && size === 'compact' && styles.rounded,
                corners && cornersIsPreset && styles[corners],
                className,
            )}
            data-status={colorLevel}
            style={(corners && !cornersIsPreset) ? { borderRadius: corners } : {}}
        >
            {shape !== 'square' && (
                <div>
                    {children}
                </div>
            )}
            {shape === 'square' && (
                <div className={styles.icon}>
                    {icon}
                    <VisuallyHidden>
                        {children}
                    </VisuallyHidden>
                </div>
            )}
        </div>
    );
};
