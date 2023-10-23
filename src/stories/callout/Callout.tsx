import type { FC, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Callout.module.scss';
import { RemoveFromDOM, TextWhenString } from '../utility';

export type CalloutProps = {
    /** The variant of the Callout. */
    variant?: 'default' | 'warning' | 'positive' | 'negative';
    /** An icon to display in the Callout. For best results, use an SVG icon with fill set to `currentColor`. */
    icon?: ReactElement;
    /** The contents of the Callout. */
    children?: ReactNode;
};

/**
 * A Callout component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Callout } from 'paris/callout';
 * ```
 * @constructor
 */
export const Callout: FC<CalloutProps> = ({
    variant = 'default',
    icon,
    children,
}) => (
    <div className={clsx(styles.content, styles[variant])}>
        <RemoveFromDOM when={!icon}>
            <div className={styles.icon}>
                {icon}
            </div>
        </RemoveFromDOM>
        <TextWhenString as="p" kind="paragraphXSmall">
            {children}
        </TextWhenString>
    </div>
);
