import type {
    ComponentPropsWithoutRef, FC, ReactElement, ReactNode,
} from 'react';
import clsx from 'clsx';
import styles from './Callout.module.scss';
import { RemoveFromDOM, TextWhenString } from '../utility';
import { Icon, ArrowRight } from '../icon';

export type CalloutProps = {
    /** The variant of the Callout. */
    variant?: 'default' | 'warning' | 'positive' | 'negative';
    /** An icon to display in the Callout. To hide icon, set `icon={null}`. For best results, use an SVG icon with fill set to `currentColor`. */
    icon?: ReactElement<any> | null;
    /** The contents of the Callout. */
    children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

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
    icon = <Icon icon={ArrowRight} size={16} className={styles.icon} />,
    children,
    className,
    ...props
}) => (
    <div className={clsx(styles.content, styles[variant], className)} {...props}>
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
