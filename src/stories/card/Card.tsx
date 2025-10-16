import type { FC, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.scss';
import { TextWhenString } from '../utility';

export type CardProps = {
    /**
     * The visual variant of the Card. `raised` is the default variant with a drop shadow, `surface` is a variant with a border and overlay, `flat` is a variant with a border.
     *
     * @default "raised"
     */
    kind?: 'raised' | 'surface' | 'flat';
    /**
     * The status of the Card. `pending` adds a dashed border.
     *
     * @default "default"
     */
    status?: 'default' | 'pending';
    /** The contents of the Card. */
    children?: ReactNode | ReactNode[];
    // /**
    //  * Overrides for nested components.
    //  */
    // overrides?: {
    //     tilt?: TiltProps;
    // }
} & HTMLAttributes<HTMLDivElement>;

/**
 * A Card component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Card } from 'paris/card';
 * ```
 * @constructor
 */
export const Card: FC<CardProps> = ({
    kind = 'raised',
    status = 'default',
    children,
    ...props
}) => (
    <div
        {...props}
        className={clsx(
            styles.container,
            styles[kind],
            styles[status],
            typeof children === 'string' && styles.text,
            props?.className,
        )}
    >
        <TextWhenString kind="paragraphMedium">
            {children}
        </TextWhenString>
    </div>
);
